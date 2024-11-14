import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import JobTitlePieChart from './JobTitlePieChart';
import ApplicationsByDayGraph from './ApplicationsByDayGraph';
import ResponseStatusPieChart from './ResponseStatusPieChart';
import '../styles/Dashboard.css';
import {AuthContext} from "../contexts/AuthContext";

const Dashboard = () => {
    const [applicationsByDay, setApplicationsByDay] = useState([]);
    const [jobApplications, setJobApplications] = useState([]);
    const { isLoggedIn } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            if (isLoggedIn) {
                const statsResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/job-applications/stats`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setApplicationsByDay(statsResponse.data.applicationsByDay);

                const applicationsResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/job-applications`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setJobApplications(applicationsResponse.data);
            }

        };
        fetchData();
    }, []);

    return (
        <div className="kanban-dashboard">
            <JobTitlePieChart jobApplications={jobApplications} />
            <ApplicationsByDayGraph applicationsByDay={applicationsByDay} />
            <ResponseStatusPieChart jobApplications={jobApplications} />
            {/*<GitHubContributionsLikeChart applicationsByDay={applicationsByDay} />*/}
        </div>
    );
};

export default Dashboard;
