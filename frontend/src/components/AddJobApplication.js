import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import '../styles/AddJobApplication.css';
import { useNavigate } from 'react-router-dom';
//import styled from "styled-components";
import { REACT_APP_BACKEND_URL } from '../config';
import styled from "styled-components";

const styles = {
  header: {
    textAlign: 'center',
    marginBottom: '10px',
  },
};

const AddJobApplication = ({ isOpen, onClose }) => {
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [status, setStatus] = useState('');
  const [applicationDate, setApplicationDate] = useState('');
  const [responseDate, setResponseDate] = useState('');
  const [platform, setPlatform] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [description, setDescription] = useState('');
  const [comments, setComments] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Reset error message

    if (!companyName || !jobTitle || !status || !applicationDate) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    const jobApplication = {
      companyName,
      jobTitle,
      status,
      applicationDate,
      responseDate,
      platform,
      jobUrl,
      description,
      comments,
    };

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${REACT_APP_BACKEND_URL}/job-applications`, jobApplication, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        onClose(); // Close modal on success
        resetForm(); // Clear the form fields
        navigate('/job-applications'); // Redirect to job applications page on success
        window.location.reload(); // Refactoring needed
      }
    } catch (error) {
      console.error('Error adding job application:', error);
      setErrorMessage('Failed to add job application. Please try again.');
    }
  };

  const resetForm = () => {
    setCompanyName('');
    setJobTitle('');
    setStatus('');
    setApplicationDate('');
    setResponseDate('');
    setPlatform('');
    setJobUrl('');
    setDescription('');
    setComments('');
  };

  return (
      <Modal
          isOpen={isOpen}
          onRequestClose={onClose}
          style={{
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            },
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              width: '400px',
              padding: '20px',
              borderRadius: '10px',
              backgroundColor: '#ffffff',
              color: '#333',
            },
          }}
      >
        <modal-content>
          <close-button onClick={onClose}>&times;</close-button>
          <h2 style={styles.header}>Add Job Application</h2>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <div className="form-row">
            <div className="form-group">
              <input
                  type="text"
                  placeholder="Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                  type="text"
                  placeholder="Job Title"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>
            <div className="form-group">
              <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
              >
                <option value="" disabled>Select Status</option>
                <option value="Applied">Applied</option>
                <option value="Interviewing">Interviewing</option>
                <option value="Rejected">Rejected</option>
                <option value="Offered">Offered</option>
                <option value="ATS Reject">ATS Reject</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <input
                  type="date"
                  placeholder="Application Date"
                  value={applicationDate}
                  onChange={(e) => setApplicationDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                  type="date"
                  placeholder="Response Date"
                  value={responseDate}
                  onChange={(e) => setResponseDate(e.target.value)}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <input
                  type="text"
                  placeholder="Platform"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                  type="url"
                  placeholder="Job URL"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
              />
            </div>
          </div>
          <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
          />
          <textarea
              placeholder="Comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows="4"
          />
          <button onClick={handleSubmit}>Submit</button>
        </modal-content>
      </Modal>
  );
};

export default AddJobApplication;
