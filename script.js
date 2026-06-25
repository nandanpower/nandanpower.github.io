/* ============================================
   NANDAN POWER – Main JavaScript
   Handles all interactive features
   ============================================ */

'use strict';

/* ─────────────────────────────────────────────
   DOM Ready Wrapper
   ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  /* ───── Cache DOM Elements ───── */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const scrollProgress = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');
  const sections = document.querySelectorAll('section[id]');
  const statNumbers = document.querySelectorAll('.stat-number');
  const timeline = document.querySelector('.timeline');
  const testimonialsTrack = document.getElementById('testimonialsTrack');
  const sliderPrev = document.getElementById('sliderPrev');
  const sliderNext = document.getElementById('sliderNext');
  const sliderDots = document.querySelectorAll('.slider-dot');


  /* ─────────────────────────────────────────────
     1. Navbar – Shrink on Scroll
     ───────────────────────────────────────────── */
  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }


  /* ─────────────────────────────────────────────
     2. Scroll Progress Indicator
     ───────────────────────────────────────────── */
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
  }


  /* ─────────────────────────────────────────────
     3. Back to Top Button
     ───────────────────────────────────────────── */
  function handleBackToTop() {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ─────────────────────────────────────────────
     4. Active Nav Link Highlighting
     ───────────────────────────────────────────── */
  function highlightActiveSection() {
    const scrollPos = window.scrollY + 120;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }


  /* ─────────────────────────────────────────────
     5. Mobile Hamburger Menu
     ───────────────────────────────────────────── */
  function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');
    const isOpen = navMenu.classList.contains('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  hamburger.addEventListener('click', toggleMobileMenu);

  // Close mobile menu when a link is clicked
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        toggleMobileMenu();
      }
    });
  });

  // Close mobile menu on outside click
  document.addEventListener('click', (e) => {
    if (
      navMenu.classList.contains('open') &&
      !navMenu.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      toggleMobileMenu();
    }
  });

  // Close mobile menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      toggleMobileMenu();
      hamburger.focus();
    }
  });


  /* ─────────────────────────────────────────────
     6. Scroll Reveal Animations
     ───────────────────────────────────────────── */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));


  /* ─────────────────────────────────────────────
     7. Animated Counters
     ───────────────────────────────────────────── */
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;

    statNumbers.forEach((counter) => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const duration = 2000; // ms
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out curve for a natural deceleration effect
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);

        counter.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      }

      requestAnimationFrame(updateCounter);
    });

    countersAnimated = true;
  }

  // Observe the stats section to trigger counters
  const statsSection = document.getElementById('stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    statsObserver.observe(statsSection);
  }


  /* ─────────────────────────────────────────────
     8. Timeline Animation
     ───────────────────────────────────────────── */
  if (timeline) {
    const timelineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            timeline.classList.add('animated');
            timelineObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    timelineObserver.observe(timeline);
  }


  /* ─────────────────────────────────────────────
     9. Testimonials Slider
     ───────────────────────────────────────────── */
  let currentSlide = 0;
  const totalSlides = 3;
  let slideInterval;

  function goToSlide(index) {
    currentSlide = ((index % totalSlides) + totalSlides) % totalSlides;
    testimonialsTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

    // Update dots
    sliderDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
      dot.setAttribute('aria-selected', i === currentSlide);
    });
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  // Auto-slide
  function startAutoSlide() {
    slideInterval = setInterval(nextSlide, 5000);
  }

  function stopAutoSlide() {
    clearInterval(slideInterval);
  }

  sliderNext.addEventListener('click', () => {
    stopAutoSlide();
    nextSlide();
    startAutoSlide();
  });

  sliderPrev.addEventListener('click', () => {
    stopAutoSlide();
    prevSlide();
    startAutoSlide();
  });

  sliderDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      stopAutoSlide();
      goToSlide(parseInt(dot.getAttribute('data-index'), 10));
      startAutoSlide();
    });
  });

  // Pause auto-slide on hover
  const sliderContainer = document.querySelector('.testimonials-slider');
  if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', stopAutoSlide);
    sliderContainer.addEventListener('mouseleave', startAutoSlide);
  }

  // Touch/swipe support for testimonials
  let touchStartX = 0;
  let touchEndX = 0;

  if (testimonialsTrack) {
    testimonialsTrack.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    testimonialsTrack.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeThreshold = 50;
      if (touchStartX - touchEndX > swipeThreshold) {
        stopAutoSlide();
        nextSlide();
        startAutoSlide();
      } else if (touchEndX - touchStartX > swipeThreshold) {
        stopAutoSlide();
        prevSlide();
        startAutoSlide();
      }
    }, { passive: true });
  }

  startAutoSlide();


  /* ─────────────────────────────────────────────
     10. Smooth Scroll for Anchor Links
     ───────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });


  /* ─────────────────────────────────────────────
     11. Lazy Loading Images (native fallback)
     ───────────────────────────────────────────── */
  if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading – nothing to do
  } else {
    // Fallback: observe images with loading="lazy"
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const lazyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.src; // trigger load
          lazyObserver.unobserve(img);
        }
      });
    });
    lazyImages.forEach((img) => lazyObserver.observe(img));
  }


  /* ─────────────────────────────────────────────
     12. Combined Scroll Handler (Throttled)
     ───────────────────────────────────────────── */
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleNavbarScroll();
        updateScrollProgress();
        handleBackToTop();
        highlightActiveSection();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Run once on load
  handleNavbarScroll();
  updateScrollProgress();
  handleBackToTop();
  highlightActiveSection();


  /* ─────────────────────────────────────────────
     13. Keyboard Accessibility
     ───────────────────────────────────────────── */
  // Add focus-visible class support for older browsers
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-user');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-user');
  });

});
