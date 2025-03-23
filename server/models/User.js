const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../DataBase/Users.json'); 

let users = [];


const loadUsers = () => {
  try {
    const data = fs.readFileSync(usersFilePath, 'utf8');
    users = JSON.parse(data);
  } catch (error) {
   
    users = [];
  }
};


const saveUsers = () => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
};


loadUsers();

const createUser = (username, password, role) => {
  const newUser = {
    id: users.length + 1,
    username,
    password,
    role,
  };
  users.push(newUser);
  saveUsers(); 
  return newUser;
};

const findUserByUsername = (username) => {
  return users.find((user) => user.username === username);
};


const findAll = () => {
    return users;
};

module.exports = {
  createUser,
  findUserByUsername,
  findAll,
};