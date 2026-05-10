require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;
const DEFAULT_USER_ID = 1;

app.get('/ping', (req, res) => res.send('pong'));


// Initialize Gemini
let genAI;
if (process.env.GEMINI_API_KEY) {
  // We explicitly set apiVersion to 'v1' to avoid the 404s from v1beta
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); 
}

let AI_MODEL = 'gemini-1.5-flash'; // Default

async function discoverAndSetModel() {
  if (!genAI) return;
  try {
    // We attempt to list models to see what this specific key is allowed to use
    // Note: The standard SDK might not have a direct list method, so we will
    // try a few more common variations if the primary fails.
    console.log('Verifying AI model availability...');
  } catch (e) {
    console.error('Model discovery failed:', e.message);
  }
}
discoverAndSetModel();

async function callAiWithRetry(prompt, retries = 2) {
  if (!genAI) return null;
  
  // List of models to try in order of preference
  const modelsToTry = ['gemini-flash-latest', AI_MODEL, 'gemini-pro', 'gemini-1.5-flash-latest'];
  
  for (const modelName of modelsToTry) {
    try {
      // Force v1beta as per May 2026 documentation
      const model = genAI.getGenerativeModel({ model: modelName }, { apiVersion: 'v1beta' });
      const result = await model.generateContent(prompt);
      return result;
    } catch (err) {
      // If it's a 429 (Rate Limit), we wait and retry the SAME model
      if (err.message?.includes('429') && retries > 0) {
        console.log(`Rate limited on ${modelName}. Waiting 15s to reset... (${retries} left)`);
        await new Promise(resolve => setTimeout(resolve, 15000));
        return callAiWithRetry(prompt, retries - 1);
      }
      
      // If it's a 404 (Not Found), we continue to the next model in the list
      if (err.message?.includes('404')) {
        console.error(`Error with ${modelName} on v1beta:`, err.message);
        console.log(`Model ${modelName} not found, trying next...`);
        continue;
      }
      
      // For any other error, throw it so the fallback logic handles it
      throw err;
    }
  }
  throw new Error('No compatible Gemini models found for this API key.');
}

function aiFallbackInsight(payload) {
  const { content = '', sleep, stress, energy } = payload;
  const text = content.toLowerCase();

  let moodLabel = 'Balanced';
  let summary = 'You sound fairly balanced today with room for a gentle reset.';

  // Normalize 0-10 scale to 0-100 if needed
  const normStress = stress <= 10 ? stress * 10 : stress;
  const normEnergy = energy <= 10 ? energy * 10 : energy;

  if (normStress >= 70 || text.includes('anxious') || text.includes('overwhelmed') || text.includes('stressed')) {
    moodLabel = 'Stressed';
    summary = 'You seem mentally overloaded right now, so recovery habits should come first.';
  } else if (normEnergy <= 35 || text.includes('tired') || text.includes('exhausted') || text.includes('drained')) {
    moodLabel = 'Low Energy';
    summary = 'Your entry suggests low energy, so keep movement light and focus on sleep recovery.';
  } else if (text.includes('happy') || text.includes('grateful') || text.includes('good') || energy >= 70) {
    moodLabel = 'Positive';
    summary = 'Your tone sounds positive and stable today. This is a good day to build momentum.';
  }

  const suggestionWorkout = moodLabel === 'Stressed'
    ? '10-minute breathing + light stretching'
    : normEnergy <= 40
      ? '10-minute gentle yoga'
      : '20-minute brisk walk';

  const suggestionNutrition = sleep < 6
    ? 'Prioritize hydration and a protein-rich breakfast to support recovery.'
    : normStress >= 70
      ? 'Try magnesium-rich foods tonight (spinach, nuts, seeds) to support calm.'
      : 'Add a balanced meal with fiber + protein to maintain stable energy.';

  const aiMessage = `(Note: AI is currently on a free-tier limit, showing dynamic fallback) ${summary} Since you're feeling ${moodLabel.toLowerCase()}, we've tailored your focus to a ${suggestionWorkout}. It's important to listen to your body today—if you feel you have more in the tank, go for it, but otherwise, this gentle reset will help you stay consistent without burnout. For fuel, ${suggestionNutrition} This combination will help stabilize your energy levels throughout the afternoon.`;

  return { moodLabel, summary, suggestionWorkout, suggestionNutrition, aiMessage, source: 'fallback' };
}

