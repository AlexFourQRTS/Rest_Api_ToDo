const express = require('express');
const app = express();
const port = 5000;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Task = require('./models/Task');
const authenticateToken = require('./middleware/auth');
const cors = require('cors')

app.use(cors());
app.use(express.json());

app.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const user = await User.findUserByUsername(username);
    if (user) {
      return res.status(400).json({ message: 'Пользователь уже существует' });
    }
    const newUser = await User.createUser(username, password, role);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findUserByUsername(username);
    if (!user) {
      return res.status(400).json({ message: 'Неверные учетные данные' });
    }
    if (password !== user.password) {
      return res.status(400).json({ message: 'Неверные учетные данные' });
    }
    const token = jwt.sign({ userId: user.id, role: user.role }, 'api');
    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.get('/users', authenticateToken, async (req, res) => {
  try {
    const users = await User.findAll(); 
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/tasks', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Нет прав для создания задач' });
    }
    const { title, description, userId } = req.body;
    const newTask = await Task.createTask(title, description, userId); 
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/users/:userId/tasks', authenticateToken, async (req, res) => {
  try {
      const tasks = await Task.getTasksByUserId(req.params.userId); 
      res.json(tasks);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});


// ----------------------------------------



app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});