import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Container, ListGroup, Form, Button } from "react-bootstrap";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const UserPage = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [tasks, setTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState(new Set());
    const [page, setPage] = useState(1);
    const tasksPerPage = 5;
    const userId = token ? jwtDecode(token).userId : null;

    const fetchTasks = useCallback(async () => {
        if (!userId) return;
    
        try {
            const response = await axios.get(`http://localhost:5000/users/${userId}/tasks`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTasks(response.data);
        } catch (error) {
            console.error("Ошибка получения задач:", error);
        }
    }, [token, userId]);
    
        

    useEffect(() => {
        if (!token) {
            navigate("/login");
        } else {
            setTasks([]); 
            setPage(1);
            fetchTasks(true);
        }
    }, [navigate, token, userId, fetchTasks]);

    const handleTaskCompletion = (taskId) => {
        const newCompletedTasks = new Set(completedTasks);
        if (newCompletedTasks.has(taskId)) {
            newCompletedTasks.delete(taskId);
        } else {
            newCompletedTasks.add(taskId);
        }
        setCompletedTasks(newCompletedTasks);
    };

    return (
        <>
            <br />
            <h2>Список задач для Id - {userId}</h2>
            <br />
            <Container>
                <h2>Список задач</h2>
                <ListGroup>
                    {tasks.map((task) => (
                        <ListGroup.Item key={task.id}>
                            <Form.Check
                                type="checkbox"
                                label={task.title}
                                checked={completedTasks.has(task.id)}
                                onChange={() => handleTaskCompletion(task.id)}
                            />
                            <p>{task.description}</p>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
                
            </Container>
        </>
    );
};

export default UserPage;
