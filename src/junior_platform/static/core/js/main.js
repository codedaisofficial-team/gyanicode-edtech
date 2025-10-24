
; (() => {
    // Sidebar functionality
    const sidebar = document.getElementById("sidebar")
    const sidebarInner = document.getElementById("sidebar-inner")
    const mainMenu = document.getElementById("main-menu")
    const openBtns = sidebar.querySelectorAll("[data-open-submenu]")
    const backBtns = sidebar.querySelectorAll("[data-back-button]")
    const checkbox = document.getElementById("sidebar-toggle")

    function openSubmenu(id) {
        sidebarInner.classList.add("submenu-open")
        sidebar.classList.add("submenu-open") // Add class to sidebar to hide scrollbar
        sidebar.querySelectorAll(".submenu-panel").forEach((p) => p.setAttribute("aria-hidden", "true"))
        const panel = document.getElementById("submenu-" + id)
        if (panel) panel.setAttribute("aria-hidden", "false")
        openBtns.forEach((btn) => {
            const isTarget = btn.getAttribute("data-open-submenu") === id
            btn.setAttribute("aria-expanded", isTarget ? "true" : "false")
        })
    }

    function backToMain() {
        sidebarInner.classList.remove("submenu-open")
        sidebar.classList.remove("submenu-open") // Remove class from sidebar to show scrollbar
        sidebar.querySelectorAll(".submenu-panel").forEach((p) => p.setAttribute("aria-hidden", "true"))
        openBtns.forEach((btn) => btn.setAttribute("aria-expanded", "false"))
        mainMenu.focus?.()
    }

    openBtns.forEach((btn) => btn.addEventListener("click", () => openSubmenu(btn.getAttribute("data-open-submenu"))))
    backBtns.forEach((btn) => btn.addEventListener("click", backToMain))

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            if (sidebarInner.classList.contains("submenu-open")) backToMain()
            else if (checkbox.checked) checkbox.checked = false
        }
    })
    checkbox.addEventListener("change", () => {
        if (!checkbox.checked) {
            backToMain()
            sidebar.classList.remove("submenu-open") // Ensure scrollbar is restored when sidebar is closed
        }
    })
    document.addEventListener("click", (event) => {
        const isClickInsideSidebar = sidebar.contains(event.target);
        const isToggleBtn =
            event.target.id === "sidebar-toggle" ||
            event.target.closest("#sidebar-toggle-label");
        if (isToggleBtn) return;
        if (checkbox.checked && !isClickInsideSidebar) {
            checkbox.checked = false;
            backToMain();
        }
    });

    // Hero content rotation
    const contentData = [
        {
            tagline: "Your future begins with learning",
            heading: 'Future-Proof<br /> <span class="highlight">Learning</span> Today.<br />Learn continuously',
            subtext: "Whether at home or on the go, our platform makes continuous learning accessible, helping you always move forward."
        },
        {
            tagline: "Transform your career path",
            heading: 'Master New <span class="highlight">Skills</span><br />Unlock Endless<br /><span class="highlight">Opportunities</span>',
            subtext: "Join thousands of learners who've transformed their careers through our expert-led courses and personalized learning paths."
        },
        {
            tagline: "Learn at your own pace",
            heading: 'Flexible Learning<br />for <span class="highlight">Modern Life</span><br />Anytime, Anywhere',
            subtext: "Access world-class education on your schedule. Learn from industry experts and apply skills in real-world projects immediately."
        },
        {
            tagline: "Build your dream future",
            heading: 'From Beginner to<br /><span class="highlight">Expert</span> Level<br />Your Journey Starts Here',
            subtext: "Comprehensive courses designed to take you from zero to hero. Get certified, build portfolio projects, and land your dream job."
        }
    ];

    let currentIndex = 0;
    let isTransitioning = false;

    const taglineEl = document.getElementById('tagline');
    const headingEl = document.getElementById('heading');
    const subtextEl = document.getElementById('subtext');
    const progressDots = document.querySelectorAll('.progress-dot');

    function updateContent(index) {
        if (isTransitioning) return;
        isTransitioning = true;

        progressDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        const currentHeading = headingEl.querySelector('.heading-text');
        const currentSub = subtextEl;

        currentHeading.classList.remove('active');
        currentHeading.classList.add('exit');
        currentSub.classList.remove('active');
        currentSub.classList.add('exit');

        setTimeout(() => {
            const data = contentData[index];

            taglineEl.textContent = data.tagline;
            headingEl.innerHTML = `<span class="heading-text">${data.heading}</span>`;
            subtextEl.textContent = data.subtext;

            setTimeout(() => {
                const newHeading = headingEl.querySelector('.heading-text');
                newHeading.classList.add('active');
                subtextEl.classList.add('active');
                isTransitioning = false;
            }, 50);
        }, 600);
    }

    function startRotation() {
        setInterval(() => {
            currentIndex = (currentIndex + 1) % contentData.length;
            updateContent(currentIndex);
        }, 5000);
    }

    progressDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (index !== currentIndex && !isTransitioning) {
                currentIndex = index;
                updateContent(currentIndex);
            }
        });
    });

    startRotation();

    // FAQ toggle
    document.querySelectorAll('.faq-item').forEach(item => {
        const btn = item.querySelector('button');
        const content = item.querySelector('div.hidden');
        const icon = btn.querySelector('.text-pink-500');
        btn.addEventListener('click', () => {
            const isHidden = content.classList.contains('hidden');
            document.querySelectorAll('.faq-item div.hidden').forEach(c => c.classList.add('hidden'));
            document.querySelectorAll('.faq-item button .text-pink-500').forEach(i => i.textContent = '+');
            if (isHidden) {
                content.classList.remove('hidden');
                icon.textContent = '−';
            } else {
                content.classList.add('hidden');
                icon.textContent = '+';
            }
        });
    });
})();

