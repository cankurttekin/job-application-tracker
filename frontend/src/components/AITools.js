// src/components/AITools.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
    padding: 20px;
`;

const Button = styled.button`
    background-color: black;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 20px;

    &:hover {
        background-color: #333;
    }
`;

const Dropdown = styled.select`
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-top: 10px;
    margin-right: 10px;
    width: 100%; /* Makes the dropdown full width */
    max-width: 400px; /* Limits the max width */
    font-size: 16px; /* Increases font size for better readability */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const QuestionsContainer = styled.div`
    margin-top: 20px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #f9f9f9;
`;

const QuestionList = styled.ul`
    list-style-type: none; /* Remove default bullet points */
    padding: 0; /* Remove default padding */
`;

const QuestionItem = styled.li`
    padding: 8px; /* Add padding for each question */
    border-bottom: 1px solid #eee; /* Add a bottom border to separate questions */
    &:last-child {
        border-bottom: none; /* Remove border for the last item */
    }
`;

const JobDetails = styled.h3`
    margin-bottom: 24px; /* Adds space between job details and questions */
`;

const AITools = () => {
    const [jobApplications, setJobApplications] = useState([]);
    const [interviewQuestions, setInterviewQuestions] = useState([]);
    const [selectedJobApplication, setSelectedJobApplication] = useState(null);

    useEffect(() => {
        const fetchJobApplications = async () => {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/job-applications`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setJobApplications(response.data);
            if (response.data.length > 0) {
                setSelectedJobApplication(response.data[0]); // Set the first job application as selected
            }
        };

        fetchJobApplications();
    }, []);

    const handleGenerateQuestions = async () => {
        if (!selectedJobApplication) {
            console.error("No job application selected.");
            return;
        }

        const { jobDescription, jobTitle } = selectedJobApplication;

        const token = localStorage.getItem("token");
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/llm/generate-interview`, {
                jobDescription,
                jobTitle
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("Response Data:", response.data);

            // Check if 'questions' property exists in the response
            if (response.data.questions && Array.isArray(response.data.questions)) {
                setInterviewQuestions(response.data.questions); // Set questions directly from the response
            } else {
                console.error("No questions found in response:", response.data);
                setInterviewQuestions([]); // Clear questions if none found
            }
        } catch (error) {
            console.error("Error generating questions:", error);
            setInterviewQuestions([]); // Clear questions on error
        }
    };

    return (
        <Container>
            <h2>Generate Interview Questions</h2>

            {jobApplications.length > 0 && (
                <>
                    <Dropdown
                        onChange={(e) => setSelectedJobApplication(jobApplications[e.target.value])}
                        value={jobApplications.indexOf(selectedJobApplication)}
                    >
                        {jobApplications.map((job, index) => (
                            <option key={index} value={index}>
                                {job.jobTitle} - {job.companyName} {/* Adjust to match your job application structure */}
                            </option>
                        ))}
                    </Dropdown>

                    <Button onClick={handleGenerateQuestions}>Generate</Button>
                </>
            )}

            {interviewQuestions && interviewQuestions.length > 0 && (
                <QuestionsContainer>
                    <JobDetails>
                        {selectedJobApplication.jobTitle} at {selectedJobApplication.companyName}
                    </JobDetails>
                    <h3>Generated Questions:</h3>
                    <QuestionList>
                        {interviewQuestions.map((question, index) => (
                            <QuestionItem key={index}>{question}</QuestionItem>
                        ))}
                    </QuestionList>
                </QuestionsContainer>
            )}
        </Container>
    );
};

export default AITools;
