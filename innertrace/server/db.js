const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'innertrace.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to SQLite database.');
    initDb();
  }
});

function initDb() {
  db.serialize(() => {
    // Users Table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      persona TEXT,
      settings_json TEXT
    )`);

    // Workouts Table
    db.run(`CREATE TABLE IF NOT EXISTS workouts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      date TEXT,
      type TEXT,
      duration INTEGER,
      exercises_json TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    // Meals Table
    db.run(`CREATE TABLE IF NOT EXISTS meals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      date TEXT,
      diet_type TEXT,
      calorie_target INTEGER,
      meals_json TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    // Journals Table
    db.run(`CREATE TABLE IF NOT EXISTS journals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      date TEXT,
      type TEXT,
      mood INTEGER,
      sleep REAL,
      stress REAL,
      energy REAL,
      content TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`);
    
    // Chats Table
    db.run(`CREATE TABLE IF NOT EXISTS chats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      timestamp TEXT,
      sender TEXT,
      message TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    // AI insights generated from journals
    db.run(`CREATE TABLE IF NOT EXISTS ai_insights (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      journal_id INTEGER,
      created_at TEXT,
      mood_label TEXT,
      summary TEXT,
      suggestion_workout TEXT,
      suggestion_nutrition TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(journal_id) REFERENCES journals(id)
    )`);

    // Backfill columns for old DBs created before sleep/stress/energy fields existed.
    db.all(`PRAGMA table_info(journals)`, (pragmaErr, rows) => {
      if (pragmaErr || !rows) return;
      const existingColumns = rows.map((row) => row.name);
      if (!existingColumns.includes('sleep')) {
        db.run(`ALTER TABLE journals ADD COLUMN sleep REAL`);
      }
      if (!existingColumns.includes('stress')) {
        db.run(`ALTER TABLE journals ADD COLUMN stress REAL`);
      }
      if (!existingColumns.includes('energy')) {
        db.run(`ALTER TABLE journals ADD COLUMN energy REAL`);
      }
    });

    db.all(`PRAGMA table_info(workouts)`, (pragmaErr, rows) => {
      if (pragmaErr || !rows) return;
      const cols = rows.map(r => r.name);
      if (!cols.includes('ai_note')) {
        db.run(`ALTER TABLE workouts ADD COLUMN ai_note TEXT`);
      }
    });

    db.all(`PRAGMA table_info(meals)`, (pragmaErr, rows) => {
      if (pragmaErr || !rows) return;
      const cols = rows.map(r => r.name);
      if (!cols.includes('ai_note')) {
        db.run(`ALTER TABLE meals ADD COLUMN ai_note TEXT`);
      }
    });

    // Insert a default mock user if none exists
    db.get('SELECT id FROM users WHERE email = ?', ['test@innertrace.com'], (err, row) => {
      if (!row) {
        db.run(`INSERT INTO users (name, email, password, persona, settings_json) VALUES (?, ?, ?, ?, ?)`, 
          ['User', 'test@innertrace.com', 'password123', 'Wellness Enthusiast', '{}']);
      }
    });
  });
}

module.exports = db;
