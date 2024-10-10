import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import styled from 'styled-components';
import GlobalStyle from './styles/globalStyles';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import JobApplications from './components/JobApplications';
import AddJobApplication from './components/AddJobApplication';

const Container = styled.div`
    display: flex;
`;

const MainContent = styled.div`
    flex: 1;
    //padding: 20px;
    padding-left: 34px;
    //margin-top: 26px;
    //border-radius: 20px;
    background-color: #ffff;
    //margin-left: 16px;
    //margin-top: 28px;
    //margin-left: 28px; /* Match the sidebar width */
`;

const App = () => {
    const [page, setPage] = useState('home');

    return (
        <>
            <GlobalStyle />
            <Container>
                <Sidebar setPage={setPage} />
                <MainContent>
                    {page === 'home' && <Home />}
                    {page === 'jobApplications' && <JobApplications />}
                    {page === 'Login' && <Login />}
                </MainContent>
            </Container>
        </>
    );
};

export default App;
