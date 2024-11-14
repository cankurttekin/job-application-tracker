import React from 'react';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import styled from 'styled-components';
import GlobalStyle from './styles/globalStyles';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import JobApplications from './components/JobApplications';
import { AuthProvider, AuthContext } from './contexts/AuthContext'; // Use AuthContext for the provider
import Charts from './components/Charts';
import AITools from './components/AITools';
import Resume from "./components/Resume";
import MainContent from './components/layout/MainContent';
import ExportData from "./components/ExportData";
import Dashboard from "./components/Dashboard";

const PrivateRoute = ({ isLoggedIn, children }) => {
    return isLoggedIn ? children : <Navigate to="/login" />;
};

const Container = styled.div`
    display: flex;
`;

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <GlobalStyle />
                <Container>
                    <Sidebar />
                    <MainContent>
                        <Routes>
                        <Route path="/login" element={<Login />} />
                        </Routes>
                        <AuthContext.Consumer>

                            {({ isLoggedIn }) => (
                                <Routes>
                                    <Route path="/" element={isLoggedIn ? <Navigate to="/job-applications" /> : <Home />} />
                                    <Route path="/register" element={<Register />} />
                                    <Route path="/job-applications" element={<JobApplications />} />

                                    <Route
                                        path="/job-applications"
                                        element={<PrivateRoute isLoggedIn={isLoggedIn}><JobApplications /></PrivateRoute>}
                                    />
                                    <Route path="/charts" element={<PrivateRoute isLoggedIn={isLoggedIn}><Charts /></PrivateRoute>} />
                                    <Route path="/ai-tools" element={<PrivateRoute isLoggedIn={isLoggedIn}><AITools /></PrivateRoute>} />
                                    <Route path="/resume" element={<PrivateRoute isLoggedIn={isLoggedIn}><Resume /></PrivateRoute>} />
                                    <Route path="/export" element={<PrivateRoute isLoggedIn={isLoggedIn}><ExportData /></PrivateRoute>} />
                                </Routes>
                            )}
                        </AuthContext.Consumer>
                    </MainContent>
                </Container>
            </Router>
        </AuthProvider>
    );
};

export default App;
