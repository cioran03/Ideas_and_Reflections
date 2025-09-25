// Theme management
class ThemeManager {
  constructor() {
    this.themeToggle = document.getElementById('theme-toggle');
    this.themeIcon = this.themeToggle.querySelector('.theme-icon');
    this.currentTheme = this.getStoredTheme() || this.getPreferredTheme();
    
    this.init();
  }

  init() {
    // Set initial theme
    this.setTheme(this.currentTheme);
    
    // Add event listener for theme toggle
    this.themeToggle.addEventListener('click', () => {
      this.toggleTheme();
    });

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!this.getStoredTheme()) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });

    // Add keyboard support for theme toggle
    this.themeToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggleTheme();
      }
    });
  }

  getStoredTheme() {
    return localStorage.getItem('theme');
  }

  getPreferredTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  setTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.updateThemeIcon(theme);
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  updateThemeIcon(theme) {
    // Add a subtle animation to the icon change
    this.themeIcon.style.transform = 'scale(0.8)';
    
    setTimeout(() => {
      this.themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
      this.themeIcon.style.transform = 'scale(1)';
    }, 150);
  }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Add subtle animations to article links on home page
function initArticleLinkAnimations() {
  const articleLinks = document.querySelectorAll('.article-link');
  
  articleLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
    });
    
    link.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
}

// Add reading progress indicator for article pages
function initReadingProgress() {
  const articleBody = document.querySelector('.article-body');
  if (!articleBody) return;

  // Create progress bar
  const progressBar = document.createElement('div');
  progressBar.className = 'reading-progress';
  progressBar.innerHTML = '<div class="reading-progress-fill"></div>';
  
  // Add CSS for progress bar
  const style = document.createElement('style');
  style.textContent = `
    .reading-progress {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background-color: var(--bg-accent);
      z-index: 1000;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .reading-progress.visible {
      opacity: 1;
    }
    
    .reading-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
      width: 0%;
      transition: width 0.1s ease;
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(progressBar);

  const progressFill = progressBar.querySelector('.reading-progress-fill');

  function updateProgress() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    progressFill.style.width = scrollPercent + '%';
    
    // Show/hide progress bar based on scroll position
    if (scrollTop > 100) {
      progressBar.classList.add('visible');
    } else {
      progressBar.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', updateProgress);
  updateProgress(); // Initial call
}

// Add fade-in animation for content
function initFadeInAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Add fade-in styles
  const style = document.createElement('style');
  style.textContent = `
    .fade-in {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
  `;
  document.head.appendChild(style);

  // Apply fade-in to elements
  const elementsToAnimate = document.querySelectorAll('.article-item, .article-content, .intro');
  elementsToAnimate.forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize theme management
  new ThemeManager();
  
  // Initialize other features
  initSmoothScrolling();
  initArticleLinkAnimations();
  initReadingProgress();
  initFadeInAnimations();
  
  // Add subtle entrance animation to the page
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  }, 100);
});

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
  // Press 'T' to toggle theme
  if (e.key.toLowerCase() === 't' && !e.ctrlKey && !e.altKey && !e.metaKey) {
    const activeElement = document.activeElement;
    if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      document.getElementById('theme-toggle').click();
    }
  }
});

// Handle page visibility changes (pause animations when tab is not visible)
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    document.body.style.animationPlayState = 'paused';
  } else {
    document.body.style.animationPlayState = 'running';
  }
});