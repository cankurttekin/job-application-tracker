import React, { useContext } from 'react';
import '../styles/Home.css';
import organizeImage from '../assets/organize.png';
import filterImage from '../assets/filter.png';
import starsImage from '../assets/stars.png';
import goalsImage from '../assets/goal.png';
import buyMeACoffeeImage from '../assets/buy-me-a-beer.png';
import seperator from '../assets/seperator.png';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import styled from "styled-components";
import screenshotImage from '../assets/screenshot1.png';
const Button = styled.button`
    margin-right: 0;
    margin-left: 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    &:hover {
        background-color: #333;
    }
`;

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
                    <h2 className="big-text2">Application Tracking System For Suckers</h2>
                </div>
                <div className="right-column">
                    <h3 className="small-text">Make your job hunt more organized — in one place.</h3>
                    {!isLoggedIn && (
                        <Button className="register-button" onClick={handleRegisterClick}>
                            Get ATSFS free
                        </Button>
                    )}
                </div>
            </div>

            <div className="illustrations-container">
                <div className="illustration-item">
                    <img src={organizeImage} alt="Illustration 1" className="illustration"/>
                    <p className="illustration-text">Add jobs from any source you want</p>
                </div>
                <div className="illustration-item">
                    <img src={starsImage} alt="Illustration 2" className="illustration"/>
                    <p className="illustration-text">Comment on your applications, star your favorites</p>
                </div>
                <div className="illustration-item">
                    <img src={filterImage} alt="Illustration 3" className="illustration"/>
                    <p className="illustration-text">Filter and/or sort to view your applications</p>
                </div>
                <div className="illustration-item">
                    <img src={goalsImage} alt="Illustration 4" className="illustration"/>
                    <p className="illustration-text">Land a job (hopefully)</p>
                </div>
            </div>

            <div className="screenshot-section">
                <div className="screenshot-container">
                    <img
                        src={screenshotImage}
                        alt="Screenshot of the application"
                        className="screenshot"
                    />
                </div>
                <div className="screenshot-text">
                    <h2 className="big-text">Why use ATSFS instead of spreadsheets or just good old notes?</h2>
                    <p className="big-text2">
                        ⚹<b>One convenient place</b> you can access from anywhere and any
                        device.<br/>
                        ⚹<b>Stay organized</b>, never miss an opportunity.<br/>
                        ⚹<b>Generate</b> personalized interview questions to prepare effectively.<br/>
                        ⚹<b>Analyze</b> your application stats.
                        <br/>
                    </p>
                </div>
            </div>

            <div className="support-container">
                <a href="https://www.buymeacoffee.com/cankurttekin" target="_blank" rel="noopener noreferrer">
                    <img
                        src={buyMeACoffeeImage}
                        alt="Buy Me a Coffee"
                        style={{height: '60px', width: 'auto'}}
                    />
                </a>
                <p style={{maxWidth: '600px', margin: 0}}>
                    This service is designed to help people in job hunt without any cost, if you want to support,
                    here is donation button stuff.
                </p>
            </div>

            <footer className="footer">
                <img src={seperator} alt="seperator" className="seperator"/>
                <p>
                    Application Tracking System For Suckers(ATSFS) made with despair and boredom by&nbsp;
                    <a href="https://can.kurttekin.com" target="_blank" rel="noopener noreferrer">cankurttekin</a>
                    &nbsp;to help me and you.
                </p>
                <br/>
                <p>
                    This software is free and open-source, licensed under the terms of the&nbsp;
                    <a href="https://www.gnu.org/licenses/gpl-3.0.html" target="_blank"
                       rel="noopener noreferrer">GNU
                        General Public License (GPL)</a>.<br/>
                    You can freely use, modify, and distribute it under the same terms.
                </p>
                <br/>
                <p style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <a href="https://github.com/cankurttekin/job-application-tracker" target="_blank"
                       rel="noopener noreferrer" style={{display: 'flex', alignItems: 'center'}}>
                        <span className="material-icons" style={{marginRight: '5px'}}>code</span>
                        Source Code
                    </a>
                </p>
            </footer>
        </div>
    );
};

export default Home;
