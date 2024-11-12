import React, { createContext, useState, useEffect } from 'react';
import { login as loginService } from '../services/authService'; // Import the login function from authService

export const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Check authentication status on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUser(decodedToken.sub);
    }
  }, []);

  const login = async (username, password, turnstileToken) => {
    try {
      const response = await loginService(username, password, turnstileToken);
      const { token } = response;

      if (token) {
        localStorage.setItem('token', token);
        setIsLoggedIn(true); // Trigger re-render for components that depend on this state
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setUser(decodedToken.sub);
      }
    } catch (error) {
      console.error('Login failed', error);
      throw error; // Re-throw the error to handle it in `Login.js`
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
      <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
        {children}
      </AuthContext.Provider>
  );
};
