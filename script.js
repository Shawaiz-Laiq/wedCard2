
/* =========================================================
   AHMED WEDS LIBA
   PREMIUM WEDDING INVITATION
   MAIN JAVASCRIPT
========================================================= */


/* =========================================================
   01. SELECT HTML ELEMENTS
========================================================= */

const introScreen = document.getElementById("introScreen");

const invitationPage = document.getElementById("invitationPage");

const openInvitationButton = document.getElementById("openInvitation");

const introLights = document.getElementById("introLights");

const scrollLights = document.getElementById("scrollLights");

const scrollGuide = document.getElementById("scrollGuide");

const backToTop = document.getElementById("backToTop");

const mobileMenuButton = document.getElementById("mobileMenuButton");

const mainNavigation = document.querySelector(".main-navigation");

const rsvpForm = document.getElementById("rsvpForm");

const rsvpStatus = document.getElementById("rsvpStatus");


/* =========================================================
   02. GLOBAL SETTINGS
========================================================= */

const SETTINGS = {
    totalLights: 45,
    countdownDate: "2027-01-01T19:00:00",
    scrollPauseDelay: 850,
    scrollGuideDelay: 1100,
    whatsappNumber: "923001234567"
};

let invitationOpened = false;

let scrollTimer = null;

let scrollGuideTimer = null;

let scrollFrameRequested = false;

let countdownInterval = null;


/* =========================================================
   03. HELPER FUNCTIONS
========================================================= */

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function randomInteger(min, max) {
    return Math.floor(randomNumber(min, max + 1));
}

function getElement(id) {
    return document.getElementById(id);
}

function setText(id, value) {
    const element = getElement(id);

    if (element) {
        element.textContent = value;
    }
}

function padNumber(number) {
    return String(number).padStart(2, "0");
}


/* =========================================================
   04. CREATE INTRO LIGHTS
========================================================= */

function createIntroLights() {

    if (!introLights) {
        return;
    }

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < SETTINGS.totalLights; i++) {

        const light = document.createElement("span");

        light.className = "intro-light";

        const size = randomNumber(3, 8);

        const left = randomNumber(2, 98);

        const top = randomNumber(2, 96);

        const speed = randomNumber(1.5, 4);

        const delay = randomNumber(0, 3);

        light.style.left = `${left}%`;

        light.style.top = `${top}%`;

        light.style.setProperty(
            "--light-size",
            `${size}px`
        );

        light.style.setProperty(
            "--light-speed",
            `${speed}s`
        );

        light.style.setProperty(
            "--light-delay",
            `${delay}s`
        );

        fragment.appendChild(light);
    }

    introLights.appendChild(fragment);
}


/* =========================================================
   04B. INTRO SPARKLES (canvas) + CENTRE BURST
========================================================= */

const sparkleCanvas = document.getElementById("introSparkles");

let sparkleCtx = null;
let sparkles = [];
let sparkleRunning = false;
let sparkleWidth = 0;
let sparkleHeight = 0;

