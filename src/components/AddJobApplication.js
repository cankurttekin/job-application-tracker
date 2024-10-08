import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function AddJobApplication() {
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [status, setStatus] = useState('');
  const [applicationDate, setApplicationDate] = useState('');
  const [responseDate, setResponseDate] = useState('');
  const [platform, setPlatform] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [description, setDescription] = useState('');
  const [comments, setComments] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  
const handleAddApplication = async (e) => {
    e.preventDefault();
    try {
      await api.post('/job-applications', { 
	companyName,
        jobTitle,
        status,
        applicationDate,
        responseDate,
        platform,
        jobUrl,
        description,
        comments,});
      setMessage('Application added successfully');
      navigate('/applications');
    } catch (error) {
      setMessage('Failed to add application');
      console.error(error);
    }
  };


return (
    <div>
      <h2>Add Job Application</h2>
      <form onSubmit={handleAddApplication}>
        <input
          type="text"
          placeholder="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Job Title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="Application Date"
          value={applicationDate}
          onChange={(e) => setApplicationDate(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="Response Date"
          value={responseDate}
          onChange={(e) => setResponseDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Platform"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        />
        <input
          type="url"
          placeholder="Job URL"
          value={jobUrl}
          onChange={(e) => setJobUrl(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <textarea
          placeholder="Comments"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
        <button type="submit">Add Application</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
export default AddJobApplication;
