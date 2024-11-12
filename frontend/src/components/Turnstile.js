import React, { useEffect } from 'react';

const Turnstile = ({ siteKey, onVerify }) => {
    useEffect(() => {
        // Check if Turnstile script is already loaded
        if (!document.querySelector("script[src='https://challenges.cloudflare.com/turnstile/v0/api.js']")) {
            const script = document.createElement("script");
            script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);
        }

        // Initialize Turnstile widget after script loads
        const onLoad = () => {
            if (window.turnstile) {
                window.turnstile.render('#turnstile-widget', {
                    sitekey: siteKey,
                    callback: onVerify,
                });
            }
        };

        // Check if script has already loaded
        if (window.turnstile) {
            onLoad();
        } else {
            window.addEventListener("load", onLoad);
        }

        return () => {
            window.removeEventListener("load", onLoad);
        };
    }, [siteKey, onVerify]);

    return <div id="turnstile-widget" className="cf-turnstile"></div>;
};

export default Turnstile;
