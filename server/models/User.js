const db = require('./db'); 

const initializeDatabase = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL
    );
  `;
  await db.query(createTableQuery);
};

const createUser = async (username, password, role = "user") => {
  const insertQuery = `
    INSERT INTO users (username, password, role)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const result = await db.query(insertQuery, [username, password, role]);
  return result.rows[0];
};

const findUserByUsername = async (username) => {
  const selectQuery = `
    SELECT * FROM users
    WHERE username = $1;
  `;
  const result = await db.query(selectQuery, [username]);
  return result.rows[0];
};

const findUserById = async (id) => {
  const selectQuery = `
    SELECT * FROM users
    WHERE id = $1;
  `;
  const result = await db.query(selectQuery, [id]);
  return result.rows[0];
};

const findAll = async () => {
  const selectAllQuery = `
    SELECT * FROM users;
  `;
  const result = await db.query(selectAllQuery);
  return result.rows;
};

initializeDatabase();

module.exports = {
  createUser,
  findUserByUsername,
  findUserById,
  findAll,
};