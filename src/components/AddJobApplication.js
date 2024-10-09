import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import styled from 'styled-components';

const ModalContent = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative; /* Required for absolute positioning of the close button */
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%; /* Full width */
`;

const TextArea = styled.textarea`
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%; /* Full width */
`;

const Button = styled.button`
  background-color: #333; /* Button background color */
  color: white; /* Button text color */
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%; /* Full width */
`;

const FormRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between; /* Space between elements */
  width: 100%; /* Full width */
  margin-bottom: 10px; /* Space between rows */
`;

const FormGroup = styled.div`
  flex: 1; /* Take equal space */
  margin: 5px; /* Margin around fields */
  min-width: 180px; /* Minimum width for fields */
`;

const CloseButton = styled.button`
  position: absolute;
  top: 2px; /* Increased from 10px to 20px */
  right: 2px;
  background: none;
  border: 1px solid #333; /* Border color */
  color: #333; /* Text color */
  font-size: 26px; /* Size of the close button */
  width: 30px; /* Width of the button */
  height: 30px; /* Height of the button */
  border-radius: 50%; /* Circular border */
  display: flex;
  align-items: center; /* Center text vertically */
  justify-content: center; /* Center text horizontally */
  cursor: pointer;

  &:hover {
    background-color: black; /* Light background on hover */
    color: white; /* Change color on hover */
  }
`;


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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Reset error message

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
      const token = localStorage.getItem('token'); // Get JWT token from localStorage
      const response = await axios.post('http://localhost:8080/api/job-applications', jobApplication, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      //if (response.status === 201) {
        //navigate('/job-applications'); // Redirect to job applications page on success
      //}
    } catch (error) {
      console.error('Error adding job application:', error);
      setErrorMessage('Failed to add job application. Please try again.');
    }
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
              backgroundColor: '#f5f5f5', // Modal background color
              color: '#333', // Text color in the modal
            },
          }}
      >
        <ModalContent>
          <CloseButton onClick={onClose}>&times;</CloseButton>
          <h2>Add Job Application</h2>
          <FormRow>
            <FormGroup>
              <Input
                  type="text"
                  placeholder="Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Input
                  type="text"
                  placeholder="Job Title"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Input
                  type="text"
                  placeholder="Status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
              />
            </FormGroup>
          </FormRow>
          <FormRow>
            <FormGroup>
              <Input
                  type="date"
                  placeholder="Application Date"
                  value={applicationDate}
                  onChange={(e) => setApplicationDate(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Input
                  type="date"
                  placeholder="Response Date"
                  value={responseDate}
                  onChange={(e) => setResponseDate(e.target.value)}
              />
            </FormGroup>
          </FormRow>
          <FormRow>
            <FormGroup>
              <Input
                  type="text"
                  placeholder="Platform"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Input
                  type="url"
                  placeholder="Job URL"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
              />
            </FormGroup>
          </FormRow>
          <TextArea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4" // Number of rows for the textarea
          />
          <TextArea
              placeholder="Comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows="4" // Number of rows for the textarea
          />
          <Button onClick={handleSubmit}>Submit</Button>
        </ModalContent>
      </Modal>
  );
};


export default AddJobApplication;
