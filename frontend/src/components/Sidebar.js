import React, {useState, useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import styled from 'styled-components';
import AddJobApplication from './AddJobApplication';
import {AuthContext} from '../contexts/AuthContext';
const SidebarContainer = styled.div`
    position: fixed;
    top: 0;
    left: ${(props) => (props.isHidden ? '-280px' : '0')}; /* toggle visibility with slide effect */
    width: 280px;
    height: 98vh;
    background-color: #f5f5f5;
    padding: 20px;
    color: black;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 0 0.675rem 0.675rem 0;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    transition: left 0.3s ease; /* transition for show/hide */
`;

const HamburgerIcon = styled.div`
    position: fixed;
    top: 10px;
    left: 10px;
    font-size: 26px;
    cursor: pointer;
    z-index: 1100;
    background-color: #f5f5f5;
    border: solid 1px grey;
    padding: 4px;
    border-radius: 18%;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
    color: grey;
`;

const SidebarItem = styled.div`
    margin: 20px 0;
    cursor: pointer;
    padding: 10px;
    border-radius: 5px;
    display: flex;
    align-items: center;

    &:hover {
        background-color: #f2f3f4;
    }

    & > .material-icons {
        margin-right: 10px;
    }
`;

const ProfileContainer = styled.div`
    text-align: center;
    color: black;
    margin-bottom: 30px;
`;

const ProfileButton = styled.button`
    background: none;
    border: none;
    color: black;
    cursor: pointer;
    padding: 10px;
    border-radius: 5px;

    &:hover {
        color: #333;
    }
`;

const HorizontalLine = styled.hr`
    margin: 20px 0;
    border: 0;
    border-top: 1px solid #ccc;
`;

const AppName = styled.div`
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 10px;
    padding-left: 20px;
`;

const Sidebar = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext); // Use global isLoggedIn
    const [isHidden, setIsHidden] = useState(false); // Controls sidebar visibility

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

    const toggleSidebar = () => {
        setIsHidden(!isHidden); // Toggles sidebar visibility
    };

    return (
        <>
            {/* Hamburger Menu Icon */}
            <HamburgerIcon className="material-icons" onClick={toggleSidebar}>
                menu
            </HamburgerIcon>

            {/* Sidebar */}
            <SidebarContainer isHidden={isHidden}>
                <div>
                    <AppName>ATSFS</AppName>
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
                                <SidebarItem onClick={() => navigate('/myResume')}>
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
                    <ProfileButton onClick={isLoggedIn ? handleLogout : () => navigate('/login')}>
                        <span className="material-icons">{isLoggedIn ? 'logout' : 'login'}</span>
                        {isLoggedIn ? 'Logout' : 'Login'}
                    </ProfileButton>
                </ProfileContainer>
            </SidebarContainer>
        </>
    );
};

export default Sidebar;
