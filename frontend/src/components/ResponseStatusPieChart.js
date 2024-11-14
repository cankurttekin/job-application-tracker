import React from 'react';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { Box, Grid } from '@mui/material';

const ResponseStatusPieChart = ({ jobApplications }) => {
    const responseCounts = jobApplications.reduce((acc, app) => {
        const status = app.status === 'Applied' ? 'Status: Others' : 'Status: Applied';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});

    const data = Object.keys(responseCounts).map(status => ({
        name: status,
        value: responseCounts[status]
    }));

    const COLORS = ['#FF8042', '#82ca9d'];

    const renderLegend = () => {
        return data.map((entry, index) => (
            <Grid key={entry.name} container alignItems="center">
                <Box
                    sx={{
                        width: 15,
                        height: 15,
                        backgroundColor: COLORS[index % COLORS.length],
                        marginRight: 1,
                    }}
                />
                <p>{entry.name}</p>
            </Grid>
        ));
    };

    return (
        <div className="kanban-card" sx={{padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <h3>Response Status</h3>
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

export default ResponseStatusPieChart;
