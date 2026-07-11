/* ====================================================
   ALI SOFTWARE STUDIO - Main JavaScript
   ==================================================== */

'use strict';

// ========== DOM READY ==========
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNavigation();
  initScrollEffects();
  initCounterAnimation();
  initFadeInObserver();
  initContactForm();
  initBackToTop();
  initSmoothScroll();
});

// ========== LOADING SCREEN ==========
function initLoader() {
  const loadingScreen = document.getElementById('loading-screen');

  window.addEventListener('load', () => {
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
    }, 1500);
  });

  // Fallback: hide loader after 3 seconds even if load event already fired
  setTimeout(() => {
    if (!loadingScreen.classList.contains('hidden')) {
      loadingScreen.classList.add('hidden');
    }
  }, 3000);
}

// ========== NAVIGATION ==========
function initNavigation() {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Toggle mobile menu
  navToggle.addEventListener('click', () => {
    const isActive = navMenu.classList.contains('active');
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', !isActive);
    document.body.style.overflow = isActive ? '' : 'hidden';
  });

  // Close menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Set active link based on scroll position
  const sections = document.querySelectorAll('section[id]');

  function updateActiveLink() {
    let current = '';
    const scrollPosition = window.scrollY + 150;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink();
}

// ========== SCROLL EFFECTS ==========
function initScrollEffects() {
  const header = document.getElementById('header');
  const backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Header background
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Back to top button
    if (scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });
}

// ========== COUNTER ANIMATION ==========
function initCounterAnimation() {
  const counters = document.querySelectorAll('.stat-number');
  let animated = false;

  function animateCounters() {
    if (animated) return;

    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const totalFrames = 60;
      const increment = target / totalFrames;
      let current = 0;
      let frame = 0;

      const updateCounter = () => {
        frame++;
        current = Math.min(Math.round(increment * frame), target);
        counter.textContent = current;

        if (frame < totalFrames) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };

      updateCounter();
    });

    animated = true;
  }

  // Trigger when hero stats are in view
  const heroStats = document.querySelector('.hero-stats');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  if (heroStats) {
    observer.observe(heroStats);
  }
}

// ========== FADE IN OBSERVER ==========
function initFadeInObserver() {
  const fadeElements = document.querySelectorAll('.fade-in');

  // Check for IntersectionObserver support
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(el => observer.observe(el));
  } else {
    // Fallback: make all elements visible immediately
    fadeElements.forEach(el => el.classList.add('visible'));
  }
}

// ========== CONTACT FORM ==========
function initContactForm() {
  const form = document.getElementById('contact-form');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject') || 'New Inquiry from Ali Software Studio',
      message: formData.get('message')
    };

    // Simple validation
    if (!data.name || !data.email || !data.message) {
      showFormMessage('Please fill in all required fields.', 'error');
      return;
    }

    if (!isValidEmail(data.email)) {
      showFormMessage('Please enter a valid email address.', 'error');
      return;
    }

    // Show loading state
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    try {
      // Send email using FormSubmit
      const formDataToSend = new FormData();
      formDataToSend.append('name', data.name);
      formDataToSend.append('email', data.email);
      formDataToSend.append('subject', data.subject);
      formDataToSend.append('message', data.message);

      const response = await fetch('https://formsubmit.co/ajax/MuhammedAli46@gmail.com', {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        showFormMessage(
          '✓ Thank you! Your message has been sent successfully. I will get back to you shortly.',
          'success'
        );
        form.reset();
      } else {
        showFormMessage(
          'Error sending message. Please try again or contact us directly via WhatsApp.',
          'error'
        );
      }
    } catch (error) {
      console.error('Form submission error:', error);
      showFormMessage(
        'Error sending message. Please try WhatsApp: +92 314 9663093',
        'error'
      );
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFormMessage(message, type) {
  // Remove any existing message
  const existingMsg = document.querySelector('.form-message');
  if (existingMsg) existingMsg.remove();

  const msgDiv = document.createElement('div');
  msgDiv.className = `form-message form-message-${type}`;
  msgDiv.textContent = message;
  msgDiv.style.cssText = `
    padding: 14px 18px;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 500;
    margin-top: 16px;
    animation: fadeInUp 0.3s ease;
    ${type === 'success'
      ? 'background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.2); color: #22C55E;'
      : 'background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); color: #EF4444;'
    }
  `;

  const form = document.getElementById('contact-form');
  form.appendChild(msgDiv);

  // Auto remove after 5 seconds
  setTimeout(() => {
    msgDiv.style.opacity = '0';
    msgDiv.style.transform = 'translateY(10px)';
    msgDiv.style.transition = 'all 0.3s ease';
    setTimeout(() => msgDiv.remove(), 300);
  }, 5000);
}

// ========== BACK TO TOP ==========
function initBackToTop() {
  const backToTop = document.getElementById('back-to-top');

  backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ========== SMOOTH SCROLL ==========
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = document.getElementById('header').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ========== ADD DYNAMIC CSS ==========
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);
