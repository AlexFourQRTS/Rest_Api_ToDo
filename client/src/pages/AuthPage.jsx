import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './style.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { routes } from '../routes';

const AuthPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', {
                username,
                password,
            });
            console.log('Авторизация успешна:', response.data);
            toast.success('Авторизация успешна!');

           
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.role); 

           
            if (response.data.role === 'admin') {
                navigate(routes.admin);
                alert('Перенаправляем Admin');
            } else if (response.data.role === 'user') {
                navigate(routes.user);
                alert('Перенаправляем User');
            } else {
                navigate(routes.home);
                alert('Перенаправляем на главную страницу, роль не определена');
            }

        } catch (error) {
            console.error('Ошибка авторизации:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('Ошибка авторизации!');
            }
            toast.error(errorMessage || 'Ошибка авторизации!');
        }
    };

    return (
        <div className="container">
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </Form.Group>
                
                <Button variant="primary" type="submit">
                    Sign in
                </Button>
            </Form>
            <ToastContainer position="top-right" autoClose={5000} />
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
};

export default AuthPage;