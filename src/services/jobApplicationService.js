import axios from 'axios';

const API_URL = 'http://localhost:8080/api/jobapplications';

const getAllJobApplications = () => {
  return axios.get(API_URL, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
};

const createJobApplication = (jobApplicationData) => {
  return axios.post(API_URL, jobApplicationData, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
};

export default {
  getAllJobApplications,
  createJobApplication
};
