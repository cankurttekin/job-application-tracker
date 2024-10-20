import React, { useContext } from 'react';
import '../styles/Home.css';
import organizeImage from '../assets/organize.png';
import filterImage from '../assets/filter.png';
import starsImage from '../assets/stars.png';
import goalsImage from '../assets/goal.png';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Home = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useContext(AuthContext);

    const handleRegisterClick = () => {
        navigate('/register');
    };

    return (
        <div className="home-container">
            <div className="header-container">
                <div className="left-column">
                    <h2 className="big-text">Keep Track of Your Job Applications</h2>
                    <h2 className="big-text2">Application Tracking For Suckers</h2>
                </div>
                <div className="right-column">
                    <h3 className="small-text">Make your job hunt more organized — in one place.</h3>
                    {!isLoggedIn && (  // Conditionally render the Register button
                        <button className="register-button" onClick={handleRegisterClick}>
                            Register
                        </button>
                    )}
                </div>
            </div>

            <div className="illustrations-container">
                <div className="illustration-item">
                    <img src={organizeImage} alt="Illustration 1" className="illustration" />
                    <p className="illustration-text">Add jobs from any source you want</p>
                </div>
                <div className="illustration-item">
                    <img src={starsImage} alt="Illustration 2" className="illustration" />
                    <p className="illustration-text">Comment on your applications, star your favorites</p>
                </div>
                <div className="illustration-item">
                    <img src={filterImage} alt="Illustration 3" className="illustration" />
                    <p className="illustration-text">Filter and/or sort to view your applications</p>
                </div>
                <div className="illustration-item">
                    <img src={goalsImage} alt="Illustration 4" className="illustration" />
                    <p className="illustration-text">Land a job (hopefully)</p>
                </div>
            </div>

            <footer className="footer">
                <p>
                    <a href="https://can.kurttekin.com" target="_blank" rel="noopener noreferrer">cankurttekin</a>
                </p>
                <br/>
                <p>
                    This software is free and open-source, licensed under the terms of the&nbsp;
                    <a href="https://www.gnu.org/licenses/gpl-3.0.html" target="_blank" rel="noopener noreferrer">GNU
                        General Public License (GPL)</a>.<br/>
                    You can freely use, modify, and distribute it under the same terms.
                </p>
                <br/>
                <p>
                    <a href="https://github.com/cankurttekin/job-application-tracker" target="_blank" rel="noopener noreferrer">
                        Source Code
                    </a>
                </p>
            </footer>
        </div>
    );
};

export default Home;