function resizeSparkles() {

    if (!sparkleCanvas || !sparkleCtx) {
        return;
    }

    const ratio = Math.min(window.devicePixelRatio || 1, 2);

    sparkleWidth = window.innerWidth;
    sparkleHeight = window.innerHeight;

    sparkleCanvas.width = sparkleWidth * ratio;
    sparkleCanvas.height = sparkleHeight * ratio;

    sparkleCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function makeSparkle(burst) {

    const colors = ["255,236,170", "255,210,120", "255,255,255", "255,190,160"];

    const sparkle = {
        x: randomNumber(0, sparkleWidth),
        y: randomNumber(0, sparkleHeight),
        size: randomNumber(1, 3.6),
        vx: randomNumber(-0.15, 0.15),
        vy: randomNumber(-0.55, -0.1),
        phase: randomNumber(0, Math.PI * 2),
        twinkle: randomNumber(0.03, 0.09),
        color: colors[randomInteger(0, colors.length - 1)],
        star: Math.random() > 0.72,
        life: 1,
        decay: 0,
        burst: false
    };

    if (burst) {
        sparkle.x = sparkleWidth / 2 + randomNumber(-6, 6);
        sparkle.y = randomNumber(0, sparkleHeight);
        sparkle.vx = (Math.random() > 0.5 ? 1 : -1) * randomNumber(2, 9);
        sparkle.vy = randomNumber(-1.5, 1.5);
        sparkle.size = randomNumber(1.5, 4.5);
        sparkle.decay = randomNumber(0.008, 0.02);
        sparkle.burst = true;
    }

    return sparkle;
}

function drawSparkle(s) {

    const alpha = Math.min(
        1,
        Math.max(0, (0.35 + Math.sin(s.phase) * 0.35) * s.life + (s.burst ? 0.4 * s.life : 0))
    );

    sparkleCtx.fillStyle = `rgba(${s.color},${alpha})`;
    sparkleCtx.shadowColor = `rgba(${s.color},0.9)`;
    sparkleCtx.shadowBlur = s.size * 4;

    sparkleCtx.beginPath();

    if (s.star) {

        const r = s.size * 2.6;

        sparkleCtx.moveTo(s.x, s.y - r);
        sparkleCtx.quadraticCurveTo(s.x, s.y, s.x + r, s.y);
        sparkleCtx.quadraticCurveTo(s.x, s.y, s.x, s.y + r);
        sparkleCtx.quadraticCurveTo(s.x, s.y, s.x - r, s.y);
        sparkleCtx.quadraticCurveTo(s.x, s.y, s.x, s.y - r);

    } else {

        sparkleCtx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    }

    sparkleCtx.fill();
}

function sparkleLoop() {

    if (!sparkleRunning) {
        return;
    }

    sparkleCtx.clearRect(0, 0, sparkleWidth, sparkleHeight);

    sparkles = sparkles.filter(s => s.life > 0);

    sparkles.forEach(s => {

        s.x += s.vx;
        s.y += s.vy;
        s.phase += s.twinkle;

        if (s.burst) {
            s.vx *= 0.975;
            s.life -= s.decay;
        } else {
            if (s.y < -10) { s.y = sparkleHeight + 10; }
            if (s.x < -10) { s.x = sparkleWidth + 10; }
            if (s.x > sparkleWidth + 10) { s.x = -10; }
        }

        drawSparkle(s);
    });

    requestAnimationFrame(sparkleLoop);
}

function startSparkles() {

    if (!sparkleCanvas || sparkleRunning) {
        return;
    }

    sparkleCtx = sparkleCanvas.getContext("2d");

    resizeSparkles();

    window.addEventListener("resize", resizeSparkles);

    const total = sparkleWidth < 600 ? 70 : 130;

    for (let i = 0; i < total; i++) {
        sparkles.push(makeSparkle(false));
    }

    sparkleRunning = true;

    requestAnimationFrame(sparkleLoop);
}

function burstSparkles() {

    if (!sparkleRunning) {
        return;
    }

    const total = sparkleWidth < 600 ? 120 : 220;

    for (let i = 0; i < total; i++) {
        sparkles.push(makeSparkle(true));
    }

    setTimeout(() => {
        sparkleRunning = false;
        window.removeEventListener("resize", resizeSparkles);
    }, 3200);
}


/* =========================================================
   05. OPEN WEDDING INVITATION
========================================================= */

function openInvitation() {

    if (invitationOpened) {
        return;
    }

    invitationOpened = true;

    if (openInvitationButton) {
        openInvitationButton.disabled = true;
    }

    if (introScreen) {

        introScreen.classList.add("opening");

        burstSparkles();

        setTimeout(() => {

            introScreen.classList.add("opened");

        }, 2600);

    }

    if (invitationPage) {

        setTimeout(() => {

            invitationPage.classList.add("visible");

            document.body.style.overflow = "auto";

            window.scrollTo({
                top: 0,
                behavior: "instant"
            });

            startRevealObserver();

        }, 2300);

    }
}


/* =========================================================
   06. OPEN BUTTON EVENT
========================================================= */

if (openInvitationButton) {

    openInvitationButton.addEventListener(
        "click",
        openInvitation
    );

}


/* =========================================================
   07. COUNTDOWN TIMER
========================================================= */

function updateCountdown() {

    const targetDate = new Date(
        SETTINGS.countdownDate
    ).getTime();

    const currentDate = Date.now();

    const difference = targetDate - currentDate;

    if (difference <= 0) {

        setText("days", "00");

        setText("hours", "00");

        setText("minutes", "00");

        setText("seconds", "00");

        setText(
            "countdownMessage",
            "Today is the beautiful wedding celebration!"
        );

        if (countdownInterval) {
            clearInterval(countdownInterval);
        }

        return;
    }

    const days = Math.floor(
        difference / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
        (difference / (1000 * 60 * 60)) % 24
    );

    const minutes = Math.floor(
        (difference / (1000 * 60)) % 60
    );

    const seconds = Math.floor(
        (difference / 1000) % 60
    );

    setText("days", padNumber(days));

    setText("hours", padNumber(hours));

    setText("minutes", padNumber(minutes));

    setText("seconds", padNumber(seconds));
}


/* =========================================================
   08. START COUNTDOWN
========================================================= */

function startCountdown() {

    updateCountdown();

    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    countdownInterval = setInterval(
        updateCountdown,
        1000
    );

}


/* =========================================================
   09. REVEAL OBSERVER
========================================================= */

let revealObserver = null;

function startRevealObserver() {

    const revealElements = document.querySelectorAll(
        ".reveal"
    );

    if (!("IntersectionObserver" in window)) {

        revealElements.forEach(element => {
            element.classList.add("active");
        });

        return;
    }

    if (revealObserver) {
        revealObserver.disconnect();
    }

    revealObserver = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("active");

                    observer.unobserve(entry.target);

                }

            });

        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -35px 0px"
        }
    );

    revealElements.forEach(element => {

        revealObserver.observe(element);

    });

}


