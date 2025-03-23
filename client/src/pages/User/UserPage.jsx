import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Container, ListGroup, Form, Button } from "react-bootstrap";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const UserPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = token ? jwtDecode(token).userId : null;

  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState({});
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    userId: userId,
    statusTodo: "Active Статус",
  });

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
      fetchTasks();
    }
  }, [navigate, token, userId, fetchTasks]);

  const handleInputChangeNewTask = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const createTask = async () => {
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
      setNewTask({
        title: "",
        description: "",
        statusTodo: "Active Статус",
        userId: userId,
      });
    } catch (error) {
      console.error(
        "Ошибка создания задачи:",
        error.response?.data || error.message
      );
      alert("Не удалось создать задачу.");
    }
  };

  const deleteTask = async (taskId) => {
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
        console.error(
          "Ошибка удаления задачи:",
          error.response?.data || error.message
        );
        fetchTasks();
      }
    }
  };

  const editTask = (task) => {
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

  const saveTask = async (taskId) => {
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
      console.error(
        "Ошибка обновления задачи:",
        error.response?.data || error.message
      );
      fetchTasks();
    }
  };

  const cancelEdit = () => {
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

          <Form.Group className="mb-3">
            <Form.Control
              name="userId"
              value={newTask.userId || userId}
              readOnly
            />
          </Form.Group>
          <Button variant="primary" onClick={createTask}>
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
                    </Form.Control>
                  </Form.Group>
                  <Button variant="success" onClick={() => saveTask(task.id)}>
                    Сохранить
                  </Button>{" "}
                  <Button variant="secondary" onClick={cancelEdit}>
                    Отмена
                  </Button>
                </Form>
              ) : (
                <>
                  <p>{task.description}</p>
                  <small>Статус: {task.statusTodo}</small>{" "}
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => editTask(task)}
                  >
                    Редактировать
                  </Button>{" "}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteTask(task.id)}
                  >
                    Удалить
                  </Button>
                  <br />
                  <br />
                  <div>{task.title}</div>
                  <br />
                  <br />
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
