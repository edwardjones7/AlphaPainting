/* ============================================================
   ALPHA PAINTING - Interactive JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Preloader ---
  const preloader = document.getElementById('preloader');
  document.body.classList.add('loading');

  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.classList.remove('loading');
      animateHero();
    }, 1200);
  });

  // --- Custom Cursor ---
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });

    function animateCursorRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateCursorRing);
    }
    animateCursorRing();

    const hoverElements = document.querySelectorAll('a, button, .portfolio-card, .service-card, .filter-btn');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
    });
  }

  // --- Hero Particles ---
  const particlesContainer = document.getElementById('heroParticles');
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.setProperty('--duration', (4 + Math.random() * 6) + 's');
    particle.style.setProperty('--delay', (Math.random() * 4) + 's');
    particle.style.width = (2 + Math.random() * 4) + 'px';
    particle.style.height = particle.style.width;
    particlesContainer.appendChild(particle);
  }

  // --- Hero Entrance Animation ---
  function animateHero() {
    const heroElements = document.querySelectorAll('.hero .reveal-up');
    heroElements.forEach(el => {
      el.classList.add('revealed');
    });

    // Animate stat counters
    setTimeout(() => {
      animateCounters();
    }, 600);
  }

  // --- Stat Counter Animation ---
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const duration = 2000;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.round(target * eased);

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      }
      requestAnimationFrame(updateCounter);
    });
  }

  // --- Navbar Scroll Effect ---
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTop = document.getElementById('backToTop');

  function handleScroll() {
    const scrollY = window.scrollY;

    // Navbar background
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top button
    if (scrollY > 600) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    // Active nav link
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Back to top click
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // --- Mobile Navigation ---
  const navToggle = document.getElementById('navToggle');
  const navLinksContainer = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinksContainer.classList.toggle('open');
    document.body.style.overflow = navLinksContainer.classList.contains('open') ? 'hidden' : '';
  });

  navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinksContainer.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // --- Scroll Reveal (Intersection Observer) ---
  const revealElements = document.querySelectorAll('.reveal-up:not(.hero .reveal-up), .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Portfolio Filter ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      portfolioItems.forEach((item, index) => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.classList.remove('hidden');
          item.style.animation = `fadeInUp 0.5s ease ${index * 0.05}s both`;
        } else {
          item.classList.add('hidden');
          item.style.animation = '';
        }
      });
    });
  });

  // --- Testimonials Slider ---
  const track = document.getElementById('testimonialsTrack');
  const cards = track.querySelectorAll('.testimonial-card');
  const prevBtn = document.getElementById('testPrev');
  const nextBtn = document.getElementById('testNext');
  const dotsContainer = document.getElementById('testDots');
  let currentSlide = 0;
  let autoSlideInterval;

  // Create dots
  cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('test-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  function goToSlide(index) {
    currentSlide = index;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    dotsContainer.querySelectorAll('.test-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });

    resetAutoSlide();
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % cards.length);
  }

  function prevSlide() {
    goToSlide((currentSlide - 1 + cards.length) % cards.length);
  }

  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(nextSlide, 5000);
  }
  resetAutoSlide();

  // Touch / swipe support for testimonials
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
  }, { passive: true });

  // --- Contact Form ---
  const contactForm = document.getElementById('contactForm');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalContent = submitBtn.innerHTML;

    submitBtn.innerHTML = '<span>Sending...</span>';
    submitBtn.disabled = true;

    setTimeout(() => {
      contactForm.innerHTML = `
        <div class="form-success">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <h3>Message Sent!</h3>
          <p>Thank you for reaching out. We'll get back to you within 24 hours with a detailed estimate for your project.</p>
        </div>
      `;
    }, 1500);
  });

  // --- Smooth Scroll for All Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // --- Parallax Effect on Hero ---
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroContent = document.querySelector('.hero-content');
    if (heroContent && scrollY < window.innerHeight) {
      heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
      heroContent.style.opacity = 1 - (scrollY / window.innerHeight) * 0.8;
    }
  }, { passive: true });

  // --- Service Cards Tilt Effect ---
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.service-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

});

// CSS animation keyframe for filter
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);
