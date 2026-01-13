/**
 * H-SMA-CE Website JavaScript
 * Handles navigation, slideshow, and animations
 */

document.addEventListener('DOMContentLoaded', function() {
    // =====================================================
    // Navigation
    // =====================================================
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    // Navbar scroll effect
    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll(); // Initial check
    
    // Mobile menu toggle
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    
    // Active navigation link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    
    function setActiveNavLink() {
        const scrollY = window.scrollY;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', setActiveNavLink);
    
    // =====================================================
    // Hero Slideshow
    // =====================================================
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.slide-indicator');
    let currentSlide = 0;
    let slideInterval;
    
    function showSlide(index) {
        // Remove active class from all slides and indicators
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Add active class to current slide and indicator
        if (slides[index]) slides[index].classList.add('active');
        if (indicators[index]) indicators[index].classList.add('active');
        
        currentSlide = index;
    }
    
    function nextSlide() {
        let next = currentSlide + 1;
        if (next >= slides.length) next = 0;
        showSlide(next);
    }
    
    function startSlideshow() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    function stopSlideshow() {
        clearInterval(slideInterval);
    }
    
    // Initialize slideshow
    if (slides.length > 0) {
        startSlideshow();
        
        // Click indicators to change slides
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', function() {
                stopSlideshow();
                showSlide(index);
                startSlideshow();
            });
        });
    }
    
    // =====================================================
    // Smooth Scrolling
    // =====================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = target.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // =====================================================
    // Scroll Animations (Fade In)
    // =====================================================
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });
    
    // =====================================================
    // Stats Counter Animation
    // =====================================================
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;
    
    function animateStats() {
        if (statsAnimated) return;
        
        statNumbers.forEach(stat => {
            const text = stat.textContent;
            const match = text.match(/(\d+)/);
            
            if (match) {
                const target = parseInt(match[0]);
                const prefix = text.split(match[0])[0];
                const suffix = text.split(match[0])[1];
                let current = 0;
                const increment = target / 50;
                const duration = 1500;
                const stepTime = duration / 50;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    stat.textContent = prefix + Math.floor(current) + suffix;
                }, stepTime);
            }
        });
        
        statsAnimated = true;
    }
    
    // Observe stats section
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }
    
    // =====================================================
    // Card Hover Effects
    // =====================================================
    const cards = document.querySelectorAll('.card, .partner-card, .feature-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // =====================================================
    // Dropdown handling for touch devices
    // =====================================================
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        
        if (toggle) {
            toggle.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('open');
                }
            });
        }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('open');
            });
        }
    });
    
    // =====================================================
    // Loading animation
    // =====================================================
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
    // =====================================================
    // Taurasi Slideshow (senza overlay blu)
    // =====================================================
    const taurasiSlides = document.querySelectorAll('.taurasi-slide');
    const taurasiIndicators = document.querySelectorAll('.taurasi-indicator');
    let currentTaurasiSlide = 0;
    let taurasiInterval;
    
    function showTaurasiSlide(index) {
        taurasiSlides.forEach(slide => slide.classList.remove('active'));
        taurasiIndicators.forEach(indicator => indicator.classList.remove('active'));
        
        if (taurasiSlides[index]) taurasiSlides[index].classList.add('active');
        if (taurasiIndicators[index]) taurasiIndicators[index].classList.add('active');
        
        currentTaurasiSlide = index;
    }
    
    function nextTaurasiSlide() {
        let next = currentTaurasiSlide + 1;
        if (next >= taurasiSlides.length) next = 0;
        showTaurasiSlide(next);
    }
    
    function startTaurasiSlideshow() {
        taurasiInterval = setInterval(nextTaurasiSlide, 4000);
    }
    
    function stopTaurasiSlideshow() {
        clearInterval(taurasiInterval);
    }
    
    // Initialize Taurasi slideshow
    if (taurasiSlides.length > 0) {
        startTaurasiSlideshow();
        
        taurasiIndicators.forEach((indicator, index) => {
            indicator.addEventListener('click', function() {
                stopTaurasiSlideshow();
                showTaurasiSlide(index);
                startTaurasiSlideshow();
            });
        });
    }

    // =====================================================
    // Lightbox / Image Viewer
    // =====================================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    function openLightbox(src) {
    if (lightbox && lightboxImg) {
        lightboxImg.src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

    if (lightbox && lightboxImg) {
        // Seleziona tutte le immagini cliccabili (conference photos, card images, gallery items)
        const clickableImages = document.querySelectorAll('.conference-photo img, .card-image img, .gallery-item img');

        clickableImages.forEach(img => {
            img.addEventListener('click', function(e) {
                e.stopPropagation(); // Previeni apertura modal della card
                openLightbox(this.src);
            });
        });

        // Chiudi cliccando sulla X
        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }

        // Chiudi cliccando sullo sfondo
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Chiudi con ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                if (lightbox.classList.contains('active')) {
                    closeLightbox();
                }
                // Chiudi anche i detail modal
                const activeModal = document.querySelector('.detail-modal.active');
                if (activeModal) {
                    activeModal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    }

    // =====================================================
    // Detail Modals (Publications & Conferences)
    // =====================================================
    const clickableCards = document.querySelectorAll('.clickable-card');
    const detailModals = document.querySelectorAll('.detail-modal');
    
    // Apri modal al click sulla card
    clickableCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Non aprire se è stato cliccato un link
            if (e.target.closest('a')) return;
            
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Chiudi modal
    detailModals.forEach(modal => {
        // Click sul pulsante chiudi
        const closeBtn = modal.querySelector('.detail-modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
        
        // Click sullo sfondo
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Gestione galleria nei modal delle conferenze
    document.querySelectorAll('.gallery-item img').forEach(img => {
        img.addEventListener('click', function(e) {
            e.stopPropagation();
            openLightbox(this.src);
        });
    });

    console.log('H-SMA-CE Website Initialized');
});