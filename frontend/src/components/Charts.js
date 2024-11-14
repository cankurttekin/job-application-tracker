import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { ResponsiveContainer } from 'recharts';
import styled from 'styled-components';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { REACT_APP_BACKEND_URL } from '../config';
import Dashboard from "./Dashboard";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    margin: 20px auto;
    box-sizing: border-box;
    //width: 100%;
`;

const Title = styled.h2`
    text-align: center;
    margin-bottom: 10px;
`;

const Header = styled.h3`
    margin-bottom: 8px;
    color: #4a4a4a;
    padding-bottom: 4px;
`;

const ChartWrapper = styled.div`
    padding: 20px;
    border-radius: 6px;
    border: 1px solid #ddd;
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
    flex-direction: column;
`;

const GitHubContributionsChart = ({ applicationsByDay }) => {
    const totalDays = 365;
    const days = Array.from({ length: totalDays }, (_, index) => {
        const date = new Date();
        date.setDate(date.getDate() - index);
        return date.toISOString().split('T')[0]; // Format YYYY-MM-DD
    }).reverse();

    return (

        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(53, 20px)',
            gap: '2px',
            overflowX: 'auto',
            paddingBottom: '18px',
            justifyContent: 'center',
        }}>
            {days.map((day) => {
                const applications = applicationsByDay[day] || 0;
                const color = applications > 0 ? `rgba(57, 211, 83, ${Math.min(applications / 3, 1)})` : 'rgba(22, 28, 34, 1)'; // Adjust the divisor for color intensity
                return (
                    <div
                        key={day}
                        style={{
                            width: '18px',
                            height: '18px',
                            backgroundColor: color,
                            borderRadius: '4px',
                            position: 'relative',
                        }}
                        title={`${applications} Applications on ${new Date(day).toLocaleDateString()}`}
                    >
                        <span style={{
                            position: 'absolute',
                            bottom: '-18px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            fontSize: '10px',
                            color: '#fff',
                        }}>
                            {new Date(day).getDate()}
                        </span>
                        {day.endsWith('01') && (
                            <span style={{
                                position: 'absolute',
                                top: '-15px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                fontSize: '10px',
                                color: '#fff',
                            }}>
                                {new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(day))}
                            </span>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

const JobPositionPieChart = ({ jobPositions }) => {
    const data = Object.entries(jobPositions).map(([name, value]) => ({
        name,
        value,
    }));

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384', '#36A2EB', '#FFCE56'];

    return (
        <ChartWrapper>
            <ResponsiveContainer width="100%" height={360}>
                <PieChart>
                    <Tooltip />
                    <Legend />
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </ChartWrapper>
    );
};

const Charts = () => {
    const [applicationsByDay, setApplicationsByDay] = useState({});
    const [jobPositions, setJobPositions] = useState({});
    const { isLoggedIn } = useContext(AuthContext); // Use global isLoggedIn

    useEffect(() => {
        const fetchData = async () => {
            if (isLoggedIn) {
                try {
                    const response = await axios.get(`${REACT_APP_BACKEND_URL}/job-applications/stats`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    });
                    setApplicationsByDay(response.data.applicationsByDay);
                    const jobAppResponse = await axios.get(`${REACT_APP_BACKEND_URL}/job-applications`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    });
                    const positionData = jobAppResponse.data.reduce((acc, app) => {
                        acc[app.jobTitle] = (acc[app.jobTitle] || 0) + 1;
                        return acc;
                    }, {});
                    setJobPositions(positionData);
                } catch (error) {
                    console.error('Error fetching job application stats:', error);
                }
            }
        };

        fetchData();
    }, [isLoggedIn]);

    // Calculate total applications
    const totalApplications = Object.values(applicationsByDay).reduce((total, count) => total + count, 0);

    return (
        <Container>
            <Title>Your Stats</Title>
            <Dashboard></Dashboard>
            <ChartWrapper>
                <Header>{totalApplications} Applications in the last year</Header>

                <ResponsiveContainer width="100%">
                    <GitHubContributionsChart applicationsByDay={applicationsByDay} />
                </ResponsiveContainer>
            </ChartWrapper>
            {/*<Header>Positions</Header>*/}
            <JobPositionPieChart jobPositions={jobPositions}>
            </JobPositionPieChart>
        </Container>
    );
};

export default Charts;
