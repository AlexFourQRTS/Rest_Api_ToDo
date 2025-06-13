import React, { useState } from "react";
import Login from "../../../Auth/Login";
import Register from "../../../Auth/Register";
import styles from "./AuthForm.module.css";

const AuthForm = ({ onLoginSuccess, onRegisterSuccess }) => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className={styles.authContainer}>
      {showLogin ? (
        <Login
          onLoginSuccess={onLoginSuccess}
          onRegisterClick={() => setShowLogin(false)}
        />
      ) : (
        <Register
          onRegisterSuccess={onRegisterSuccess}
          onLoginClick={() => setShowLogin(true)}
        />
      )}
    </div>
  );
};

export default AuthForm; 