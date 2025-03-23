const express = require("express");
const router = express.Router();
const User = require("./servise");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const user = await User.findUserByUsername(username);
    if (user) {
      return res.status(400).json({ message: "Пользователь уже существует" });
    }
    const newUser = await User.createUser(username, password, role);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findUserByUsername(username);
    if (!user) {
      return res.status(400).json({ message: "Неверные учетные данные" });
    }
    if (password !== user.password) {
      return res.status(400).json({ message: "Неверные учетные данные" });
    }
    const token = jwt.sign({ userId: user.id, role: user.role }, "api");
    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
