// @ts-nocheck
export function cleanFortress(e) {
    if (!e || !e.querySelectorAll) return;

    const o = e.querySelector("#fortressdesign");
    if (o) {
        console.log("🔐 Fortress-Schutz aktiv");
        injectNoCacheMeta();
        blockFrameUsage();
    }

    // Add function to set a cookie with user's consent
    const setCookie = (name, value, days) => {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=None; Secure";
    };

    // Show cookie consent banner
    const showCookieBanner = () => {
        const banner = document.createElement("div");
        banner.className = "cookie-banner";
        banner.innerHTML = `
            <div>
                🍪 Diese Website verwendet Cookies für Technik & – mit Zustimmung – Google Analytics.
            </div>
            <div>
                <button class="cookie-accept">Zustimmen</button>
                <button class="cookie-decline">Ablehnen</button>
            </div>
        `;
        document.body.appendChild(banner);
        
        banner.querySelector(".cookie-accept").addEventListener("click", () => {
            setCookie("cookieConsent", "accepted", 365);
            banner.remove();
            loadAnalytics();
        });

        banner.querySelector(".cookie-decline").addEventListener("click", () => {
            setCookie("cookieConsent", "declined", 365);
            banner.remove();
            console.log("🚫 Analytics abgelehnt");
        });
    };

    // Load Analytics if cookies are accepted
    const loadAnalytics = () => {
        console.log("📊 Lade Google Analytics...");
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=G-JYCZLWZZVD'; // Deine GA-ID
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'G-JYCZLWZZVD'); // GA-ID auch hier

        console.log("✅ Google Analytics aktiviert");
    };

    const cookieConsent = document.cookie.split('; ').find(row => row.startsWith('cookieConsent='));
    if (cookieConsent && cookieConsent.split('=')[1] === "accepted") {
        loadAnalytics();
    } else {
        showCookieBanner();
    }
}
