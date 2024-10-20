import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

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
      // Decode the JWT to extract the username
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUser(decodedToken.sub); // Set the username from the sub field
    }
  }, []);

  const login = async (credentials) => {
    try {
      const response = await axios.post('http://localhost:8080/api/login', credentials);
      const { token } = response.data;
      localStorage.setItem('token', token);
      setIsLoggedIn(true);

      // Decode the JWT to get the username
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUser(decodedToken.sub); // Set the username from the sub field
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
      <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, login, logout }}>
        {children}
      </AuthContext.Provider>
  );
};
