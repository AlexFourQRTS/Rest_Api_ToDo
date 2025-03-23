const express = require('express');
const router = express.Router();
const TaskService = require("./servise");
const authenticateToken = require('../../middleware/auth');


router.post('/tasksCreate', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Нет прав для создания задач' });
    }
    const { title, description, statusTodo, userId } = req.body;
    const newTask = await TaskService.createTask(title, description, statusTodo, userId);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/users/:userId', authenticateToken, async (req, res) => {
  try {
    
    const tasks = await TaskService.getTasksByUserId(req.params.userId);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;