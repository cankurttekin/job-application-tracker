import React, { useState } from 'react';
import { login } from '../services/authService';

const Login = ({ setPage }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(username, password);
      // Check if response contains token
      if (response.token) {
        console.log(response);
        window.location.reload(false); // temporary
      } else {
        console.error("No token received");
      }
    } catch (error) {
      // Log error details
      console.error("Error during login:", error.response ? error.response.data : error.message);
    }
  };

  return (
      <div style={{ padding: '20px' }}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <button type="submit" style={{ backgroundColor: 'white', color: 'black' }}>Login</button>
        </form>
      </div>
  );
};

export default Login;

