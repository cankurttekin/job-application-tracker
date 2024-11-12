import axios from 'axios';
import { REACT_APP_BACKEND_URL } from '../config';

export const login = async (username, password, turnstileToken) => {
  try {
    const response = await axios.post(
        `${REACT_APP_BACKEND_URL}/auth/login?turnstileToken=${turnstileToken}`,
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
        throw new Error("Invalid username or password.");
      } else if (error.response.status === 403) {
        throw new Error(error.response.data.message || "Email not verified. Please verify your email before logging in.");
      } else {
        throw new Error(error.response.data.message || "An error occurred during login.");
      }
    } else {
      throw new Error("Network error. Please try again later.");
    }
  }
};

export const register = async (username, email, password, turnstileToken) => {
  return axios.post(`${REACT_APP_BACKEND_URL}/auth/register?turnstileToken=${turnstileToken}`, { username, email, password });
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

