// DOM Elements
const header = document.getElementById('header');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav__link');
const themeToggle = document.getElementById('themeToggle');
const scrollProgress = document.getElementById('scrollProgress');
const particles = document.getElementById('particles');
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const contactForm = document.getElementById('contactForm');
const statNumbers = document.querySelectorAll('.stat-number');

// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-color-scheme', theme);
        const themeIcon = themeToggle ? themeToggle.querySelector('.theme-icon') : null;
        if (themeIcon) themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

// Navigation Manager
class NavigationManager {
    constructor() {
        this.isMenuOpen = false;
        this.init();
    }

    init() {
        navToggle.addEventListener('click', () => this.toggleMenu());
        navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && !e.target.closest('.nav')) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        navToggle.classList.toggle('active', this.isMenuOpen);
        navMenu.classList.toggle('active', this.isMenuOpen);
    }

    closeMenu() {
        this.isMenuOpen = false;
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }
}

// Scroll Manager
class ScrollManager {
    constructor() {
        this.sections = document.querySelectorAll('section[id]');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            this.updateScrollProgress();
            this.updateHeaderState();
            this.highlightActiveNavLink();
        });

        // Smooth scrolling for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / documentHeight) * 100;
        scrollProgress.style.width = `${scrollPercent}%`;
    }

    updateHeaderState() {
        const scrollTop = window.pageYOffset;
        header.classList.toggle('scrolled', scrollTop > 100);
    }

    highlightActiveNavLink() {
        const scrollTop = window.pageYOffset;

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// Animation Manager using Intersection Observer
class AnimationManager {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        this.createObserver();
        this.addAnimationClasses();
    }

    createObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');

                    // Trigger counter animation for stats
                    if (entry.target.classList.contains('stat-number')) {
                        this.animateCounter(entry.target);
                    }
                }
            });
        }, this.observerOptions);
    }

    addAnimationClasses() {
        // Add animation classes to elements
        const fadeInElements = document.querySelectorAll('.about__description, .section-title, .achievement-card, .contact__info');
        fadeInElements.forEach(el => {
            el.classList.add('fade-in');
            this.observer.observe(el);
        });

        const slideLeftElements = document.querySelectorAll('.about__text, .contact__info');
        slideLeftElements.forEach(el => {
            el.classList.add('slide-in-left');
            this.observer.observe(el);
        });

        const slideRightElements = document.querySelectorAll('.about__stats, .contact__form');
        slideRightElements.forEach(el => {
            el.classList.add('slide-in-right');
            this.observer.observe(el);
        });

        // Observe stat numbers for counter animation
        statNumbers.forEach(stat => {
            this.observer.observe(stat);
        });

        // Stagger animation for project cards and experience cards
        this.staggerAnimation('.project-card', 100);
        this.staggerAnimation('.experience-card', 150);
    }

    staggerAnimation(selector, delay) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
            el.classList.add('fade-in');
            el.style.transitionDelay = `${index * delay}ms`;
            this.observer.observe(el);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.target);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        updateCounter();
    }
}

// Particles Animation
class ParticlesManager {
    constructor() {
        this.particlesContainer = particles;
        this.particlesCount = 50;
        this.particles = [];
        this.init();
    }

    init() {
        this.createParticles();
        this.animateParticles();
    }

    createParticles() {
        for (let i = 0; i < this.particlesCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 1}px;
                height: ${Math.random() * 4 + 1}px;
                background: var(--color-primary);
                border-radius: 50%;
                opacity: ${Math.random() * 0.5 + 0.2};
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
            `;

            this.particles.push({
                element: particle,
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2
            });

            this.particlesContainer.appendChild(particle);
        }
    }

    animateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off walls
            if (particle.x <= 0 || particle.x >= window.innerWidth) {
                particle.vx *= -1;
            }
            if (particle.y <= 0 || particle.y >= window.innerHeight) {
                particle.vy *= -1;
            }

            particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px)`;
        });

        requestAnimationFrame(() => this.animateParticles());

        const dot = document.querySelector('.cursor-dot');

        document.addEventListener('mousemove', e => {
            dot.style.left = e.clientX + 'px'; dot.style.top = e.clientY + 'px';
        });

        document.querySelectorAll('a, button, [role="button"]').forEach(el => {
            el.addEventListener('mouseenter', () => dot.classList.add('grow'));
            el.addEventListener('mouseleave', () => dot.classList.remove('grow'));
        });
    }
}

// Projects Filter Manager
class ProjectsFilterManager {
    constructor() {
        this.activeFilter = 'all';
        this.init();
    }

    init() {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => this.handleFilterClick(button));
        });
    }

    handleFilterClick(clickedButton) {
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        clickedButton.classList.add('active');

        const filter = clickedButton.dataset.filter;
        this.filterProjects(filter);
    }

    filterProjects(filter) {
        projectCards.forEach(card => {
            const cardCategory = card.dataset.category;
            const shouldShow = filter === 'all' || cardCategory === filter;

            if (shouldShow) {
                card.classList.remove('filtering-out');
                card.classList.add('filtering-in');
                card.style.display = 'block';
            } else {
                card.classList.remove('filtering-in');
                card.classList.add('filtering-out');
                setTimeout(() => {
                    if (card.classList.contains('filtering-out')) {
                        card.style.display = 'none';
                    }
                }, 300);
            }
        });
    }
}

