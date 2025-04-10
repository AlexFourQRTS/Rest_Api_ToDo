import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState("user");
  const [errorMessage, setErrorMessage] = useState("");

  const isValidEmail = (email) => {
   
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(""); 

    if (password.length < 8) {
      setErrorMessage("Пароль должен содержать не менее 8 символов.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Пароли не совпадают.");
      return;
    }

    if (!isValidEmail(username)) {
      setErrorMessage("Введите адрес электронной почты.");
      return;
    }

    try {
      const response = await axios.post("https://skydishch.fun/api/auth/register", {
        username,
        password,
        role,
      });
      console.log("Регистрация успешна:", response.data);
      toast.success("Регистрация успешна!", {
        onClose: () => {
          setUsername("");
          setPassword("");
          setConfirmPassword("");
          setRole("user");
        },
      });
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="container color">
      <Form onSubmit={handleSubmit}>
        <div>Регистрация</div>
        
        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label>Имя пользователя</Form.Label>
          <Form.Control
            type="text"
            placeholder=""
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Пароль</Form.Label>
          <div className="password-input-group">
            <Form.Control
              type={showPassword ? "text" : "password"}
              placeholder=""
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="password-toggle-icon"
              onClick={togglePasswordVisibility}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>
          {password.length < 8 && password.length > 0 && (
            <Form.Text className="text-danger">
              Пароль должен содержать не менее 8 символов.
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
          <Form.Label>Подтвердите пароль</Form.Label>
          <div className="password-input-group">
            <Form.Control
              type={showConfirmPassword ? "text" : "password"}
              placeholder=""
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span
              className="password-toggle-icon"
              onClick={toggleConfirmPasswordVisibility}
            >
              <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
            </span>
          </div>
          {confirmPassword !== password && confirmPassword.length > 0 && (
            <Form.Text className="text-danger">Пароли не совпадают.</Form.Text>
          )}
        </Form.Group>
        <br />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <br />
        <ToastContainer position="top-right" autoClose={500} />
       
        <br />
        <br />

        <Button variant="primary" type="submit">
          Зарегистрироваться
        </Button>
      </Form>
     
    </div>
  );
};

export default RegisterPage;