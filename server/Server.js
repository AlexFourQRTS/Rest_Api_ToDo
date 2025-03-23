const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");

const authController = require("./module/Auth/controler");
const userController = require("./module/User/controler");
const taskController = require("./module/Task/controler");

app.use(cors());
app.use(express.json());

app.use("/auth", authController);
app.use("/users", userController);
app.use("/tasks", taskController);

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});

