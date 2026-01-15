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


    // --- Smart Download Logic ---

    // 1. Detect OS
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

    // 2. Fetch Release Data & Update UI
    async function initSmartDownloads() {
        const detectedOS = detectOS();
        const heroBtn = document.getElementById('hero-download-btn');
        const navBtn = document.getElementById('nav-cta-btn');

        // Pre-highlight the OS card even before fetch
        if (detectedOS) {
            highlightPlatformCard(detectedOS);
        }

        try {
            const response = await fetch('./latest.json');
            if (!response.ok) throw new Error('Failed to load release data');
            const data = await response.json();

            // Update version badge
            updateVersionBadge(data.version);

            // Update Platform Cards with direct links
            updatePlatformCards(data.platforms);

            // Update Primary CTA Buttons based on OS
            if (detectedOS) {
                updateHeroButton(heroBtn, navBtn, detectedOS, data);
            }

        } catch (error) {
            console.warn('Smart Download Error:', error);
            // Fallback is already set in HTML (GitHub Releases)
        }
    }

    function updateVersionBadge(version) {
        const badge = document.getElementById('version-badge');
        if (badge && version) {
            badge.style.display = 'inline-flex';
            const textSpan = badge.querySelector('.version-text');
            if (textSpan) {
                const displayVersion = version.startsWith('v') ? version : `v${version}`;
                textSpan.textContent = displayVersion;
            }
        }
    }

    function highlightPlatformCard(os) {
        let cardId;
        if (os === 'mac') {
            // Default to Apple Silicon for newer Macs
            cardId = 'dl-mac-arm';
        } else {
            cardId = `dl-${os}`;
        }
        const card = document.getElementById(cardId);
        if (card) {
            card.style.borderColor = 'var(--color-primary)';
            card.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
            card.style.transform = 'scale(1.02) translateY(-4px)';

            // "Recommended" Badge
            if (!card.querySelector('.rec-badge')) {
                const badge = document.createElement('div');
                badge.className = 'rec-badge';
                badge.textContent = 'Recommended';
                badge.style.position = 'absolute';
                badge.style.top = '-12px';
                badge.style.left = '24px';
                badge.style.background = 'var(--color-primary)';
                badge.style.color = '#fff';
                badge.style.padding = '4px 12px';
                badge.style.borderRadius = 'var(--radius-full)';
                badge.style.fontSize = '0.75rem';
                badge.style.fontWeight = '600';
                badge.style.boxShadow = 'var(--shadow-md)';
                card.appendChild(badge);
            }
        }
    }

    function updatePlatformCards(platforms) {
        // Update Mac ARM (Apple Silicon)
        const macArmCard = document.getElementById('dl-mac-arm');
        if (macArmCard && platforms['darwin-aarch64']) {
            macArmCard.href = platforms['darwin-aarch64'].url;
        }

        // Update Mac Intel
        const macIntelCard = document.getElementById('dl-mac-intel');
        if (macIntelCard && platforms['darwin-x86_64']) {
            macIntelCard.href = platforms['darwin-x86_64'].url;
        }

        // Update Windows
        const winCard = document.getElementById('dl-win');
        if (winCard && platforms['windows-x86_64']) {
            winCard.href = platforms['windows-x86_64'].url;
        }

        // Update Linux
        const linuxCard = document.getElementById('dl-linux');
        if (linuxCard && platforms['linux-x86_64']) {
            linuxCard.href = platforms['linux-x86_64'].url;
        }
    }

    function updateHeroButton(heroBtn, navBtn, os, data) {
        let downloadUrl = '';
        let label = 'Download Now';

        if (os === 'mac') {
            // Simplified: Default to Silicon (aarch64) or maybe try to detect?
            // Detection of M1 vs Intel via JS is tricky/unreliable. 
            // Strategy: Link to the 'darwin-aarch64' .dmg by default, or provide a dual option?
            // For this user request: "provide direct download links". 
            // Let's default to Apple Silicon as it's the future.
            if (data.platforms['darwin-aarch64']) {
                downloadUrl = data.platforms['darwin-aarch64'].url;
                label = `Download for macOS`;
            }
        } else if (os === 'win') {
            if (data.platforms['windows-x86_64']) {
                downloadUrl = data.platforms['windows-x86_64'].url;
                label = `Download for Windows`;
            }
        } else if (os === 'linux') {
            if (data.platforms['linux-x86_64']) {
                downloadUrl = data.platforms['linux-x86_64'].url;
                label = `Download for Linux`;
            }
        }

        // Apply updates
        if (downloadUrl) {
            const updateBtn = (btn) => {
                if (!btn) return;
                // Preserve the icon if possible, just update text node
                // btn.innerHTML is tricky if we want to keep SVG. 
                // Let's reconstruct or just update textContent?
                // Reconstructing is safer for layout.
                const svgIcon = btn.querySelector('svg') ? btn.querySelector('svg').outerHTML : '';
                btn.innerHTML = `${svgIcon} ${label} <span style="opacity:0.6; font-size:0.85em; margin-left:6px;">(v${data.version})</span>`;
                // btn.href = downloadUrl; // Keep scroll to #download behavior
            };

            updateBtn(heroBtn);
            // Optional: Update navbar button too?
            // updateBtn(navBtn); // Maybe keep navbar simple
        }
    }

    // Initialize
    initSmartDownloads();

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
