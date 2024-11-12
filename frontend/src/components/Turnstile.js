import React, { useEffect, useRef, useState } from 'react';

const Turnstile = ({ siteKey, onVerify }) => {
    const [captchaLoaded, setCaptchaLoaded] = useState(false);
    const captchaRef = useRef(null);
    const turnstileRendered = useRef(false); // Ref to track if Turnstile is already rendered

    useEffect(() => {
        // Load the Turnstile script if not already loaded
        const handleLoad = () => {
            setCaptchaLoaded(true);
        };

        if (window.turnstile && window.turnstile.render) {
            handleLoad();
        } else {
            const script = document.createElement('script');
            script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
            script.async = true;
            script.defer = true;
            script.onload = handleLoad;
            document.body.appendChild(script);
        }

        return () => {
            // Cleanup: No need to remove the script as it should be loaded only once
        };
    }, []);

    useEffect(() => {
        if (captchaLoaded && siteKey && !turnstileRendered.current) {
            // Render the Turnstile widget only if it hasn't been rendered already
            if (captchaRef.current) {
                window.turnstile.render(captchaRef.current, {
                    sitekey: siteKey,
                    callback: onVerify,
                });
                turnstileRendered.current = true; // Mark as rendered
            }
        }
    }, [captchaLoaded, siteKey, onVerify]);

    return <div ref={captchaRef} />;
};

export default Turnstile;
