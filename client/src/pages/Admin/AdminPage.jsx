import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Form, ListGroup, Card } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminPage = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [users, setUsers] = useState([]);
  const [selectedUserTasks, setSelectedUserTasks] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [editingTask, setEditingTask] = useState(null);


  const [createTaskTitle, setCreateTaskTitle] = useState("");
  const [createTaskDescription, setCreateTaskDescription] = useState("");
  const [createTaskStatusTodo, setCreateTaskStatusTodo] = useState("Active Статус");
  const [createTaskUserId, setCreateTaskUserId] = useState("");


  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [editTaskDescription, setEditTaskDescription] = useState("");
  const [editTaskStatusTodo, setEditTaskStatusTodo] = useState("");
  const [editTaskUserId, setEditTaskUserId] = useState("");

  useEffect(() => {
    if (role !== "admin") {
      navigate("/");
    } else {
      fetchUsers();
    }
  }, [navigate, role]);

  useEffect(() => {
    if (users.length > 0 && !createTaskUserId) {
      setCreateTaskUserId(users[0]?.id);
    }
  }, [users, createTaskUserId]);

  useEffect(() => {
    if (editingTask) {
      setEditTaskTitle(editingTask.title);
      setEditTaskDescription(editingTask.description);
      setEditTaskStatusTodo(editingTask.statusTodo);
      setEditTaskUserId(editingTask.userId);
    }
  }, [editingTask]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/admin/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Ошибка получения пользователей:", error);
    }
  };

  const fetchUserTasks = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/admin/tasks/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSelectedUserTasks(response.data);
      setSelectedUserId(userId);
    } catch (error) {
      console.error("Ошибка получения задач пользователя:", error);
      setSelectedUserTasks([]);
      setSelectedUserId(userId);
    }
  };

  const  UserSelect = (userId) => {
    setSelectedUserId(userId);
    fetchUserTasks(userId);
  };

  const  CreateTaskSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/admin/tasksCreate",
        {
          title: createTaskTitle,
          description: createTaskDescription,
          userId: createTaskUserId,
          statusTodo: createTaskStatusTodo,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (selectedUserId === createTaskUserId) {
        fetchUserTasks(selectedUserId);
      }
      setCreateTaskTitle("");
      setCreateTaskDescription("");
      toast.success(
        `Задача успешно создана: ${response.data.message || "Задача создана!"}`
      );
    } catch (error) {
      toast.error(
        `Ошибка создания задачи: ${error.response?.data?.message || "Неизвестная ошибка"}`
      );
      console.error("Ошибка создания задачи:", error);
    }
  };


  const  EditTask = (task) => {
    setEditingTask(task);
  };

  const  UpdateTask = async () => {
    if (!editingTask) return;
  
    try {
      await axios.put(
        `http://localhost:5000/admin/tasks/${editingTask.id}`,
        {
          id: editingTask.id,  
          title: editTaskTitle,
          description: editTaskDescription,
          statusTodo: editTaskStatusTodo,
          userId: editTaskUserId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Задача успешно обновлена!");
      setEditingTask(null);
      if (selectedUserId) {
        fetchUserTasks(selectedUserId);
      }
    } catch (error) {
      toast.error(
        `Ошибка обновления задачи: ${error.response?.data?.message || "Неизвестная ошибка"}`
      );
      console.error("Ошибка обновления задачи:", error);
    }
  };

  const  DeleteTask = async () => {
    if (!editingTask) return;
    if (window.confirm(`Вы уверены, что хотите удалить задачу "${editingTask.title}"?`)) {
      try {
        await axios.delete(`http://localhost:5000/admin/tasks/${editingTask.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        toast.success("Задача успешно удалена!");
        setEditingTask(null);
        if (selectedUserId) {
          fetchUserTasks(selectedUserId);
        }
      } catch (error) {
        toast.error(
          `Ошибка удаления задачи: ${error.response?.data?.message || "Неизвестная ошибка"}`
        );
        console.error("Ошибка удаления задачи:", error);
      }
    }
  };

  return (
    <Container fluid>
      <h2>Административная панель</h2>

    
      <div className="mb-4 border p-3">
        <h3>Создать новую задачу</h3>
        <Form onSubmit={ CreateTaskSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="admin-user">Назначить пользователю</Form.Label>
            <Form.Select
              value={createTaskUserId}
              onChange={(e) => setCreateTaskUserId(e.target.value)}
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="admin-user">Название задачи</Form.Label>
            <Form.Control
              type="text"
              value={createTaskTitle}
              onChange={(e) => setCreateTaskTitle(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="admin-user">Описание задачи</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={createTaskDescription}
              onChange={(e) => setCreateTaskDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="admin-user">Статус задачи</Form.Label>
            <Form.Control
              type="text"
              value={createTaskStatusTodo}
              onChange={(e) => setCreateTaskStatusTodo(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Создать задачу
          </Button>
        </Form>
      </div>

      {/* Edit Task Form */}
      {editingTask && (
        <div className="mb-3 border p-3">
          <h3>Редактировать задачу</h3>
          <Form.Group className="mb-3">
            <Form.Label>Название</Form.Label>
            <Form.Control
              type="text"
              value={editTaskTitle}
              onChange={(e) => setEditTaskTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Описание</Form.Label>
            <Form.Control
              as="textarea"
              value={editTaskDescription}
              onChange={(e) => setEditTaskDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Статус</Form.Label>
            <Form.Control
              as="select"
              value={editTaskStatusTodo}
              onChange={(e) => setEditTaskStatusTodo(e.target.value)}
            >
              <option value="Active Статус">Active Статус</option>
              <option value="В процессе">В процессе</option>
              <option value="Завершено">Завершено</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Назначить пользователю</Form.Label>
            <Form.Control
              as="select"
              value={editTaskUserId}
              onChange={(e) => setEditTaskUserId(e.target.value)}
            >
              <option value="">Выберите пользователя</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username} (ID: {user.id})
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Button variant="success" onClick={ UpdateTask} className="me-2">
            Сохранить задачу
          </Button>
          <Button variant="danger" onClick={ DeleteTask}>
            Удалить задачу
          </Button>
        </div>
      )}

      <Row className="mt-4">
        <Col md={3} className="user-list-col">
          <div className="user-list-task-column">
            {users.map((user) => (
              <div
                key={user.id}
                onClick={() =>  UserSelect(user.id)}
                className={`user-list ${selectedUserId === user.id ? "active" : "1"}`}
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #ccc",
                  cursor: "pointer",
                  backgroundColor: selectedUserId === user.id ? "#f0f0f0" : "transparent",
                }}
              >
                {user.username}
              </div>
            ))}
          </div>
        </Col>
        <Col md={9} className="user-tasks-col">
          {selectedUserId ? (
            <>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h3>
                  Задачи пользователя:{" "}
                  {users.find((user) => user.id === selectedUserId)?.username || `ID ${selectedUserId} || "1"`}
                </h3>
              </div>
              <Card>
                <ListGroup variant="flush">
                  {selectedUserTasks.map((task) => (
                    <ListGroup.Item key={task.id} className="d-flex justify-content-between align-items-center">
                      {task.title} - {task.description}
                      <Button variant="outline-primary" size="sm" onClick={() =>  EditTask(task)}>
                        Редактировать
                      </Button>
                    </ListGroup.Item>
                  ))}
                  {selectedUserTasks.length === 0 && <ListGroup.Item>У пользователя нет задач.</ListGroup.Item>}
                </ListGroup>
              </Card>
            </>
          ) : (
            <p>Выберите пользователя для просмотра задач.</p>
          )}
        </Col>
      </Row>
      <ToastContainer position="top-right" autoClose={3000} />
    </Container>
  );
};

export default AdminPage;