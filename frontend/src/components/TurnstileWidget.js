import React, { useState } from 'react';
import Turnstile from 'react-turnstile';
import {REACT_APP_TURNSTILE_SITE_KEY} from "../config";

const TurnstileWidget = ({ onChange }) => {
    const [token, setToken] = useState(null);

    const handleTurnstileChange = (value) => {
        setToken(value);
        if (onChange) {
            onChange(value); // Pass token back to parent component
        }
    };

    return (
        <div>
            <Turnstile
                sitekey={REACT_APP_TURNSTILE_SITE_KEY}
                onChange={handleTurnstileChange}
            />
        </div>
    );
};

export default TurnstileWidget;
