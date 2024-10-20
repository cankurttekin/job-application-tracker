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
import Charts from './components/Charts';
import AITools from './components/AITools';
import Resume from "./components/Resume";

const PrivateRoute = ({ isLoggedIn, children }) => {
    return isLoggedIn ? children : <Navigate to="/login" />;
};

const Container = styled.div`
    display: flex;
`;

const MainContent = styled.div`
    flex: 1;
    padding-left: 280px;
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
                            <Route path="/charts" element={<PrivateRoute isLoggedIn={isLoggedIn}><Charts /></PrivateRoute>} />
                            <Route path="/ai-tools" element={<PrivateRoute isLoggedIn={isLoggedIn}><AITools /></PrivateRoute>} />
                            <Route path="/resume" element={<PrivateRoute isLoggedIn={isLoggedIn}><Resume /></PrivateRoute>} />
                        </Routes>
                    </MainContent>
                </Container>
            </Router>
        </AuthProvider>
    );
};

export default App;
