import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const CreateTaskForm = ({ users, onCreateTask }) => {
  const [title, setTitle] = useState("Название Задания");
  const [description, setDescription] = useState("Описание задания");
  const [statusTodo, setStatusTodo] = useState("Active Статус");
  const [userId, setUserId] = useState(users[0]?.id || "1");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/admin/tasksCreate",
        {
          title,
          description,
          userId,
          statusTodo,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      onCreateTask();
      setTitle("");
      setDescription("");

      toast.success(
        `Задача успешно создана: ${response.data.message || "Задача создана!"}`
      );
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(`Ошибка создания задачи: ${error.response.data.message}`);
      } else {
        toast.error("Ошибка создания задачи!");
      }
      console.error("Ошибка создания задачи:", error);
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit} className="admin-task">
        <Form.Group className="mb-3">
          <br />
          <Form.Label className="admin-user">Назначить пользователю</Form.Label>
          <Form.Select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="admin-user">Описание задачи</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="admin-user">Статус задачи</Form.Label>
          <Form.Control
            type="text"
            value={statusTodo}
            onChange={(e) => setStatusTodo(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Создать задачу
        </Button>
      </Form>

      <br />
      <ToastContainer position="top-right" autoClose={5000} />
    </>
  );
};

export default CreateTaskForm;
