import React from "react";
import { ListGroup } from "react-bootstrap";

const UserList = ({ users, onUserSelect, selectedUserId }) => {
  return (
    <div className="user-list-task-column">
      {users.map((user) => (
        <div
          key={user.id}
          action
          onClick={() => onUserSelect(user.id)}
          active={selectedUserId === user.id}
          className="user-list"
        >
          {user.username}
        </div>
      ))}
    </div>
  );
};

export default UserList;
