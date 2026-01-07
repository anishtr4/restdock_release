document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navCta = document.querySelector('.nav-cta');
    const body = document.body;

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
            navCta.classList.toggle('active');
            body.classList.toggle('no-scroll');
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
                navCta.classList.remove('active');
                body.classList.remove('no-scroll');
            });
        });
    }

    // OS Detection and Highlight
    function detectOS() {
        const platform = navigator.platform.toLowerCase();
        const userAgent = navigator.userAgent.toLowerCase();

        if (platform.includes('mac') || userAgent.includes('mac')) {
            return 'mac';
        } else if (platform.includes('win') || userAgent.includes('win')) {
            return 'win';
        } else if (platform.includes('linux') || userAgent.includes('linux')) {
            return 'linux';
        }
        return null;
    }

    const detectedOS = detectOS();
    if (detectedOS) {
        // Highlight the platform card
        const cardId = `dl-${detectedOS}`;
        const card = document.getElementById(cardId);
        if (card) {
            // Add a special highlight class or styling
            card.style.borderColor = 'var(--color-primary)';
            card.style.background = 'linear-gradient(135deg, rgba(242, 76, 0, 0.1), rgba(255, 255, 255, 0.05))';
            card.style.transform = 'scale(1.05)';

            // Add a "Recommended" badge
            const badge = document.createElement('div');
            badge.textContent = 'Recommended for you';
            badge.style.position = 'absolute';
            badge.style.top = '-12px';
            badge.style.background = 'var(--color-primary)';
            badge.style.color = 'white';
            badge.style.padding = '4px 12px';
            badge.style.borderRadius = '50px';
            badge.style.fontSize = '0.75rem';
            badge.style.fontWeight = '600';
            card.appendChild(badge);
        }

        // Update Hero CTA text if needed, or leave it generic as "Download Now"
        // But we can make it scroll to the specific card
        const heroBtn = document.getElementById('hero-download-btn');
        if (heroBtn) {
            heroBtn.addEventListener('click', (e) => {
                // Default behavior is smooth scroll to #download, which is fine
                // But we could focus the card potentially?
                // Let's stick to default smooth scroll for now.
            });
        }
    }

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll(
        '.section-header, .bento-card, .platform-card, .hero-content > *, .hero-visual'
    );

    // Add initial class to all elements
    revealElements.forEach((el, index) => {
        el.classList.add('reveal-on-scroll');
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');

    // Initial check
    if (window.pageYOffset > 50) {
        navbar.classList.add('scrolled');
    }

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3D Perspective Mouse Movement Effect for Hero
    const heroSection = document.querySelector('.hero');
    const perspectiveWrapper = document.querySelector('.perspective-wrapper');

    if (heroSection && perspectiveWrapper) {
        heroSection.addEventListener('mousemove', (e) => {
            // Calculate mouse position relative to center of hero
            const rect = heroSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg rotation
            const rotateY = ((x - centerX) / centerX) * 5;  // Max 5deg rotation

            perspectiveWrapper.style.transform = `rotateX(${rotateX + 5}deg) rotateY(${rotateY - 10}deg)`;
        });

        heroSection.addEventListener('mouseleave', () => {
            // Reset to default
            perspectiveWrapper.style.transform = 'rotateY(-10deg) rotateX(5deg)';
        });
    }
});
