/**
 * CodeCraft IT Academy — Main Script
 * Rich animations, particle canvas, calculator, filters, modals, and interactive UI
 */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. Interactive Particle Canvas Background
     -------------------------------------------------------------------------- */
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = Math.random() * 2 + 1;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.color = Math.random() > 0.5 ? 'rgba(99, 102, 241, ' : 'rgba(217, 70, 239, ';
        this.alpha = Math.random() * 0.5 + 0.2;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.alpha + ')';
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color + '0.8)';
        ctx.fill();
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }
    }

    function initParticles() {
      particles = [];
      const count = Math.floor(width / 22); // Responsive density
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }

    function connectParticles() {
      const maxDist = 130;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.15;
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      connectParticles();
      animationFrameId = requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();
  }

  /* --------------------------------------------------------------------------
     2. Cursor Ambient Glow Follower
     -------------------------------------------------------------------------- */
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.innerWidth > 900) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function smoothCursor() {
      currentX += (mouseX - currentX) * 0.1;
      currentY += (mouseY - currentY) * 0.1;
      cursorGlow.style.left = `${currentX}px`;
      cursorGlow.style.top = `${currentY}px`;
      requestAnimationFrame(smoothCursor);
    }
    smoothCursor();
  }

  /* --------------------------------------------------------------------------
     3. Header Scroll Effect & Active Link Highlight
     -------------------------------------------------------------------------- */
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Header background blur toggle
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Back to top visibility
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Scroll spy for navigation
    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // Back to top click event
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --------------------------------------------------------------------------
     4. Mobile Navigation Drawer Toggle & Dropdowns
     -------------------------------------------------------------------------- */
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const dropdownItems = document.querySelectorAll('.has-dropdown');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
    });

    // Close when clicking outside or clicking non-dropdown links
    document.querySelectorAll('.nav-link:not(.has-dropdown > a)').forEach((link) => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
      });
    });

    // Mobile dropdown accordion
    dropdownItems.forEach((item) => {
      const trigger = item.querySelector('.nav-link');
      trigger.addEventListener('click', (e) => {
        if (window.innerWidth <= 900) {
          e.preventDefault();
          item.classList.toggle('mobile-open');
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     5. Typing Text Animation (Hero)
     -------------------------------------------------------------------------- */
  const typingTextEl = document.getElementById('typingText');
  if (typingTextEl) {
    const roles = [
      'Frontend React Dasturchisi',
      'Python & Sun\'iy Intellekt Mutaxassisi',
      'Flutter Mobile Ilova Tuzuvchisi',
      'Java & Spring Enterprise Muhandisi',
      'Professional Kiberxavfsizlik Eksperti'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingDelay = 100;

    function typeLoop() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        typingTextEl.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingDelay = 50;
      } else {
        typingTextEl.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingDelay = 100;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        typingDelay = 2000; // Pause at end of text
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingDelay = 400; // Pause before new word
      }

      setTimeout(typeLoop, typingDelay);
    }

    typeLoop();
  }

  /* --------------------------------------------------------------------------
     6. Hero Visual Code Sandbox Tabs
     -------------------------------------------------------------------------- */
  const codeTabs = document.querySelectorAll('.code-tab');
  const activeCodeBlock = document.getElementById('activeCodeBlock');

  const codeSnippets = {
    js: `<code><span class="token-keyword">const</span> <span class="token-variable">student</span> = {
  <span class="token-property">name</span>: <span class="token-string">"Sardor Alimov"</span>,
  <span class="token-property">role</span>: <span class="token-string">"Junior Fullstack Developer"</span>,
  <span class="token-property">academy</span>: <span class="token-string">"CodeCraft IT Academy"</span>,
  <span class="token-property">salaryGoal</span>: <span class="token-string">"$1,200+"</span>,
  <span class="token-property">skills</span>: [<span class="token-string">"React"</span>, <span class="token-string">"Next.js"</span>, <span class="token-string">"Node.js"</span>, <span class="token-string">"AI"</span>],
  <span class="token-function">learn</span>() {
    <span class="token-keyword">return</span> <span class="token-string">"Muvaffaqiyatli IT karyera kafolati!"</span>;
  }
};

<span class="token-comment">// Natijani konsolga chiqaramiz:</span>
<span class="token-variable">console</span>.<span class="token-function">log</span>(<span class="token-variable">student</span>.<span class="token-function">learn</span>());
<span class="token-output">> "Muvaffaqiyatli IT karyera kafolati!" 🚀</span></code>`,

    py: `<code><span class="token-keyword">from</span> <span class="token-variable">codecraft</span> <span class="token-keyword">import</span> <span class="token-property">AIEngine</span>

<span class="token-keyword">class</span> <span class="token-function">FutureDeveloper</span>:
    <span class="token-keyword">def</span> <span class="token-function">__init__</span>(self, name):
        self.name = name
        self.stack = [<span class="token-string">"Python"</span>, <span class="token-string">"FastAPI"</span>, <span class="token-string">"PyTorch"</span>]
        self.status = <span class="token-string">"Tayyorlovda"</span>

    <span class="token-keyword">def</span> <span class="token-function">train_model</span>(self):
        <span class="token-keyword">return</span> <span class="token-string">f"{self.name} AI modelini 99% aniqlikda o'qitdi!"</span>

dev = <span class="token-function">FutureDeveloper</span>(<span class="token-string">"Siz"</span>)
<span class="token-output">> "Siz AI modelini 99% aniqlikda o'qitdingiz!" 🤖</span></code>`,

    style: `<code><span class="token-property">.it-student</span> {
  <span class="token-keyword">display</span>: flex;
  <span class="token-keyword">mindset</span>: <span class="token-string">unstoppable</span>;
  <span class="token-keyword">skills</span>: <span class="token-string">full-potential</span>;
  <span class="token-keyword">salary</span>: <span class="token-function">calc</span>(100% * hard_work);
  <span class="token-keyword">future</span>: <span class="token-string">bright</span>;
  <span class="token-keyword">animation</span>: grow 24/7 infinite;
}

<span class="token-output">> .it-student { status: 'Senior Developer'; } ✨</span></code>`
  };

  codeTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      codeTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const tabKey = tab.getAttribute('data-tab');
      if (codeSnippets[tabKey]) {
        activeCodeBlock.style.opacity = '0';
        setTimeout(() => {
          activeCodeBlock.innerHTML = codeSnippets[tabKey];
          activeCodeBlock.style.opacity = '1';
        }, 150);
      }
    });
  });

  /* --------------------------------------------------------------------------
     7. Animated Counters (Count-up numbers in Hero)
     -------------------------------------------------------------------------- */
  const statNumbers = document.querySelectorAll('.stat-number');
  let counted = false;

  function countUpNumbers() {
    statNumbers.forEach((el) => {
      const target = +el.getAttribute('data-target');
      const duration = 2000;
      const step = Math.ceil(target / (duration / 25));

      let current = 0;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          el.textContent = target.toLocaleString();
          clearInterval(timer);
        } else {
          el.textContent = current.toLocaleString();
        }
      }, 25);
    });
  }

  // Trigger counters when hero stats are in viewport
  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !counted) {
          countUpNumbers();
          counted = true;
        }
      },
      { threshold: 0.5 }
    );
    statsObserver.observe(statsSection);
  }

  /* --------------------------------------------------------------------------
     8. Course Category Filter Tabs
     -------------------------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const courseCards = document.querySelectorAll('.course-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      courseCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.5s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* --------------------------------------------------------------------------
     9. Interactive Tuition & Discount Calculator
     -------------------------------------------------------------------------- */
  const calcCourseSelect = document.getElementById('calcCourse');
  const formatRadios = document.querySelectorAll('input[name="calcFormat"]');
  const planRadios = document.querySelectorAll('input[name="calcPlan"]');

  const calcMonthlyPrice = document.getElementById('calcMonthlyPrice');
  const calcDuration = document.getElementById('calcDuration');
  const calcSavedAmount = document.getElementById('calcSavedAmount');
  const calcTotalPrice = document.getElementById('calcTotalPrice');

  function calculateTuition() {
    if (!calcCourseSelect) return;

    const selectedOption = calcCourseSelect.options[calcCourseSelect.selectedIndex];
    const baseMonthlyPrice = parseInt(selectedOption.getAttribute('data-price'), 10);
    const months = parseInt(selectedOption.getAttribute('data-months'), 10);

    // Format: offline vs online (-15%)
    let selectedFormat = 'offline';
    formatRadios.forEach((r) => {
      if (r.checked) selectedFormat = r.value;
      const card = r.closest('.calc-radio-card');
      if (r.checked) card.classList.add('active');
      else card.classList.remove('active');
    });

    // Plan: monthly vs full (-20%)
    let selectedPlan = 'monthly';
    planRadios.forEach((r) => {
      if (r.checked) selectedPlan = r.value;
      const card = r.closest('.calc-radio-card');
      if (r.checked) card.classList.add('active');
      else card.classList.remove('active');
    });

    let effectiveMonthly = baseMonthlyPrice;
    if (selectedFormat === 'online') {
      effectiveMonthly = Math.round(effectiveMonthly * 0.85); // 15% discount for online
    }

    let standardTotal = effectiveMonthly * months;
    let finalTotal = standardTotal;
    let saved = 0;

    if (selectedPlan === 'full') {
      saved = Math.round(standardTotal * 0.2); // 20% discount on upfront full payment
      finalTotal = standardTotal - saved;
    }

    // Format currency
    const formatSum = (val) => val.toLocaleString('uz-UZ') + " so'm";

    calcMonthlyPrice.textContent = formatSum(effectiveMonthly);
    calcDuration.textContent = `${months} oy`;
    calcSavedAmount.textContent = formatSum(saved);
    calcTotalPrice.textContent = formatSum(finalTotal);
  }

  if (calcCourseSelect) {
    calcCourseSelect.addEventListener('change', calculateTuition);
    formatRadios.forEach((r) => r.addEventListener('change', calculateTuition));
    planRadios.forEach((r) => r.addEventListener('change', calculateTuition));
    calculateTuition();
  }

  /* --------------------------------------------------------------------------
     10. FAQ Accordion Toggle
     -------------------------------------------------------------------------- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const header = item.querySelector('.faq-header');
    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach((other) => other.classList.remove('active'));

      // If wasn't active, activate it
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  /* --------------------------------------------------------------------------
     11. Modals & Syllabus Dialog
     -------------------------------------------------------------------------- */
  const trialModal = document.getElementById('trialModal');
  const syllabusModal = document.getElementById('syllabusModal');
  const openTrialBtns = document.querySelectorAll('.open-modal-btn');
  const closeTrialModal = document.getElementById('closeTrialModal');
  const closeSyllabusModal = document.getElementById('closeSyllabusModal');
  const syllabusCloseBtn = document.getElementById('syllabusCloseBtn');
  const syllabusEnrollBtn = document.getElementById('syllabusEnrollBtn');
  const viewSyllabusBtns = document.querySelectorAll('.view-syllabus-btn');

  // Open Trial Modal
  openTrialBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (syllabusModal) syllabusModal.classList.remove('active');
      if (trialModal) trialModal.classList.add('active');
      document.body.classList.add('no-scroll');
    });
  });

  // Close Trial Modal
  if (closeTrialModal) {
    closeTrialModal.addEventListener('click', () => {
      trialModal.classList.remove('active');
      document.body.classList.remove('no-scroll');
    });
  }

  // Close Syllabus Modal
  if (closeSyllabusModal) {
    closeSyllabusModal.addEventListener('click', () => {
      syllabusModal.classList.remove('active');
      document.body.classList.remove('no-scroll');
    });
  }
  if (syllabusCloseBtn) {
    syllabusCloseBtn.addEventListener('click', () => {
      syllabusModal.classList.remove('active');
      document.body.classList.remove('no-scroll');
    });
  }
  if (syllabusEnrollBtn) {
    syllabusEnrollBtn.addEventListener('click', () => {
      syllabusModal.classList.remove('active');
      trialModal.classList.add('active');
    });
  }

  // Close modals on clicking backdrop
  window.addEventListener('click', (e) => {
    if (e.target === trialModal) {
      trialModal.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
    if (e.target === syllabusModal) {
      syllabusModal.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
  });

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (trialModal) trialModal.classList.remove('active');
      if (syllabusModal) syllabusModal.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
  });

  // Syllabus Content Mapping
  const syllabusData = {
    'Fullstack JavaScript (React & Node.js)': [
      { module: '1-Modul: Web Asoslari', time: '1-oy', desc: 'HTML5 semantikasi, CSS3 animatsiyalar, Flexbox, CSS Grid, Responsive dizayn, Git & GitHub.' },
      { module: '2-Modul: Chuqur JavaScript (ES6+)', time: '2-oy', desc: 'DOM manipulatsiyasi, Async/Await, Closures, Prototiplar, API bilan ishlash (Fetch/Axios), Algoritmik masalalar.' },
      { module: '3-Modul: Frontend: React & Next.js', time: '3-4-oy', desc: 'React Hooks, Custom Hooks, Redux Toolkit, TailwindCSS, Next.js Server Components, SSR & SEO optimizatsiya.' },
      { module: '4-Modul: Backend: Node.js & Express', time: '5-6-oy', desc: 'REST API qurish, Express.js middleware, MongoDB & PostgreSQL, JWT autentifikatsiya, Fayl yuklash.' },
      { module: '5-Modul: Fullstack Loyiha & Deploy', time: '7-8-oy', desc: 'E-commerce to\'liq loyiha, Docker asoslari, AWS/Vercel serverlarga deploy va Karyera markazida ishga tayyorlov.' }
    ],
    'Python, Django & AI': [
      { module: '1-Modul: Python Fundamentals', time: '1-oy', desc: 'Sintaksis, ma\'lumotlar turlari, funksiyalar, OOP (Ob\'ektga yo\'naltirilgan dasturlash), modullar va Git.' },
      { module: '2-Modul: PostgreSQL & Ma\'lumotlar Bazasi', time: '2-oy', desc: 'SQL so\'rovlari, Relyatsion ma\'lumotlar bazasi, ORM arxitekturasi va optimallashtirish.' },
      { module: '3-Modul: Django & FastAPI', time: '3-4-oy', desc: 'Django Rest Framework (DRF), FastAPI orqali yuqori tezlikdagi APIlar, Celery va Redis.' },
      { module: '4-Modul: Sun\'iy Intellekt & Botlar', time: '5-6-oy', desc: 'Telegram Botlar (Aiogram 3), OpenAI API, LangChain integratsiyasi va Data Science asoslari (Pandas/NumPy).' },
      { module: '5-Modul: Diplom Loyihasi & Intervyu', time: '7-oy', desc: 'Katta miqyosli AI-yordamchi loyihasi, Docker, CI/CD va texnik suhbatlarga tayyorgarlik.' }
    ],
    'Flutter & Dart Mobile Development': [
      { module: '1-Modul: Dart Dasturlash Tili', time: '1-oy', desc: 'Dart sintaksisi, OOP tamoyillari, Asinxron dasturlash (Streams/Futures), Funksional yondashuv.' },
      { module: '2-Modul: Flutter UI & Animatsiyalar', time: '2-oy', desc: 'Widgetlar daraxti, Custom Paint, Responsiv layoutlar, Chiroyli mikro-animatsiyalar.' },
      { module: '3-Modul: State Management & Arxitektura', time: '3-4-oy', desc: 'Bloc/Cubit, Provider, Clean Architecture tamoyillari, Local Caching (Hive/Isar).' },
      { module: '4-Modul: API & Cloud Xizmatlar', time: '5-oy', desc: 'Firebase Authentication, Cloud Firestore, Push Notifications, To\'lov tizimlari (Payme/Click).' },
      { module: '5-Modul: App Store & Play Market', time: '6-oy', desc: 'Ilovani optimizatsiya qilish, do\'konlarga chiqarish va portfolio loyiha yaratish.' }
    ],
    'Java & Spring Boot Enterprise': [
      { module: '1-Modul: Java Core & Algoritmlar', time: '1-2-oy', desc: 'Java OOP, Collections, Multithreading, Exception Handling, Stream API va Design Patterns.' },
      { module: '2-Modul: Ma\'lumotlar Bazasi & Hibernate', time: '3-oy', desc: 'PostgreSQL, JDBC, JPA/Hibernate, Tranzaksiyalar va indekslar bilan ishlash.' },
      { module: '3-Modul: Spring Boot & Security', time: '4-5-oy', desc: 'Spring MVC, Dependency Injection, Spring Security, JWT, OAuth2 va RESTful API.' },
      { module: '4-Modul: Microservices & Cloud', time: '6-7-oy', desc: 'Spring Cloud, Eureka, API Gateway, Apache Kafka, Docker va Kubernetes asoslari.' },
      { module: '5-Modul: Fintech Loyiha Himoyasi', time: '8-oy', desc: 'Bank to\'lov moduli loyihasi va bank/fintech kompaniyalariga ishga yo\'llanma.' }
    ],
    'Kiberxavfsizlik & Ethical Hacking': [
      { module: '1-Modul: Tarmoq & Linux Asoslari', time: '1-oy', desc: 'TCP/IP, DNS, OSI modeli, Linux tizim ma\'muriyati va Bash skript yozish.' },
      { module: '2-Modul: Zaifliklarni Qidirish & Audit', time: '2-oy', desc: 'Nmap, Wireshark, Port skanerlash, Axborot to\'plash (OSINT) metodlari.' },
      { module: '3-Modul: Web Xavfsizligi (OWASP Top 10)', time: '3-4-oy', desc: 'SQL Injection, XSS, CSRF zaifliklarini topish va ularni xavfsiz yopish.' },
      { module: '4-Modul: Pentesting & Metasploit', time: '5-oy', desc: 'Tizimlarni test qilish, exploitlar, ijtimoiy muhandislikdan himoyalanish.' },
      { module: '5-Modul: Sertifikat & Himoya Loyihasi', time: '6-oy', desc: 'Xavfsizlik hisoboti tayyorlash va kiberxavfsizlik mutaxassisi sertifikati.' }
    ],
    'Dasturlash Asoslari (Foundation)': [
      { module: '1-Modul: Kompyuter Savodxonligi & Mantiq', time: '1-oy', desc: 'Kompyuter ishlash prinsiplari, ikkilik sanoq sistemasi, mantiqiy fikrlash testlari.' },
      { module: '2-Modul: C++ Sintaksisi & Konstruktsiyalar', time: '2-oy', desc: 'O\'zgaruvchilar, shart operatorlari (if/else), sikllar (for/while), massivlar va funksiyalar.' },
      { module: '3-Modul: Algoritmlar & Ma\'lumotlar Tuzilmasi', time: '3-oy', desc: 'Saralash algoritmlari, ko\'rsatkichlar (pointers), Git tizimi va keyingi yo\'nalishni tanlash.' }
    ]
  };

  viewSyllabusBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const courseTitle = btn.getAttribute('data-course-title');
      const syllabusModalTitle = document.getElementById('syllabusModalTitle');
      const syllabusModulesList = document.getElementById('syllabusModulesList');

      if (syllabusModalTitle && syllabusModulesList) {
        syllabusModalTitle.textContent = courseTitle;
        const modules = syllabusData[courseTitle] || syllabusData['Fullstack JavaScript (React & Node.js)'];

        syllabusModulesList.innerHTML = modules
          .map(
            (m) => `
            <div class="syllabus-item">
              <div class="syllabus-item-header">
                <strong>${m.module}</strong>
                <span>${m.time}</span>
              </div>
              <p>${m.desc}</p>
            </div>
          `
          )
          .join('');

        syllabusModal.classList.add('active');
        document.body.classList.add('no-scroll');
      }
    });
  });

  /* --------------------------------------------------------------------------
     12. Phone Masking for Forms (+998 __ ___-__-__)
     -------------------------------------------------------------------------- */
  const phoneInputs = document.querySelectorAll('input[type="tel"]');

  phoneInputs.forEach((input) => {
    input.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.startsWith('998')) {
        val = val.substring(3);
      }
      let formatted = '+998 ';
      if (val.length > 0) formatted += '(' + val.substring(0, 2);
      if (val.length >= 2) formatted += ') ' + val.substring(2, 5);
      if (val.length >= 5) formatted += '-' + val.substring(5, 7);
      if (val.length >= 7) formatted += '-' + val.substring(7, 9);

      e.target.value = formatted.substring(0, 19);
    });
  });

  /* --------------------------------------------------------------------------
     13. Form Submission Handling with Animated Toast Notification
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const modalForm = document.getElementById('modalForm');
  const newsletterForm = document.getElementById('newsletterForm');
  const toastNotification = document.getElementById('toastNotification');
  const closeToast = document.getElementById('closeToast');

  function showToast(title, message) {
    if (!toastNotification) return;

    document.getElementById('toastTitle').textContent = title;
    document.getElementById('toastMessage').textContent = message;

    toastNotification.classList.add('active');

    setTimeout(() => {
      toastNotification.classList.remove('active');
    }, 4500);
  }

  if (closeToast) {
    closeToast.addEventListener('click', () => {
      toastNotification.classList.remove('active');
    });
  }

  // Handle Main Contact Form
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Yuborilmoqda...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Qabul qilindi!';
        showToast(
          'Arizangiz muvaffaqiyatli qabul qilindi! 🎉',
          'Mutaxassisimiz 15 daqiqa ichida siz bilan bog\'lanadi va dars jadvalini taqdim etadi.'
        );
        contactForm.reset();

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }, 3000);
      }, 1200);
    });
  }

  // Handle Modal Form
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = modalForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Band qilinmoqda...';
      submitBtn.disabled = true;

      setTimeout(() => {
        trialModal.classList.remove('active');
        document.body.classList.remove('no-scroll');
        modalForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        showToast(
          'Ochiq darsga joyingiz band qilindi! 🚀',
          'Sizga SMS orqali ochiq dars sanasi va lokatsiya yuborildi.'
        );
      }, 1000);
    });
  }

  // Handle Newsletter Form
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast(
        'Obuna bo\'lganingiz uchun rahmat! 📬',
        'Sizga eng sara IT maqolalar va grant e\'lonlarini yuborib turamiz.'
      );
      newsletterForm.reset();
    });
  }

  /* --------------------------------------------------------------------------
     14. Scroll Reveal Animations (Vanilla Intersection Observer)
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

});
