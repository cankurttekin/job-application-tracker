import React, { useEffect } from 'react';

const Turnstile = ({ siteKey, onVerify }) => {
    useEffect(() => {
        // Load the Turnstile script only once
        const script = document.createElement("script");
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            // Cleanup script when component unmounts
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div
            className="cf-turnstile"
            data-sitekey={siteKey}
            data-callback={onVerify}
        ></div>
    );
};

export default Turnstile;
