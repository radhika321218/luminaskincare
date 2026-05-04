document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const nav = document.getElementById("navbar");
    const mobileBtn = document.querySelector(".mobile-menu-btn");
    const navLinks = document.querySelector(".nav-links");
    const searchToggle = document.querySelector(".search-toggle");
    const searchPanel = document.getElementById("site-search");
    const searchClose = document.querySelector(".search-close");
    const searchInput = document.getElementById("product-search");
    const productCards = Array.from(document.querySelectorAll(".product-card"));
    const emptyState = document.querySelector(".empty-state");
    const cartCount = document.querySelector(".cart-count");
    const toast = document.querySelector(".toast");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let ticking = false;
    let cartItems = 0;
    let toastTimer;

    const updateNav = () => {
        nav.classList.toggle("nav-scrolled", window.scrollY > 24);
        ticking = false;
    };

    const requestNavUpdate = () => {
        if (!ticking) {
            window.requestAnimationFrame(updateNav);
            ticking = true;
        }
    };

    window.addEventListener("scroll", requestNavUpdate, { passive: true });
    updateNav();

    if ("IntersectionObserver" in window && !reduceMotion) {
        const observer = new IntersectionObserver((entries, activeObserver) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    activeObserver.unobserve(entry.target);
                }
            });
        }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

        document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
        window.setTimeout(() => {
            document.querySelectorAll(".reveal:not(.active)").forEach((element) => element.classList.add("active"));
        }, 1400);
    } else {
        document.querySelectorAll(".reveal").forEach((element) => element.classList.add("active"));
    }

    const closeMenu = () => {
        navLinks?.classList.remove("active");
        nav?.classList.remove("menu-active");
        body.classList.remove("menu-open");
        mobileBtn?.setAttribute("aria-expanded", "false");
        mobileBtn?.setAttribute("aria-label", "Open menu");
    };

    const toggleMenu = () => {
        const isOpen = navLinks.classList.toggle("active");
        nav.classList.toggle("menu-active", isOpen);
        body.classList.toggle("menu-open", isOpen);
        mobileBtn.setAttribute("aria-expanded", String(isOpen));
        mobileBtn.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    };

    mobileBtn?.addEventListener("click", toggleMenu);
    navLinks?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

    const closeSearch = () => {
        searchPanel.hidden = true;
        nav.classList.remove("search-active");
        body.classList.remove("search-open");
        searchToggle?.setAttribute("aria-expanded", "false");
        searchInput.value = "";
        filterProducts("");
    };

    const openSearch = () => {
        closeMenu();
        searchPanel.hidden = false;
        nav.classList.add("search-active");
        body.classList.add("search-open");
        searchToggle?.setAttribute("aria-expanded", "true");
        searchInput.focus();
    };

    searchToggle?.addEventListener("click", () => {
        if (searchPanel.hidden) {
            openSearch();
        } else {
            closeSearch();
        }
    });

    searchClose?.addEventListener("click", closeSearch);

    function filterProducts(value) {
        const query = value.trim().toLowerCase();
        let visibleCount = 0;

        productCards.forEach((card) => {
            const matches = !query || card.dataset.product.toLowerCase().includes(query);
            card.classList.toggle("is-hidden", !matches);
            visibleCount += matches ? 1 : 0;
        });

        if (emptyState) {
            emptyState.hidden = visibleCount !== 0;
        }
    }

    searchInput?.addEventListener("input", (event) => filterProducts(event.target.value));

    const routineData = {
        oily: {
            kicker: "Balanced Glow",
            title: "Lightweight hydration with a clear finish.",
            text: "Start with Velvet Foam, layer Glow Elixir, then seal only the dry areas with Dew Barrier."
        },
        dry: {
            kicker: "Barrier Comfort",
            title: "Cushion skin with moisture that lasts.",
            text: "Cleanse gently, use Glow Elixir on damp skin, then apply Dew Barrier as the final comfort layer."
        },
        combination: {
            kicker: "Zone Smart",
            title: "Balance shine without drying the cheeks.",
            text: "Keep the T-zone light with Glow Elixir and add Dew Barrier wherever skin feels tight."
        },
        sensitive: {
            kicker: "Calm Ritual",
            title: "Simple steps for skin that reacts easily.",
            text: "Use Velvet Foam at night, add a small amount of Glow Elixir, and finish with Dew Barrier."
        }
    };

    const routinePanel = document.getElementById("routine-panel");
    const routineKicker = routinePanel?.querySelector(".eyebrow");
    const routineTitle = routinePanel?.querySelector("h3");
    const routineText = routinePanel?.querySelector("[data-routine-text]");

    document.querySelectorAll(".skin-tab").forEach((tab) => {
        tab.addEventListener("click", () => {
            const skinType = tab.dataset.skin;
            const routine = routineData[skinType];

            document.querySelectorAll(".skin-tab").forEach((item) => {
                const isActive = item === tab;
                item.classList.toggle("active", isActive);
                item.setAttribute("aria-selected", String(isActive));
            });

            if (routine && routineKicker && routineTitle && routineText) {
                routineKicker.textContent = routine.kicker;
                routineTitle.textContent = routine.title;
                routineText.textContent = routine.text;
            }
        });
    });

    const showToast = (message) => {
        if (!toast) {
            return;
        }

        window.clearTimeout(toastTimer);
        toast.textContent = message;
        toast.hidden = false;
        toastTimer = window.setTimeout(() => {
            toast.hidden = true;
        }, 2200);
    };

    document.querySelectorAll("[data-add]").forEach((button) => {
        button.addEventListener("click", () => {
            cartItems += 1;
            cartCount.textContent = String(cartItems);
            showToast(`${button.dataset.add} added to bag`);
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
            if (!searchPanel.hidden) {
                closeSearch();
            }
        }
    });
});
