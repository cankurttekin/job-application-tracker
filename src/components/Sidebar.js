import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import AddJobApplication from './AddJobApplication';

const SidebarContainer = styled.div`
    position: fixed; /* Make sidebar fixed */
    top: 0; /* Align to top */
    left: 0; /* Align to left */
    width: 280px;
    height: 98vh; /* Full height */
    background-color: #f5f5f5;
    padding: 20px;
    color: black;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 0 0.675rem 0.675rem 0;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1); /* Optional shadow for visual separation */
    z-index: 1000; /* Ensure it stays on top */
    margin-top: 10px;

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
        margin-right: 10px; /* Space between icon and text */
    }
`;

const ProfileContainer = styled.div`
    margin-top: auto; /* Push to bottom */
    text-align: center;
    color: #aaa; /* Light text color */
`;

const ProfileButton = styled.button`
    background: none;
    border: none;
    color: #aaa;
    cursor: pointer;
    padding: 10px;
    border-radius: 5px;

    &:hover {
        color: black;
    }
`;

const Sidebar = ({ setPage }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Tracks login state
    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token); // Set login status based on token presence
    }, []);

    const handleAddJobClick = () => {
        setIsModalOpen(true);
    };
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setPage('login');
    };

    return (
        <SidebarContainer>
            <div>
                <SidebarItem onClick={() => setPage('home')}>
                    <span className="material-icons">home</span>
                    Home
                </SidebarItem>
	    {isLoggedIn && (
                    <>
                <SidebarItem onClick={() => setPage('jobApplications')}>
                    <span className="material-icons">work</span>
                    Applications
                </SidebarItem>

                <SidebarItem onClick={handleAddJobClick}>
                    <span className="material-icons">add</span>
                    Add Job Application
                </SidebarItem>
		</>
	    )}
            </div>

            <AddJobApplication isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            <ProfileContainer>
	    {isLoggedIn ? (
		    <ProfileButton onClick={handleLogout}>
                        <span className="material-icons">logout</span>
                        Logout
                    </ProfileButton>
                ) : (
                <ProfileButton onClick={() => setPage('Login')}>
                    <span className="material-icons">login</span>
                    Login
                </ProfileButton>
		)}
<div>{isLoggedIn ? 'Logged in as User' : ''}</div>
            </ProfileContainer>
        </SidebarContainer>
    );
};

export default Sidebar;

