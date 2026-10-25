/**
 * KAD Labs — Interactive Scripts
 * Lightweight, zero-dependency script for navigation, interactions, and dynamic year.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic copyright year
  const yearElements = document.querySelectorAll('#year, .current-year');
  const currentYear = new Date().getFullYear();
  yearElements.forEach((el) => {
    el.textContent = currentYear;
  });

  // 2. Mobile navigation menu toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');

  if (mobileToggle && mobileDrawer) {
    const toggleMenu = () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      mobileToggle.classList.toggle('active');
      mobileDrawer.classList.toggle('open');
      document.body.style.overflow = !isExpanded ? 'hidden' : '';
    };

    mobileToggle.addEventListener('click', toggleMenu);

    // Close mobile menu when a nav link is clicked
    mobileDrawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (mobileDrawer.classList.contains('open')) {
          toggleMenu();
        }
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        toggleMenu();
      }
    });
  }

  // 3. Phone mockup screenshot switcher (if switcher buttons exist)
  const previewTabs = document.querySelectorAll('[data-preview-target]');
  const previewScreen = document.querySelector('.phone-screen img');

  if (previewTabs.length && previewScreen) {
    previewTabs.forEach((tab) => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        previewTabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        const newSrc = tab.getAttribute('data-preview-target');
        if (newSrc) {
          previewScreen.src = newSrc;
        }
      });
    });
  }

  // 4. Copy email helper
  const copyButtons = document.querySelectorAll('[data-copy-text]');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy-text');
      try {
        await navigator.clipboard.writeText(textToCopy);
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => {
          btn.textContent = originalText;
        }, 2000);
      } catch (err) {
        // Fallback: mailto link click
        window.location.href = `mailto:${textToCopy}`;
      }
    });
  });

  // 5. Active section highlighting for desktop navigation
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav a');

  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
          }
        });
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
  }
});
