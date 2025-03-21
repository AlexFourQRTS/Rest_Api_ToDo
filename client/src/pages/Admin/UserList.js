import React from "react";
import { ListGroup } from 'react-bootstrap';

const UserList = ({ users, onUserSelect, selectedUserId }) => {
    return (
        <ListGroup>
            {users.map(user => (
                <ListGroup.Item
                    key={user.id}
                    action
                    onClick={() => onUserSelect(user.id)}
                    active={selectedUserId === user.id}
                >
                    {user.username}
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
};

export default UserList;