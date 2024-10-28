import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL + "/api";

const Container = styled.div`
    padding: 20px;
`;

const Button = styled.button`
    margin: 10px 0;
`;

const Resume = () => {
    const [resumeData, setResumeData] = useState({
        id: null,
        title: "",
        summary: "",
        //workExperiences: [{ title: "", company: "", startDate: "", endDate: "", description: "" }],
        //projects: [{ title: "", description: "", link: "" }],
        skills: [""],
        coverLetter: ""
    });

    useEffect(() => {
        const fetchResume = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${REACT_APP_BACKEND_URL}/resumes`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // Check if response data has the required fields and provide defaults if necessary
                const fetchedData = response.data || {
                    id: null,
                    title: "",
                    summary: "",
                    //workExperiences: [{ title: "", company: "", startDate: "", endDate: "", description: "" }],
                    //projects: [{ title: "", description: "", link: "" }],
                    skills: [""],
                    coverLetter: ""
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
        setResumeData({ ...resumeData, [name]: value });
    };

    const handleNestedChange = (e, section, index) => {
        const { name, value } = e.target;
        const updatedSection = resumeData[section].map((item, i) =>
            i === index ? { ...item, [name]: value } : item
        );
        setResumeData({ ...resumeData, [section]: updatedSection });
    };


    const addSkill = () => {
        setResumeData({
            ...resumeData,
            skills: [...resumeData.skills, ""]
        });
    };

    const handleSkillChange = (e, index) => {
        const updatedSkills = resumeData.skills.map((skill, i) =>
            i === index ? e.target.value : skill
        );
        setResumeData({ ...resumeData, skills: updatedSkills });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            if (resumeData.id) {
                // Update existing resume
                await axios.put(`${REACT_APP_BACKEND_URL}/resumes/${resumeData.id}`, resumeData, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                alert("Resume updated successfully!");
            } else {
                // Create new resume
                await axios.post(`${REACT_APP_BACKEND_URL}/resumes`, resumeData, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                alert("Resume submitted successfully!");
            }
        } catch (error) {
            console.error("Error submitting resume:", error);
            alert("Failed to submit resume. Please try again.");
        }
    };

    return (
        <Container>
            <form onSubmit={handleSubmit}>
                <h2>Resume Information</h2>

                {/* Title Section */}
                <div>
                    <label>Title:</label>
                    <textarea
                        name="title"
                        value={resumeData.title}
                        onChange={handleChange}
                    />
                </div>

                {/* About Me Section */}
                <div>
                    <label>Summary:</label>
                    <textarea
                        name="summary"
                        value={resumeData.summary}
                        onChange={handleChange}
                    />
                </div>

                {/* Location Section */}
                <div>
                    <label>Location:</label>
                    <textarea
                        name="location"
                        value={resumeData.location}
                        onChange={handleChange}
                    />
                </div>

                {/* Education Section */}
                <div>
                    <label>Education:</label>
                    <textarea
                        name="education"
                        value={resumeData.education}
                        onChange={handleChange}
                    />
                </div>

                {/* Work Experience Section */}
                <h3>Work Experience</h3>
                <div>
                    <textarea
                        name="workexperience"
                        value="Will be implemented"
                        onChange={handleChange}
                    />
                </div>


                {/* Projects Section */}
                <h3>Projects</h3>
                <div>
                    <textarea
                        name="projects"
                        value="Will be implemented"
                        onChange={handleChange}
                    />
                </div>
                <h3>Projects</h3>
                { /*
                {resumeData.projects.map((project, index) => (
                    <div key={index}>
                        <input
                            type="text"
                            name="title"
                            placeholder="Project Title"
                            value={project.title}
                            onChange={(e) => handleNestedChange(e, "projects", index)}
                        />
                        <textarea
                            name="description"
                            placeholder="Project Description"
                            value={project.description}
                            onChange={(e) => handleNestedChange(e, "projects", index)}
                        />
                        <input
                            type="url"
                            name="link"
                            placeholder="Project Link"
                            value={project.link}
                            onChange={(e) => handleNestedChange(e, "projects", index)}
                        />
                    </div>
                ))}
                <Button type="button" onClick={addProject}>Add Project</Button>
                asdasdas */ }


                {/* Skills Section */}
                <h3>Skills</h3>
                {resumeData.skills.map((skill, index) => (
                    <input
                        key={index}
                        type="text"
                        placeholder="Skill"
                        value={skill}
                        onChange={(e) => handleSkillChange(e, index)}
                    />
                ))}
                <Button type="button" onClick={addSkill}>Add Skill</Button>

                {/* Cover Letter Section */}
                <div>
                    <h3>Cover Letter</h3>
                    <textarea
                        name="coverLetter"
                        value={resumeData.coverLetter}
                        onChange={handleChange}
                    />
                </div>

                <Button type="submit">Submit Resume</Button>
            </form>
        </Container>
    );
};

export default Resume;
