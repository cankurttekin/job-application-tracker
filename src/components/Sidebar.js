import React, { useState } from 'react';
import styled from 'styled-components';
import AddJobApplication from './AddJobApplication';

const SidebarContainer = styled.div`
    width: 300px;
    height: 100vh;
    background-color: #f5f5f5;
    padding: 20px;
    color: black;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 0 0.675rem 0.675rem 0;
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

    const handleAddJobClick = () => {
        setIsModalOpen(true);
    };

    return (
        <SidebarContainer>
            <div>
                <SidebarItem onClick={() => setPage('home')}>
                    <span className="material-icons">home</span>
                    Home
                </SidebarItem>
                <SidebarItem onClick={() => setPage('jobApplications')}>
                    <span className="material-icons">work</span>
                    Applications
                </SidebarItem>
                <SidebarItem onClick={handleAddJobClick}>
                    <span className="material-icons">add</span>
                    Add Job Application
                </SidebarItem>
            </div>
            <AddJobApplication isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            <ProfileContainer>
                <ProfileButton onClick={() => setPage('profile')}>
                    <span className="material-icons">person</span>
                    Profile
                </ProfileButton>
                <div>info</div>
            </ProfileContainer>
        </SidebarContainer>
    );
};

export default Sidebar;

