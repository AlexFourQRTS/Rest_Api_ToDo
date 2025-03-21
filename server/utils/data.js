// utils/data.js
const fs = require('fs').promises;
const path = require('path');

const dataFilePath = path.resolve(__dirname, '../data.json');

const readData = async () => {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { users: [], tasks: [] };
  }
};

const writeData = async (data) => {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
};

module.exports = {
  readData,
  writeData,
};