import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import AddJobApplication from './AddJobApplication';
import { AuthContext } from '../contexts/AuthContext';
import atsfsIcon from '../assets/atsfs.png';

const NavbarContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    background-color: white;
    padding: 0 20px;
    color: #2f2f2f;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #ccc;
    z-index: 1000;
`;

const NavbarItems = styled.div`
    display: flex;
    align-items: center;

    @media (max-width: 768px) {
        display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
        position: absolute;
        top: 60px;
        left: 0;
        right: 0;
        background-color: white;
        padding: 10px 0;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        z-index: 1001;
    }
`;

const NavbarToggle = styled.button`
    display: none;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #2f2f2f;

    @media (max-width: 768px) {
        display: block;
    }

    &:hover {
        background-color: #dedede;
    }
`;

const NavbarRight = styled.div`
    display: flex;
    align-items: center;
    margin-left: auto;

    @media (max-width: 768px) {
        justify-content: center;
        margin-left: 0;
        padding-top: 10px;
    }
`;

const NavbarItem = styled.div`
    //margin: 10px;
    //margin-left: 10px;
    cursor: pointer;
    padding: 10px;
    border-radius: 5px;
    display: flex;
    //align-items: center;

    &:hover {
        background-color: #dedede;
    }

    & > .material-icons {
        margin-right: 5px;
    }
`;

const AppName = styled.div`
    font-size: 24px;
    font-weight: bold;
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-right: 20px;
    margin-left: 10px;
`;

const Navbar = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { isLoggedIn, user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false); // Dropdown state
    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleAddJobClick = () => {
        setIsModalOpen(true);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <NavbarContainer>
            <NavbarToggle onClick={toggleDropdown}>
                <span className="material-icons">menu</span>
            </NavbarToggle>
            <NavbarItems isOpen={isOpen}>

            <AppName onClick={() => navigate('/')}>
                    <img src={atsfsIcon} alt="Icon" style={{ marginRight: '10px', width: '40px' }} />
                    ATSFS
                </AppName>
                {isLoggedIn && (
                    <>
                        <NavbarItem onClick={() => navigate('/job-applications')}>
                            <span className="material-icons">work</span>
                            Applications
                        </NavbarItem>
                        <NavbarItem onClick={handleAddJobClick}>
                            <span className="material-icons">add</span>
                            Add Application
                        </NavbarItem>
                        <NavbarItem onClick={() => navigate('/charts')}>
                            <span className="material-icons">bar_chart</span>
                            Charts
                        </NavbarItem>
                        <NavbarItem onClick={() => navigate('/ai-tools')}>
                            <span className="material-icons">build</span>
                            AI Tools
                        </NavbarItem>
                        <NavbarItem onClick={() => navigate('/resume')}>
                            <span className="material-icons">assignment_ind</span>
                            Resume
                        </NavbarItem>
                        <NavbarItem onClick={() => navigate('/exportData')}>
                            <span className="material-icons">file_download</span>
                            Export Data
                        </NavbarItem>
                    </>
                )}


            <AddJobApplication isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            <NavbarRight>
                {isLoggedIn && <div>Logged in as <strong>{user}</strong></div>}
                <NavbarItem onClick={isLoggedIn ? handleLogout : () => navigate('/login')}>
                    <span className="material-icons">{isLoggedIn ? 'logout' : 'login'}</span>
                    {isLoggedIn ? 'Logout' : 'Log in'}
                </NavbarItem>
            </NavbarRight>
            </NavbarItems>
        </NavbarContainer>
    );
};

export default Navbar;
