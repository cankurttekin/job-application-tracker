import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL + "/api";

// Styled Components for Layout
const Container = styled.div`
    padding: 40px;
    max-width: 800px;
    margin: 0 auto;
    color: #333;
`;

const Section = styled.div`
    margin-bottom: 30px;
`;

const SectionTitle = styled.h3`
    margin-bottom: 8px;
    color: #4a4a4a;
    border-bottom: 2px solid #ddd;
    padding-bottom: 4px;
`;

const Skill = styled.span`
    background: #e0e0e0;
    padding: 8px 8px;
    margin: 0 4px 4px 0;
    border-radius: 6px;
    display: inline-block;
`;

const Resume = () => {
    const [resumeData, setResumeData] = useState({
        title: "",
        summary: "",
        education: "",
        location: "",
        skills: [""],
        coverLetter: "",
    });

    useEffect(() => {
        const fetchResume = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${REACT_APP_BACKEND_URL}/resumes`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const fetchedData = response.data || { title: "", summary: "", education: "", location: "", skills: [""], coverLetter: "" };
                setResumeData(fetchedData);
            } catch (error) {
                console.error("Error fetching resume:", error);
            }
        };
        fetchResume();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setResumeData({ ...resumeData, [name]: value });
    };

    const addSkill = () => {
        setResumeData({ ...resumeData, skills: [...resumeData.skills, ""] });
    };

    const handleSkillChange = (e, index) => {
        const updatedSkills = resumeData.skills.map((skill, i) => (i === index ? e.target.value : skill));
        setResumeData({ ...resumeData, skills: updatedSkills });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.post(`${REACT_APP_BACKEND_URL}/resumes`, resumeData, {
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
            });
            alert("Resume submitted successfully!");
        } catch (error) {
            console.error("Error submitting resume:", error);
            alert("Failed to submit resume. Please try again.");
        }
    };

    return (
        <Container>
            <SectionTitle>Title</SectionTitle>
            <h2>
                <input
                    type="text"
                    name="title"
                    placeholder="Title (e.g., Full Stack Developer)"
                    value={resumeData.title}
                    onChange={handleChange}
                />
            </h2>

            <Section>
                <SectionTitle>Location</SectionTitle>
                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={resumeData.location}
                    onChange={handleChange}
                />
            </Section>

            <Section>
                <SectionTitle>Summary</SectionTitle>
                <textarea
                    name="summary"
                    placeholder="Write a brief summary about yourself..."
                    value={resumeData.summary}
                    onChange={handleChange}
                    rows={4}
                />
            </Section>

            <Section>
                <SectionTitle>Education</SectionTitle>
                <textarea
                    name="education"
                    placeholder="Education background"
                    value={resumeData.education}
                    onChange={handleChange}
                    rows={3}
                />
            </Section>

            <Section>
                <SectionTitle>Skills</SectionTitle>
                {resumeData.skills.map((skill, index) => (
                    <Skill key={index}>
                        <input
                            type="text"
                            placeholder="Skill"
                            value={skill}
                            onChange={(e) => handleSkillChange(e, index)}
                        />
                    </Skill>
                ))}
                <button type="button" onClick={addSkill}>Add Skill</button>
            </Section>

            <Section>
                <SectionTitle>Cover Letter</SectionTitle>
                <textarea
                    name="coverLetter"
                    placeholder="Cover letter..."
                    value={resumeData.coverLetter}
                    onChange={handleChange}
                    rows={5}
                />
            </Section>

            <button type="submit" onClick={handleSubmit}>Submit Resume</button>
        </Container>
    );
};

export default Resume;
