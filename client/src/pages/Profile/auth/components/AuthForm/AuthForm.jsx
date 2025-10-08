import React, { useState } from "react";
import Login from "../Login";
import Register from "../Register";
// Removed CSS module import

const AuthForm = ({ onLoginSuccess, onRegisterSuccess }) => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center">
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