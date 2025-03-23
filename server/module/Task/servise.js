const { readData, writeData } = require("../../DataBase/ConnestTask.js");

const _getData = async () => {
  return await readData();
};

const _saveData = async (data) => {
  await writeData(data);
};

const createTask = async (title, description, statusTodo, userId) => {
  const data = await _getData();

  const newTask = {
    id: data.tasks.length + 1,
    title,
    description,
    userId,
    statusTodo,
  };
  data.tasks.push(newTask);
  await _saveData(data);
  return newTask;
};

const getTasks = async () => {
  const data = await _getData();
  return data.tasks;
};

const getTaskById = async (id) => {
  const data = await _getData();
  const task = data.tasks.find((task) => task.id === parseInt(id));
  if (!task) {
    throw new Error(`Задача с ID ${id} не найдена`);
  }
  return task;
};

const updateTask = async (id, title, description, statusTodo, userId) => {
  const data = await _getData();
  const taskIndex = data.tasks.findIndex((task) => task.id === parseInt(id));
  if (taskIndex === -1) {
    throw new Error(`Задача с ID ${id} не найдена`);
  }
  data.tasks[taskIndex] = {
    ...data.tasks[taskIndex],
    title,
    description,
    userId,
    statusTodo,
  };
  await _saveData(data);
  return data.tasks[taskIndex];
};

const deleteTask = async (id) => {
  const data = await _getData();
  const taskIndex = data.tasks.findIndex((task) => task.id === parseInt(id));
  if (taskIndex === -1) {
    return false; 
  }
  data.tasks.splice(taskIndex, 1);
  await _saveData(data);
  return true;
};

const getTasksByUserId = async (userId) => {
  const data = await _getData();
  return data.tasks.filter((task) => task.userId === String(userId));
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByUserId,
};