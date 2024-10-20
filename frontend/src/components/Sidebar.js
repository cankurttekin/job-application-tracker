import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import AddJobApplication from './AddJobApplication';
import { AuthContext } from '../contexts/AuthContext';
import atsfsIcon from '../assets/atsfs.png';

const SidebarContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 280px;
    height: 100vh;
    background-color: #ebebeb;
    padding: 20px;
    color: #2f2f2f;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    //box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    border-right: 1px solid #ccc;
    z-index: 1000;
`;

const SidebarItem = styled.div`
    margin: 20px 0;
    cursor: pointer;
    padding: 10px;
    border-radius: 5px;
    display: flex;
    align-items: center;

    &:hover {
        background-color: #dedede;
    }

    & > .material-icons {
        margin-right: 10px;
    }
`;

const ProfileContainer = styled.div`
    text-align: center;
    color: #2f2f2f;
    margin-bottom: 30px;
`;

const ProfileButton = styled.button`
    background: none;
    border: none;
    color: #2f2f2f;
    cursor: pointer;
    padding: 1px;

    &:hover {
        color: #333;
    }
`;

const HorizontalLine = styled.hr`
    margin: 12px 0;
    border: 0;
    border-top: 1px solid #ccc;
`;

const AppName = styled.div`
    font-size: 28px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Sidebar = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext); // Use global isLoggedIn

    const navigate = useNavigate(); // Use navigate for routing

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token); // Update the state based on token presence
    }, []);

    const handleAddJobClick = () => {
        setIsModalOpen(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove token from localStorage
        setIsLoggedIn(false);
        navigate('/login'); // Navigate to login after logout
    };

    return (
        <SidebarContainer>
            <div>
                <AppName>
                    <img src={atsfsIcon} alt="Icon" style={{ marginRight: '10px', width: '50px' }} />
                    ATSFS
                </AppName>
                <SidebarItem onClick={() => navigate('/')}>
                    <span className="material-icons">home</span>
                    Home
                </SidebarItem>

                {/* Profile Section */}
                <ProfileContainer>
                    {isLoggedIn ? (
                        <>
                            <HorizontalLine />
                            <SidebarItem onClick={() => navigate('/job-applications')}>
                                <span className="material-icons">work</span>
                                Applications
                            </SidebarItem>
                            <SidebarItem onClick={handleAddJobClick}>
                                <span className="material-icons">add</span>
                                Add Job Application
                            </SidebarItem>
                            <SidebarItem onClick={() => navigate('/charts')}>
                                <span className="material-icons">bar_chart</span>
                                Charts
                            </SidebarItem>
                            <SidebarItem onClick={() => navigate('/ai-tools')}>
                                <span className="material-icons">build</span>
                                AI Tools
                            </SidebarItem>
                            <SidebarItem onClick={() => navigate('/resume')}>
                                <span className="material-icons">assignment_ind</span>
                                My Resume
                            </SidebarItem>
                            <SidebarItem onClick={() => navigate('/exportData')}>
                                <span className="material-icons">file_download</span>
                                Export My Data
                            </SidebarItem>
                        </>
                    ) : (
                        <p></p>
                    )}
                </ProfileContainer>
            </div>

            <AddJobApplication isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {/* Bottom Profile Section */}
            <ProfileContainer>
                <HorizontalLine />
                {isLoggedIn && <div>Logged in as User</div>}
                <SidebarItem onClick={isLoggedIn ? handleLogout : () => navigate('/login')}>
                    <span className="material-icons">{isLoggedIn ? 'logout' : 'login'}</span>
                    {isLoggedIn ? 'Logout' : 'Login'}
                </SidebarItem>
            </ProfileContainer>
        </SidebarContainer>
    );
};

export default Sidebar;
