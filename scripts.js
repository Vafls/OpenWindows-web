/* =============================================
   OPENWINDOWS — SCRIPTS
   ============================================= */

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // THEME TOGGLE
    // ==========================================
    const html = document.documentElement;
    const themeBtn = document.getElementById("themeBtn");

    const savedTheme = localStorage.getItem("ow-theme") || "light";
    html.setAttribute("data-theme", savedTheme);

    themeBtn?.addEventListener("click", () => {
        const current = html.getAttribute("data-theme");
        const next = current === "light" ? "dark" : "light";
        html.setAttribute("data-theme", next);
        localStorage.setItem("ow-theme", next);
    });


    // ==========================================
    // HEADER SCROLL EFFECT
    // ==========================================
    const header = document.getElementById("header");
    const scrollTop = document.getElementById("scrollTop");

    const onScroll = () => {
        const y = window.scrollY;
        header?.classList.toggle("scrolled", y > 20);
        scrollTop?.classList.toggle("visible", y > 300);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    scrollTop?.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });


    // ==========================================
    // CURSOR GLOW
    // ==========================================
    const cursorGlow = document.getElementById("cursorGlow");

    if (cursorGlow && window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener("mousemove", (e) => {
            cursorGlow.style.left = e.clientX + "px";
            cursorGlow.style.top = e.clientY + "px";
        });
    } else {
        cursorGlow?.remove();
    }


    // ==========================================
    // REVEAL ON SCROLL
    // ==========================================
    const revealEls = document.querySelectorAll(".reveal, .reveal-right");

    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add("visible");
                }, parseInt(delay));
                revealObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealEls.forEach(el => revealObs.observe(el));


    // ==========================================
    // IMAGE SLIDERS
    // ==========================================
    document.querySelectorAll(".image-slider").forEach(slider => {
        const track = slider.querySelector(".slider-track");
        const images = track?.querySelectorAll("img");
        if (!images || images.length === 0) return;

        const prev = slider.querySelector(".prev");
        const next = slider.querySelector(".next");
        const dotsContainer = slider.querySelector(".slider-dots");

        let currentIndex = 0;
        let autoTimer;

        // Create dots
        const dots = [];
        images.forEach((_, i) => {
            const dot = document.createElement("div");
            dot.classList.add("slider-dot");
            if (i === 0) dot.classList.add("active");
            dot.addEventListener("click", () => goTo(i));
            dotsContainer?.appendChild(dot);
            dots.push(dot);
        });

        // Hide images with bad src gracefully
        images.forEach(img => {
            img.addEventListener("error", () => {
                img.style.opacity = "0";
                img.parentElement.style.background = "var(--bg3)";
            });
        });

        const goTo = (index) => {
            currentIndex = (index + images.length) % images.length;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((d, i) => d.classList.toggle("active", i === currentIndex));
        };

        const startAuto = () => {
            stopAuto();
            autoTimer = setInterval(() => goTo(currentIndex + 1), 3500);
        };

        const stopAuto = () => clearInterval(autoTimer);

        prev?.addEventListener("click", () => { goTo(currentIndex - 1); startAuto(); });
        next?.addEventListener("click", () => { goTo(currentIndex + 1); startAuto(); });

        slider.addEventListener("mouseenter", stopAuto);
        slider.addEventListener("mouseleave", startAuto);

        // Touch swipe
        let touchStartX = 0;
        slider.addEventListener("touchstart", e => { touchStartX = e.touches[0].clientX; }, { passive: true });
        slider.addEventListener("touchend", e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) goTo(currentIndex + (diff > 0 ? 1 : -1));
            startAuto();
        }, { passive: true });

        startAuto();
    });


    // ==========================================
    // SEARCH
    // ==========================================
    const searchInput = document.getElementById("search");
    searchInput?.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase().trim();
        const cards = document.querySelectorAll(".app-card");

        cards.forEach(card => {
            if (card.classList.contains("coming-soon")) return;
            const title = card.querySelector(".card-title")?.textContent.toLowerCase() || "";
            const desc = card.querySelector(".card-desc")?.textContent.toLowerCase() || "";
            const show = !query || title.includes(query) || desc.includes(query);
            card.style.transition = "opacity 0.3s, transform 0.3s";
            card.style.opacity = show ? "1" : "0.25";
            card.style.transform = show ? "" : "scale(0.97)";
        });
    });


    // ==========================================
    // RIPPLE EFFECT
    // ==========================================
    document.querySelectorAll(".ripple").forEach(el => {
        el.addEventListener("click", function (e) {
            const rect = el.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height) * 2;
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            const ripple = document.createElement("span");
            ripple.classList.add("ripple-circle");
            ripple.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
            `;

            el.appendChild(ripple);
            setTimeout(() => ripple.remove(), 700);
        });
    });


    // ==========================================
    // CARD GLOW FOLLOW MOUSE
    // ==========================================
    document.querySelectorAll(".app-card, .about-card").forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty("--mouse-x", x + "%");
            card.style.setProperty("--mouse-y", y + "%");
        });
    });


    // ==========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener("click", (e) => {
            const target = document.querySelector(a.getAttribute("href"));
            if (target) {
                e.preventDefault();
                const top = target.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top, behavior: "smooth" });
            }
        });
    });


    // ==========================================
    // FLOATING CARDS PARALLAX (subtle)
    // ==========================================
    const floatingCards = document.querySelectorAll(".floating-card, .hero-window");
    if (floatingCards.length > 0 && window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener("mousemove", (e) => {
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            const dx = (e.clientX - cx) / cx;
            const dy = (e.clientY - cy) / cy;

            floatingCards.forEach((el, i) => {
                const factor = (i % 3 + 1) * 4;
                el.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
            });
        });
    }


    // ==========================================
    // NAV ACTIVE LINK (scroll spy)
    // ==========================================
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    if (sections.length > 0 && navLinks.length > 0) {
        const spyObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => {
                        link.classList.toggle("active",
                            link.getAttribute("href") === "#" + entry.target.id
                        );
                    });
                }
            });
        }, { threshold: 0.4 });

        sections.forEach(s => spyObs.observe(s));
    }


    // ==========================================
    // STAGGER ANIMATE CARDS ON LOAD
    // ==========================================
    const cards = document.querySelectorAll(".app-card, .about-card");
    cards.forEach((card, i) => {
        if (!card.dataset.delay) {
            card.dataset.delay = i * 80;
        }
    });

});
