document.addEventListener('DOMContentLoaded', () => {
  // --- Theme Management ---
  const themeToggleBtn = document.getElementById('theme-toggle');
  
  const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  };

  // Initialize Theme
  const currentTheme = getPreferredTheme();
  setTheme(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  }

  // --- Mobile Menu ---
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      mobileToggle.classList.toggle('active');
    });

    // Close menu when clicking links
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileToggle.classList.remove('active');
      });
    });
  }

  // --- Scroll Spy & Nav Highlight ---
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a');

  const scrollSpy = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');
      const targetNavLink = document.querySelector(`.nav-links a[href*=${sectionId}]`);

      if (targetNavLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navItems.forEach(item => item.classList.remove('active'));
          targetNavLink.classList.add('active');
        } else {
          targetNavLink.classList.remove('active');
        }
      }
    });
  };
  
  if (sections.length > 0) {
    window.addEventListener('scroll', scrollSpy);
  }

  // --- Intersection Observer for Skill Bars & Animations ---
  const skillProgressBars = document.querySelectorAll('.skill-progress');
  if (skillProgressBars.length > 0) {
    const skillObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const progress = bar.getAttribute('data-progress');
          bar.style.width = `${progress}%`;
          observer.unobserve(bar);
        }
      });
    }, { threshold: 0.1 });

    skillProgressBars.forEach(bar => skillObserver.observe(bar));
  }

  // Fade-in animations for section components
  const animateElements = document.querySelectorAll('.timeline-content, .pillar-card, .highlight-card');
  if (animateElements.length > 0) {
    // Add base CSS styling inline for simplicity, or it's handled via classes
    animateElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });

    const animationObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          target.style.opacity = '1';
          target.style.transform = 'translateY(0)';
          observer.unobserve(target);
        }
      });
    }, { threshold: 0.1 });

    animateElements.forEach(el => animationObserver.observe(el));
  }

  // --- Publications Filtering & Search ---
  const searchInput = document.getElementById('pub-search');
  const filterTabs = document.querySelectorAll('.filter-tab');
  const pubCards = document.querySelectorAll('.pub-card');

  const filterPublications = () => {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const activeFilter = document.querySelector('.filter-tab.active')?.getAttribute('data-filter') || 'all';

    pubCards.forEach(card => {
      const title = card.querySelector('.pub-title')?.textContent.toLowerCase() || '';
      const authors = card.querySelector('.pub-authors')?.textContent.toLowerCase() || '';
      const journal = card.querySelector('.pub-journal')?.textContent.toLowerCase() || '';
      const category = card.getAttribute('data-category');

      const matchesSearch = title.includes(query) || authors.includes(query) || journal.includes(query);
      const matchesFilter = activeFilter === 'all' || category === activeFilter;

      if (matchesSearch && matchesFilter) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  };

  if (searchInput) {
    searchInput.addEventListener('input', filterPublications);
  }

  if (filterTabs.length > 0) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        filterPublications();
      });
    });
  }

  // --- Work Experience (sidvash.com style) ---
  const weDetails = [
    {
      logo: 'assets/img/inrim.svg',
      company: 'National Institute of Metrological Research (INRiM), Torino, Italy',
      meta: 'Junior Scientist · Apr 2023 – Jun 2023',
      desc: 'Collaborated with Dr. Matteo Fretto and Dr. Natascia De Leo. Probed the superconducting energy gap in NbN nanofilms via Andreev Reflection Spectroscopy, developing a novel fabrication methodology for point-contact spectroscopy devices.'
    },
    {
      logo: 'assets/img/iiser.svg',
      company: 'Indian Institute of Science Education and Research (IISER), Tirupati, India',
      meta: 'Research Associate · Aug 2017 – Aug 2019',
      desc: 'Collaborated with Dr. Dileep Mampallil. Developed a Surface Acoustic Wave (SAW) microfluidic platform with integrated polydimethylsiloxane (PDMS) microchannels, designed for in vitro live-cell imaging of root-bacteria interactions.'
    },
    {
      logo: 'assets/img/isro.svg',
      company: 'Indian Space Research Organization (ISRO), Ahmedabad, India',
      meta: 'Research Intern · Jan 2016 – Jan 2017',
      desc: 'Collaborated with Dr. Kamlesh C. Pargein. Conducted M.Sc. thesis research on optimizing and fabricating SAW wire grid polarizers with 70 nm feature sizes for enhanced performance in space-borne satellite payloads.'
    },
    {
      logo: 'assets/img/npl.svg',
      company: 'National Physical Laboratory (NPL), New Delhi, India',
      meta: 'Research Intern · Apr 2015 – Jun 2015',
      desc: 'Worked with Dr. S.P. Singh on chemical synthesis and process optimization of iron disulfide nanoparticles to increase the photon conversion efficiency of photovoltaic solar cells.'
    }
  ];

  let activeBtn = null;

  window.weShowDetail = function(idx, btn) {
    const d = weDetails[idx];
    const panel = document.getElementById('we-detail-panel');

    // Toggle off if same button clicked again
    if (activeBtn === btn && panel.classList.contains('we-panel-visible')) {
      window.weCloseDetail();
      return;
    }

    // Reset all active states
    document.querySelectorAll('.we-logo-btn').forEach(b => b.classList.remove('we-active'));
    btn.classList.add('we-active');
    activeBtn = btn;

    document.getElementById('we-d-logo').src = d.logo;
    document.getElementById('we-d-logo').alt = d.company;
    document.getElementById('we-d-company').textContent = d.company;
    document.getElementById('we-d-meta').textContent = d.meta;
    document.getElementById('we-d-desc').innerHTML = d.desc;

    // Re-trigger animation
    panel.classList.remove('we-panel-visible');
    void panel.offsetWidth; // Reflow
    panel.classList.add('we-panel-visible');

    // Scroll into view on mobile
    if (window.innerWidth < 700) {
      setTimeout(() => {
        panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 80);
    }
  };

  window.weCloseDetail = function() {
    const panel = document.getElementById('we-detail-panel');
    if (panel) {
      panel.classList.remove('we-panel-visible');
    }
    document.querySelectorAll('.we-logo-btn').forEach(b => b.classList.remove('we-active'));
    activeBtn = null;
  };

  // Close detail panel when clicking outside
  document.addEventListener('click', (e) => {
    const grid = document.getElementById('we-logo-grid');
    const panel = document.getElementById('we-detail-panel');
    if (grid && panel && !grid.contains(e.target) && !panel.contains(e.target)) {
      window.weCloseDetail();
    }
  });

  // --- Copy Citation / BibTeX functionality ---
  window.copyCitation = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Citation copied to clipboard!');
    }).catch(err => {
      console.error('Error copying citation:', err);
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed'; // Avoid scrolling
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        showToast('Citation copied to clipboard!');
      } catch (e) {
        showToast('Failed to copy. Please select and copy manually.');
      }
      document.body.removeChild(textarea);
    });
  };

  const showToast = (message) => {
    let toast = document.getElementById('toast-notification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast-notification';
      toast.className = 'toast-notification';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  };
});
