const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middleware/auth');

const {
  getTasksByUserId,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} = require("../../models/Task"); 

router.get('/:userId/tasks', authenticateToken, async (req, res) => {
  try {
    const tasks = await getTasksByUserId(req.params.userId);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:userId/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const task = await getTaskById(req.params.id);
    if (task.userId !== req.user.id) {
      return res.status(403).json({ message: 'Нет доступа к этой задаче' });
    }
    res.json(task);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.post('/:userId/tasks', authenticateToken, async (req, res) => {
  try {
    const { title, description, statusTodo , userId} = req.body;
    const newTask = await createTask(title, description, statusTodo, userId);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.put('/:userId/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const task = await getTaskById(req.params.id);
    const { title, description, statusTodo } = req.body;
    const updatedTask = await updateTask(req.params.id, title, description, statusTodo, req.user.id);
    res.json(updatedTask);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.delete('/:userId/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const task = await getTaskById(req.params.id);
    await deleteTask(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;
