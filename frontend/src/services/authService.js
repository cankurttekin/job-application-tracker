import axios from 'axios';

const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL+'/api';

export const login = async (username, password) => {
  try {
    const response = await axios.post(
        `${REACT_APP_BACKEND_URL}/auth/login`,
        { username, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
    );

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  } catch (error) {
    if (error.response) {
      // Check for specific response status
      if (error.response.status === 401) {
        throw new Error("Invalid username or password."); // Customize error message
      } else {
        throw new Error("An error occurred during login."); // General error message
      }
    } else {
      throw new Error("Network error. Please try again later."); // Handle network errors
    }
  }
};




export const register = async (username, email, password) => {
  return axios.post(`${REACT_APP_BACKEND_URL}/auth/register`, { username, email, password });
};

export const logout = () => {
  localStorage.removeItem("token");
  /*
    return axios.post(REACT_APP_BACKEND_URL + "signout").then((response) => {
      return response.data;
    });
  */
};

export const getCurrentUser = () => {
  return localStorage.getItem("token");
};

