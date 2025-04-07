const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");

const authController = require("./module/Auth/controler");
const userController = require("./module/User/controler");
const adminController = require("./module/Admin/controler");

app.use(cors());
app.use(express.json());

app.use("/auth", authController);
app.use("/users/", userController);
app.use("/admin", adminController);

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});

