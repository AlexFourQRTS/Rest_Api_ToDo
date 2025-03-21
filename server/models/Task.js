const { readData, writeData } = require('../utils/data');

const createTask = async (title, description, userId) => {
  const data = await readData();
  const newTask = {
    id: data.tasks.length + 1,
    title,
    description,
    userId,
  };
  data.tasks.push(newTask);
  await writeData(data);
  return newTask;
};

const getTasks = async () => {
  const data = await readData();
  return data.tasks;
};

const getTaskById = async (id) => {
  const data = await readData();
  return data.tasks.find((task) => task.id === parseInt(id));
};

const updateTask = async (id, title, description, status) => {
  const data = await readData();
  const taskIndex = data.tasks.findIndex((task) => task.id === parseInt(id));
  if (taskIndex === -1) {
    return null;
  }
  data.tasks[taskIndex] = {
    ...data.tasks[taskIndex],
    title,
    description,
    status,
  };
  await writeData(data);
  return data.tasks[taskIndex];
};

const deleteTask = async (id) => {
  const data = await readData();
  const taskIndex = data.tasks.findIndex((task) => task.id === parseInt(id));
  if (taskIndex === -1) {
    return false;
  }
  data.tasks.splice(taskIndex, 1);
  await writeData(data);
  return true;
};

const getTasksByUserId = async (userId) => {
  const data = await readData();
  return data.tasks.filter(task => task.userId === String(userId)); 
};



module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByUserId, 
};