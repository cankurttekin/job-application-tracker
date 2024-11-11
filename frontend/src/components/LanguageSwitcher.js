import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from "styled-components";

const Button = styled.button`
    padding: 4px;
    background-color: transparent;
    color: black;
    &:hover {
        background-color: #dedede;
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
