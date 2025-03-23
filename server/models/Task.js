const fs = require('fs').promises;
const path = require('path');
const dataFilePath = path.resolve(__dirname, '../DataBase/Tasks.json');

const readData = async () => {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch {
    return { users: [], tasks: [] };
  }
};

const writeData = async (data) => {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
};

const getTasks = async () => (await readData()).tasks;

const getTaskById = async (id) => {
  const task = (await getTasks()).find((t) => t.id === parseInt(id));
  if (!task) throw new Error(`Задача с ID ${id} не найдена`);
  return task;
};

const getTasksByUserId = async (userId) => (await getTasks()).filter((t) => t.userId === String(userId));

const createTask = async (title, description, statusTodo, userId) => {
  const data = await readData();
  const newTask = { id: data.tasks.length + 1, title, description, userId, statusTodo };
  data.tasks.push(newTask);
  await writeData(data);
  return newTask;
};

const updateTask = async (id, title, description, statusTodo, userId) => {
  const data = await readData();
  const taskIndex = data.tasks.findIndex((t) => t.id === parseInt(id));
  if (taskIndex === -1) throw new Error(`Задача с ID ${id} не найдена`);
  data.tasks[taskIndex] = { ...data.tasks[taskIndex], title, description, userId, statusTodo };
  await writeData(data);
  return data.tasks[taskIndex];
};

const deleteTask = async (id) => {
  const data = await readData();
  const taskIndex = data.tasks.findIndex((t) => t.id === parseInt(id));
  if (taskIndex === -1) return false;
  data.tasks.splice(taskIndex, 1);
  await writeData(data);
  return true;
};

module.exports = {
  getTasks,
  getTaskById,
  getTasksByUserId,
  createTask,
  updateTask,
  deleteTask
};
