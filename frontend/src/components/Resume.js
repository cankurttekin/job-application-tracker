import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { REACT_APP_BACKEND_URL } from '../config';

const COVER_LETTER_LENGTH = 2000;
const SUMMARY_LENGTH = 255;

// Styled Components for Layout
const Container = styled.div`
    max-width: 768px;
    margin: 20px auto;
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
    padding: 8px 8px;
    margin: 0 4px 4px 0;
    border-radius: 6px;
    display: inline-block;
`;

const SkillInput = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 5px;

    /* Pseudo element for the bullet point */
    &::before {
        content: '🞙';
        color: black;  /* Color of the bullet point */
        margin-right: 10px;  /* Space between bullet and input */
    }

    input {
        border: none;
        //padding: 5px;
        padding-left: 5px;
        padding-bottom: 2px;
        //font-size: 14px;
        font-size: 18px;
        width: 180px;
        outline: none;
        //border-radius: 5px;
        background-color: transparent;

        &:focus {
            //border-color: #007bff;
        }
    }
`;

const Resume = () => {
    const [resumeData, setResumeData] = useState({
        title: "",
        summary: "",
        location: "",
        skills: [""],
        coverLetter: "",
        workExperiences: [{ title: "", company: "", startDate: "", endDate: "", description: "" }],
        educationList: [],
    });

    useEffect(() => {
        const fetchResume = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${REACT_APP_BACKEND_URL}/resumes`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const fetchedData = {
                    title: response.data.title || "",
                    summary: response.data.summary || "",
                    location: response.data.location || "",
                    skills: response.data.skills || [""],
                    coverLetter: response.data.coverLetter || "",
                    workExperiences: response.data.workExperiences || [{ title: "", company: "", startDate: "", endDate: "", description: "" }],
                    educationList: response.data.educationList || [{ institutionName: "", startDate: "", endDate: "", field: "", location: "" }], // Initialize educationList
                };

                setResumeData(fetchedData);
            } catch (error) {
                console.error("Error fetching resume:", error);
            }
        };
        fetchResume();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // For coverLetter, enforce the length limit
        if (name === "coverLetter" && value.length > COVER_LETTER_LENGTH) {
            return; // Prevents updating the state if the limit is exceeded
        }

        // For summary, enforce the length limit
        if (name === "summary" && value.length > SUMMARY_LENGTH) {
            return; // Prevents updating the state if the limit is exceeded
        }

        setResumeData({ ...resumeData, [name]: value });
    };

    const addSkill = () => {
        setResumeData({ ...resumeData, skills: [...resumeData.skills, ""] });
    };

    const addEducation = () => {
        setResumeData({ ...resumeData, educationList: [...resumeData.educationList, { schoolName: "", startDate: "", endDate: "", field: "", location: "" }] });
    };

    const handleSkillChange = (e, index) => {
        const updatedSkills = resumeData.skills.map((skill, i) => (i === index ? e.target.value : skill));
        setResumeData({ ...resumeData, skills: updatedSkills });
    };

    const handleEducationChange = (e, index) => {
        const { name, value } = e.target;
        const updatedEducation = resumeData.educationList.map((edu, i) => (i === index ? { ...edu, [name]: value } : edu));
        setResumeData({ ...resumeData, educationList: updatedEducation });
    };

    const handleWorkExperienceChange = (e, index) => {
        const { name, value } = e.target;
        const updatedWorkExperiences = resumeData.workExperiences.map((experience, i) =>
            i === index ? { ...experience, [name]: value } : experience
        );
        setResumeData({ ...resumeData, workExperiences: updatedWorkExperiences });
    };

    const addWorkExperience = () => {
        setResumeData({
            ...resumeData,
            workExperiences: [
                ...resumeData.workExperiences,
                { title: "", company: "", startDate: "", endDate: "", description: "" }
            ]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            // Ensure the data includes workExperiences
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
                    rows={3}
                />
                <p style={{color: '#4a4a4a',}}>{SUMMARY_LENGTH - resumeData.summary.length} characters remaining</p> {/* Character counter */}
            </Section>

            <Section>
                <SectionTitle>Education</SectionTitle>
                {resumeData.educationList.map((education, index) => (
                    <div key={index} style={{ marginBottom: "20px" }}> {/* Add marginBottom to separate entries */}
                        <input
                            type="text"
                            name="schoolName"
                            placeholder="School Name"
                            value={education.schoolName}
                            onChange={(e) => handleEducationChange(e, index)}
                        />
                        <input
                            type="date"
                            name="startDate"
                            placeholder="Start Date"
                            value={education.startDate}
                            onChange={(e) => handleEducationChange(e, index)}
                        />
                        <input
                            type="date"
                            name="endDate"
                            placeholder="End Date"
                            value={education.endDate}
                            onChange={(e) => handleEducationChange(e, index)}
                        />
                        <input
                            type="text"
                            name="field"
                            placeholder="Field/Major/Subject"
                            value={education.field}
                            onChange={(e) => handleEducationChange(e, index)}
                        />
                        <input
                            type="text"
                            name="location"
                            placeholder="Location"
                            value={education.location}
                            onChange={(e) => handleEducationChange(e, index)}
                        />
                    </div>
                ))}
                <button type="button" onClick={addEducation}>Add Education</button>
            </Section>

            <Section>
                <SectionTitle>Work Experience</SectionTitle>
                {resumeData.workExperiences.map((experience, index) => (
                    <div key={index} style={{ marginBottom: "20px" }}>
                        <input
                            type="text"
                            name="title"
                            placeholder="Job Title"
                            value={experience.title}
                            onChange={(e) => handleWorkExperienceChange(e, index)}
                        />
                        <input
                            type="text"
                            name="company"
                            placeholder="Company Name"
                            value={experience.company}
                            onChange={(e) => handleWorkExperienceChange(e, index)}
                        />
                        <input
                            type="date"
                            name="startDate"
                            placeholder="Start Date"
                            value={experience.startDate}
                            onChange={(e) => handleWorkExperienceChange(e, index)}
                        />
                        <input
                            type="date"
                            name="endDate"
                            placeholder="End Date"
                            value={experience.endDate}
                            onChange={(e) => handleWorkExperienceChange(e, index)}
                        />
                        <textarea
                            name="description"
                            placeholder="Job Description"
                            value={experience.description}
                            onChange={(e) => handleWorkExperienceChange(e, index)}
                            rows={3}
                        />
                    </div>
                ))}
                <button type="button" onClick={addWorkExperience}>Add Work Experience</button>
            </Section>

            <Section>
                <SectionTitle>Skills</SectionTitle>
                {resumeData.skills.map((skill, index) => (
                    <Skill key={index}>
                        <SkillInput>
                            <input
                                type="text"
                                value={skill}
                                onChange={(e) => handleSkillChange(e, index)}

                                placeholder={`Skill`}
                            />
                        </SkillInput>
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
                <p style={{color: '#4a4a4a',}}>{COVER_LETTER_LENGTH - resumeData.coverLetter.length} characters remaining</p> {/* Character counter */}
            </Section>

            <button type="submit" onClick={handleSubmit}>Submit Resume</button>
        </Container>
    );
};

export default Resume;
