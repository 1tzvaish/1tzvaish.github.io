/* ==========================================================================
   MATRIX BACKGROUND ANIMATION
   ========================================================================== */
function initMatrixRain() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Set canvas size
  function resizeCanvas() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Characters used for rain (Cyberpunk Mix of Katakana & Binary/Hex)
  const chars = '01010101ABCDEFGHIJKLMNOPQRSTUVWXYZｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';
  const charArr = chars.split('');
  
  const fontSize = 14;
  let columns = Math.floor(canvas.width / fontSize);
  
  // Array of drops - one per column, initialized at random Y positions
  let drops = [];
  for (let x = 0; x < columns; x++) {
    drops[x] = Math.random() * -100;
  }

  // Adjust columns count if resized
  window.addEventListener('resize', () => {
    const newColumns = Math.floor(canvas.width / fontSize);
    if (newColumns > columns) {
      for (let x = columns; x < newColumns; x++) {
        drops[x] = Math.random() * -100;
      }
    }
    columns = newColumns;
  });

  // Rain loop
  function draw() {
    // Semi-transparent black background to create trail effect
    ctx.fillStyle = 'rgba(10, 10, 10, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Green text, varying opacity for depth
    ctx.font = fontSize + 'px "Fira Code", monospace';

    for (let i = 0; i < drops.length; i++) {
      // Pick a random char
      const text = charArr[Math.floor(Math.random() * charArr.length)];
      
      // Randomize color slightly (mostly neon green, some bright highlights)
      if (Math.random() > 0.98) {
        ctx.fillStyle = '#00d4ff'; // Bright Blue glitch highlight
      } else if (Math.random() > 0.95) {
        ctx.fillStyle = '#ffffff'; // White highlight
      } else {
        ctx.fillStyle = '#00ff41'; // Neon Green
      }

      // x coordinate = column index * font size
      // y coordinate = drop index * font size
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      ctx.fillText(text, x, y);

      // Sending drop back to top randomly after it has crossed screen
      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }

      // Move drop down
      drops[i]++;
    }
  }

  // Set interval
  setInterval(draw, 33);
}

/* ==========================================================================
   TYPING EFFECT
   ========================================================================== */
function initTypingEffect() {
  const textElement = document.getElementById('typed-role');
  if (!textElement) return;

  const roles = [
    "Python Developer",
    "Cybersecurity Enthusiast",
    "MCA Student @ Amrita",
    "Former IEDC Lead"
  ];
  
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      // Deleting character
      textElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // Delete faster
    } else {
      // Typing character
      textElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 120; // Normal typing speed
    }

    // Checking if full word is typed
    if (!isDeleting && charIndex === currentRole.length) {
      // Pause at the end of word
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      // Cycle to next role
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500; // Brief pause before typing next word
    }

    setTimeout(type, typingSpeed);
  }

  // Start typing
  setTimeout(type, 1000);
}

/* ==========================================================================
   CUSTOM CURSOR LOGIC
   ========================================================================== */
function initCustomCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;

  // Move dots
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // The dot follows mouse position exactly
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  // Ring delay/interpolation loop
  function updateRing() {
    // Linear interpolation: delay factor 0.15
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;

    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';

    requestAnimationFrame(updateRing);
  }
  updateRing();

  // Add hover effect states
  const hoverElements = document.querySelectorAll('a, button, input, textarea, .project-card, .cert-card, .hamburger, #header-logo');
  hoverElements.forEach(elem => {
    elem.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
    });
    elem.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
  });
}

/* ==========================================================================
   SCROLL REVEAL & STATS FILL LOGIC
   ========================================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.scroll-reveal');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Trigger skill progress bar animations specifically
        const skillBars = entry.target.querySelectorAll('.skill-bar-fill');
        if (skillBars.length > 0) {
          skillBars.forEach(bar => {
            const targetVal = bar.getAttribute('data-percent');
            bar.style.width = targetVal;
          });
        }
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  reveals.forEach(rev => observer.observe(rev));
}

/* ==========================================================================
   TIMELINE PROGRESS LINE FILL
   ========================================================================== */
