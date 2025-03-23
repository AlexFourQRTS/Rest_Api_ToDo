import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import UserList from "./UserList";
import UserTasks from "./UserTasks";
import UserToDo from "./UserToDo";
import CreateTaskForm from "./CreateTaskForm";

const AdminPage = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [users, setUsers] = useState([]);
  const [selectedUserTasks, setSelectedUserTasks] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    if (role !== "admin") {
      navigate("/");
    } else {
      fetchUsers();
    }
  }, [navigate, role]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Ошибка получения пользователей:", error);
    }
  };

  const fetchUserTasks = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/tasks/users/${userId}/tasks`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSelectedUserTasks(response.data);
      setSelectedUserId(userId);
    } catch (error) {
      console.error("Ошибка получения задач пользователя:", error);
      setSelectedUserTasks([]);
    }
  };

  const handleUserSelect = (userId) => {
    fetchUserTasks(userId);
  };

  const handleTaskCreated = () => {
    if (selectedUserId) {
      fetchUserTasks(selectedUserId);
    }
  };

  return (
    <>
      <CreateTaskForm users={users} onCreateTask={handleTaskCreated} />

      <div className="user-list-task-row">
        <UserList
          users={users}
          onUserSelect={handleUserSelect}
          selectedUserId={selectedUserId}
        />

        <div className="todo-admin-check">
          <UserToDo
          
            username={
              users.find((user) => user.id === selectedUserId)?.username
            }
            
          />

          {selectedUserId && <UserTasks tasks={selectedUserTasks} />}
        </div>
      </div>
    </>
  );
};

export default AdminPage;
