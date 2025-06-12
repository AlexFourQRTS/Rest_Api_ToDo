import React from "react";
import { Card } from "react-bootstrap";

const UserToDo = ({ username }) => {
  return (
    <div>
      <p> Задачи для {username}</p>
    </div>
  );
};

export default UserToDo;
