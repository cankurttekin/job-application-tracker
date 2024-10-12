import axios from 'axios';

const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL+'/api';

export const login = async (username, password) => {
  const response = await axios.post(`${REACT_APP_BACKEND_URL}/auth/login`, { username, password });
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }
  return response.data;
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

