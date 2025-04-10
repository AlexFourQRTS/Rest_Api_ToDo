const express = require("express");
const router = express.Router();
const User = require("./servise");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findUserByUsername(username);
    if (user) {
      return res.status(400).json({ message: "Пользователь уже существует" });
    }
    const newUser = await User.createUser(username, password, "user");

    const { password_hash, ...userWithoutHash } = newUser;
    res.status(201).json(userWithoutHash);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findUserByUsername(username);
    if (!user) {
      return res.status(400).json({ message: "Пользователь не найден" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Неверный пароль" });
    }
    
    const token = jwt.sign({ username: user.username, userId: user.id, role: user.role }, "api");
    res.json({ token, role: user.role, username: user.username });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;