import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleGoogleLoginCallback } from '../services/authService';

const GoogleCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Extract the 'code' from the URL query parameters
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            handleGoogleLoginCallback(code)
                .then(() => {
                    navigate('/job-applications'); // Redirect after successful login
                })
                .catch((error) => {
                    console.error('Google login failed:', error);
                    alert('Google login failed. Please try again.');
                });
        } else {
            alert('Invalid Google login code.');
        }
    }, [navigate]);

    return <div>Loading...</div>;
};

export default GoogleCallback;
