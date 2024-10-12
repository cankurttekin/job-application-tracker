import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import styled from 'styled-components';
import GlobalStyle from './styles/globalStyles';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import JobApplications from './components/JobApplications';
import { AuthProvider } from './contexts/AuthContext';

const PrivateRoute = ({ isLoggedIn, children }) => {
    return isLoggedIn ? children : <Navigate to="/login" />;
};

const Container = styled.div`
    display: flex;
`;

const MainContent = styled.div`
    flex: 1;
    padding-left: 34px;
    background-color: #ffff;
`;

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) setIsLoggedIn(true);
    }, []);

    return (
        <AuthProvider>
            <Router>
                <GlobalStyle />
                <Container>
                    <Sidebar />
                    <MainContent>
                        <Routes>
                            <Route path="/" element={isLoggedIn ? <Navigate to="/job-applications" /> : <Home />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/login" element={<Login />} />
                            <Route
                                path="/job-applications"
                                element={<PrivateRoute isLoggedIn={isLoggedIn}><JobApplications /></PrivateRoute>}
                            />
                        </Routes>
                    </MainContent>
                </Container>
            </Router>
        </AuthProvider>
    );
};

export default App;