/* =========================================================
   10. MOBILE NAVIGATION
========================================================= */

function toggleMobileMenu() {

    if (!mainNavigation) {
        return;
    }

    mainNavigation.classList.toggle("menu-open");

}

if (mobileMenuButton) {

    mobileMenuButton.addEventListener(
        "click",
        toggleMobileMenu
    );

}


/* =========================================================
   11. CLOSE MOBILE MENU AFTER CLICK
========================================================= */

function closeMobileMenu() {

    if (!mainNavigation) {
        return;
    }

    mainNavigation.classList.remove("menu-open");

}

if (mainNavigation) {

    const navigationLinks = mainNavigation.querySelectorAll("a");

    navigationLinks.forEach(link => {

        link.addEventListener(
            "click",
            closeMobileMenu
        );

    });

}


/* =========================================================
   12. SCROLL LIGHTS
========================================================= */

function hideScrollLights() {

    if (!scrollLights) {
        return;
    }

    scrollLights.classList.remove("visible");

}

function showScrollLights() {

    if (!scrollLights || !invitationOpened) {
        return;
    }

    scrollLights.classList.add("visible");

}


/* =========================================================
   13. SCROLL GUIDE
========================================================= */

function hideScrollGuide() {

    if (!scrollGuide) {
        return;
    }

    scrollGuide.classList.remove("visible");

}

function showScrollGuide() {

    if (!scrollGuide || !invitationOpened) {
        return;
    }

    const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 120;

    if (!nearBottom) {
        scrollGuide.classList.add("visible");
    }

}


/* =========================================================
   14. HANDLE SCROLL PAUSE
========================================================= */

function handleScrollPause() {

    hideScrollLights();

    hideScrollGuide();

    clearTimeout(scrollTimer);

    clearTimeout(scrollGuideTimer);

    scrollTimer = setTimeout(() => {

        showScrollLights();

    }, SETTINGS.scrollPauseDelay);

    scrollGuideTimer = setTimeout(() => {

        showScrollGuide();

    }, SETTINGS.scrollGuideDelay);

}


/* =========================================================
   15. SCROLL POSITION UPDATES
========================================================= */

function updateScrollPosition() {

    const currentScroll = window.scrollY;

    if (backToTop) {

        if (currentScroll > 500) {

            backToTop.classList.add("visible");

        } else {

            backToTop.classList.remove("visible");

        }

    }

    if (currentScroll >= 100) {

        hideScrollGuide();

    }

    scrollFrameRequested = false;

}


/* =========================================================
   16. OPTIMIZED SCROLL EVENT
========================================================= */

window.addEventListener(
    "scroll",
    () => {

        if (!scrollFrameRequested) {

            window.requestAnimationFrame(() => {

                updateScrollPosition();

            });

            scrollFrameRequested = true;

        }

        if (invitationOpened) {

            handleScrollPause();

        }

    },
    {
        passive: true
    }
);


/* =========================================================
   17. BACK TO TOP
========================================================= */

