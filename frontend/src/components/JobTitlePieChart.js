import React from 'react';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { Box, Typography, Grid } from '@mui/material';

const JobTitlePieChart = ({ jobApplications }) => {
    // Normalize job titles to lowercase for case-insensitive grouping
    const jobTitleCounts = jobApplications.reduce((acc, app) => {
        const normalizedTitle = app.jobTitle.toLowerCase(); // Convert job title to lowercase
        acc[normalizedTitle] = (acc[normalizedTitle] || 0) + 1;
        return acc;
    }, {});

    // Prepare data for the pie chart, restoring original case for display
    const data = Object.keys(jobTitleCounts).map(normalizedTitle => ({
        name: normalizedTitle.charAt(0).toUpperCase() + normalizedTitle.slice(1), // Capitalize first letter for display
        value: jobTitleCounts[normalizedTitle],
    }));

    // Limit the number of legends to 5
    const maxLegends = 5;
    const limitedData = data.slice(0, maxLegends);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6347'];

    const renderLegend = () => {
        return limitedData.map((entry, index) => (
            <Grid key={entry.name} container alignItems="center">
                <Box
                    sx={{
                        width: 15,
                        height: 15,
                        backgroundColor: COLORS[index % COLORS.length],
                        marginRight: 1,
                    }}
                />
                <Typography>{entry.name}</Typography>
            </Grid>
        ));
    };

    return (
        <div className="kanban-card" sx={{padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <h3>Job Title Distribution</h3>
            <Box sx={{width: '100%', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <ResponsiveContainer width="90%" height="90%">
                    <PieChart>
                        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                            ))}
                        </Pie>
                        <Tooltip/>
                    </PieChart>
                </ResponsiveContainer>
            </Box>
            <Box sx={{marginTop: 2}}>
                {renderLegend()}
            </Box>
        </div>
    );
};

export default JobTitlePieChart;
