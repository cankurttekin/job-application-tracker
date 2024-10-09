import React from 'react';
import { Link } from 'react-router-dom';
import { logout } from '../services/authService';

const Navbar = () => {
  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <nav style={{ backgroundColor: 'black', color: 'white', padding: '10px' }}>
      <Link to="/job-applications" style={{ color: 'white', marginRight: '20px' }}>Job Applications</Link>
      <Link to="/add-job-application" style={{ color: 'white', marginRight: '20px' }}>Add Job Application</Link>
      <button onClick={handleLogout} style={{ color: 'white', backgroundColor: 'black', border: 'none' }}>Logout</button>
    </nav>
  );
};

export default Navbar;
