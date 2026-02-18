document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Toggle ---
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.main-nav');

    if (mobileBtn && nav) {
        mobileBtn.addEventListener('click', () => {
            mobileBtn.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        // Close menu when clicking a link
        document.querySelectorAll('.main-nav a').forEach(link => {
            link.addEventListener('click', () => {
                mobileBtn.classList.remove('active');
                nav.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // --- Sticky Header Effect ---
    const header = document.querySelector('.site-header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
            header.style.background = 'rgba(18, 18, 18, 0.95)';
        } else {
            header.style.boxShadow = 'none';
            header.style.background = 'rgba(18, 18, 18, 0.85)';
        }
    });

    // --- Smooth Scroll Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // --- Intersection Observer for Fade-in Animations ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply fade-in class to major sections cards
    const elementsToAnimate = document.querySelectorAll(
        '.hero-content, .hero-visual, .project-card, .expertise-card, .stat-card, .recognition-item, .testimonial-card, .contact-card, .about-text, .about-image'
    );

    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in-element');
        observer.observe(el);
    });

    // --- Floating Elements Mouse Parallax (Hero) ---
    const heroSection = document.querySelector('.hero-section');
    const float1 = document.querySelector('.float-1');
    const float2 = document.querySelector('.float-2');

    if (heroSection && float1 && float2) {
        heroSection.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;

            float1.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
            float2.style.transform = `translate(-${x * 30}px, -${y * 30}px)`;
        });
    }

    // --- Infinite Recognition Carousel Slider ---
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    if (carouselWrapper) {
        const carousel = carouselWrapper.querySelector('.recognition-carousel');
        const prevBtn = carouselWrapper.querySelector('.prev-btn');
        const nextBtn = carouselWrapper.querySelector('.next-btn');

        if (carousel && prevBtn && nextBtn) {
            const originalItems = Array.from(carousel.children);

            // Calculate single set width including gap
            // We assume all items have the same width
            const itemWidth = originalItems[0].offsetWidth;
            const gap = parseFloat(window.getComputedStyle(carousel).gap) || 0;
            const singleSetWidth = (itemWidth + gap) * originalItems.length;

            // Clone items for infinite loop
            originalItems.forEach(item => {
                const clone = item.cloneNode(true);
                carousel.appendChild(clone);
            });

            // Auto-scroll variables
            let scrollAmount = 0;
            const scrollSpeed = 0.8; // Adjust for speed
            let isPaused = false;
            let autoScrollId;

            const animateScroll = () => {
                if (!isPaused) {
                    scrollAmount += scrollSpeed;

                    // Infinite loop reset
                    if (scrollAmount >= singleSetWidth) {
                        scrollAmount -= singleSetWidth;
                    }
                    carousel.scrollLeft = scrollAmount;
                } else {
                    // Sync while paused (e.g. user manually scrolled)
                    scrollAmount = carousel.scrollLeft;

                    // Handle manual scroll wrapping (optional but good for consistency)
                    if (carousel.scrollLeft >= singleSetWidth) {
                        scrollAmount = carousel.scrollLeft - singleSetWidth;
                        carousel.scrollLeft = scrollAmount;
                    }
                }
                autoScrollId = requestAnimationFrame(animateScroll);
            };

            // Start loop
            autoScrollId = requestAnimationFrame(animateScroll);

            // Pause on hover
            carouselWrapper.addEventListener('mouseenter', () => isPaused = true);
            carouselWrapper.addEventListener('mouseleave', () => isPaused = false);

            // Simple Manual Controls
            prevBtn.addEventListener('click', () => {
                const cardWidth = itemWidth + gap;
                carousel.scrollBy({ left: -cardWidth, behavior: 'smooth' });
                scrollAmount = carousel.scrollLeft - cardWidth; // Sync
            });

            nextBtn.addEventListener('click', () => {
                const cardWidth = itemWidth + gap;
                carousel.scrollBy({ left: cardWidth, behavior: 'smooth' });
                scrollAmount = carousel.scrollLeft + cardWidth; // Sync
            });
        }
    }

});


const logo = document.querySelector('.logo-img');
const originalSrc = logo.src;
const hoverSrc = logo.dataset.hover;

logo.addEventListener('mouseenter', () => {
    logo.src = hoverSrc;
});

logo.addEventListener('mouseleave', () => {
    logo.src = originalSrc;
});

function downloadResume(event) {
    event.preventDefault();

    const downloadUrl =
        "https://drive.google.com/uc?export=download&id=1-UMrkXepbxmX2F9KaqkmbTUOLRRCYi06";

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.target = "_blank"; // ensures download even if preview is forced
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


/* Add these classes dynamically */
const style = document.createElement('style');
style.textContent = `
    .fade-in-element {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
    
    .fade-in-element.visible {
        opacity: 1;
        transform: translateY(0);
    }
    .no-scroll {
        overflow: hidden;
    }
`;
document.head.appendChild(style);

/* Testimonials Read More Toggle */
function toggleTestimonial(btn) {
    const card = btn.closest('.testimonial-card');
    const moreText = card.querySelector('.more-text');
    const dots = card.querySelector('.dots');

    if (moreText.style.display === 'none') {
        moreText.style.display = 'inline';
        if (dots) dots.style.display = 'none';
        btn.textContent = 'Read Less';
    } else {
        moreText.style.display = 'none';
        if (dots) dots.style.display = 'inline';
        btn.textContent = 'Read More';
    }
}

/* Testimonial Slider Controls */
/* Testimonial Slider Controls */
document.addEventListener('DOMContentLoaded', () => {
    const testimonialSlider = document.querySelector('.testimonials-slider');
    if (testimonialSlider) {
        const tPrevBtn = document.querySelector('.testimonial-prev-btn');
        const tNextBtn = document.querySelector('.testimonial-next-btn-main');

        if (tPrevBtn && tNextBtn) {
            tPrevBtn.addEventListener('click', () => {
                const firstCard = testimonialSlider.querySelector('.testimonial-card');
                if (firstCard) {
                    const cardWidth = firstCard.offsetWidth;
                    const gap = parseFloat(window.getComputedStyle(testimonialSlider).gap) || 0;
                    testimonialSlider.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' });
                }
            });

            tNextBtn.addEventListener('click', () => {
                const firstCard = testimonialSlider.querySelector('.testimonial-card');
                if (firstCard) {
                    const cardWidth = firstCard.offsetWidth;
                    const gap = parseFloat(window.getComputedStyle(testimonialSlider).gap) || 0;
                    testimonialSlider.scrollBy({ left: (cardWidth + gap), behavior: 'smooth' });
                }
            });
        }
    }
});
