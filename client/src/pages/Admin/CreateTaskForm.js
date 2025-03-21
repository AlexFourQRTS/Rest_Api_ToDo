import React, { useState } from "react";
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

const CreateTaskForm = ({ users, onCreateTask }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [userId, setUserId] = useState(users[0]?.id || '');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('http://localhost:5000/tasks', {
                title,
                description,
                userId,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            onCreateTask(); 
            setTitle('');
            setDescription('');
        } catch (error) {
            console.error('Ошибка создания задачи:', error);
        }
    };

    return (
        <>
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Label>Название задачи</Form.Label>
                <Form.Control
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Описание задачи</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Назначить пользователю</Form.Label>
                <Form.Select
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                >
                    {users.map(user => (
                        <option key={user.id} value={user.id}>{user.username}</option>
                    ))}
                </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit">
                Создать задачу
            </Button>
            
        </Form>
        <br />
        </>
        
    );
};

export default CreateTaskForm;