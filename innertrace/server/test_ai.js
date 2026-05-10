const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  try {
    const ai = new GoogleGenAI({ apiKey });
    console.log('Calling AI...');
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: 'Hello' }] }]
    });
    console.log('AI Call Finished');
    console.log('Success:', response.candidates[0].content.parts[0].text);
  } catch (err) {
    console.error('Test Failed:', err.message);
  }
}

test();
