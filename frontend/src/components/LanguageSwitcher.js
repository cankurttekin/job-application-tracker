import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from "styled-components";

const Button = styled.button`
    margin-right: 2px;
    margin-left: 0;
    padding: 4px;
    background-color: transparent;
    color: black;
    //border: 1px solid #333;
    //box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    &:hover {
        background-color: #f5f5f5;
    }
`;

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
    };

    return (
        <div>
            <Button onClick={() => changeLanguage('en')}>EN</Button>
            <Button onClick={() => changeLanguage('tr')}>TR</Button>
        </div>
    );
};

export default LanguageSwitcher;