function initTimelineProgress() {
  const timelineProgress = document.getElementById('timeline-progress');
  const timelineSection = document.getElementById('experience');
  
  if (!timelineProgress || !timelineSection) return;

  window.addEventListener('scroll', () => {
    const sectionRect = timelineSection.getBoundingClientRect();
    const sectionHeight = timelineSection.offsetHeight;
    const windowHeight = window.innerHeight;
    
    // Calculate progress when the section enters the screen
    // Starts filling when top is at 80% screen height, ends when bottom is at 20% height
    const startPoint = windowHeight * 0.8;
    const endPoint = windowHeight * 0.2;
    
    let progress = 0;
    
    if (sectionRect.top < startPoint) {
      const scrollableDist = sectionHeight + (startPoint - endPoint);
      const scrolledDist = startPoint - sectionRect.top;
      
      progress = (scrolledDist / scrollableDist) * 100;
      progress = Math.max(0, Math.min(100, progress)); // Clamp between 0% and 100%
    }
    
    timelineProgress.style.height = progress + '%';
  });
}

/* ==========================================================================
   CERTIFICATIONS FILTER LOGIC
   ========================================================================== */
function initCertificationsFilter() {
  const filterBtns = document.querySelectorAll('.cert-filter-btn');
  const certCards = document.querySelectorAll('.cert-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      certCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.8)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ==========================================================================
   HEADER NAVIGATION CONTROL
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  const scrollTopBtn = document.getElementById('scroll-top-btn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (window.scrollY > 500) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// Mobile Hamburger Menu
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
}

/* ==========================================================================
   CONTACT FORM DISPATCH SIMULATION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const responseMsg = document.getElementById('form-response');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');

    // Show loading state
    btnText.classList.add('hidden');
    btnLoader.classList.remove('hidden');
    submitBtn.disabled = true;
    responseMsg.className = 'form-response-msg';
    responseMsg.textContent = '';

    // Extract form variables
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Simulate server transmission delay (1.5s)
    setTimeout(() => {
      // Revert loading states
      btnText.classList.remove('hidden');
      btnLoader.classList.add('hidden');
      submitBtn.disabled = false;

      // Success visual simulation
      responseMsg.classList.add('success');
      responseMsg.innerHTML = `<i class="fa-solid fa-square-check"></i> TRAN_SUCCESS: Packets deployed! Thank you, ${name}. I will contact you shortly.`;
      
      // Reset form fields
      form.reset();
    }, 1500);
  });
}

/* ==========================================================================
   INTERACTIVE CYBER CONSOLE EASTER EGG (Ctrl + `)
   ========================================================================== */
function initEasterEggTerminal() {
  const overlay = document.getElementById('terminal-overlay');
  const termClose = document.getElementById('term-close-btn');
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  const logo = document.getElementById('header-logo');

  if (!overlay || !input || !output) return;

  let terminalOpen = false;

  // Toggle terminal function
  function toggleTerminal() {
    terminalOpen = !terminalOpen;
    if (terminalOpen) {
      overlay.style.display = 'flex';
      input.focus();
      // Initialize with boot sequence if empty
      if (output.children.length === 0) {
        runBootSequence();
      }
    } else {
      overlay.style.display = 'none';
    }
  }

  // Keyboard shortcut listener
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === '`') {
      e.preventDefault();
      toggleTerminal();
    }
  });

  // Close button
  if (termClose) {
    termClose.addEventListener('click', toggleTerminal);
  }

  // Click logo to trigger
  if (logo) {
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      toggleTerminal();
    });
  }

  // Clicking anywhere inside terminal refocuses the input
  overlay.addEventListener('click', (e) => {
    if (e.target.id === 'terminal-overlay' || e.target.id === 'terminal-window' || e.target.id === 'terminal-output') {
      input.focus();
    }
  });

  // CLI execution handler
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const commandLine = input.value.trim();
      input.value = '';

      if (commandLine === '') return;

      // Print prompt and command first
      printLine(`guest@vaishnav_nodes:~$ ${commandLine}`, 'terminal-user');

      // Parse command
      executeCommand(commandLine);
    }
  });

  // Helpers
  function printLine(text, className = '') {
    const line = document.createElement('div');
    line.className = 'terminal-line-text ' + className;
    line.innerHTML = text;
    output.appendChild(line);

    // Scroll to bottom
    const win = document.getElementById('terminal-window');
    win.scrollTop = win.scrollHeight;
  }

  function runBootSequence() {
    printLine('INITIALIZING CYBERCONSOLE V2.5...', 'highlight-blue');
    
    const bootLines = [
      { text: '[ OK ] Kernel Core Loaded (Antigravity v3.1.2)', delay: 100 },
      { text: '[ OK ] Security Protocols Initialized', delay: 250 },
      { text: '[ OK ] Resolving DNS parameters for node: Kollam, India', delay: 400 },
      { text: '[ OK ] Decrypting Vaishnav B credential blocks...', delay: 600 },
      { text: '[ OK ] SECURE SOCKET ESTABLISHED. CONNECTION ACTIVE.', delay: 750 },
      { text: '\n======================================================', delay: 850 },
      { text: '     _  _  _  _  _  _  _  _  _  _  _  _  _  _  _ \n    (V)(A)(I)(S)(H)(N)(A)(V)(_)(B)(/)(/)(P)(O)(R)(T)', delay: 900 },
      { text: '======================================================', delay: 950 },
      { text: 'Welcome to Vaishnav\'s Node Console.', delay: 1050 },
      { text: 'Type "help" to view a list of authorized core commands.\n', delay: 1150 }
    ];

    bootLines.forEach(line => {
      setTimeout(() => {
        printLine(line.text);
      }, line.delay);
    });
  }

  function executeCommand(cmd) {
    const tokens = cmd.toLowerCase().split(' ');
    const coreCmd = tokens[0];

    switch (coreCmd) {
      case 'help':
        printLine('Available Core Operations:');
        printLine('  help      - Outputs available commands.');
        printLine('  about     - Decrypts Vaishnav\'s personal profile.');
        printLine('  skills    - Loads technical competency grids.');
        printLine('  projects  - Outputs active software projects.');
        printLine('  scan      - RUN VIRTUAL PORT SCAN ON LOCAL SYSTEMS.');
        printLine('  clear     - Clears the console output buffers.');
        printLine('  exit      - Terminates interactive shell.');
        break;

      case 'about':
        printLine('NODE IDENTITY: Vaishnav B');
        printLine('ACADEMICS: Integrated MCA @ Amrita (2021-2026)');
        printLine('BIO: Passionate Python Developer and Cybersecurity enthusiast. Focuses on network tools, secure development pipelines, and administrative leadership (having served as the IEDC Lead).');
        printLine('LOCATION: Kollam, Kerala, India');
        break;

      case 'skills':
        printLine('LOADING SKILLS PROFILE...');
        printLine('Python       [==================] 90%');
        printLine('SQL          [=================>] 85%');
        printLine('HTML/CSS/JS  [================]   80%');
        printLine('SecConcepts  [================]   85%');
        printLine('Networking   [================]   80%');
        printLine('Linux/Bash   [===============]    75%');
        break;

      case 'projects':
        printLine('DECRYPTING PROJECT LOGS...');
        const tableHtml = `
<table class="term-table">
  <thead>
    <tr><th>ID</th><th>PROJECT NAME</th><th>YEAR</th><th>TECH STACK</th><th>STATUS</th></tr>
  </thead>
  <tbody>
    <tr><td>01</td><td>Developer Portfolio</td><td>2026</td><td>HTML5, CSS3, JavaScript, Git</td><td>LIVE</td></tr>
    <tr><td>02</td><td>Port Scanner</td><td>2026</td><td>Python, Sockets, Threading, Linux</td><td>STABLE</td></tr>
    <tr><td>03</td><td>Smart File Organizer</td><td>2025</td><td>Python, Tkinter, File System API</td><td>RESOLVED</td></tr>
    <tr><td>04</td><td>To-Do List Web App</td><td>2025</td><td>Python, SQLite, HTML, CSS</td><td>STABLE</td></tr>
    <tr><td>05</td><td>Car Rental System</td><td>2024</td><td>HTML, CSS, JS, PHP, SQL</td><td>RESOLVED</td></tr>
    <tr><td>06</td><td>Unified Attendance System</td><td>2023</td><td>HTML, CSS, JS, PHP, SQL</td><td>RESOLVED</td></tr>
  </tbody>
</table>`;
        printLine(tableHtml);
        break;

      case 'clear':
        output.innerHTML = '';
        break;

      case 'exit':
        toggleTerminal();
        break;

      case 'scan':
        runPortScanSimulation();
        break;

      default:
        printLine(`shell: command not found: ${coreCmd}. Type "help" for a list of valid parameters.`, 'glow-text-blue');
    }
  }

  // Simulated scan animation (highly custom and cool!)
  function runPortScanSimulation() {
    input.disabled = true;
    printLine('INITIATING LOCAL NETWORK HOST SCAN...', 'glow-text-blue');
    
    let step = 0;
    const ports = [21, 22, 23, 25, 53, 80, 110, 135, 139, 443, 445, 1433, 3306, 3389, 8080];
    const openPorts = [22, 80, 443, 3306];

    function scanStep() {
      if (step < ports.length) {
        const port = ports[step];
        const isOpen = openPorts.includes(port);
        const randDelay = Math.floor(Math.random() * 80) + 40;
        
        if (isOpen) {
          printLine(`Scanning Port ${port}... <span style="color: #00ff41; font-weight: bold;">[ OPEN ]</span> -> Service detected: ${getService(port)}`);
        } else {
          printLine(`Scanning Port ${port}... [ CLOSED ]`);
        }
        
        step++;
        const win = document.getElementById('terminal-window');
        win.scrollTop = win.scrollHeight;
        setTimeout(scanStep, randDelay);
      } else {
        printLine('\n=================== SCAN REPORT ===================', 'glow-text-blue');
        printLine('Scan target: localhost (127.0.0.1)');
        printLine('Open Ports Summary:');
        printLine('  - Port 22   (SSH)   - Open (OpenSSH 8.2p1)');
        printLine('  - Port 80   (HTTP)  - Open (Apache httpd 2.4.41)');
        printLine('  - Port 443  (HTTPS) - Open (TLSv1.3 encrypted)');
        printLine('  - Port 3306 (MySQL) - Open (MySQL Enterprise 8.0)');
        printLine('\nHost Status: ACTIVE (1 host scanned, 4 ports open).');
        printLine('===================================================\n', 'glow-text-blue');
        
        input.disabled = false;
        input.focus();
        
        const win = document.getElementById('terminal-window');
        win.scrollTop = win.scrollHeight;
      }
    }

    function getService(p) {
      switch(p) {
        case 22: return 'SSH (Secure Shell)';
        case 80: return 'HTTP (Web Server)';
        case 443: return 'HTTPS (Secure Web)';
        case 3306: return 'MySQL Database';
        default: return 'unknown';
      }
    }

    setTimeout(scanStep, 400);
  }
}

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initMatrixRain();
  initTypingEffect();
  initCustomCursor();
  initScrollReveal();
  initTimelineProgress();
  initCertificationsFilter();
  initHeaderScroll();
  initMobileMenu();
  initContactForm();
  initEasterEggTerminal();
});
