const express = require("express");
const router = express.Router();
const User = require("./servise");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

router.post("/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const user = await User.findUserByUsername(username);
    if (user) {
      return res.status(400).json({ message: "Пользователь уже существует" });
    }
    const newUser = await User.createUser(username, password, role);

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
      return res.status(400).json({ message: "Неверные учетные данные" });
    }
    console.log("password", password);

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    console.log("hashedPassword", hashedPassword);

    const isPasswordValid = await User.comparePasswords(password, hashedPassword);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Неверные учетные данные" });
    }

    const token = jwt.sign({ username: user.username, userId: user.id, role: user.role }, "api");
    res.json({ token, role: user.role, username: user.username });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;