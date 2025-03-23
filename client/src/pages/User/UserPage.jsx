import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Container, ListGroup, Form, Button } from "react-bootstrap";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const UserPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState({});
  const [newTask, setNewTask] = useState({ title: "", description: "", statusTodo: "Active Статус" });
  const userId = token ? jwtDecode(token).userId : null;

  const fetchTasks = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await axios.get(
        `http://localhost:5000/users/${userId}/tasks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks(response.data);
    } catch (error) {
      console.error(
        "Ошибка получения задач:",
        error.response?.data || error.message
      );
    }
  }, [token, userId]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      setTasks([]);
      fetchTasks();
    }
  }, [navigate, token, userId, fetchTasks]);

  const handleInputChangeNewTask = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) {
      alert("Пожалуйста, введите название задачи.");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:5000/users/${userId}/tasks`,
        newTask,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks((prevTasks) => [...prevTasks, response.data]);
      setNewTask({ title: "", description: "", statusTodo: "Active Статус" }); // Очистить форму
    } catch (error) {
      console.error("Ошибка создания задачи:", error.response?.data || error.message);
      alert("Не удалось создать задачу.");
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/users/${userId}/tasks/${taskId}`,
        { statusTodo: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, statusTodo: newStatus } : task
        )
      );
    } catch (error) {
      console.error("Ошибка обновления статуса:", error.response?.data || error.message);
      fetchTasks();
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Вы уверены, что хотите удалить эту задачу?")) {
      try {
        await axios.delete(
          `http://localhost:5000/users/${userId}/tasks/${taskId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      } catch (error) {
        console.error("Ошибка удаления задачи:", error.response?.data || error.message);
        fetchTasks();
      }
    }
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
    setEditedTask({ ...task });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleSaveTask = async (taskId) => {
    try {
      await axios.put(
        `http://localhost:5000/users/${userId}/tasks/${taskId}`,
        editedTask,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? { ...editedTask } : task))
      );
      setEditingTaskId(null);
    } catch (error) {
      console.error("Ошибка обновления задачи:", error.response?.data || error.message);
      fetchTasks();
    }
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
  };

  return (
    <>
      <br />
      <h2>Список задач для Id - {userId}</h2>
      <br />

      <Container className="mb-4">
        <h3>Создать новую задачу</h3>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Название</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={newTask.title}
              onChange={handleInputChangeNewTask}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Описание</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={newTask.description}
              onChange={handleInputChangeNewTask}
            />
          </Form.Group>
          <Button variant="primary" onClick={handleCreateTask}>
            Создать задачу
          </Button>
        </Form>
      </Container>

      <Container>
        <h2>Список задач</h2>
        <ListGroup>
          {tasks.map((task) => (
            <ListGroup.Item key={task.id}>
              {editingTaskId === task.id ? (
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Название</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={editedTask.title || ""}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Описание</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="description"
                      value={editedTask.description || ""}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Статус</Form.Label>
                    <Form.Control
                      as="select"
                      name="statusTodo"
                      value={editedTask.statusTodo || ""}
                      onChange={handleInputChange}
                    >
                      <option value="Active Статус">Active Статус</option>
                      <option value="В процессе">В процессе</option>
                      <option value="Завершено">Завершено</option>
                      {/* Добавьте другие статусы по необходимости */}
                    </Form.Control>
                  </Form.Group>
                  <Button variant="success" onClick={() => handleSaveTask(task.id)}>
                    Сохранить
                  </Button>{" "}
                  <Button variant="secondary" onClick={handleCancelEdit}>
                    Отмена
                  </Button>
                </Form>
              ) : (
                <>
                  <div>
                    {task.title}
                    <Form.Check
                      inline
                      type="checkbox"
                      label="Завершено"
                      checked={task.statusTodo === "Завершено"}
                      onChange={(e) =>
                        handleStatusChange(
                          task.id,
                          e.target.checked ? "Завершено" : "Active Статус"
                        )
                      }
                    />
                  </div>
                  <p>{task.description}</p>
                  <small>Статус: {task.statusTodo}</small>{" "}
                  <Button variant="primary" size="sm" onClick={() => handleEditTask(task)}>
                    Редактировать
                  </Button>{" "}
                  <Button variant="danger" size="sm" onClick={() => handleDeleteTask(task.id)}>
                    Удалить
                  </Button>
                </>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Container>
    </>
  );
};

export default UserPage;