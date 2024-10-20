// REFACTOR
import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";

const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL+'/api';

const Container = styled.div`
    padding: 20px;
`;

const Button = styled.button`
  margin: 0;

`;

const Resume = () => {
    const [resumeData, setResumeData] = useState({
        title: "",
        summary: "",
        education: "",
        experience: "",
        skills: "",
        location: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setResumeData({
            ...resumeData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // API call to send resume data to backend
            const token = localStorage.getItem('token');
            const response = await axios.post(`${REACT_APP_BACKEND_URL}/resumes`, resumeData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });
            alert("Resume submitted successfully!");
        } catch (error) {
            console.error("Error submitting resume:", error);
            alert("Failed to submit resume. Please try again.");
        }
    };

    return (
        <Container>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={resumeData.title}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Summary:</label>
                    <input
                        type="text"
                        name="summary"
                        value={resumeData.summary}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Education:</label>
                    <textarea
                        name="education"
                        value={resumeData.education}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Work Experience:</label>
                    <textarea
                        name="experience"
                        value={resumeData.experience}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Skills:</label>
                    <textarea
                        name="skills"
                        value={resumeData.skills}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Location:</label>
                    <textarea
                        name="location"
                        value={resumeData.location}
                        onChange={handleChange}
                    />
                </div>
                <label>FIX:</label>
                <Button type="submit">Submit Resume</Button>
            </form>
        </Container>
    );
};

export default Resume;