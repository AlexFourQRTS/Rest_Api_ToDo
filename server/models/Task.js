const db = require('./db'); 

const getTasks = async () => {
  const selectAllQuery = `
    SELECT * FROM tasks;
  `;
  const result = await db.query(selectAllQuery);
  return result.rows;
};

const getTaskById = async (id) => {
  const selectQuery = `
    SELECT * FROM tasks
    WHERE id = $1;
  `;
  const result = await db.query(selectQuery, [id]);
  if (result.rows.length === 0) {
    throw new Error(`Задача с ID ${id} не найдена`);
  }
  return result.rows[0];
};

const getTasksByUserId = async (user_id) => {
  const selectQuery = `
    SELECT * FROM tasks
    WHERE user_id = $1;
  `;
  const result = await db.query(selectQuery, [user_id]);
  return result.rows;
};

const createTask = async (
  title = "Без названия",
  description = "Описание отсутствует",
  statusTodo = "pending",
  user_id
) => {
  if (!user_id) {
    return "Не верный ввод createTask";
  }

  const insertQuery = `
    INSERT INTO tasks (title, description, status_todo, user_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const result = await db.query(insertQuery, [title, description, statusTodo, user_id]);
  return result.rows[0];
};

const updateTask = async (
  id,
  title = "Без названия",
  description = "Описание отсутствует",
  statusTodo = "pending",
  userId
) => {
  // ...
  const updateQuery = `
    UPDATE tasks
    SET title = COALESCE($2, title),
        description = COALESCE($3, description),
        status_todo = COALESCE($4, status_todo),
        user_id = COALESCE($5, user_id)
    WHERE id = $1
    RETURNING *;
  `;
  const result = await db.query(updateQuery, [id, title, description, statusTodo, userId]);
  if (result.rows.length === 0) {
    throw new Error(`Задача с ID ${id} не найдена`);
  }
  return result.rows[0];
};

const deleteTask = async (id) => {
  const deleteQuery = `
    DELETE FROM tasks
    WHERE id = $1
    RETURNING *;
  `;
  const result = await db.query(deleteQuery, [id]);
  return result.rows.length > 0;
};

module.exports = {
  getTasks,
  getTaskById,
  getTasksByUserId,
  createTask,
  updateTask,
  deleteTask,
};