function goToTop() {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

if (backToTop) {

    backToTop.addEventListener(
        "click",
        goToTop
    );

}


/* =========================================================
   18. RSVP FORM
========================================================= */

// function handleRSVP(event) {

//     event.preventDefault();

//     if (!rsvpForm) {
//         return;
//     }

//     const guestName = getElement("guestName").value.trim();

//     const guestCount = getElement("guestCount").value;

//     const attendance = getElement("attendance").value;

//     const guestMessage = getElement("guestMessage").value.trim();

//     if (!guestName || !guestCount || !attendance) {

//         if (rsvpStatus) {
//             rsvpStatus.textContent =
//                 "Please complete all required fields.";
//         }

//         return;
//     }

//     const message = [
//         "Wedding RSVP - Ahmed & Liba",
//         "",
//         `Name: ${guestName}`,
//         `Guests: ${guestCount}`,
//         `Attendance: ${attendance}`,
//         `Message: ${guestMessage || "No additional message"}`
//     ].join("\n");

//     const whatsappURL =
//         `https://wa.me/${SETTINGS.whatsappNumber}?text=${encodeURIComponent(message)}`;

//     if (rsvpStatus) {

//         rsvpStatus.textContent =
//             "Opening WhatsApp to send your RSVP...";

//     }

//     window.open(
//         whatsappURL,
//         "_blank",
//         "noopener,noreferrer"
//     );

// }


/* =========================================================
   19. RSVP EVENT
========================================================= */

// if (rsvpForm) {

//     rsvpForm.addEventListener(
//         "submit",
//         handleRSVP
//     );

// }


/* =========================================================
   20. CREATE FLOATING PETALS
========================================================= */

function createPetals() {

    const petalsContainer = getElement("heroPetals");

    if (!petalsContainer) {
        return;
    }

    const isMobile = window.innerWidth <= 600;

    const totalPetals = isMobile ? 8 : 15;

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < totalPetals; i++) {

        const petal = document.createElement("span");

        petal.className = "floating-petal";

        petal.style.left = `${randomNumber(0, 100)}%`;

        petal.style.animationDuration =
            `${randomNumber(7, 14)}s`;

        petal.style.animationDelay =
            `${randomNumber(0, 10)}s`;

        petal.style.setProperty(
            "--petal-size",
            `${randomNumber(6, 12)}px`
        );

        fragment.appendChild(petal);

    }

    petalsContainer.appendChild(fragment);

}


/* =========================================================
   21. DYNAMIC PETAL STYLE
========================================================= */

const petalStyle = document.createElement("style");

petalStyle.textContent = `
    .hero-floating-petals {
        position: absolute;
        inset: 0;
        z-index: 2;
        overflow: hidden;
        pointer-events: none;
    }

    .floating-petal {
        position: absolute;
        top: -20px;
        width: var(--petal-size);
        height: calc(var(--petal-size) * 1.5);
        border-radius: 100% 0 100% 0;
        background: rgba(255, 218, 164, 0.65);
        animation: petalFall linear infinite;
        will-change: transform;
    }

    @keyframes petalFall {
        0% {
            transform: translate3d(0, -20px, 0) rotate(0deg);
            opacity: 0;
        }

        15% {
            opacity: 0.8;
        }

        85% {
            opacity: 0.7;
        }

        100% {
            transform: translate3d(50px, 750px, 0) rotate(300deg);
            opacity: 0;
        }
    }
`;

document.head.appendChild(petalStyle);


/* =========================================================
   22. IMAGE LAZY LOADING SUPPORT
========================================================= */

function prepareImages() {

    const images = document.querySelectorAll(
        "img"
    );

    images.forEach(image => {

        if (!image.hasAttribute("loading")) {

            image.setAttribute(
                "loading",
                "lazy"
            );

        }

        image.addEventListener(
            "error",
            () => {

                image.style.opacity = "0.35";

                image.alt = "Wedding image unavailable";

            },
            {
                once: true
            }
        );

    });

}


/* =========================================================
   23. HANDLE PAGE VISIBILITY
========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if (document.hidden) {

            clearTimeout(scrollTimer);

            clearTimeout(scrollGuideTimer);

            hideScrollLights();

            hideScrollGuide();

        } else if (invitationOpened) {

            handleScrollPause();

        }

    }
);


/* =========================================================
   24. STOP SCROLL EFFECT AT PAGE BOTTOM
========================================================= */

function isAtPageBottom() {

    const scrollPosition =
        window.scrollY + window.innerHeight;

    const pageHeight =
        document.documentElement.scrollHeight;

    return scrollPosition >= pageHeight - 100;

}


/* =========================================================
   25. BOTTOM SCROLL CHECK
========================================================= */

window.addEventListener(
    "scroll",
    () => {

        if (isAtPageBottom()) {

            hideScrollGuide();

        }

    },
    {
        passive: true
    }
);


/* =========================================================
   26. PREVENT DOUBLE FORM SUBMISSION
========================================================= */

let formSubmitting = false;

if (rsvpForm) {

    rsvpForm.addEventListener(
        "submit",
        () => {

            if (formSubmitting) {
                return;
            }

            formSubmitting = true;

            setTimeout(() => {

                formSubmitting = false;

            }, 2500);

        }
    );

}


/* =========================================================
   27. INITIALIZE WEBSITE
========================================================= */

function initializeWebsite() {

    createIntroLights();

    startSparkles();

    createPetals();

    startCountdown();

    prepareImages();

    if (invitationPage) {

        invitationPage.classList.remove("visible");

    }

    if (document.body) {

        document.body.style.overflow = "hidden";

    }

}


