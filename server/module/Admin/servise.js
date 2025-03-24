const User = require("../../models/User");

class AdminService {
  static async getAllUsers() {
    try {
      return User.findAll();
    } catch (error) {
      throw new Error(
        `Ошибка при получении всех пользователей: ${error.message}`
      );
    }
  }

  static async getUserById(id) {
    try {
      const user = User.findUserById(id);
      if (!user) {
        throw new Error(`Пользователь с ID ${id} не найден`);
      }
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

}

module.exports = AdminService;
