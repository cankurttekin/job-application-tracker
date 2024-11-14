import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import AddJobApplication from './AddJobApplication';
import { AuthContext } from '../contexts/AuthContext';
import atsfsIcon from '../assets/atsfs.png';
import LanguageSwitcher from "./LanguageSwitcher"; // Import the useTranslation hook

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
    border-bottom: 1px solid ${({ scrolled }) => (scrolled ? '#e5e5e5' : 'transparent')}; /* Change border based on scrolled state */
    z-index: 1000;
    transition: border-bottom 0.3s; /* Smooth transition for border */
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
        padding: 10px 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        z-index: 1001;
    }
`;

const NavbarToggle = styled.button`
    display: none;
    background: none;
    border: none;
    font-size: 28px;
    cursor: pointer;
    color: #2f2f2f;
    border-radius: 0;
    width: 22px;
    height: 100%;
    margin: 0;
    padding: 0;

    @media (max-width: 768px) {
        display: block;
    }

    &:hover {
        background-color: transparent;
    }
`;

const NavbarRight = styled.div`
    display: flex;
    align-items: center;
    margin-left: 16px;

    @media (max-width: 768px) {
        justify-content: center;
        margin-left: 0;
        padding-top: 10px;
    }
`;

const NavbarItem = styled.div`
    cursor: pointer;
    padding: 10px;
    border-radius: 5px;
    display: flex;

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
    margin-left: 2px;
`;

const Navbar = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { isLoggedIn, user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false); // Dropdown state
    const [scrolled, setScrolled] = useState(false); // State to track scroll position

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleAddJobClick = () => {
        setIsModalOpen(true);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleNavigation = (path) => {
        toggleDropdown();  // Always toggle the dropdown before navigating
        navigate(path);    // Then navigate to the provided path
    };

    // Scroll event listener to update the scrolled state
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 0); // Set scrolled to true if window is scrolled down
        };

        window.addEventListener('scroll', handleScroll); // Add scroll event listener
        return () => {
            window.removeEventListener('scroll', handleScroll); // Cleanup listener on unmount
        };
    }, []);

    return (
        <NavbarContainer scrolled={scrolled}>
            <AppName onClick={() => navigate('/')}>
                <img src={atsfsIcon} alt="Icon" style={{ marginRight: '10px', width: '40px' }} />
                ATSFS
            </AppName>
            <NavbarToggle onClick={toggleDropdown}>
                <span className="material-icons">menu</span>
            </NavbarToggle>
            <NavbarItems isOpen={isOpen}>
                {isLoggedIn && (
                    <>
                        <NavbarItem onClick={() => handleNavigation('/job-applications')}>
                            <span className="material-icons">work</span>
                            Applications
                        </NavbarItem>
                        <NavbarItem onClick={() => {toggleDropdown(); handleAddJobClick();}}>
                            <span className="material-icons">add</span>
                            Add
                        </NavbarItem>
                        <NavbarItem onClick={() => handleNavigation('/charts')}>
                            <span className="material-icons">bar_chart</span>
                            Stats
                        </NavbarItem>
                        <NavbarItem onClick={() => handleNavigation('/ai-tools')}>
                            <span className="material-icons">build</span>
                            AI
                        </NavbarItem>
                        <NavbarItem onClick={() => handleNavigation('/resume')}>
                            <span className="material-icons">assignment_ind</span>
                            Resume
                        </NavbarItem>
                        <NavbarItem onClick={() => handleNavigation('/export')}>
                            <span className="material-icons">file_download</span>
                            Export
                        </NavbarItem>

                    </>

                )}
                <LanguageSwitcher></LanguageSwitcher>
                <AddJobApplication isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
                <NavbarRight>
                    {isLoggedIn && <div style={{marginRight: '2px',}}>Logged in as <strong>{user}</strong></div>}
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