/* =========================================================
   28. DOM READY
========================================================= */

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initializeWebsite,
        {
            once: true
        }
    );

} else {

    initializeWebsite();

}


/* =========================================================
   29. HANDLE WINDOW RESIZE
========================================================= */

let resizeTimer = null;

window.addEventListener(
    "resize",
    () => {

        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(() => {

            const petalsContainer = getElement("heroPetals");

            if (petalsContainer) {

                petalsContainer.innerHTML = "";

                createPetals();

            }

        }, 250);

    },
    {
        passive: true
    }
);


/* =========================================================
   30. CLEANUP
========================================================= */

window.addEventListener(
    "pagehide",
    () => {

        clearInterval(countdownInterval);

        clearTimeout(scrollTimer);

        clearTimeout(scrollGuideTimer);

        clearTimeout(resizeTimer);

        if (revealObserver) {

            revealObserver.disconnect();

        }

    }
);

/* =========================================================
   RSVP POPUP + FORM - NO WHATSAPP, ONLY CLOSE
========================================================= */

const rsvpModal = document.getElementById('rsvpModal');
const openRsvpBtn = document.getElementById('openRsvpBtn');
const closeRsvpBtn = document.getElementById('closeRsvpBtn');
// const rsvpForm = document.getElementById('rsvpForm');
// const rsvpStatus = document.getElementById('rsvpStatus');

// Popup kholo
if(openRsvpBtn && rsvpModal){
    openRsvpBtn.addEventListener('click', () => {
        rsvpModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    });
}

// Popup band karo
function closeRsvp(){
    if(!rsvpModal) return;
    rsvpModal.classList.remove('open');
    document.body.style.overflow = '';
}

if(closeRsvpBtn){
    closeRsvpBtn.addEventListener('click', closeRsvp);
}

// Bahar click kare to band
if(rsvpModal){
    rsvpModal.addEventListener('click', (e) => {
        if(e.target === rsvpModal) closeRsvp();
    });
}

// FORM SUBMIT - WhatsApp NAHI, sirf CLOSE
// if(rsvpForm){
//     rsvpForm.addEventListener('submit', (e) => {
//         e.preventDefault();

//         const guestName = document.getElementById('guestName').value.trim();
//         const guestCount = document.getElementById('guestCount').value;
//         const attendance = document.getElementById('attendance').value;

//         if(!guestName || !guestCount || !attendance){
//             if(rsvpStatus) rsvpStatus.textContent = "Please complete all required fields.";
//             return;
//         }

//         if(rsvpStatus){
//             rsvpStatus.textContent = "Thank you " + guestName + "! Your RSVP has been received ♥";
//         }

//         // 1.5 second baad form band ho jayega
//         setTimeout(() => {
//             rsvpForm.reset();
//             if(rsvpStatus) rsvpStatus.textContent = "";
//             closeRsvp();
//         }, 1500);
//     });
// }

/* =========================================================
   END OF WEDDING INVITATION JAVASCRIPT
========================================================= */



// =================================
// RSVP FORM BACKEND CONNECTION
// =================================

// const rsvpForm = document.getElementById("rsvpForm");
// const rsvpStatus = document.getElementById("rsvpStatus");

if (rsvpForm) {

    rsvpForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const submitButton = rsvpForm.querySelector(".rsvp-submit");

        const formData = {
            guestName: document.getElementById("guestName").value.trim(),
            guestCount: document.getElementById("guestCount").value,
            guestNumber: document.getElementById("guestNumber").value,
            attendance: document.getElementById("attendance").value,
            guestMessage: document.getElementById("guestMessage").value.trim()
        };

        try {

            submitButton.disabled = true;
            submitButton.textContent = "SENDING...";

            rsvpStatus.textContent = "Submitting your RSVP...";
            rsvpStatus.style.color = "#b18b45";

            const response = await fetch(
                "https://admin2wedding.vercel.app/api/rsvp",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to submit RSVP");
            }

            // Success
           // Success
rsvpStatus.textContent =
    "Thank you! Your RSVP has been submitted successfully.";

rsvpStatus.style.color = "green";

setTimeout(() => {
    rsvpForm.reset();
    rsvpStatus.textContent = "";
    closeRsvp();
}, 2000);

        } catch (error) {

            console.error("RSVP Error:", error);

            rsvpStatus.textContent =
                error.message || "Something went wrong. Please try again.";

            rsvpStatus.style.color = "red";

        } finally {

            submitButton.disabled = false;
            submitButton.textContent = "SEND RSVP";

        }

    });

}
