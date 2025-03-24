import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Container, ListGroup, Form, Button } from "react-bootstrap";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";

import 'react-toastify/dist/ReactToastify.css';

const UserPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = token ? jwtDecode(token).userId : null;
  const username = token ? jwtDecode(token).username : null;

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

  const InputChangeNewTask = (e) => {
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
    const taskToDelete = tasks.find(task => task.id === taskId);
    if (!taskToDelete) return;

    const toastId = toast.warn(
      <div>
        <p>Вы уверены, что хотите удалить задачу "{taskToDelete.title}"?</p>
        <Button variant="danger" size="sm" onClick={async () => {
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
            toast.success("Задача успешно удалена!");
            toast.dismiss(toastId);
          } catch (error) {
            toast.error(
              `Ошибка удаления задачи: ${error.response?.data || error.message}`
            );
            console.error("Ошибка удаления задачи:", error);
            fetchTasks(); 
            toast.dismiss(toastId);
          }
        }}>
          Удалить
        </Button>{' '}
        <Button variant="secondary" size="sm" onClick={() => toast.dismiss(toastId)}>
          Отмена
        </Button>
      </div>,
      {
        position: "top-right",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      }
    );
  };


  const editTask = (task) => {
    setEditingTaskId(task.id);
    setEditedTask({ ...task });
  };

  const InputChange = (e) => {
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

  const [activeWindow, setActiveWindow] = useState('window2');

  const ButtonClick = (windowName) => {
    setActiveWindow(windowName);

  };

  return (
    <>
      <br />
      <h2>Пользователь - {username}</h2>
      <br />
      <div>
        <button className="btn" onClick={() => ButtonClick('window1')}>Создать</button>
        <button className="btn" onClick={() => ButtonClick('window2')}>Список</button>
      </div>

      {activeWindow === 'window1' && (


        <Container className="mb-4">

          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Название</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={newTask.title}
                onChange={InputChangeNewTask}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Описание</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={newTask.description}
                onChange={InputChangeNewTask}
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
      )}

      {activeWindow === 'window2' && (

        <Container>

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
                        onChange={InputChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Описание</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="description"
                        value={editedTask.description || ""}
                        onChange={InputChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Статус</Form.Label>
                      <Form.Control
                        as="select"
                        name="statusTodo"
                        value={editedTask.statusTodo || ""}
                        onChange={InputChange}
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

                    <div>{task.title}</div>

                    <br />
                  </>
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Container>
      )}
        <ToastContainer />
    </>
  );
};

export default UserPage;
