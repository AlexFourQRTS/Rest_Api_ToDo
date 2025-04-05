const db = require("../../models/db");
const bcrypt = require("bcrypt");
const saltRounds = 10;

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

const createUser = async (username, password, role) => {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    console.log("hashedPassword", hashedPassword);
    
    const insertQuery = `
      INSERT INTO users (username, password, role) 
      VALUES ($1, $2, $3)
      RETURNING id, username, role;
    `;
    const result = await db.query(insertQuery, [username, hashedPassword, role]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

const findUserByUsername = async (username) => {
  const selectQuery = `
    SELECT id, username, password, role FROM users 
    WHERE username = $1;
  `;
  const result = await db.query(selectQuery, [username]);
  return result.rows[0];
};

const comparePasswords = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

initializeDatabase();

module.exports = {
  createUser,
  findUserByUsername,
  comparePasswords,
};