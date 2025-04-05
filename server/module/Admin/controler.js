const express = require("express");
const router = express.Router();
const AdminService = require("./servise");
const authenticateToken = require("../../middleware/auth");
const {
  getTasks,
  getTaskById,
  getTasksByUserId,
  createTask,
  updateTask,
  deleteTask,
} = require("../../models/Task");

const {
  createUser,
  findUserByUsername,
  findUserById,
  findAll,
  deleteUser,
} = require("../../models/User");

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Нет прав администратора" });
  }
};

router.get("/users", authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await AdminService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/users/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const user = await AdminService.getUserById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.delete("/users/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    await AdminService.deleteUser(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.get("/tasks/:userId", authenticateToken, async (req, res) => {
  try {
    const tasks = await getTasksByUserId(req.params.userId);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/tasksCreate", authenticateToken, async (req, res) => {
  try {
    const { title, description, statusTodo, userId } = req.body;
    const task = await createTask(title, description, statusTodo, userId);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
