import React from 'react';
import '../styles/Home.css'; // Import a CSS file for styles
import organizeImage from '../assets/organize.png'; // Import the image
import filterImage from '../assets/filter.png'; // Import the image
import starsImage from '../assets/stars.png'; // Import the image
import goalsImage from '../assets/goal.png'; // Import the image
import glpImage from '../assets/gplv3.png'; // Import the image

const Home = () => {
    return (
        <div className="home-container">
            <div className="header-container">
                <div className="left-column">
                    <h2 className="big-text">Keep Track of Your Job Applications</h2>
                    <h2 className="big-text2">Application Tracking For Suckers</h2>
                </div>
                <div className="right-column">
                    <h3 className="small-text">Make your job hunt more organized — in one place.</h3>
                    <a href="/register" className="register-button">Register</a>
                </div>
            </div>

            <div className="illustrations-container">
                <div className="illustration-item">
                    <img src={organizeImage} alt="Illustration 1" className="illustration" />
                    <p className="illustration-text">Add jobs from anywhere you want(LinkedIn, Kariyer, Emails..)</p>
                </div>
                <div className="illustration-item">
                    <img src={starsImage} alt="Illustration 2" className="illustration" />
                    <p className="illustration-text">Add comments on your job applications like rating interview questions, your answers, what would you want to change etc.</p>
                </div>
                <div className="illustration-item">
                    <img src={filterImage} alt="Illustration 3" className="illustration" />
                    <p className="illustration-text">Use filters to view your all of your applications</p>
                </div>
                <div className="illustration-item">
                    <img src={goalsImage} alt="Illustration 4" className="illustration" />
                    <p className="illustration-text">Achieve Your Goals</p>
                </div>
            </div>

            <footer className="footer">
                <p><a href="https://can.kurttekin.com" target="_blank" rel="noopener noreferrer">cankurttekin</a></p>
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
                <p>
                    <img src={require('../assets/gplv3.png')} alt="GPL v3 License" className="gpl-logo"/>
                </p>
            </footer>
        </div>
    );
};

export default Home;
