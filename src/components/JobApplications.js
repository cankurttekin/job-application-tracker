
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const JobApplications = () => {
  const [jobApplications, setJobApplications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/api/job-applications", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobApplications(response.data);
    };

    fetchData();
  }, []);

  return (
  <div>
  <h2>Job Applications</h2>
    <div style={{ padding: '20px' }}>

      <ul>
        {jobApplications.map(app => (
          <li key={app.id}>{app.companyName} - {app.jobTitle}</li>
        ))}
      </ul>
    </div>
    </div>
  );
};

export default JobApplications;
