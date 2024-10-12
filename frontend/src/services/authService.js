import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL+'/api';

export const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, { username, password });
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }
  return response.data;
};

export const register = async (username, email, password) => {
  return axios.post(`${API_URL}/auth/register`, { username, email, password });
};

export const logout = () => {
  localStorage.removeItem("token");
  /*
    return axios.post(API_URL + "signout").then((response) => {
      return response.data;
    });
  */
};

export const getCurrentUser = () => {
  return localStorage.getItem("token");
};

