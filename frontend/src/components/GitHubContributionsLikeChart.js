import React from 'react';
import { Box } from '@mui/material';
import { ResponsiveContainer } from 'recharts';

const GitHubContributionsChart = ({ applicationsByDay }) => {
    const totalDays = 365;
    const days = Array.from({ length: totalDays }, (_, index) => {
        const date = new Date();
        date.setDate(date.getDate() - index);
        return date.toISOString().split('T')[0]; // Format YYYY-MM-DD
    }).reverse();
    const totalApplications = Object.values(applicationsByDay).reduce((total, count) => total + count, 0);

    return (
        <div className="kanban-card" sx={{ padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3>{totalApplications} Applications in the last year</h3>
            <Box sx={{ width: '100%', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ResponsiveContainer width="auto" height="90%">

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
                </ResponsiveContainer>
            </Box>
        </div>
    );
};

export default GitHubContributionsChart;