const youtubeVideoId = "vzq_23qN6U8";

function initVideo() {
    const isMobile = window.innerWidth < 768; // Tailwind's md breakpoint
    const videoContainer = document.getElementById(
        isMobile ? "video-container-mobile" : "video-container"
    );

    if (!youtubeVideoId || !videoContainer) return;

    // Find the placeholder inside this container (not globally)
    const placeholder = videoContainer.querySelector("#video-placeholder");

    // Remove old iframes if any (prevents duplicates on resize)
    videoContainer.querySelectorAll("iframe").forEach(el => el.remove());

    // Create the iframe
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=1&loop=1&playlist=${youtubeVideoId}&rel=0&modestbranding=1&controls=1`;
    iframe.className = "w-full h-full rounded-2xl";
    iframe.setAttribute("allowfullscreen", "");
    iframe.setAttribute("title", "YouTube video player");
    iframe.style.display = "none";

    // Remove only the placeholder inside this container
    if (placeholder) placeholder.remove();

    // Add the iframe to the correct container
    videoContainer.appendChild(iframe);

    // Lazy-load: show only when visible
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    iframe.style.display = "block";
                    observer.unobserve(videoContainer);
                }
            });
        },
        { threshold: 0.3 }
    );

    observer.observe(videoContainer);
}

// Run on page load
initVideo();

// Handle resize/orientation change dynamically
window.addEventListener("resize", () => {
    const isMobileNow = window.innerWidth < 768;
    const hasMobileVideo = document.querySelector("#video-container-mobile iframe");
    const hasDesktopVideo = document.querySelector("#video-container iframe");

    if ((isMobileNow && !hasMobileVideo) || (!isMobileNow && !hasDesktopVideo)) {
        initVideo();
    }
});






(function () {
    const crCarousel = document.getElementById('crCarousel');
    if (!crCarousel) return;

    const crSidePrevBtn = document.getElementById('crSidePrevBtn');
    const crSideNextBtn = document.getElementById('crSideNextBtn');
    const crIndicatorsContainer = document.getElementById('crIndicators');
    const crCourseCards = crCarousel.querySelectorAll('.cr-course-card');
    const carouselContainer = crCarousel.closest('.cr-carousel-wrapper').querySelector('.cr-carousel-container');

    let currentIndex = 0;
    let cardsPerView = getCardsPerView();
    let autoSlideInterval = null;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationFrame = null;
    let lastDiff = 0;

    function getGapPx() {
        const styles = getComputedStyle(crCarousel);
        const gap = parseFloat(styles.columnGap || styles.gap || '0');
        return isNaN(gap) ? 0 : gap;
    }
    function getCardFullWidth() {
        if (!crCourseCards.length) return 0;
        const gap = getGapPx();
        const cardWidth = crCourseCards[0].offsetWidth;
        return cardWidth + gap;
    }
    function getCardsPerView() {
        const w = window.innerWidth;
        if (w < 768) return 1;
        if (w < 1024) return 2;
        if (w < 1280) return 3;
        return 4;
    }
    function getMaxIndex() {
        return Math.max(0, crCourseCards.length - cardsPerView);
    }
    function clampIndex(idx) {
        const max = getMaxIndex();
        if (idx < 0) return 0;
        if (idx > max) return max;
        return idx;
    }
    function getMobileTranslateBounds() {
        const gap = getGapPx();
        const cardWidth = crCourseCards[0].offsetWidth;
        const containerWidth = carouselContainer.getBoundingClientRect().width;
        const centerOffset = (containerWidth - cardWidth) / 2;

        const step = cardWidth + gap;
        const maxTranslate = centerOffset;
        const minTranslate = -((crCourseCards.length - 1) * step) + centerOffset;
        return { minTranslate, maxTranslate };
    }
    function getTranslateXForIndex(index) {
        const hasOverflow = crCourseCards.length > cardsPerView;
        if (!hasOverflow) return 0;

        if (cardsPerView === 1) {
            const gap = getGapPx();
            const cardWidth = crCourseCards[0].offsetWidth;
            const containerWidth = carouselContainer.getBoundingClientRect().width;
            const centerOffset = (containerWidth - cardWidth) / 2;
            let tx = -(index * (cardWidth + gap)) + centerOffset;
            const { minTranslate, maxTranslate } = getMobileTranslateBounds();
            if (tx > maxTranslate) tx = maxTranslate;
            if (tx < minTranslate) tx = minTranslate;
            return tx;
        }
        const step = getCardFullWidth();
        return -index * step;
    }
    function updateActiveCardScaling() {
        crCourseCards.forEach((card, i) => {
            if (i === currentIndex) card.classList.add('active');
            else card.classList.remove('active');
        });
    }
    function updateIndicators() {
        crIndicatorsContainer.innerHTML = '';
        const totalIndicators = Math.max(1, crCourseCards.length - cardsPerView + 1);
        for (let i = 0; i < totalIndicators; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'cr-indicator' + (i === currentIndex ? ' active' : '');
            indicator.setAttribute('role', 'button');
            indicator.setAttribute('tabindex', '0');
            indicator.setAttribute('aria-label', 'Go to slide ' + (i + 1));
            indicator.addEventListener('click', () => goToCard(i));
            indicator.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    goToCard(i);
                }
            });
            crIndicatorsContainer.appendChild(indicator);
        }
    }
    function updateSideIndicatorVisibility() {
        const hasOverflow = crCourseCards.length > cardsPerView;
        if (crSidePrevBtn && crSideNextBtn) {
            crSidePrevBtn.style.visibility = hasOverflow ? 'visible' : 'hidden';
            crSideNextBtn.style.visibility = hasOverflow ? 'visible' : 'hidden';
        }
    }
    function updateCarousel() {
        currentIndex = clampIndex(currentIndex);
        const translateX = getTranslateXForIndex(currentIndex);
        crCarousel.style.transform = 'translateX(' + translateX + 'px)';
        prevTranslate = translateX;
        currentTranslate = translateX;
        updateIndicators();
        updateSideIndicatorVisibility();
        updateActiveCardScaling();
    }
    function goToPrevCard() {
        if (currentIndex > 0) currentIndex--;
        else currentIndex = getMaxIndex();
        updateCarousel();
        resetAutoSlide();
    }
    function goToNextCard() {
        const max = getMaxIndex();
        if (currentIndex < max) currentIndex++;
        else currentIndex = 0;
        updateCarousel();
        resetAutoSlide();
    }
    function goToCard(index) {
        currentIndex = clampIndex(index);
        updateCarousel();
        resetAutoSlide();
    }

    function touchStart(e) {
        isDragging = true;
        crCarousel.style.transition = 'none';
        startPos = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        if (e.type !== 'touchstart') e.preventDefault();
        lastDiff = 0;
        animationFrame = requestAnimationFrame(animationUpdate);
    }
    function touchMove(e) {
        if (!isDragging) return;
        const currentPosition = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const diff = currentPosition - startPos;
        lastDiff = diff;
        if (Math.abs(diff) > 10) currentTranslate = prevTranslate + diff;
    }
    function animationUpdate() {
        if (isDragging) {
            if (cardsPerView === 1) {
                const { minTranslate, maxTranslate } = getMobileTranslateBounds();
                if (currentTranslate > maxTranslate) currentTranslate = maxTranslate;
                if (currentTranslate < minTranslate) currentTranslate = minTranslate;
            }
            crCarousel.style.transform = 'translateX(' + currentTranslate + 'px)';
            requestAnimationFrame(animationUpdate);
        }
    }
    function touchEnd() {
        if (!isDragging) return;
        isDragging = false;
        cancelAnimationFrame(animationFrame);
        crCarousel.style.transition = 'transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)';
        const movedBy = currentTranslate - prevTranslate;
        const threshold = Math.min(50, getCardFullWidth() * 0.15);
        if (movedBy < -threshold && currentIndex < getMaxIndex()) currentIndex++;
        else if (movedBy > threshold && currentIndex > 0) currentIndex--;
        updateCarousel();
        resetAutoSlide();
    }

    function startAutoSlide() {
        stopAutoSlide();
        if (crCourseCards.length <= cardsPerView) return;
        autoSlideInterval = setInterval(goToNextCard, 4000);
    }
    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    }
    function resetAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }
    function handleResize() {
        const newCardsPerView = getCardsPerView();
        if (newCardsPerView !== cardsPerView) {
            cardsPerView = newCardsPerView;
            currentIndex = 0;
            updateCarousel();
            startAutoSlide();
        } else {
            updateCarousel();
        }
    }
    function handleVisibilityChange() {
        if (document.hidden) stopAutoSlide();
        else startAutoSlide();
    }
    function handleKeydown(e) {
        if (e.key === 'ArrowLeft') goToPrevCard();
        else if (e.key === 'ArrowRight') goToNextCard();
    }

    function initCarousel() {
        updateIndicators();
        if (crSidePrevBtn) crSidePrevBtn.addEventListener('click', goToPrevCard);
        if (crSideNextBtn) crSideNextBtn.addEventListener('click', goToNextCard);

        crCarousel.addEventListener('touchstart', touchStart, { passive: true });
        crCarousel.addEventListener('touchmove', touchMove, { passive: true });
        crCarousel.addEventListener('touchend', touchEnd);

        crCarousel.addEventListener('mousedown', touchStart);
        window.addEventListener('mousemove', touchMove);
        window.addEventListener('mouseup', touchEnd);
        crCarousel.addEventListener('mouseleave', () => { if (isDragging) touchEnd(); });

        carouselContainer.tabIndex = 0;
        carouselContainer.addEventListener('keydown', handleKeydown);

        carouselContainer.addEventListener('mouseenter', stopAutoSlide);
        carouselContainer.addEventListener('mouseleave', startAutoSlide);
        carouselContainer.addEventListener('focusin', stopAutoSlide);
        carouselContainer.addEventListener('focusout', startAutoSlide);

        window.addEventListener('resize', handleResize);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        updateCarousel();
        startAutoSlide();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCarousel);
    } else {
        initCarousel();
    }
})();

// CSS-only price toggle visibility
const billMonthly = document.getElementById('bill-monthly');
const billYearly = document.getElementById('bill-yearly');

function updatePrices() {
    const monthlyPrices = document.querySelectorAll('.price-monthly');
    const yearlyPrices = document.querySelectorAll('.price-yearly');

    if (billMonthly.checked) {
        monthlyPrices.forEach(p => p.style.display = 'block');
        yearlyPrices.forEach(p => p.style.display = 'none');
    } else {
        monthlyPrices.forEach(p => p.style.display = 'none');
        yearlyPrices.forEach(p => p.style.display = 'block');
    }
}

billMonthly.addEventListener('change', updatePrices);
billYearly.addEventListener('change', updatePrices);


// <!-- Testimonial Carousel Script -->

// Simple responsive auto-sliding carousel (1 slide on mobile, 3 on lg)
(function () {
    const track = document.querySelector('.carousel-track');
    if (!track) return;

    const getSlidesPerView = () => matchMedia('(min-width: 1024px)').matches ? 3 : 1;
    let slidesPerView = getSlidesPerView();
    let currentPage = 0;
    let autoTimer = null;

    const getTotalPages = () => {
        const totalSlides = track.children.length;
        return Math.max(1, Math.ceil(totalSlides / slidesPerView));
    };

    const goToPage = (index) => {
        const pageWidth = track.clientWidth; // width of visible area
        track.scrollTo({ left: index * pageWidth, behavior: 'smooth' });
    };

    const onResize = () => {
        const next = getSlidesPerView();
        if (next !== slidesPerView) {
            slidesPerView = next;
            currentPage = 0;
            goToPage(currentPage);
        }
    };
    window.addEventListener('resize', onResize);

    const startAuto = () => {
        if (autoTimer) return;
        autoTimer = setInterval(() => {
            const totalPages = getTotalPages();
            currentPage = (currentPage + 1) % totalPages;
            goToPage(currentPage);
        }, 4000);
    };

    const stopAuto = () => {
        if (!autoTimer) return;
        clearInterval(autoTimer);
        autoTimer = null;
    };

    // Pause on click, resume when mouse leaves the card
    const slides = track.querySelectorAll('.group');
    slides.forEach((slide) => {
        slide.addEventListener('click', stopAuto);
        slide.addEventListener('mouseleave', startAuto);
    });

    startAuto();
})();

// Equalize card heights when collapsed; allow growth on expand
(function () {
    let sharedMinHeight = 0;

    const getCardContainer = (el) => el.closest('.p-5') ? el.closest('.p-5').parentElement : null;
    const getAllCardContainers = () => Array.from(document.querySelectorAll('.carousel-track > .group'))
        .map(group => group.querySelector('.relative.overflow-hidden.rounded-2xl'))
        .filter(Boolean);

    const isExpanded = (container) => {
        const text = container.querySelector('.testimonial-text');
        return text && text.classList.contains('expanded');
    };

    const equalizeHeights = () => {
        const containers = getAllCardContainers();
        containers.forEach(c => c.style.minHeight = '');

        const collapsedHeights = containers.map(c => {
            // Temporarily treat as collapsed for measurement
            const text = c.querySelector('.testimonial-text');
            const wasExpanded = text && text.classList.contains('expanded');
            if (wasExpanded) text.classList.remove('expanded');
            const h = c.offsetHeight;
            if (wasExpanded) text.classList.add('expanded');
            return h;
        });

        sharedMinHeight = Math.max(0, ...collapsedHeights);
        containers.forEach(c => {
            if (!isExpanded(c)) c.style.minHeight = sharedMinHeight + 'px';
        });
    };

    // Initialize and on resize
    window.addEventListener('load', equalizeHeights);
    window.addEventListener('resize', () => {
        // Debounce resize a bit
        clearTimeout(window.__eqResizeTimer);
        window.__eqResizeTimer = setTimeout(equalizeHeights, 150);
    });

    // Hook into Read More toggles to adjust minHeight per card
    document.querySelectorAll('.read-more').forEach((btn) => {
        btn.addEventListener('click', () => {
            const container = getCardContainer(btn);
            if (!container) return;
            const text = container.querySelector('.testimonial-text');
            const expanded = text && text.classList.contains('expanded');
            if (expanded) {
                container.style.minHeight = 'auto';
            } else {
                container.style.minHeight = sharedMinHeight + 'px';
            }
        });
    });
})();

// Toggle Read More / Less
document.querySelectorAll('.read-more').forEach((btn) => {
    btn.addEventListener('click', () => {
        const textBlock = btn.previousElementSibling;
        const fade = textBlock.querySelector('.fade');

        textBlock.classList.toggle('expanded');

        const isExpanded = textBlock.classList.contains('expanded');
        btn.textContent = isExpanded ? 'Read Less' : 'Read More';

        // Hide fade when expanded, show when collapsed
        if (fade) {
            fade.classList.toggle('hidden', isExpanded);
        }
    });
});

// Handle avatar upload
document.querySelectorAll('.upload-input').forEach((input) => {
    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const avatarContainer = e.target.nextElementSibling;
        const img = avatarContainer.querySelector('.uploaded-img');
        const defaultIcon = avatarContainer.querySelector('.default-avatar');
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                img.src = reader.result;
                img.classList.remove('hidden');
                defaultIcon.classList.add('hidden');
            };
            reader.readAsDataURL(file);
        }
    });
});