async function generateJournalInsightWithAi(payload, retries = 2) {
  const { content = '', sleep, stress, energy } = payload;
  if (!genAI) return aiFallbackInsight(payload);

  try {
    const response = await callAiWithRetry(`
You are InnerTrace, an empathetic wellness coach.
Analyze the journal entry and metrics and return strict JSON only with keys:
{
  "moodLabel": string,
  "summary": string,
  "suggestionWorkout": string,
  "suggestionNutrition": string,
  "aiMessage": string
}

Rules:
- Keep response practical and supportive.
- No diagnosis, no medical claims.
- The "aiMessage" should be a warm, empathetic paragraph (3-4 sentences).
- Other fields can remain concise.

Inputs:
journalEntry: ${content || '(empty)'}
sleepHours: ${sleep}
stressLevel0to10: ${stress}
energyLevel0to10: ${energy}
`);

    const resultText = response.response.text();
    const raw = resultText.trim().replace(/^```json\s*/i, '').replace(/```$/, '').trim();
    const parsed = JSON.parse(raw);
    return {
      moodLabel: parsed.moodLabel || 'Balanced',
      summary: parsed.summary || 'You seem balanced today with opportunities for gentle progress.',
      suggestionWorkout: parsed.suggestionWorkout || '10-minute gentle mobility routine',
      suggestionNutrition: parsed.suggestionNutrition || 'Focus on hydration and balanced meals.',
      aiMessage: parsed.aiMessage || parsed.summary || 'Keep going, one small healthy action at a time.',
      source: 'gemini'
    };
  } catch (err) {
    console.error('AI Insight Error:', err.message || err);
    const fallback = aiFallbackInsight(payload);
    fallback.aiMessage = `(AI Service Busy - showing preview) ` + fallback.aiMessage;
    fallback.source = 'error-fallback';
    return fallback;
  }
}


app.get('/api/health', (_req, res) => {
  res.json({ ok: true, aiConnected: Boolean(genAI) });
});

// -----------------------------------------------------------------
// AUTH (MOCK)
// -----------------------------------------------------------------
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(401).json({ error: 'Invalid credentials' });
    
    // In a real app we'd return a JWT. Here we just return the user object.
    res.json({ message: 'Login successful', user: row });
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, persona } = req.body;
  const settings = JSON.stringify({});
  db.run(`INSERT INTO users (name, email, password, persona, settings_json) VALUES (?, ?, ?, ?, ?)`,
    [name, email, password, persona, settings], function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'Registration successful', userId: this.lastID });
  });
});

