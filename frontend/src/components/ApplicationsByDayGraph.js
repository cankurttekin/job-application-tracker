import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Box } from '@mui/material';

const ApplicationsByDayGraph = ({ applicationsByDay }) => {
    const [formattedData, setFormattedData] = useState([]);

    useEffect(() => {
        // Transform the applicationsByDay object into an array of objects for the chart
        const data = Object.keys(applicationsByDay).map(date => ({
            date: date,
            applications: applicationsByDay[date]
        }));
        setFormattedData(data);
    }, [applicationsByDay]);

    return (
        <div className="kanban-card" sx={{ padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3>Applications Over Time</h3>
            <Box sx={{ width: '100%', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ResponsiveContainer width="90%" height="90%">
                    <LineChart data={formattedData}>
                        <CartesianGrid stroke="#ccc" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="applications" stroke="#8884d8" />
                    </LineChart>
                </ResponsiveContainer>
            </Box>
        </div>
    );
};

export default ApplicationsByDayGraph;
