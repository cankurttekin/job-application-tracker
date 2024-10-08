import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',  // Your backend URL
});

// Function to set the Authorization header for requests that need it
const setAuthToken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Add a request interceptor
api.interceptors.request.use(config => {
  setAuthToken();
  return config;
});

export default api;
