import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./style.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [errorMessage, setErrorMessage] = useState("");

  const Submit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/auth/register", {
        username,
        password,
        role,
      });
      console.log("Регистрация успешна:", response.data);
      toast.success("Регистрация успешна!", {
        onClose: () => {
          setUsername("");
          setPassword("");
          setRole("user");
        },
      });
      setErrorMessage("");
    } catch (error) {
      console.error("Ошибка регистрации:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Ошибка регистрации!");
      }
      toast.error(errorMessage || "Ошибка регистрации!");
    }
  };

  return (
    <div className="container color">
      <Form onSubmit={Submit}>
        <div>Регистрация</div>
  
        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label>Имя пользоователя</Form.Label>
          <Form.Control
            type="text"
            placeholder=""
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Пароль</Form.Label>
          <Form.Control
            type="password"
            placeholder=""
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicRole">
          <Form.Label>Полномочия</Form.Label>
          <Form.Control
            as="select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </Form.Control>
        </Form.Group>

        <Button variant="primary" type="submit">
          Зарегестрироваться
        </Button>
      </Form>
      <ToastContainer position="top-right" autoClose={5000} />
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default RegisterPage;
