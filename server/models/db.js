const { Pool } = require('pg');


const pool = new Pool({
  user: 'user',
  host: 'db',
  database: 'mydatabase',
  password: 'password',
  port: 5432,
});

const query = async (text, params) => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
};


const initializeDatabase = async () => {

  const createUserTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL
    );
  `;
  await query(createUserTableQuery);

  const createTaskTableQuery = `
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL DEFAULT 'Без названия',
      description TEXT NOT NULL DEFAULT 'Описание отсутствует',
      status_todo VARCHAR(50) NOT NULL DEFAULT 'pending',
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
    );
  `;
  await query(createTaskTableQuery);
};

initializeDatabase();

module.exports = {
  query,
};