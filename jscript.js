
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const navItems = document.querySelectorAll(".nav-link");

// Open and close the mobile navigation
function closeMenu() {
    navLinks.classList.remove("show");
    menuToggle.classList.remove("open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
}

menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("show");

    menuToggle.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );
});

// Close menu after clicking a navigation link
navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        closeMenu();
    });
});

// Close menu when Escape is pressed
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMenu();
        menuToggle.focus();
    }
});

// Close mobile menu when switching to desktop layout
window.addEventListener("resize", () => {
    if (window.innerWidth > 680) {
        closeMenu();
    }
});

// Highlight the active navigation link
navItems.forEach((link) => {
    link.addEventListener("click", () => {
        navItems.forEach((item) => {
            item.classList.remove("active");
        });

        link.classList.add("active");
    });
});
// ========================================
// ADVANCED SCROLL FUNCTIONALITY
// ========================================

document.documentElement.classList.add("js-scroll");

const progressBar = document.getElementById(
    "scroll-progress-bar"
);

const backToTopButton = document.getElementById(
    "back-to-top"
);

const pageSections = document.querySelectorAll(
    "main section[id]"
);

const navigationLinks = document.querySelectorAll(
    "#nav-links .nav-link"
);

// Respect reduced-motion preferences
const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;


// 1. Update scroll progress and back-to-top button
function updateScrollUI() {
    const scrollTop =
        window.scrollY ||
        document.documentElement.scrollTop;

    const scrollableHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;

    const progress = scrollableHeight > 0
        ? (scrollTop / scrollableHeight) * 100
        : 0;

    if (progressBar) {
        progressBar.style.width =
            `${Math.min(100, Math.max(0, progress))}%`;
    }

    if (backToTopButton) {
        backToTopButton.classList.toggle(
            "visible",
            scrollTop > 350
        );
    }
}

let scrollUpdatePending = false;

window.addEventListener("scroll", () => {
    if (scrollUpdatePending) return;

    scrollUpdatePending = true;

    window.requestAnimationFrame(() => {
        updateScrollUI();
        scrollUpdatePending = false;
    });
}, { passive: true });

window.addEventListener("resize", updateScrollUI);

updateScrollUI();


// 2. Back-to-top click action
if (backToTopButton) {
    backToTopButton.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion
                ? "auto"
                : "smooth"
        });
    });
}


// 3. Highlight navigation based on visible section
if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const sectionId = entry.target.id;

                navigationLinks.forEach((link) => {
                    const isActive =
                        link.getAttribute("href") ===
                        `#${sectionId}`;

                    link.classList.toggle(
                        "active",
                        isActive
                    );

                    if (isActive) {
                        link.setAttribute(
                            "aria-current",
                            "location"
                        );
                    } else {
                        link.removeAttribute("aria-current");
                    }
                });
            });
        },
        {
            rootMargin: "-25% 0px -55% 0px",
            threshold: 0
        }
    );

    pageSections.forEach((section) => {
        sectionObserver.observe(section);
    });
}


// 4. Reveal elements as they enter the viewport
const revealTargets = document.querySelectorAll(
    "main section .section-heading, " +
    ".about-grid, " +
    ".project-card, " +
    ".contact-grid, " +
    ".contact-extra-links"
);

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -35px 0px"
        }
    );

    revealTargets.forEach((element) => {
        element.classList.add("scroll-reveal");
        revealObserver.observe(element);
    });
} else {
    // Fallback for browsers without IntersectionObserver
    revealTargets.forEach((element) => {
        element.classList.add("is-visible");
    });
}