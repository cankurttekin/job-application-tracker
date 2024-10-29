import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL + "/api";

const Container = styled.div`
    padding: 20px;
`;

const SelectionContainer = styled.div`
    display: flex;
    align-items: center;
    margin-top: 10px;
`;

const Dropdown = styled.select`
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-top: 10px;
    margin-right: 10px;
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
    list-style-type: none;
    padding: 0;
`;

const QuestionItem = styled.li`
    padding: 8px;
    border-bottom: 1px solid #eee;
    &:last-child {
        border-bottom: none;
    }
`;

const JobDetails = styled.h3`
    margin-bottom: 24px;
`;

const ResultMessage = styled.p`
    margin-top: 20px;
    font-weight: bold;
`;

const PersonalizationSection = styled.div`
    margin-top: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f0f0f0;
`;

const PersonalizationElement = styled.div`
    margin-bottom: 10px;
`;

const CheckboxLabel = styled.label`
    //display: block;
    display: inline-block;
    margin: 0px 40px;
`;

const PersonalizationHeader = styled.h4`
    cursor: pointer;
    //text-decoration: underline;
`;

const AITools = () => {
    const [jobApplications, setJobApplications] = useState([]);
    const [interviewQuestions, setInterviewQuestions] = useState([]);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [selectedJobApplication, setSelectedJobApplication] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [resultMessage, setResultMessage] = useState("");
    const [showPersonalization, setShowPersonalization] = useState(false);
    const [personalization, setPersonalization] = useState({
        tone: [],
        focusAreas: [],
        questionTypes: [],
        experienceLevel: ''
    });

    useEffect(() => {
        const fetchJobApplications = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${REACT_APP_BACKEND_URL}/job-applications`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setJobApplications(response.data);
                if (response.data.length > 0) {
                    setSelectedJobApplication(response.data[0]); // Set the first job application as selected
                }
            } catch (error) {
                console.error("Error fetching job applications:", error);
            }
        };

        fetchJobApplications();
    }, []);

    const handleGenerateQuestions = async () => {
        if (!selectedJobApplication) {
            console.error("No job application selected.");
            return;
        }

        const { description, jobTitle } = selectedJobApplication;

        // Get the user's resume
        const token = localStorage.getItem("token");
        try {
            const resumeResponse = await axios.get(`${REACT_APP_BACKEND_URL}/resumes`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const resume = resumeResponse.data; // Adjust based on your API response
            const response = await axios.post(`${REACT_APP_BACKEND_URL}/llm/generate-interview`, {
                description,
                jobTitle,
                resume,
                personalization // Include user personalization in the payload
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("Interview Response Data:", response.data);

            if (Array.isArray(response.data.questions)) {
                setInterviewQuestions(response.data.questions);
            } else {
                console.error("No interview questions found in response:", response.data);
                setInterviewQuestions([]);
            }
        } catch (error) {
            console.error("Error generating questions:", error);
            setInterviewQuestions([]);
        }
    };

    const handleGenerateQuiz = async () => {
        if (!selectedJobApplication) {
            console.error("No job application selected.");
            return;
        }

        const { description, jobTitle } = selectedJobApplication;

        const token = localStorage.getItem("token");
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/llm/generate-quiz`, {
                description,
                jobTitle
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("Quiz Response Data:", response.data);

            if (Array.isArray(response.data)) {
                const formattedQuestions = response.data.map((q) => ({
                    questionText: q.questionText,
                    options: q.options,
                    correctAnswer: q.correctAnswer,
                }));
                setQuizQuestions(formattedQuestions);
                setSelectedAnswers({});
                setResultMessage("");
            } else {
                console.error("Expected an array of quiz questions, but got:", response.data);
                setQuizQuestions([]);
            }
        } catch (error) {
            console.error("Error generating quiz:", error);
            setQuizQuestions([]);
        }
    };

    const handleAnswerSelect = (questionIndex, answer) => {
        setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
    };

    const checkAnswers = () => {
        let score = 0;
        quizQuestions.forEach((question, index) => {
            if (selectedAnswers[index] === question.correctAnswer) {
                score++;
            }
        });
        setResultMessage(`You scored ${score} out of ${quizQuestions.length}.`);
    };

    const handlePreferenceChange = (e) => {
        const { name, value, checked } = e.target;
        if (name === "focusAreas" || name === "questionTypes") {
            setPersonalization((prev) => {
                const newValues = checked
                    ? [...prev[name], value]
                    : prev[name].filter((item) => item !== value);
                return { ...prev, [name]: newValues };
            });
        } else if (name === "tone") {
            setPersonalization((prev) => {
                const newValues = checked
                    ? [...prev[name], value]
                    : prev[name].filter((item) => item !== value);
                return { ...prev, [name]: newValues };
            });
        } else {
            setPersonalization((prev) => ({ ...prev, [name]: value }));
        }
    };

    return (
        <Container>
            <h2>AI Tools</h2>

            {jobApplications.length > 0 && (
                <>
                    <SelectionContainer>
                        <Dropdown
                            onChange={(e) => setSelectedJobApplication(jobApplications[e.target.value])}
                            value={jobApplications.indexOf(selectedJobApplication)}
                        >
                            {jobApplications.map((job, index) => (
                                <option key={index} value={index}>
                                    {job.jobTitle} - {job.companyName}
                                </option>
                            ))}
                        </Dropdown>

                        <button onClick={handleGenerateQuestions}>Interview Questions</button>
                        <button onClick={handleGenerateQuiz}>Generate Quiz</button>
                    </SelectionContainer>
                </>
            )}

            {/* Personalization Section */}
            <PersonalizationSection>
                <PersonalizationHeader onClick={() => setShowPersonalization(!showPersonalization)}>
                    Personalize your AI responses✨ ⤵
                </PersonalizationHeader>
                {showPersonalization && (
                    <>
                        <PersonalizationElement>
                        <h4>Tone</h4>
                        <CheckboxLabel>
                            <input
                                type="checkbox"
                                name="tone"
                                value="friendly"
                                onChange={handlePreferenceChange}
                            />
                            Friendly
                        </CheckboxLabel>
                        <CheckboxLabel>
                            <input
                                type="checkbox"
                                name="tone"
                                value="formal"
                                onChange={handlePreferenceChange}
                            />
                            Formal
                        </CheckboxLabel>
                        <CheckboxLabel>
                            <input
                                type="checkbox"
                                name="tone"
                                value="casual"
                                onChange={handlePreferenceChange}
                            />
                            Casual
                        </CheckboxLabel>
                        <CheckboxLabel>
                            <input
                                type="checkbox"
                                name="tone"
                                value="encouraging"
                                onChange={handlePreferenceChange}
                            />
                            Encouraging
                        </CheckboxLabel>
                        </PersonalizationElement>
                        <PersonalizationElement>
                        <h4>Focus Areas</h4>
                        <CheckboxLabel>
                            <input
                                type="checkbox"
                                name="focusAreas"
                                value="teamwork"
                                onChange={handlePreferenceChange}
                            />
                            Teamwork
                        </CheckboxLabel>
                        <CheckboxLabel>
                            <input
                                type="checkbox"
                                name="focusAreas"
                                value="leadership"
                                onChange={handlePreferenceChange}
                            />
                            Leadership
                        </CheckboxLabel>
                        <CheckboxLabel>
                            <input
                                type="checkbox"
                                name="focusAreas"
                                value="communication"
                                onChange={handlePreferenceChange}
                            />
                            Communication
                        </CheckboxLabel>
                        <CheckboxLabel>
                            <input
                                type="checkbox"
                                name="focusAreas"
                                value="problem-solving"
                                onChange={handlePreferenceChange}
                            />
                            Problem Solving
                        </CheckboxLabel>
                        </PersonalizationElement>
                        <PersonalizationElement>
                        <h4>Question Types</h4>
                        <CheckboxLabel>
                            <input
                                type="checkbox"
                                name="questionTypes"
                                value="technical"
                                onChange={handlePreferenceChange}
                            />
                            Technical
                        </CheckboxLabel>
                        <CheckboxLabel>
                            <input
                                type="checkbox"
                                name="questionTypes"
                                value="behavioral"
                                onChange={handlePreferenceChange}
                            />
                            Behavioral
                        </CheckboxLabel>
                        <CheckboxLabel>
                            <input
                                type="checkbox"
                                name="questionTypes"
                                value="situational"
                                onChange={handlePreferenceChange}
                            />
                            Situational
                        </CheckboxLabel>
                        </PersonalizationElement>
                        <PersonalizationElement>
                        <h4>Experience Level</h4>
                        <CheckboxLabel>
                            <input
                                type="radio"
                                name="experienceLevel"
                                value="junior"
                                onChange={handlePreferenceChange}
                            />
                            Junior Level
                        </CheckboxLabel>
                        <CheckboxLabel>
                            <input
                                type="radio"
                                name="experienceLevel"
                                value="mid"
                                onChange={handlePreferenceChange}
                            />
                            Mid Level
                        </CheckboxLabel>
                        <CheckboxLabel>
                            <input
                                type="radio"
                                name="experienceLevel"
                                value="senior"
                                onChange={handlePreferenceChange}
                            />
                            Senior Level
                        </CheckboxLabel>
                            </PersonalizationElement>
                    </>
                )}
            </PersonalizationSection>

            {interviewQuestions.length > 0 && (
                <QuestionsContainer>
                    <JobDetails>
                        {selectedJobApplication.jobTitle} at {selectedJobApplication.companyName}
                    </JobDetails>
                    <h3>Generated Interview Questions:</h3>
                    <QuestionList>
                        {interviewQuestions.map((question, index) => (
                            <QuestionItem key={index}>{question}</QuestionItem>
                        ))}
                    </QuestionList>
                </QuestionsContainer>
            )}

            {quizQuestions.length > 0 && (
                <QuestionsContainer>
                    <JobDetails>
                        {selectedJobApplication.jobTitle} at {selectedJobApplication.companyName}
                    </JobDetails>
                    <h3>Quiz Questions:</h3>
                    <QuestionList>
                        {quizQuestions.map((question, index) => (
                            <QuestionItem key={index}>
                                <p>{question.questionText}</p>
                                {question.options.map((option, i) => (
                                    <div key={i}>
                                        <input
                                            type="radio"
                                            id={`question-${index}-option-${i}`}
                                            name={`question-${index}`}
                                            value={option}
                                            onChange={() => handleAnswerSelect(index, option)}
                                        />
                                        <label htmlFor={`question-${index}-option-${i}`}>{option}</label>
                                    </div>
                                ))}
                            </QuestionItem>
                        ))}
                    </QuestionList>
                    <button onClick={checkAnswers}>Check Answers</button>
                    {resultMessage && <ResultMessage>{resultMessage}</ResultMessage>}
                </QuestionsContainer>
            )}
        </Container>
    );
};

export default AITools;
