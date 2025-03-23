import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import RegisterPage from "./pages/RegisterPage";
import UserPage from "./pages/User/UserPage";
import AdminPage from "./pages/Admin/AdminPage";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import { routes } from "./routes";
import NavBar from "./components/NavBar";
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const updateAuth = (newToken, newRole) => {
    setToken(newToken);
    setRole(newRole);
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newRole);
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
  };

  return (
    <>
      <br />
      <BrowserRouter>
        <NavBar token={token} role={role} onLogout={handleLogout} />
        <Routes>
          <Route
            path={routes.login}
            element={<AuthPage onLogin={updateAuth} />}
          />
          <Route path={routes.register} element={<RegisterPage />} />
          <Route path={routes.home} element={<Home />} />
          <Route element={<PrivateRoute allowedRoles={['user']} />}>
            <Route path={routes.user} element={<UserPage />} />
          </Route>
          <Route element={<PrivateRoute allowedRoles={['admin']} />}>
            <Route path={routes.admin} element={<AdminPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;