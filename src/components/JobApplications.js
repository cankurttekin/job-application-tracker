import { useEffect, useState } from 'react';
import api from '../api';

function JobApplications() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get('/job-applications');
        setApplications(response.data);
      } catch (error) {
        console.error('Error fetching applications', error);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div>
      <h2>Job Applications</h2>
      <ul>
        {applications.map(app => (
          <li key={app.id}>{app.position} - {app.company}</li>
        ))}
      </ul>
    </div>
  );
}

export default JobApplications;
