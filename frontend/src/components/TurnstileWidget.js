import React, { useState } from 'react';
import Turnstile from 'react-turnstile';
import {REACT_APP_TURNSTILE_SITE_KEY} from "../config";

const TurnstileWidget = ({ onChange }) => {
    const [turnstileToken, setTurnstileToken] = useState(null);

    const handleTurnstileChange = (turnstileToken) => {
        setTurnstileToken(turnstileToken);
        if (onChange) {
            onChange(turnstileToken); // Pass token back to parent component
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
