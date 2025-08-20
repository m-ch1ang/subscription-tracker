const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../database.db');
const db = new sqlite3.Database(dbPath);

const initializeDatabase = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      frequency TEXT NOT NULL CHECK (frequency IN ('monthly', 'yearly', 'custom')),
      amount REAL NOT NULL,
      startDate TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating subscriptions table:', err);
    } else {
      console.log('✅ Database initialized successfully');
    }
  });
};

const getAllSubscriptions = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM subscriptions ORDER BY createdAt DESC', (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const getSubscriptionById = (id) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM subscriptions WHERE id = ?', [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const createSubscription = (subscription) => {
  return new Promise((resolve, reject) => {
    const { name, frequency, amount, startDate } = subscription;
    db.run(
      'INSERT INTO subscriptions (name, frequency, amount, startDate) VALUES (?, ?, ?, ?)',
      [name, frequency, amount, startDate],
      function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...subscription });
      }
    );
  });
};

const updateSubscription = (id, subscription) => {
  return new Promise((resolve, reject) => {
    const { name, frequency, amount, startDate } = subscription;
    db.run(
      'UPDATE subscriptions SET name = ?, frequency = ?, amount = ?, startDate = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [name, frequency, amount, startDate, id],
      function(err) {
        if (err) reject(err);
        else resolve({ id, ...subscription });
      }
    );
  });
};

const deleteSubscription = (id) => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM subscriptions WHERE id = ?', [id], function(err) {
      if (err) reject(err);
      else resolve({ deletedCount: this.changes });
    });
  });
};

module.exports = {
  initializeDatabase,
  getAllSubscriptions,
  getSubscriptionById,
  createSubscription,
  updateSubscription,
  deleteSubscription
};
