import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { ResponsiveContainer } from 'recharts';
import styled from 'styled-components';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { REACT_APP_BACKEND_URL } from '../config';

// Styled Components
const Container = styled.div`
    display: flex;
    flex-direction: column; /* Stack charts vertically */
    align-items: flex-start; /* Center charts horizontally */
    margin-top: 28px;
    box-sizing: border-box;
`;

const Title = styled.h2`
    text-align: center;
    align-self: center;
    margin-bottom: 10px;
`;

const Header = styled.h2`
    text-align: center;
    margin-bottom: 6px;
`;

const ChartWrapper = styled.div`
    background-color: black;
    padding: 20px;
    border-radius: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px; /* Space between charts */
`;

const GitHubContributionsChart = ({ applicationsByDay }) => {
    const totalDays = 365;
    const days = Array.from({ length: totalDays }, (_, index) => {
        const date = new Date();
        date.setDate(date.getDate() - index);
        return date.toISOString().split('T')[0]; // Format YYYY-MM-DD
    }).reverse();

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(53, 20px)', gap: '4px' }}>
            {days.map((day) => {
                const applications = applicationsByDay[day] || 0;
                const color = applications > 0 ? `rgba(57, 211, 83, ${Math.min(applications / 3, 1)})` : 'rgba(22, 28, 34, 1)'; // Adjust the divisor for color intensity
                return (
                    <div
                        key={day}
                        style={{
                            width: '20px',
                            height: '20px',
                            backgroundColor: color,
                            borderRadius: '4px',
                            position: 'relative', // Position for the label
                        }}
                        title={`${applications} Applications on ${new Date(day).toLocaleDateString()}`}
                    >
                        {/* Display day of the month */}
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
                        {/* Display month name on the first box of each week */}
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
        <ChartWrapper style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: '0 0 300px' }}> {/* Fixed width for the pie chart */}
                <PieChart width={300} height={460}>
                    <Tooltip />
                    <Legend />
                    <Pie
                        data={data}
                        cx={150}
                        cy={150}
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
            </div>
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
            <Header>Total Applications: {totalApplications}</Header>
            <ChartWrapper>
                <ResponsiveContainer width="100%" height="100%">
                    <GitHubContributionsChart applicationsByDay={applicationsByDay} />
                </ResponsiveContainer>
            </ChartWrapper>
            <Header>Positions</Header>
            <ChartWrapper>
                <ResponsiveContainer width="100%" height="100%">
                    <JobPositionPieChart jobPositions={jobPositions} />
                </ResponsiveContainer>
            </ChartWrapper>
        </Container>
    );
};

export default Charts;