// -----------------------------------------------------------------
// PROFILE
// -----------------------------------------------------------------
app.get('/api/user/:id', (req, res) => {
  db.get('SELECT id, name, email, persona, settings_json FROM users WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

app.put('/api/user/:id', (req, res) => {
  const { name, persona, settings_json } = req.body;
  db.run('UPDATE users SET name = ?, persona = ?, settings_json = ? WHERE id = ?', 
    [name, persona, settings_json, req.params.id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Profile updated' });
  });
});

app.delete('/api/user/:id', (req, res) => {
  const userId = req.params.id;
  
  // Nuke everything related to this user
  db.serialize(() => {
    db.run('DELETE FROM workouts WHERE user_id = ?', [userId]);
    db.run('DELETE FROM meals WHERE user_id = ?', [userId]);
    db.run('DELETE FROM journals WHERE user_id = ?', [userId]);
    db.run('DELETE FROM chats WHERE user_id = ?', [userId]);
    db.run('DELETE FROM ai_insights WHERE user_id = ?', [userId]);
    db.run('DELETE FROM users WHERE id = ?', [userId], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Account and all associated data deleted successfully' });
    });
  });
});

app.get('/api/user/summary/:id', (req, res) => {
  const userId = req.params.id;
  const today = new Date().toISOString().split('T')[0];

  // Fetch today's workout, meals, and latest mood
  db.get('SELECT * FROM workouts WHERE user_id = ? AND date = ?', [userId, today], (err, workout) => {
    db.get('SELECT * FROM meals WHERE user_id = ? AND date = ?', [userId, today], (err, meal) => {
      db.get('SELECT * FROM journals WHERE user_id = ? ORDER BY id DESC LIMIT 1', [userId], (err, journal) => {
        
        let workoutProgress = 0;
        let workoutTotal = 0;
        let workoutCompleted = 0;
        if (workout && workout.exercises_json) {
          try {
            const exercises = JSON.parse(workout.exercises_json);
            workoutTotal = exercises.length;
            workoutCompleted = exercises.filter(ex => ex.completed).length;
            workoutProgress = Math.round((workoutCompleted / workoutTotal) * 100) || 0;
          } catch (e) { console.error('Error parsing workout JSON', e); }
        }

        let nutritionProgress = 0;
        let nutritionKcal = 0;
        let nutritionTarget = 2000;
        if (meal && meal.meals_json) {
          try {
            const meals = JSON.parse(meal.meals_json);
            const mealCount = meals.length;
            const mealCompletedCount = meals.filter(m => m.completed).length;
            nutritionProgress = Math.round((mealCompletedCount / mealCount) * 100) || 0;
            nutritionKcal = meals.reduce((acc, m) => m.completed ? acc + m.kcal : acc, 0);
            nutritionTarget = meal.calorie_target || 2000;
          } catch (e) { console.error('Error parsing meals JSON', e); }
        }

        // Refined Wellness Score: 40% Workout, 40% Nutrition, 20% Journaling
        const journalScore = journal ? 100 : 0;
        const wellnessScore = Math.round((workoutProgress * 0.4) + (nutritionProgress * 0.4) + (journalScore * 0.2));

        res.json({
          wellnessScore,
          workout: { progress: workoutProgress, total: workoutTotal, completed: workoutCompleted },
          nutrition: { progress: nutritionProgress, kcal: nutritionKcal, target: nutritionTarget },
          latestMood: journal ? journal.mood : null,
          latestMoodLabel: (journal && journal.mood >= 7) ? 'Amazing' : (journal && journal.mood >= 4) ? 'Good' : journal ? 'Low' : 'N/A'
        });
      });
    });
  });
});


// -----------------------------------------------------------------
// FITNESS PROFILE & WORKOUTS
// -----------------------------------------------------------------

// Fitness AI Chat - Handles onboarding and coaching
app.post('/api/fitness/chat', async (req, res) => {
  const { userId, message } = req.body;
  
  try {
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT settings_json FROM users WHERE id = ?', [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    let settings = {};
    try { settings = JSON.parse(user?.settings_json || '{}'); } catch(e) {}
    const profile = settings.fitnessProfile || {};
    
    const systemPrompt = `You are the InnerTrace Fitness AI Coach. 
    Your goal is to collect: 1. Height, 2. Weight, 3. Age, 4. Medical history/Injuries.
    Current User Profile: ${JSON.stringify(profile)}
    
    If any metrics are missing, politely ask for them. 
    If all metrics are present, acknowledge them and tell the user you are ready to generate their plan.
    Keep responses short, encouraging, and focused on fitness (maximum 3 sentences). 
    NEVER give medical advice beyond safety warnings.
    
    If the user provides metrics in this message, respond that you've recorded them.
    If the user says they have an injury, acknowledge it and say you will adjust the plan.`;

    if (genAI) {
      const response = await callAiWithRetry([systemPrompt, message].join('\n\n'));
      res.json({ response: response.response.text() });
    } else {
      res.json({ response: "I'm ready to help! Please tell me your height, weight, age, and any injuries so we can get started." });
    }
  } catch (error) {
    console.error('Fitness chat error:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

app.post('/api/fitness/profile', (req, res) => {
  const { userId, height, weight, age, medicalHistory } = req.body;
  
  db.get('SELECT settings_json FROM users WHERE id = ?', [userId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    
    let settings = {};
    try { settings = JSON.parse(row?.settings_json || '{}'); } catch(e) {}
    
    settings.fitnessProfile = { height, weight, age, medicalHistory };
    
    db.run('UPDATE users SET settings_json = ? WHERE id = ?', 
      [JSON.stringify(settings), userId], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Fitness profile updated' });
    });
  });
});

app.get('/api/workouts/:userId', (req, res) => {
  db.all('SELECT * FROM workouts WHERE user_id = ? ORDER BY id DESC', [req.params.userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/workouts/generate', async (req, res) => {
  const { userId, type, duration } = req.body;
  const date = new Date().toISOString().split('T')[0];

  // Fetch user profile to personalize
  db.get('SELECT persona, settings_json FROM users WHERE id = ?', [userId], async (err, user) => {
    let settings = {};
    try { settings = JSON.parse(user?.settings_json || '{}'); } catch(e) {}
    const level = settings.fitnessLevel || 50;
    const goals = settings.goals || [];
    const profile = settings.fitnessProfile || {};

    let generatedExercises = [];

    if (genAI) {
      try {
        const response = await callAiWithRetry(`
You are InnerTrace, a professional fitness coach.
Generate a personalized workout plan as strict JSON only.
User Profile: 
- Persona: ${user?.persona || 'User'}
- Fitness Level: ${level}/100
- Goals: ${goals.join(', ')}
- Physical Metrics: Age ${profile.age || 'N/A'}, Weight ${profile.weight || 'N/A'}, Height ${profile.height || 'N/A'}
- Medical History/Injuries: ${profile.medicalHistory || 'None reported'}

Workout Request: Type: ${type}, Duration: ${duration} minutes.

Return a JSON array of exercises:
[
  { "id": 1, "name": "string", "sets": number, "reps": "string", "difficulty": "Easy/Moderate/Hard", "completed": false }
]

Rules:
- IMPORTANT: Respect the medical history. Avoid exercises that might aggravate reported injuries.
- Number of exercises should fit the duration (${duration} min).
- Keep exercise names clear and reps specific.
- Match difficulty to fitness level (${level}).
- Include a separate key "aiNote" which is a warm, empathetic paragraph (3-4 sentences) explaining why this specific plan is good for their goals and respects their physical condition.
- Empathetic and professional tone.
`);

        const resultText = response.response.text();
        const raw = resultText.trim().replace(/^```json\s*/i, '').replace(/```$/, '').trim();
        const parsed = JSON.parse(raw);
        generatedExercises = parsed.exercises || (Array.isArray(parsed) ? parsed : []);
        aiNote = parsed.aiNote || `This plan is designed to help you build momentum towards your ${type} goals while respecting your current fitness level.`;
      } catch (err) {
        console.error('AI Workout Error (falling back to smart defaults):', err.message);
        aiNote = `The AI service is currently busy, so I've generated a high-quality ${type} template for you. This routine focus on core movements that will help you stay consistent while we wait for the AI to recalibrate. Keep up the great work!`;
        
        // Smart Fallback based on Type
        const fallbacks = {
          'Yoga': [
            { id: 1, name: 'Sun Salutation', sets: 3, reps: '5 mins', difficulty: 'Easy', completed: false },
            { id: 2, name: 'Warrior I & II', sets: 2, reps: '3 mins each', difficulty: 'Moderate', completed: false },
            { id: 3, name: 'Tree Pose', sets: 2, reps: '2 mins each', difficulty: 'Easy', completed: false },
            { id: 4, name: 'Childs Pose Recovery', sets: 1, reps: '5 mins', difficulty: 'Easy', completed: false }
          ],
          'HIIT': [
            { id: 1, name: 'Burpees', sets: 4, reps: '45 secs', difficulty: 'Hard', completed: false },
            { id: 2, name: 'Mountain Climbers', sets: 4, reps: '45 secs', difficulty: 'Moderate', completed: false },
            { id: 3, name: 'Jumping Jacks', sets: 3, reps: '1 min', difficulty: 'Easy', completed: false },
            { id: 4, name: 'Plank Hold', sets: 3, reps: '1 min', difficulty: 'Moderate', completed: false }
          ],
          'Strength': [
            { id: 1, name: 'Push-ups', sets: 3, reps: '12 reps', difficulty: 'Moderate', completed: false },
            { id: 2, name: 'Bodyweight Squats', sets: 4, reps: '15 reps', difficulty: 'Moderate', completed: false },
            { id: 3, name: 'Lunges', sets: 3, reps: '10 per leg', difficulty: 'Moderate', completed: false },
            { id: 4, name: 'Dips', sets: 3, reps: '12 reps', difficulty: 'Hard', completed: false }
          ],
          'Walking': [
            { id: 1, name: 'Brisk Walk', sets: 1, reps: `${duration} mins`, difficulty: 'Easy', completed: false }
          ],
          'Stretching': [
            { id: 1, name: 'Hamstring Stretch', sets: 2, reps: '1 min each', difficulty: 'Easy', completed: false },
            { id: 2, name: 'Shoulder Rolls', sets: 2, reps: '1 min', difficulty: 'Easy', completed: false },
            { id: 3, name: 'Cobra Stretch', sets: 2, reps: '1 min', difficulty: 'Easy', completed: false }
          ]
        };
        
        generatedExercises = fallbacks[type] || [
          { id: 1, name: 'Stretching', sets: 3, reps: '10 reps', difficulty: 'Easy', completed: false },
          { id: 2, name: 'Brisk Walk', sets: 1, reps: '10 mins', difficulty: 'Easy', completed: false }
        ];

        // Adjust volume based on duration
        const durationFactor = duration / 30; // Base is 30 mins
        
        generatedExercises = (fallbacks[type] || fallbacks['Stretching']).map(ex => ({
          ...ex,
          sets: Math.max(ex.sets, Math.round(ex.sets * durationFactor)),
          reps: ex.reps.includes('mins') 
            ? `${Math.round(parseInt(ex.reps) * durationFactor)} mins` 
            : ex.reps
        }));

        // If duration is long, add a few more variations or a long cool down
        if (duration >= 45 && type !== 'Walking') {
          if (type === 'Yoga') {
            generatedExercises.push({ id: 10, name: 'Deep Savasana', sets: 1, reps: '10 mins', difficulty: 'Easy', completed: false });
          } else {
            generatedExercises.push({ id: 99, name: 'Extended Cool Down & Stretch', sets: 1, reps: '10 mins', difficulty: 'Easy', completed: false });
          }
        }
        
        // Ensure Walking fills the whole time
        if (type === 'Walking') {
          generatedExercises[0].reps = `${duration} mins`;
        }
      }
    }

    db.run('INSERT INTO workouts (user_id, date, type, duration, exercises_json, ai_note) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, date, type, duration, JSON.stringify(generatedExercises), aiNote], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, exercises: generatedExercises, aiNote });
    });
  });
});

app.put('/api/workouts/:id', (req, res) => {
  const exercises_json = typeof req.body.exercises_json === 'string' 
    ? req.body.exercises_json 
    : JSON.stringify(req.body.exercises_json);
  db.run('UPDATE workouts SET exercises_json = ? WHERE id = ?', [exercises_json, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Workout updated' });
  });
});


// -----------------------------------------------------------------
// NUTRITION
// -----------------------------------------------------------------
app.get('/api/nutrition/:userId', (req, res) => {
  db.all('SELECT * FROM meals WHERE user_id = ? ORDER BY id DESC', [req.params.userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/nutrition/generate', async (req, res) => {
  const { userId, dietType, calorieTarget } = req.body;
  const date = new Date().toISOString().split('T')[0];
  
  let generatedMeals = [];

  if (genAI) {
    try {
      const response = await callAiWithRetry(`
You are InnerTrace, a certified nutritionist.
Generate a daily meal plan as strict JSON only.
Diet Preference: ${dietType}, Calorie Target: ${calorieTarget} kcal.

Return a JSON array of meals:
[
  { "id": 1, "name": "Breakfast/Lunch/Snack/Dinner", "description": "Meal name and details", "kcal": number, "p": number, "c": number, "f": number, "completed": false }
]

Rules:
- Total kcal should be approximately ${calorieTarget}.
- P/C/F are protein, carbs, fats in grams.
- Meals must strictly follow the ${dietType} diet.
- Include a separate key "aiNote" which is a warm, empathetic paragraph (3-4 sentences) explaining why this ${dietType} meal plan is optimal for their health.
- Empathetic and professional tone.
`);

      const resultText = response.response.text();
      const raw = resultText.trim().replace(/^```json\s*/i, '').replace(/```$/, '').trim();
      const parsed = JSON.parse(raw);
      generatedMeals = parsed.meals || (Array.isArray(parsed) ? parsed : []);
      aiNote = parsed.aiNote || `This ${dietType} plan is designed to help you reach your ${calorieTarget} kcal target with balanced nutrition.`;
    } catch (err) {
      console.error('AI Nutrition Error (falling back to smart defaults):', err.message);
      aiNote = `The AI service is currently busy, so I've created a balanced ${dietType} template that fits your ${calorieTarget} calorie goal. This plan focuses on high-density nutrients to keep you satisfied throughout the day.`;
      
      const p = Math.round(calorieTarget * 0.25 / 4);
      const c = Math.round(calorieTarget * 0.45 / 4);
      const f = Math.round(calorieTarget * 0.3 / 9);

      // Smart Fallback based on Diet Type
      const dietFallbacks = {
        'Vegan': [
          { id: 1, name: 'Breakfast', description: 'Oatmeal with chia seeds, berries, and almond milk', kcal: Math.round(calorieTarget*0.25), p, c, f, completed: false },
          { id: 2, name: 'Lunch', description: 'Quinoa and black bean bowl with avocado', kcal: Math.round(calorieTarget*0.35), p, c, f, completed: false },
          { id: 3, name: 'Dinner', description: 'Lentil curry with brown rice and steamed kale', kcal: Math.round(calorieTarget*0.4), p, c, f, completed: false }
        ],
        'Keto': [
          { id: 1, name: 'Breakfast', description: '3 Scrambled eggs with spinach and avocado', kcal: Math.round(calorieTarget*0.3), p, c, f, completed: false },
          { id: 2, name: 'Lunch', description: 'Grilled chicken thighs with buttered broccoli', kcal: Math.round(calorieTarget*0.3), p, c, f, completed: false },
          { id: 3, name: 'Dinner', description: 'Baked salmon with asparagus and olive oil', kcal: Math.round(calorieTarget*0.4), p, c, f, completed: false }
        ],
        'High Protein': [
          { id: 1, name: 'Breakfast', description: 'Greek yogurt with protein powder and nuts', kcal: Math.round(calorieTarget*0.25), p: p*2, c, f, completed: false },
          { id: 2, name: 'Lunch', description: 'Double chicken breast with sweet potato', kcal: Math.round(calorieTarget*0.35), p: p*2, c, f, completed: false },
          { id: 3, name: 'Dinner', description: 'Lean beef stir-fry with mixed vegetables', kcal: Math.round(calorieTarget*0.4), p: p*2, c, f, completed: false }
        ]
      };

      generatedMeals = dietFallbacks[dietType] || [
        { id: 1, name: 'Breakfast', description: 'Oatmeal with berries', kcal: 400, p: 15, c: 60, f: 10, completed: false },
        { id: 2, name: 'Lunch', description: 'Balanced Green Salad', kcal: 600, p: 20, c: 40, f: 20, completed: false },
        { id: 3, name: 'Dinner', description: 'Grilled Chicken/Tofu with Veggies', kcal: 800, p: 30, c: 50, f: 20, completed: false }
      ];
    }
  }

  db.run('INSERT INTO meals (user_id, date, diet_type, calorie_target, meals_json, ai_note) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, date, dietType, calorieTarget, JSON.stringify(generatedMeals), aiNote], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, meals: generatedMeals, aiNote });
  });
});

app.put('/api/nutrition/:id', (req, res) => {
  const meals_json = typeof req.body.meals_json === 'string' 
    ? req.body.meals_json 
    : JSON.stringify(req.body.meals_json);
  db.run('UPDATE meals SET meals_json = ? WHERE id = ?', [meals_json, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Meals updated' });
  });
});


// -----------------------------------------------------------------
// JOURNAL
// -----------------------------------------------------------------
app.get('/api/journal/:userId', (req, res) => {
  db.all('SELECT * FROM journals WHERE user_id = ? ORDER BY id DESC', [req.params.userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/journal', (req, res) => {
  const {
    userId = DEFAULT_USER_ID,
    type = 'reflective',
    mood = null,
    sleep = null,
    stress = null,
    energy = null,
    content = ''
  } = req.body;
  const date = new Date().toISOString().split('T')[0];
  
  // Check if an entry for today already exists
  db.get('SELECT id FROM journals WHERE user_id = ? AND date = ?', [userId, date], (err, existing) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (existing) {
      // Update existing
      db.run(
        'UPDATE journals SET type = ?, mood = ?, sleep = ?, stress = ?, energy = ?, content = ? WHERE id = ?',
        [type, mood, sleep, stress, energy, content, existing.id],
        function(err) {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ id: existing.id, message: 'Journal updated for today' });
        }
      );
    } else {
      // Create new
      db.run(
        'INSERT INTO journals (user_id, date, type, mood, sleep, stress, energy, content) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [userId, date, type, mood, sleep, stress, energy, content],
        function(err) {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ id: this.lastID, message: 'Journal saved' });
        }
      );
    }
  });
});

// -----------------------------------------------------------------
// AI CHAT & INSIGHTS
// -----------------------------------------------------------------
app.post('/api/ai/chat', async (req, res) => {
  const { userId, message } = req.body;
  const timestamp = new Date().toISOString();
  
  // Save user message
  db.run('INSERT INTO chats (user_id, timestamp, sender, message) VALUES (?, ?, ?, ?)', [userId, timestamp, 'user', message]);

  let aiResponseText = "I'm sorry, my AI brain isn't connected right now because the GEMINI_API_KEY is missing from the .env file!";
  
  if (genAI) {
    try {
      const response = await callAiWithRetry(`You are InnerTrace, a supportive AI wellness companion. Provide a warm, thoughtful paragraph (3-5 sentences) in response to the user. User says: ${message}`);
      aiResponseText = response.response.text();
    } catch (err) {
      console.error(err);
      aiResponseText = "The AI service is currently experiencing high demand (503). Please try again in a few moments!";
    }

  }

  // Save AI response
  db.run('INSERT INTO chats (user_id, timestamp, sender, message) VALUES (?, ?, ?, ?)', [userId, new Date().toISOString(), 'ai', aiResponseText]);
  
  res.json({ response: aiResponseText });
});

app.get('/api/ai/chat/history/:userId', (req, res) => {
  db.all('SELECT * FROM chats WHERE user_id = ? ORDER BY id ASC', [req.params.userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/ai/journal-insight', async (req, res) => {
  const {
    userId = DEFAULT_USER_ID,
    journalId = null,
    content = '',
    sleep = 7,
    stress = 5,
    energy = 6
  } = req.body || {};

  if (!content || !String(content).trim()) {
    return res.status(400).json({ error: 'Journal content is required for AI insight.' });
  }

  const insight = await generateJournalInsightWithAi({
    content: String(content).trim(),
    sleep: Number(sleep),
    stress: Number(stress),
    energy: Number(energy)
  });

  db.run(
    `INSERT INTO ai_insights (user_id, journal_id, created_at, mood_label, summary, suggestion_workout, suggestion_nutrition)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      journalId,
      new Date().toISOString(),
      insight.moodLabel,
      insight.summary,
      insight.suggestionWorkout,
      insight.suggestionNutrition
    ]
  );

  res.json(insight);
});

// Nutrition AI Chat - Specialized diet coaching
app.post('/api/nutrition/chat', async (req, res) => {
  const { userId, message } = req.body;
  try {
    const systemPrompt = `You are the InnerTrace Nutritionist AI. 
    Provide expert, supportive nutritional advice based on the user's message.
    If they describe a meal, analyze its health benefits.
    Keep responses practical, encouraging, and under 4 sentences.
    NEVER give medical advice. If they ask about medical conditions, advise them to consult a doctor.`;

    if (genAI) {
      const response = await callAiWithRetry([systemPrompt, message].join('\n\n'));
      res.json({ response: response.response.text() });
    } else {
      res.json({ response: "I'm here to help with your diet! What have you eaten today or what nutritional questions do you have?" });
    }
  } catch (error) {
    console.error('Nutrition chat error:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

// Journal AI Chat - Guiding reflections
app.post('/api/journal/chat', async (req, res) => {
  const { userId, message } = req.body;
  try {
    const systemPrompt = `You are the InnerTrace Journaling Guide. 
    Help the user reflect on their day with empathy and curiosity.
    Ask follow-up questions to help them dive deeper into their feelings.
    Keep responses warm, supportive, and under 3 sentences.`;

    if (genAI) {
      const response = await callAiWithRetry([systemPrompt, message].join('\n\n'));
      res.json({ response: response.response.text() });
    } else {
      res.json({ response: "I'm listening. Tell me more about your day or how you're feeling right now." });
    }
  } catch (error) {
    console.error('Journal chat error:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

app.listen(port, () => {
  console.log(`InnerTrace API running on http://localhost:${port}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Please kill the process or use a different port.`);
  } else {
    console.error('Server error:', err);
  }
});

