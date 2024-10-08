import React, { useEffect, useState } from 'react';
import jobApplicationService from '../services/jobApplicationService';

const JobApplicationList = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    jobApplicationService.getAllJobApplications().then(
      (response) => {
        setApplications(response.data);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  return (
    <div>
      <h2>Job Applications</h2>
      <ul>
        {applications.map((application) => (
          <li key={application.id}>
            {application.jobTitle} - {application.company}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobApplicationList;

