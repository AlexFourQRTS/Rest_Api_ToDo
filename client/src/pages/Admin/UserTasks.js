import React from "react";
import { Card, ListGroup } from "react-bootstrap";

const UserTasks = ({ tasks }) => {
  return (
    <Card>
      <ListGroup variant="flush">
        {tasks.map((task) => (
          <ListGroup.Item key={task.id}>
            {task.title} - {task.description}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
};

export default UserTasks;