// Form Manager
class FormManager {
    constructor() {
        this.form = contactForm;
        this.submitBtn = document.getElementById('submitBtn');
        this.formSuccess = document.getElementById('formSuccess');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Add floating label functionality
        const formControls = this.form.querySelectorAll('.form-control');
        formControls.forEach(control => {
            control.addEventListener('focus', () => this.handleInputFocus(control));
            control.addEventListener('blur', () => this.handleInputBlur(control));
            control.addEventListener('input', () => this.clearError(control));
        });
    }

    handleInputFocus(input) {
        const label = input.nextElementSibling;
        if (label && label.classList.contains('form-label')) {
            label.style.transform = 'translateY(-20px) scale(0.8)';
            label.style.color = 'var(--color-primary)';
        }
    }

    handleInputBlur(input) {
        const label = input.nextElementSibling;
        if (label && label.classList.contains('form-label') && !input.value) {
            label.style.transform = 'translateY(0) scale(1)';
            label.style.color = 'var(--color-text-secondary)';
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        if (this.validateForm()) {
            this.showLoading();

            // Simulate form submission
            setTimeout(() => {
                this.showSuccess();
                this.form.reset();

                // Reset floating labels
                const formControls = this.form.querySelectorAll('.form-control');
                formControls.forEach(control => {
                    this.handleInputBlur(control);
                });
            }, 2000);
        }
    }

    validateForm() {
        let isValid = true;
        const requiredFields = ['name', 'email', 'subject', 'message'];

        requiredFields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            const error = document.getElementById(`${fieldName}Error`);

            if (!field.value.trim()) {
                this.showError(field, error, 'This field is required');
                isValid = false;
            } else if (fieldName === 'email' && !this.isValidEmail(field.value)) {
                this.showError(field, error, 'Please enter a valid email address');
                isValid = false;
            }
        });

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showError(field, errorElement, message) {
        field.style.borderColor = 'var(--color-error)';
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    clearError(field) {
        const fieldName = field.getAttribute('id');
        const errorElement = document.getElementById(`${fieldName}Error`);

        field.style.borderColor = 'var(--color-border)';
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    showLoading() {
        this.submitBtn.classList.add('loading');
        this.submitBtn.disabled = true;
    }

    showSuccess() {
        this.submitBtn.classList.remove('loading');
        this.submitBtn.disabled = false;
        this.formSuccess.style.display = 'block';

        setTimeout(() => {
            this.formSuccess.style.display = 'none';
        }, 5000);
    }
}

// Utility Functions
class Utils {
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
}

// Performance optimizations
const optimizedScrollHandler = Utils.throttle(() => {
    scrollManager.updateScrollProgress();
    scrollManager.updateHeaderState();
    scrollManager.highlightActiveNavLink();
}, 16);

// Initialize all managers when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all managers
    const themeManager = new ThemeManager();
    const navigationManager = new NavigationManager();
    const scrollManager = new ScrollManager();
    const animationManager = new AnimationManager();
    const particlesManager = new ParticlesManager();
    const projectsFilterManager = new ProjectsFilterManager();
    const formManager = new FormManager();

    // Add additional event listeners
    window.addEventListener('resize', Utils.debounce(() => {
        // Handle resize events if needed
        particlesManager.particles.forEach(particle => {
            if (particle.x > window.innerWidth) particle.x = window.innerWidth;
            if (particle.y > window.innerHeight) particle.y = window.innerHeight;
        });
    }, 250));

    // Add scroll event listener with throttling
    window.addEventListener('scroll', optimizedScrollHandler);

    // Add smooth hover effects for buttons and cards
    const interactiveElements = document.querySelectorAll('.btn, .card, .project-card, .experience-card, .achievement-card');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function () {
            this.style.transform = this.style.transform || '';
            if (!this.style.transform.includes('scale')) {
                this.style.transform += ' scale(1.02)';
            }
        });

        element.addEventListener('mouseleave', function () {
            this.style.transform = this.style.transform.replace(' scale(1.02)', '');
        });
    });

    // Add keyboard navigation support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navigationManager.isMenuOpen) {
            navigationManager.closeMenu();
        }
    });

    // Add focus management for accessibility
    const focusableElements = document.querySelectorAll('a, button, input, textarea, select');
    focusableElements.forEach(element => {
        element.addEventListener('focus', function () {
            this.style.outline = '2px solid var(--color-primary)';
            this.style.outlineOffset = '2px';
        });

        element.addEventListener('blur', function () {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });

    // Add loading animation to page
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    // Add cursor trail effect (optional)
    let mouseTrail = [];
    document.addEventListener('mousemove', (e) => {
        mouseTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });

        // Limit trail length
        if (mouseTrail.length > 10) {
            mouseTrail.shift();
        }

        // Clean up old trail points
        mouseTrail = mouseTrail.filter(point => Date.now() - point.time < 500);
    });

    // Preload images (if any were specified)
    const imageUrls = ['portrait.jpg', 'workspace.jpg', 'showcase.jpg'];
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });

    // Add error handling for failed image loads
    const imagePlaceholders = document.querySelectorAll('[class*="placeholder"]');
    imagePlaceholders.forEach(placeholder => {
        placeholder.style.transition = 'all 0.3s ease';
        placeholder.addEventListener('mouseenter', function () {
            this.style.background = 'var(--color-secondary)';
        });
        placeholder.addEventListener('mouseleave', function () {
            this.style.background = 'var(--gradient-card)';
        });
    });

    console.log('Portfolio initialized successfully! 🚀');
});

// Export for potential external use
window.PortfolioApp = {
    ThemeManager,
    NavigationManager,
    ScrollManager,
    AnimationManager,
    ParticlesManager,
    ProjectsFilterManager,
    FormManager,
    Utils
};