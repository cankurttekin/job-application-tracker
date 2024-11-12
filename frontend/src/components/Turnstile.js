import React, { useEffect, useRef, useState } from 'react';

const Turnstile = ({ siteKey, onVerify }) => {
    const [captchaLoaded, setCaptchaLoaded] = useState(false);
    const captchaRef = useRef(null);

    useEffect(() => {
        // Ensure the script is loaded and Turnstile is initialized
        const handleLoad = () => {
            setCaptchaLoaded(true);
        };

        if (window.turnstile && window.turnstile.render) {
            handleLoad();
        } else {
            // Check if the script is loaded
            const script = document.createElement('script');
            script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
            script.async = true;
            script.defer = true;
            script.onload = handleLoad;
            document.body.appendChild(script);
        }

        return () => {
            // Cleanup: we don't need to handle removal of the script as it's loaded only once globally
        };
    }, []);

    useEffect(() => {
        if (captchaLoaded && siteKey) {
            // Render the Turnstile widget after the script has loaded
            if (captchaRef.current) {
                window.turnstile.render(captchaRef.current, {
                    sitekey: siteKey,
                    callback: onVerify, // callback when captcha is successfully verified
                });
            }
        }
    }, [captchaLoaded, siteKey, onVerify]);

    return <div ref={captchaRef} />;
};

export default Turnstile;
