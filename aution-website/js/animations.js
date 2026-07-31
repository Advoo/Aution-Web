/* ============================================================
   AUTION — animations.js
   -------------------------------------------------------------
   Presentation-only motion and micro-interactions layered on top
   of the markup in index.html. Deliberately kept separate from
   main.js, which owns booking logic, the location search engine,
   and the map — so tweaking an animation here can never break a
   booking flow, and vice versa.

   main.js already handles: scroll-reveal (.reveal) and the stat
   count-up numbers. This file adds the smaller, purely decorative
   touches: smooth in-page scrolling, a subtle hero parallax, a
   gentle tilt on the ride-tier cards, and a first-load nudge on
   the primary CTA — all skipped automatically if the visitor's
   OS has "reduce motion" turned on.
   ============================================================ */
(function () {
    "use strict";

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return; // respect the visitor's OS-level accessibility preference

    /* ---------- smooth in-page scrolling ----------
       For any link pointing at an #id on this same page (e.g. a
       future "#reviews" or "#tiers" anchor), scroll to it smoothly
       instead of the browser's instant jump. Accounts for the fixed
       header height so the target isn't hidden underneath it. */
    function smoothAnchorScroll() {
        const header = document.querySelector(".header");
        const headerH = header ? header.offsetHeight : 0;

        document.querySelectorAll('a[href^="#"]').forEach((link) => {
            const targetId = link.getAttribute("href").slice(1);
            if (!targetId) return;
            const target = document.getElementById(targetId);
            if (!target) return;

            link.addEventListener("click", (e) => {
                e.preventDefault();
                const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
                window.scrollTo({ top, behavior: "smooth" });
            });
        });
    }

    /* ---------- hero parallax ----------
       The hero background drifts a few pixels slower than the page
       scrolls — a common, subtle depth cue. Capped so it never
       moves far enough to reveal an edge. */
    function heroParallax() {
        const bg = document.querySelector(".hero-bg");
        if (!bg) return;
        let ticking = false;

        function update() {
            const offset = Math.min(window.scrollY * 0.25, 80);
            bg.style.transform = `translateY(${offset}px) scale(1.08)`;
            ticking = false;
        }
        window.addEventListener(
            "scroll",
            () => {
                if (!ticking) {
                    requestAnimationFrame(update);
                    ticking = true;
                }
            },
            { passive: true },
        );
        update();
    }

    /* ---------- gentle tilt on ride-tier cards ----------
       A soft, low-amplitude tilt that follows the cursor — communicates
       "this is a tappable choice" without being gimmicky. Mouse-only;
       untouched on touch devices. */
    function tiltCards() {
        const cards = document.querySelectorAll(".tier-card");
        if (!cards.length || !window.matchMedia("(hover: hover)").matches) return;

        cards.forEach((card) => {
            card.style.transition = "transform .25s var(--ease, ease-out), box-shadow .25s ease";

            card.addEventListener("mousemove", (e) => {
                const r = card.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width - 0.5;
                const y = (e.clientY - r.top) / r.height - 0.5;
                const tiltMax = 4; // degrees — kept small and tasteful
                card.style.transform = `translateY(-6px) rotateX(${(-y * tiltMax).toFixed(2)}deg) rotateY(${(x * tiltMax).toFixed(2)}deg)`;
            });
            card.addEventListener("mouseleave", () => {
                card.style.transform = "";
            });
        });
    }

    /* ---------- first-load nudge on the primary CTA ----------
       One soft pulse on the "Book a Trip" button a moment after the
       page settles, just enough to draw the eye on a first visit.
       Runs once per browser session, not on every page view. */
    function ctaNudge() {
        const cta = document.querySelector(".hero-cta .btn-primary");
        if (!cta) return;
        if (sessionStorage.getItem("aution_cta_nudged")) return;

        setTimeout(() => {
            cta.animate(
                [
                    { transform: "scale(1)" },
                    { transform: "scale(1.045)" },
                    { transform: "scale(1)" },
                ],
                { duration: 700, easing: "ease-in-out" },
            );
            sessionStorage.setItem("aution_cta_nudged", "1");
        }, 1400);
    }

    function init() {
        smoothAnchorScroll();
        heroParallax();
        tiltCards();
        ctaNudge();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
