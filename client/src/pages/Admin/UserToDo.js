import React from "react";
import { Card } from 'react-bootstrap';

const UserToDo = ({ username }) => {
    return (
        <Card>
           
            <Card.Body>
                <p> Задачи для {username}</p>
            </Card.Body>
        </Card>
    );
};

export default UserToDo;