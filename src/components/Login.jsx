// src/components/Login.jsx
import React, { useState } from "react";
import { loginAdmin } from "../api/adminAPI"; // Ensure the path is correct

const Login = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await loginAdmin(username, password);
      console.log("Login successful:", result);
      // Optionally, you can save authentication token from result if needed.
      // For example: localStorage.setItem('token', result.token);
      setIsLoggedIn(true);
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed: " + err.message);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p className="error-text">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
