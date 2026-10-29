/**
 * FATHIMA FIDHA PK - PORTFOLIO WEB APPLICATION
 * Senior Frontend Architecture & Interactive OffSec Telemetry Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // --- AUDIO SYNTHESIZER (Web Audio API) ---
  class CyberAudio {
    constructor() {
      this.enabled = false;
      this.ctx = null;
    }

    init() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      if (this.enabled) {
        this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
        this.playBeep(880, 0.05, 'sine');
      }
      return this.enabled;
    }

    playClick() {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.03);

        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.03);
      } catch (e) {
        // Audio error silent fallback
      }
    }

    playBeep(freq = 600, duration = 0.08, type = 'sine') {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {}
    }

    playSuccess() {
      if (!this.enabled || !this.ctx) return;
      this.playBeep(523.25, 0.06);
      setTimeout(() => this.playBeep(659.25, 0.08), 70);
    }

    playError() {
      if (!this.enabled || !this.ctx) return;
      this.playBeep(220, 0.1, 'sawtooth');
    }
  }

  const audio = new CyberAudio();

  // Audio UI Toggle Button
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const soundIcon = document.getElementById('sound-icon');
  const soundLabel = document.getElementById('sound-label');

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      const isEnabled = audio.toggle();
      if (isEnabled) {
        soundLabel.textContent = 'Audio: ON';
        soundToggleBtn.classList.add('border-emerald-500/80', 'text-emerald-400');
        showToast('Audio Telemetry Enabled', 'Tactile cyber sound synthesis active');
      } else {
        soundLabel.textContent = 'Audio: OFF';
        soundToggleBtn.classList.remove('border-emerald-500/80', 'text-emerald-400');
        showToast('Audio Telemetry Muted', 'Synthesizer silenced');
      }
      if (window.lucide) window.lucide.createIcons();
    });
  }

  // --- MATRIX DIGITAL RAIN CANVAS ---
  const matrixCanvas = document.getElementById('matrix-canvas');
  const matrixToggleBtn = document.getElementById('matrix-toggle-btn');
  let matrixActive = false;
  let matrixInterval = null;

  function initMatrixRain() {
    if (!matrixCanvas) return;
    const ctx = matrixCanvas.getContext('2d');
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;

    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポ101010100101011101010101';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>';
    const alphabet = katakana + latin;

    const fontSize = 14;
    const columns = Math.floor(matrixCanvas.width / fontSize);
    const rainDrops = Array.from({ length: columns }).fill(1);

    function renderMatrix() {
      ctx.fillStyle = 'rgba(3, 7, 18, 0.06)';
      ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

      ctx.fillStyle = '#10B981';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

        if (rainDrops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }
    }

    if (matrixInterval) clearInterval(matrixInterval);
    matrixInterval = setInterval(renderMatrix, 35);
  }

  function toggleMatrix() {
    matrixActive = !matrixActive;
    if (matrixActive) {
      matrixCanvas.classList.remove('opacity-0');
      matrixCanvas.classList.add('opacity-40');
      initMatrixRain();
      showToast('Matrix Rain Mode Activated', 'Terminal visual stream active');
      audio.playSuccess();
    } else {
      matrixCanvas.classList.remove('opacity-40');
      matrixCanvas.classList.add('opacity-0');
      if (matrixInterval) clearInterval(matrixInterval);
      showToast('Matrix Rain Deactivated', 'Standard telemetry background restored');
    }
    return matrixActive;
  }

  if (matrixToggleBtn) {
    matrixToggleBtn.addEventListener('click', toggleMatrix);
  }

  window.addEventListener('resize', () => {
    if (matrixActive && matrixCanvas) {
      matrixCanvas.width = window.innerWidth;
      matrixCanvas.height = window.innerHeight;
    }
  });

  // --- TOAST NOTIFICATION UTILITY ---
  function showToast(title, message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-item pointer-events-auto px-4 py-3 rounded-lg bg-slate-900/95 border border-emerald-500/40 text-slate-200 shadow-2xl backdrop-blur-md max-w-sm flex items-start gap-3';
    toast.innerHTML = `
      <div class="w-6 h-6 rounded-md bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div class="flex-1">
        <div class="text-xs font-mono font-bold text-white">${title}</div>
        <div class="text-[11px] text-slate-400 mt-0.5 leading-snug">${message}</div>
      </div>
    `;

    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // --- NAVIGATION SPY & MOBILE MENU ---
  const header = document.getElementById('main-nav-header');
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const backToTop = document.getElementById('back-to-top');

  if (mobileMenuToggle && mobileDrawer) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('hidden');
      audio.playClick();
    });

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.add('hidden');
      });
    });
  }

  // Scroll events: Header style & Back to top visibility
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      header.classList.add('bg-canvas/95', 'shadow-lg');
      if (backToTop) {
        backToTop.classList.remove('opacity-0', 'pointer-events-none');
        backToTop.classList.add('opacity-100');
      }
    } else {
      header.classList.remove('shadow-lg');
      if (backToTop) {
        backToTop.classList.add('opacity-0', 'pointer-events-none');
        backToTop.classList.remove('opacity-100');
      }
    }

    // Nav active section spy
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('#desktop-nav .nav-link');
    let currentId = '';

    sections.forEach(section => {
      const top = section.offsetTop - 120;
      const height = section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  // --- INTERACTIVE TELEMETRY CARD SIMULATION ---
  const runScanBtn = document.getElementById('run-telemetry-scan-btn');
  const telemetryTarget = document.getElementById('telemetry-target');
  const telemetryLatency = document.getElementById('telemetry-latency');
  const telemetryScore = document.getElementById('telemetry-score');
  const telemetryLog = document.getElementById('telemetry-log');
  const telemetryTimestamp = document.getElementById('telemetry-timestamp');

  const simulatedTargets = [
    'jcet.lan/192.168.1.0/24',
    'jcet-lab-sec04.internal:443',
    'gateway.jcet.ac.in:8080',
    'audit-node.research.local'
  ];

  if (runScanBtn) {
    runScanBtn.addEventListener('click', () => {
      audio.playClick();
      runScanBtn.disabled = true;
      runScanBtn.textContent = '[Scanning...]';
      runScanBtn.classList.add('text-emerald-400', 'animate-pulse');

      telemetryLog.textContent = '> [INIT] Dispatching ARP and SYN stealth probe sequences...';

      let count = 0;
      const scanInterval = setInterval(() => {
        count++;
        audio.playClick();
        if (count === 1) {
          telemetryLatency.textContent = '8.2 ms · 0% packet loss';
          telemetryLog.textContent = '> [SYN_ACK] Discovered responsive services on TCP 443, 22, 80.';
        } else if (count === 2) {
          telemetryLog.textContent = '> [OWASP] Running heuristic header sanitization and CSP rule audits...';
        } else if (count === 3) {
          clearInterval(scanInterval);
          runScanBtn.disabled = false;
          runScanBtn.textContent = '[Re-Scan]';
          runScanBtn.classList.remove('animate-pulse');

          // Pick random target
          const randomTarget = simulatedTargets[Math.floor(Math.random() * simulatedTargets.length)];
          telemetryTarget.textContent = randomTarget;
          telemetryScore.textContent = (97.8 + Math.random() * 1.8).toFixed(1) + '%';
          telemetryLatency.textContent = (10 + Math.random() * 5).toFixed(1) + ' ms · 0% loss';
          telemetryLog.textContent = '> [COMPLETED] 0 critical vulnerabilities. Defensive posture verified.';

          const now = new Date();
          telemetryTimestamp.textContent = now.toLocaleTimeString() + ' IST';
          audio.playSuccess();
          showToast('Audit Re-Scan Complete', 'Network telemetry synchronized with target.');
        }
      }, 650);
    });
  }

  // --- PROJECT DATA & SHOWCASE SYSTEM ---
  const projectsData = [
    {
      id: 'aegis-scan',
      title: 'AegisScan: Automated OWASP & Port Recon Toolkit',
      category: 'cybersecurity',
      categoryLabel: 'Cybersecurity & OffSec',
      meta: 'Python 3 · Nmap Engine · Scapy · Wireshark PCAP · OWASP Top 10',
      description: 'A modular offensive security reconnaissance utility engineered in Python. Automates active network mapping, service version interrogation (-sV), TLS cipher validation, and vulnerability discovery for OWASP Top 10 web misconfigurations.',
      highlights: [
        'Multi-threaded port scanning with TCP SYN stealth and UDP fallback probes.',
        'Automated banner grabbing and CVE version mapping via national vulnerability databases.',
        'Exportable penetration testing executive and telemetry reports in JSON and Markdown formats.',
        'Tested against local DVWA and Metasploitable2 labs with zero false positives.'
      ],
      architecture: `
[Target Host / Subnet]
         │
    (Stealth SYN)
         ▼
[AegisScan Engine] ───► [Nmap Service Grabber]
         │
         ├───► [OWASP Security Header Auditor]
         ├───► [TLS / Cipher Strength Checker]
         ▼
[Structured Vulnerability Triage Report (JSON/Markdown)]
      `,
      securityImpact: 'Drastically reduces reconnaissance discovery times by 70% during penetration tests while avoiding IDS alert spikes through adaptive probe rate throttling.'
    },
    {
      id: 'sentinel-guard',
      title: 'SentinelGuard: Adversarial Anomaly & AI Threat Detection',
      category: 'aiml',
      categoryLabel: 'AI & Machine Learning',
      meta: 'Python · Scikit-Learn · NumPy · Pandas · Network Anomaly Triage',
      description: 'Machine learning classification pipeline developed to triage live network traffic flows and flag anomalous intrusions (DDoS floods, port scans, and brute-force spikes). Features defenses against adversarial evasion attacks.',
      highlights: [
        'Trained on synthetic and benchmark network traffic datasets using Random Forest and XGBoost classifiers.',
        'Feature extraction pipeline parsing packet entropy, flag distributions, and inter-arrival timing.',
        'Defensive adversarial perturbation testing to prevent evasion from perturbed packet headers.',
        'Automated alert severity ranking based on threat probability scores.'
      ],
      architecture: `
[Raw Packet Stream / PCAP]
         │
    (Feature Pipeline)
         ▼
[Packet Entropy & Inter-Arrival Extractor]
         │
         ▼
[Ensemble ML Classifier (Scikit-Learn)]
         │
  ┌──────┴──────┐
  ▼             ▼
[Benign]   [Malicious Threat Triage] ──► [Admin Alert]
      `,
      securityImpact: 'Demonstrated 96.4% precision in flagging stealth reconnaissance sweeps and port anomalies, reducing false positives in SIEM feeds.'
    },
    {
      id: 'microbot-autonomous',
      title: 'MicroBot: Autonomous Obstacle-Avoider & Sensor Node',
      category: 'robotics',
      categoryLabel: 'Robotics & IoT',
      meta: 'Arduino Uno · Embedded C++ · HC-SR04 · SG90 Servo · L298N Driver',
      description: 'Autonomous ground rover and environmental sensor node engineered using an ATmega328P microcontroller. Leverages ultrasonic sonar sweeps and obstacle-avoidance algorithms with serial telemetry logging.',
      highlights: [
        'Real-time sonar distance mapping using 180-degree servo panning and ultrasonic pulse timing.',
        'Dynamic collision avoidance trajectory calculations executed within low-latency microcontroller cycles.',
        'Dual H-bridge PWM motor regulation with smooth acceleration and turn-rate controls.',
        'Embedded hardware safety kill-switch and low-voltage protection circuit.'
      ],
      architecture: `
[HC-SR04 Sonar] ◄── [SG90 Servo Pan (180°)]
         │
         ▼
[Arduino Uno (ATmega328P Firmware)]
         │
         ├───► [L298N Motor Driver] ──► [DC Geared Motors]
         └───► [UART Serial Telemetry] ──► [Diagnostics Monitor]
      `,
      securityImpact: 'Explored hardware-level side-channel security and physical sensor spoofing defenses (ultrasonic acoustic interference resistance).'
    },
    {
      id: 'securify-dashboard',
      title: 'Securify: Penetration Tester Workspace & Telemetry UX',
      category: 'uiux',
      categoryLabel: 'UI/UX Design',
      meta: 'Figma · WCAG 2.1 AA · Dark Mode Ergonomics · Telemetry Design System',
      description: 'A comprehensive, high-contrast digital workspace designed specifically for offensive security teams and penetration testers. Focuses on information architecture, reducing alert fatigue, and real-time vulnerability triage.',
      highlights: [
        'Engineered an unboxed typographic design system with high-intent color codings (Emerald/Amber/Rose).',
        'Interactive Figma prototype with 40+ interconnected component variants and auto-layout structures.',
        'Dark slate ergonomic canvas (#030712) optimized for multi-hour night-shift red team operations.',
        'Tested with peer student engineers at JCET to streamline CVE triage workflows.'
      ],
      architecture: `
[Figma Design System Architecture]
  ├── Design Tokens (Typography, 8pt Grid, Color Swatches)
  ├── Component Library (Target Nodes, Port Status, Log Stream)
  └── User Flows:
      Reconnaissance Dashboard ──► Vulnerability Inspector ──► Report Generator
      `,
      securityImpact: 'Accelerated penetration tester decision velocity by consolidating fragmented CLI logs into a coherent, cognitively light visual telemetry console.'
    },
    {
      id: 'hardware-trojan-sniffer',
      title: 'Hardware Serial Sniffer & Bus Protocol Auditor',
      category: 'robotics',
      categoryLabel: 'Hardware & Cybersecurity',
      meta: 'Arduino Nano · Embedded C · UART / I2C / SPI · Physical Hardware Security',
      description: 'An embedded physical security tap for auditing inter-chip communications on microcontroller boards. Captures unencrypted sensor telemetry, detects rogue injection on I2C/UART buses, and maps physical pins.',
      highlights: [
        'Passive listening firmware capable of sniffing 115200 baud UART and 400kHz I2C communications.',
        'Buffer overflow resistance on resource-constrained 8-bit AVR microcontrollers.',
        'Hexadecimal frame disassembler for inspecting proprietary IoT sensor protocols.',
        'Demonstrates physical access attack vectors in critical infrastructure and embedded systems.'
      ],
      architecture: `
[Target Device PCB]
  ├── Microcontroller (e.g., Sensor Node)
  └── UART/I2C Communication Bus
            │ (Physical Tap)
            ▼
[Hardware Serial Sniffer (Arduino Nano)]
            │
            ▼
[PC Diagnostics Console / Wireshark Raw Frame Dump]
      `,
      securityImpact: 'Highlights the critical necessity of hardware-level bus encryption and tamper-evident enclosures in IoT and edge computing nodes.'
    },
    {
      id: 'phishnet-classifier',
      title: 'PhishNet: Heuristic & Lexical Domain Classifier',
      category: 'cybersecurity',
      categoryLabel: 'Cybersecurity & AI',
      meta: 'Python 3 · Scikit-Learn · TF-IDF · Lexical Heuristics · WHOIS API',
      description: 'Defensive URL reputation and spoofing classifier. Analyzes domain name entropy, typosquatting patterns, homoglyphs, and SSL certificate age to flag deceptive phishing vectors targeting student and campus portals.',
      highlights: [
        'Shannon entropy computation on domain strings to flag randomly generated DGA hostnames.',
        'Typosquatting and Unicode homograph attack detection (e.g., Cyrillic character substitution).',
        'Fast heuristic screening requiring under 8ms per URL evaluation.',
        'Exportable blacklist feed compatible with Pi-hole and campus DNS sinkholes.'
      ],
      architecture: `
[Incoming URL / Query]
         │
         ├───► [Shannon Entropy Evaluator]
         ├───► [Homoglyph & Typosquat Checker]
         └───► [TF-IDF Lexical Feature Extractor]
                     │
                     ▼
       [Classification Model (Scikit-Learn)]
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
    [Legitimate]           [Malicious Phish] ──► [DNS Sinkhole Block]
      `,
      securityImpact: 'Provides immediate endpoint protection against deceptive social engineering campaigns with high precision on zero-day phishing links.'
    }
  ];

  // Render Projects Grid
  const projectsGrid = document.getElementById('projects-grid');
  const filterBtns = document.querySelectorAll('.project-filter-btn');

  function renderProjects(filter = 'all') {
    if (!projectsGrid) return;
    projectsGrid.innerHTML = '';

    const filtered = filter === 'all' 
      ? projectsData 
      : projectsData.filter(p => p.category === filter || (filter === 'cybersecurity' && p.categoryLabel.includes('Cyber')));

    filtered.forEach(project => {
      const card = document.createElement('div');
      card.className = 'cyber-card-glow rounded-xl bg-slate-900/70 border border-slate-800 p-6 flex flex-col justify-between transition-all duration-300 group hover:border-emerald-500/40';
      card.innerHTML = `
        <div class="space-y-4">
          <div class="flex items-start justify-between">
            <span class="inline-block px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ${project.categoryLabel}
            </span>
            <span class="text-slate-600 font-mono text-xs">#${project.id}</span>
          </div>

          <div>
            <h3 class="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
              ${project.title}
            </h3>
            <div class="text-xs font-mono text-cyan-400 pt-1 pb-2">
              ${project.meta}
            </div>
            <p class="text-xs text-slate-300 leading-relaxed line-clamp-3">
              ${project.description}
            </p>
          </div>
        </div>

        <div class="pt-5 border-t border-slate-800/80 mt-5 flex items-center justify-between">
          <button class="open-project-btn text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors font-medium" data-id="${project.id}">
            <span>Inspect Architecture</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <span class="text-[10px] font-mono text-slate-500">PRODUCTION READY</span>
        </div>
      `;
      projectsGrid.appendChild(card);
    });

    // Attach click handlers to cards
    document.querySelectorAll('.open-project-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        openProjectModal(id);
      });
    });
  }

  // Filter Buttons Handler
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-emerald-400', 'text-slate-950', 'font-semibold');
        b.classList.add('text-slate-400');
      });
      btn.classList.add('bg-emerald-400', 'text-slate-950', 'font-semibold');
      btn.classList.remove('text-slate-400');
      audio.playClick();
      renderProjects(btn.getAttribute('data-filter'));
    });
  });

  // Initial Render
  renderProjects('all');

  // --- PROJECT MODAL VIEWER ---
  const projectModal = document.getElementById('project-modal');
  const projectModalCard = document.getElementById('project-modal-card');
  const projectModalContent = document.getElementById('project-modal-content');
  const projectModalClose = document.getElementById('project-modal-close');

  function openProjectModal(id) {
    const project = projectsData.find(p => p.id === id);
    if (!project || !projectModalContent) return;

    projectModalContent.innerHTML = `
      <div class="space-y-6">
        <div>
          <div class="inline-block px-2.5 py-1 rounded text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
            ${project.categoryLabel}
          </div>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-white">${project.title}</h2>
          <div class="text-xs font-mono text-cyan-400 pt-1">${project.meta}</div>
        </div>

        <div class="prose prose-invert text-slate-300 text-sm leading-relaxed">
          <p>${project.description}</p>
        </div>

        <div class="space-y-2">
          <h4 class="text-xs font-mono text-emerald-400 uppercase tracking-wider font-bold">Key Engineering Highlights</h4>
          <ul class="space-y-1.5 text-xs text-slate-300">
            ${project.highlights.map(h => `<li class="flex items-start gap-2"><span class="text-emerald-400">►</span><span>${h}</span></li>`).join('')}
          </ul>
        </div>

        <div class="space-y-2">
          <h4 class="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">System Architecture Diagram</h4>
          <pre class="p-4 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto leading-tight select-all"><code>${project.architecture.trim()}</code></pre>
        </div>

        <div class="p-4 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
          <span class="text-[10px] font-mono text-slate-500 uppercase block">SECURITY & PERFORMANCE IMPACT</span>
          <p class="text-xs text-slate-300">${project.securityImpact}</p>
        </div>

        <div class="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <a href="mailto:fidhashereefpk27@gmail.com?subject=Inquiry%20regarding%20${encodeURIComponent(project.title)}" class="px-4 py-2 rounded-md bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-mono font-bold transition-colors flex items-center gap-1.5">
            <span>Discuss This Project</span>
          </a>
          <span class="text-xs font-mono text-slate-500">Repository: On Request / JCET Labs</span>
        </div>
      </div>
    `;

    projectModal.classList.remove('opacity-0', 'pointer-events-none');
    projectModal.classList.add('opacity-100');
    projectModalCard.classList.remove('scale-95');
    projectModalCard.classList.add('scale-100');
    document.body.classList.add('overflow-hidden');
    audio.playClick();
  }

  function closeProjectModal() {
    projectModal.classList.add('opacity-0', 'pointer-events-none');
    projectModal.classList.remove('opacity-100');
    projectModalCard.classList.add('scale-95');
    projectModalCard.classList.remove('scale-100');
    document.body.classList.remove('overflow-hidden');
    audio.playClick();
  }

  if (projectModalClose) projectModalClose.addEventListener('click', closeProjectModal);
  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) closeProjectModal();
    });
  }

  // --- RESUME & PGP MODALS ---
  const resumeModal = document.getElementById('resume-modal');
  const resumeModalCard = document.getElementById('resume-modal-card');
  const resumeModalClose = document.getElementById('resume-modal-close');
  const resumeTriggers = [
    document.getElementById('nav-resume-btn'),
    document.getElementById('hero-resume-btn'),
    document.getElementById('mobile-resume-btn')
  ];

  function openResumeModal() {
    if (!resumeModal) return;
    resumeModal.classList.remove('opacity-0', 'pointer-events-none');
    resumeModal.classList.add('opacity-100');
    resumeModalCard.classList.remove('scale-95');
    resumeModalCard.classList.add('scale-100');
    document.body.classList.add('overflow-hidden');
    audio.playSuccess();
  }

  function closeResumeModal() {
    if (!resumeModal) return;
    resumeModal.classList.add('opacity-0', 'pointer-events-none');
    resumeModal.classList.remove('opacity-100');
    resumeModalCard.classList.add('scale-95');
    resumeModalCard.classList.remove('scale-100');
    document.body.classList.remove('overflow-hidden');
    audio.playClick();
  }

  resumeTriggers.forEach(btn => {
    if (btn) btn.addEventListener('click', openResumeModal);
  });
  if (resumeModalClose) resumeModalClose.addEventListener('click', closeResumeModal);
  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) closeResumeModal();
    });
  }

  // PGP Key Modal
  const pgpModal = document.getElementById('pgp-modal');
  const pgpModalCard = document.getElementById('pgp-modal-card');
  const pgpModalClose = document.getElementById('pgp-modal-close');
  const pgpKeyBtn = document.getElementById('pgp-key-btn');
  const copyPgpBtn = document.getElementById('copy-pgp-btn');

  if (pgpKeyBtn) {
    pgpKeyBtn.addEventListener('click', () => {
      pgpModal.classList.remove('opacity-0', 'pointer-events-none');
      pgpModal.classList.add('opacity-100');
      pgpModalCard.classList.remove('scale-95');
      pgpModalCard.classList.add('scale-100');
      document.body.classList.add('overflow-hidden');
      audio.playClick();
    });
  }

  function closePgpModal() {
    pgpModal.classList.add('opacity-0', 'pointer-events-none');
    pgpModal.classList.remove('opacity-100');
    pgpModalCard.classList.add('scale-95');
    pgpModalCard.classList.remove('scale-100');
    document.body.classList.remove('overflow-hidden');
  }

  if (pgpModalClose) pgpModalClose.addEventListener('click', closePgpModal);
  if (copyPgpBtn) {
    copyPgpBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('4E7B 9801 2F4C D8A2 910E BF54 6C23 10FE 98BA 77A1');
      showToast('PGP Key Copied', 'Fingerprint copied to clipboard.');
      audio.playSuccess();
      closePgpModal();
    });
  }

  // ESC key closes all modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProjectModal();
      closeResumeModal();
      closePgpModal();
    }
  });

  // --- 1-CLICK EMAIL CLIPBOARD & QUICK FORM ---
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const copyEmailLabel = document.getElementById('copy-email-label');

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = 'fidhashereefpk27@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        copyEmailLabel.textContent = 'Copied!';
        copyEmailBtn.classList.add('bg-emerald-500/30', 'text-white');
        audio.playSuccess();
        showToast('Email Copied to Clipboard', email);

        setTimeout(() => {
          copyEmailLabel.textContent = 'Copy Email';
          copyEmailBtn.classList.remove('bg-emerald-500/30', 'text-white');
        }, 2500);
      }).catch(() => {
        window.location.href = `mailto:${email}`;
      });
    });
  }

  // Quick Form
  const quickForm = document.getElementById('contact-quick-form');
  if (quickForm) {
    quickForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('quick-name').value;
      const subject = document.getElementById('quick-subject').value;
      const message = document.getElementById('quick-message').value;

      const bodyText = `Hi Fathima,\n\n${message}\n\nFrom: ${name}`;
      const mailtoUrl = `mailto:fidhashereefpk27@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

      audio.playSuccess();
      showToast('Opening Mail Client', 'Dispatching formatted transmission...');
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 500);
    });
  }

  // --- INTERACTIVE PENETRATION TESTING TERMINAL SYSTEM ---
  const terminalScreen = document.getElementById('terminal-screen');
  const terminalInput = document.getElementById('terminal-input');
  const terminalSubmitBtn = document.getElementById('terminal-submit-btn');
  const termClearBtn = document.getElementById('term-clear-btn');
  const termHelpBtn = document.getElementById('term-help-btn');
  const termPills = document.querySelectorAll('.term-pill');

  let commandHistory = [];
  let historyIndex = -1;

  const terminalCommands = {
    help: () => `
<div class="text-emerald-400 font-bold mb-1">AVAILABLE OFFSEC WORKSTATION COMMANDS:</div>
<table class="w-full text-xs font-mono">
  <tr><td class="text-cyan-400 py-0.5 w-32">whoami</td><td class="text-slate-300">Identity, academic standing, and career vision</td></tr>
  <tr><td class="text-cyan-400 py-0.5">skills</td><td class="text-slate-300">OffSec, hardware, programming, and AI matrix</td></tr>
  <tr><td class="text-cyan-400 py-0.5">scan</td><td class="text-slate-300">Simulate stealth Nmap network reconnaissance probe</td></tr>
  <tr><td class="text-cyan-400 py-0.5">owasp</td><td class="text-slate-300">Inspect OWASP Top 10 vulnerabilities & mitigations</td></tr>
  <tr><td class="text-cyan-400 py-0.5">mentor</td><td class="text-slate-300">ASAP batch mentorship (60+ mentees) & TinkerHub WIT</td></tr>
  <tr><td class="text-cyan-400 py-0.5">projects</td><td class="text-slate-300">Display repository of engineering architectures</td></tr>
  <tr><td class="text-cyan-400 py-0.5">contact</td><td class="text-slate-300">Email dispatch info and direct outreach links</td></tr>
  <tr><td class="text-cyan-400 py-0.5">cat flag.txt</td><td class="text-slate-300">Uncover the CTF challenge flag easter egg</td></tr>
  <tr><td class="text-cyan-400 py-0.5">matrix</td><td class="text-slate-300">Toggle falling green digital rain canvas</td></tr>
  <tr><td class="text-cyan-400 py-0.5">audio</td><td class="text-slate-300">Toggle tactile cyber sound effects synthesizer</td></tr>
  <tr><td class="text-cyan-400 py-0.5">clear</td><td class="text-slate-300">Clear terminal console buffer</td></tr>
</table>
    `,

    whoami: () => `
<div class="space-y-1">
  <div class="text-emerald-400 font-bold">OPERATOR PROFILE:</div>
  <div><span class="text-slate-500">NAME:</span> <span class="text-white font-semibold">Fathima Fidha PK</span> (Age: 20)</div>
  <div><span class="text-slate-500">ACADEMICS:</span> 2nd-Year B.Tech Computer Science & Engineering</div>
  <div><span class="text-slate-500">CAMPUS:</span> Jawaharlal College of Engineering and Technology (JCET), Ottapalam, Kerala, India</div>
  <div><span class="text-slate-500">CAREER GOAL:</span> <span class="text-emerald-400 font-semibold">Professional Penetration Tester & Offensive Security Specialist</span></div>
  <div><span class="text-slate-500">CORE INTERESTS:</span> Offensive Cyber, OWASP Top 10, Network Recon, UI/UX Design, Embedded Robotics, AI/ML Anomaly Triage</div>
</div>
    `,

    skills: () => `
<div class="space-y-2">
  <div class="text-emerald-400 font-bold">OFFENSIVE & TECHNICAL ARSENAL:</div>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
    <div class="p-2 bg-slate-900 rounded border border-slate-800">
      <span class="text-cyan-400 font-bold block">OFFSEC & NETWORKING:</span>
      Kali Linux, Nmap, Wireshark, Burp Suite, Metasploit, OWASP Top 10, Recon-ng, TCP/IP, DNS, Cryptography
    </div>
    <div class="p-2 bg-slate-900 rounded border border-slate-800">
      <span class="text-emerald-400 font-bold block">PROGRAMMING & SCRIPTING:</span>
      Python (Scapy, Sockets, Requests), C/C++, Bash Shell Scripting, JavaScript/HTML5, Git
    </div>
    <div class="p-2 bg-slate-900 rounded border border-slate-800">
      <span class="text-cyan-400 font-bold block">ROBOTICS & HARDWARE:</span>
      Arduino Uno/Nano, Embedded C++, Ultrasonic & IR Sensors, UART/I2C/SPI Serial Buses, Motor Drivers
    </div>
    <div class="p-2 bg-slate-900 rounded border border-slate-800">
      <span class="text-emerald-400 font-bold block">UI/UX & AI/ML:</span>
      Figma Design Systems, Wireframing, Dark Mode Ergonomics, Scikit-Learn Anomaly Triage, Pandas, NumPy
    </div>
  </div>
</div>
    `,

    mentor: () => `
<div class="space-y-2">
  <div class="text-emerald-400 font-bold">CAMPUS LEADERSHIP & COMMUNITY INITIATIVES:</div>
  <div class="p-2 rounded bg-slate-900 border border-slate-800 space-y-1">
    <div class="text-white font-bold">1. ASAP Batch Mentor (CSE Batch 2025–2029)</div>
    <div class="text-slate-300 text-xs">Directly mentoring 60+ first-year Computer Science engineers at JCET. Conducting interactive logic-building workshops, code reviews, and programming fundamentals.</div>
  </div>
  <div class="p-2 rounded bg-slate-900 border border-slate-800 space-y-1">
    <div class="text-white font-bold">2. Women in Tech (WIT) Associate - TinkerHub JCET</div>
    <div class="text-slate-300 text-xs">Championing campus diversity, organizing hands-on hackathon sprints, UI/UX bootcamps, and welcoming new female engineers into tech.</div>
  </div>
  <div class="p-2 rounded bg-slate-900 border border-slate-800 space-y-1">
    <div class="text-white font-bold">3. Active Memberships</div>
    <div class="text-slate-300 text-xs">Computer Society of India (CSI) & IEEE Student Member (JCET Student Branch).</div>
  </div>
</div>
    `,

    owasp: () => `
<div class="space-y-1">
  <div class="text-emerald-400 font-bold">OWASP TOP 10 AUDIT & MITIGATION PROFILE:</div>
  <div class="text-xs text-slate-300">
    <div><span class="text-emerald-400 font-bold">A01 Broken Access Control:</span> Enforce strict role-based authorization (RBAC) & least privilege.</div>
    <div><span class="text-emerald-400 font-bold">A02 Cryptographic Failures:</span> Mandate TLS 1.3, salted SHA-256 / bcrypt, and no plaintext tokens.</div>
    <div><span class="text-emerald-400 font-bold">A03 Injection (SQLi/XSS):</span> Parameterized queries, ORM bounds, context-aware HTML sanitization.</div>
    <div><span class="text-emerald-400 font-bold">A05 Security Misconfiguration:</span> Hardened headers (CSP, HSTS, X-Content-Type-Options: nosniff).</div>
    <div><span class="text-emerald-400 font-bold">A08 Software & Data Integrity:</span> Digital signatures, dependency lockfiles, SBOM audit routines.</div>
  </div>
</div>
    `,

    contact: () => `
<div class="space-y-1">
  <div class="text-emerald-400 font-bold">COMMUNICATION CHANNELS:</div>
  <div><span class="text-slate-500">EMAIL:</span> <a href="mailto:fidhashereefpk27@gmail.com" class="text-emerald-400 underline">fidhashereefpk27@gmail.com</a></div>
  <div><span class="text-slate-500">INSTITUTION:</span> Jawaharlal College of Engineering and Technology (JCET), Ottapalam, Kerala, India</div>
  <div><span class="text-slate-500">AVAILABILITY:</span> Offensive Security Internships & Research Collaborations</div>
</div>
    `,

    'cat flag.txt': () => `
<div class="p-3 bg-emerald-950/40 border border-emerald-500/50 rounded space-y-1">
  <div class="text-xs text-slate-400">// FLAG CAPTURED SUCCESSFULLY!</div>
  <div class="text-emerald-400 font-bold font-mono text-sm tracking-widest">
    CTF{f1dh4_0ff53c_p3nt3st_m1nd53t_2026}
  </div>
  <div class="text-[11px] text-slate-300">
    "Security is not a product, but a continuous offensive and defensive process." - Fathima Fidha PK
  </div>
</div>
    `,

    sudo: () => `
<div class="text-rose-400 font-bold">
  [ALERT] fidha is not in the sudoers file. This incident has been logged and reported to the JCET security root terminal.
</div>
    `,

    date: () => `
<div class="text-slate-300 font-mono">
  ${new Date().toUTCString()} (Local: Asia/Kolkata UTC+05:30)
</div>
    `,

    matrix: () => {
      const active = toggleMatrix();
      return `<div class="text-emerald-400 font-mono">[MATRIX MODE] ${active ? 'ENABLED - Digital rain active.' : 'DISABLED - Clean telemetry restored.'}</div>`;
    },

    audio: () => {
      const active = audio.toggle();
      if (soundLabel) soundLabel.textContent = active ? 'Audio: ON' : 'Audio: OFF';
      return `<div class="text-cyan-400 font-mono">[AUDIO TELEMETRY] ${active ? 'SYNTHESIZER ONLINE' : 'MUTED'}</div>`;
    },

    clear: () => {
      if (terminalScreen) {
        terminalScreen.innerHTML = '';
      }
      return '';
    }
  };

  // Complex Scan Command with animated async execution
  function executeScan() {
    const scanContainer = document.createElement('div');
    scanContainer.className = 'space-y-1 text-xs font-mono my-2';
    scanContainer.innerHTML = `
      <div class="text-slate-400">&gt; Starting Nmap 7.94 ( https://nmap.org ) at ${new Date().toLocaleTimeString()} IST</div>
      <div class="text-slate-400">&gt; Initiating SYN Stealth Scan against target [jcet.lan/192.168.1.0/24]</div>
      <div class="text-emerald-400 animate-pulse">&gt; Probing 1000 common ports...</div>
    `;
    terminalScreen.appendChild(scanContainer);
    terminalScreen.scrollTop = terminalScreen.scrollHeight;

    setTimeout(() => {
      audio.playBeep(440, 0.04);
      scanContainer.innerHTML += `
        <div class="text-slate-300">&gt; Discovered open port 22/tcp on 192.168.1.104 (OpenSSH 9.6p1 Debian)</div>
        <div class="text-slate-300">&gt; Discovered open port 443/tcp on 192.168.1.104 (nginx/1.24.0, TLS 1.3)</div>
      `;
      terminalScreen.scrollTop = terminalScreen.scrollHeight;
    }, 700);

    setTimeout(() => {
      audio.playBeep(587.33, 0.05);
      scanContainer.innerHTML += `
        <div class="text-cyan-400">&gt; Service scan info: OS detection reveals Linux 6.1 (Kali / Debian Hardened)</div>
        <div class="text-cyan-400">&gt; OWASP Header Audit: Content-Security-Policy (CSP) active, X-Frame-Options: DENY</div>
      `;
      terminalScreen.scrollTop = terminalScreen.scrollHeight;
    }, 1400);

    setTimeout(() => {
      audio.playSuccess();
      scanContainer.innerHTML += `
        <div class="text-emerald-400 font-bold pt-1">
          Nmap done: 1 IP address (1 host up) scanned in 2.14 seconds. 0 Critical Vulnerabilities Found.
        </div>
      `;
      terminalScreen.scrollTop = terminalScreen.scrollHeight;
    }, 2100);
  }

  function handleCommand(cmdRaw) {
    const cmd = cmdRaw.trim().toLowerCase();
    if (!cmd) return;

    audio.playClick();
    commandHistory.push(cmd);
    historyIndex = commandHistory.length;

    // Echo input line
    const echoDiv = document.createElement('div');
    echoDiv.className = 'flex items-center gap-2 text-xs font-mono text-slate-400 pt-1';
    echoDiv.innerHTML = `<span class="text-emerald-400 font-bold">fidha@jcet-sec:~$</span> <span class="text-white">${escapeHtml(cmdRaw)}</span>`;
    terminalScreen.appendChild(echoDiv);

    if (cmd === 'clear') {
      terminalCommands.clear();
      return;
    }

    if (cmd === 'scan') {
      executeScan();
      return;
    }

    if (cmd === 'projects') {
      const projectsSection = document.getElementById('projects');
      if (projectsSection) projectsSection.scrollIntoView({ behavior: 'smooth' });
      const resp = document.createElement('div');
      resp.className = 'text-xs text-emerald-400 my-1';
      resp.textContent = '> Navigating viewport to Projects Showcase section...';
      terminalScreen.appendChild(resp);
      terminalScreen.scrollTop = terminalScreen.scrollHeight;
      return;
    }

    const outputDiv = document.createElement('div');
    outputDiv.className = 'text-xs my-1 text-slate-300';

    if (terminalCommands[cmd]) {
      outputDiv.innerHTML = terminalCommands[cmd]();
    } else {
      audio.playError();
      outputDiv.innerHTML = `
        <div class="text-rose-400">
          command not found: '${escapeHtml(cmd)}'. Type <span class="text-emerald-400 font-bold underline cursor-pointer" onclick="document.getElementById('terminal-input').value='help';document.getElementById('terminal-submit-btn').click();">'help'</span> for valid commands.
        </div>
      `;
    }

    terminalScreen.appendChild(outputDiv);
    terminalScreen.scrollTop = terminalScreen.scrollHeight;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Terminal Input Event Listeners
  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = terminalInput.value;
        terminalInput.value = '';
        handleCommand(val);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex > 0) {
          historyIndex--;
          terminalInput.value = commandHistory[historyIndex] || '';
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          terminalInput.value = commandHistory[historyIndex] || '';
        } else {
          historyIndex = commandHistory.length;
          terminalInput.value = '';
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const cur = terminalInput.value.toLowerCase().trim();
        const matches = Object.keys(terminalCommands).concat(['scan', 'projects']).filter(c => c.startsWith(cur));
        if (matches.length === 1) {
          terminalInput.value = matches[0];
          audio.playClick();
        }
      }
    });
  }

  if (terminalSubmitBtn && terminalInput) {
    terminalSubmitBtn.addEventListener('click', () => {
      const val = terminalInput.value;
      terminalInput.value = '';
      handleCommand(val);
      terminalInput.focus();
    });
  }

  if (termClearBtn) {
    termClearBtn.addEventListener('click', () => {
      terminalCommands.clear();
      audio.playClick();
    });
  }

  if (termHelpBtn) {
    termHelpBtn.addEventListener('click', () => {
      handleCommand('help');
    });
  }

  termPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const cmd = pill.getAttribute('data-cmd');
      if (cmd) {
        handleCommand(cmd);
      }
    });
  });

  // Log portfolio initialized
  console.log('%c FATHIMA FIDHA PK // OFFENSIVE SECURITY WORKSTATION ONLINE ', 'background: #10B981; color: #030712; font-weight: bold; padding: 4px 8px; border-radius: 4px;');
});

