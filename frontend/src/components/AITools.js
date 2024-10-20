import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

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
    //width: 100%;
    //max-width: 400px;
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

const AITools = () => {
    const [jobApplications, setJobApplications] = useState([]);
    const [interviewQuestions, setInterviewQuestions] = useState([]);
    const [quizQuestions, setQuizQuestions] = useState([]); // State for quiz questions
    const [selectedJobApplication, setSelectedJobApplication] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState({}); // State for selected answers
    const [resultMessage, setResultMessage] = useState(""); // State for result message

    useEffect(() => {
        const fetchJobApplications = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/job-applications`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setJobApplications(response.data);
                if (response.data) {
                    setSelectedJobApplication(response.data[0]); // Set the first job application as selected
                } else {
                    setSelectedJobApplication([]);
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

        const { jobDescription, jobTitle } = selectedJobApplication;

        const token = localStorage.getItem("token");
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/llm/generate-interview`, {
                jobDescription,
                jobTitle
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("Interview Response Data:", response.data);

            // Ensure response data is an array
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

        const { jobDescription, jobTitle } = selectedJobApplication;

        const token = localStorage.getItem("token");
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/llm/generate-quiz`, {
                jobDescription,
                jobTitle
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("Quiz Response Data:", response.data);

            // Ensure response data is an array of QuizQuestion objects
            if (Array.isArray(response.data)) {
                const formattedQuestions = response.data.map((q) => ({
                    questionText: q.questionText,
                    options: q.options,
                    correctAnswer: q.correctAnswer,
                }));
                setQuizQuestions(formattedQuestions);
                setSelectedAnswers({}); // Reset selected answers
                setResultMessage(""); // Clear previous results
            } else {
                console.error("Expected an array of quiz questions, but got:", response.data);
                setQuizQuestions([]); // Clear quiz if response is not an array
            }
        } catch (error) {
            console.error("Error generating quiz:", error);
            setQuizQuestions([]); // Clear quiz on error
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
                    <div>
                        <p><br/><i>ANSWER CHECK FUNCTIONALITY NEEDS TO BE IMPLEMENTED, CURRENTLY NOT WORKING</i></p>
                    </div>
                    <button onClick={checkAnswers}>Check Answers</button>
                    {resultMessage && <ResultMessage>{resultMessage}</ResultMessage>}
                </QuestionsContainer>
            )}
        </Container>
    );
};

export default AITools;
