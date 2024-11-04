import React, { useContext } from 'react';
import '../styles/Home.css';
import organizeImage from '../assets/organize.png';
import filterImage from '../assets/filter.png';
import starsImage from '../assets/stars.png';
import goalsImage from '../assets/goal.png';
import buyMeACoffeeImage from '../assets/buy-me-a-beer.png';
import separator from '../assets/seperator.png';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import styled from "styled-components";
import screenshotImage from '../assets/screenshot1.png';
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';
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
    const { t } = useTranslation(); // Use the hook

    const handleRegisterClick = () => {
        navigate('/register');
    };

    return (
        <div className="home-container">
            <div className="header-container">
                <div className="left-column">
                    <h2 className="big-text">{t('header.title')}</h2>
                    <h2 className="big-text2">{t('header.subtitle')}</h2>
                </div>
                <div className="right-column">
                    <h3 className="small-text">{t('header.description')}</h3>
                    {!isLoggedIn && (
                        <Button className="register-button" onClick={handleRegisterClick}>
                            {t('header.buttonText')}
                        </Button>
                    )}
                </div>
            </div>

            <div className="illustrations-container">
                <div className="illustration-item">
                    <img src={organizeImage} alt="Illustration 1" className="illustration"/>
                    <p className="illustration-text">{t('illustrations.job_source')}</p>
                </div>
                <div className="illustration-item">
                    <img src={starsImage} alt="Illustration 2" className="illustration"/>
                    <p className="illustration-text">{t('illustrations.comment')}</p>
                </div>
                <div className="illustration-item">
                    <img src={filterImage} alt="Illustration 3" className="illustration"/>
                    <p className="illustration-text">{t('illustrations.filter')}</p>
                </div>
                <div className="illustration-item">
                    <img src={goalsImage} alt="Illustration 4" className="illustration"/>
                    <p className="illustration-text">{t('illustrations.goal')}</p>
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
                    <h2 className="big-text">{t('hero.title')}</h2>
                    <p className="big-text2">
                        ⚹<Trans i18nKey="hero.point1" components={{ bold: <b /> }} /><br/>
                        ⚹<Trans i18nKey="hero.point2" components={{ bold: <b /> }} /><br/>
                        ⚹<Trans i18nKey="hero.point3" components={{ bold: <b /> }} /><br/>
                        ⚹<Trans i18nKey="hero.point4" components={{ bold: <b /> }} /><br/>
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
                    {t('support.text')}
                </p>
            </div>

            <footer className="footer">
                <img src={separator} alt="seperator" className="seperator"/>
                <p>
                    {t('footer.description')}
                </p>
                <br/>
                <p>
                    This software is free and open-source, licensed under the terms of the&nbsp;
                    <a href="https://www.gnu.org/licenses/gpl-3.0.html" target="_blank" rel="noopener noreferrer">GNU
                        General Public License (GPL)</a>.<br/>
                    You can freely use, modify, and distribute it under the same terms.
                </p>
                <br/>
                <p style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <a href="https://github.com/cankurttekin/job-application-tracker" target="_blank" rel="noopener noreferrer" style={{display: 'flex', alignItems: 'center'}}> <span className="material-icons" style={{marginRight: '5px'}}>code</span> Source Code </a>
                </p>
            </footer>
        </div>

            );
        };

export default Home;