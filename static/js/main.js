
    // Detect mobile device for performance optimizations
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Initialize Lucide Icons
    lucide.createIcons();

    // -------------------------------------------------------------
    // Lenis Smooth Scroll Configuration
    // -------------------------------------------------------------
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Mouse wheel scroll support for Lenis smooth scrolling
    window.addEventListener('wheel', (event) => {
      if (event.deltaY !== 0) {
        event.preventDefault();
        const scrollAmount = event.deltaY * 0.55;
        lenis.scrollTo(window.scrollY + scrollAmount, { immediate: false });
      }
    }, { passive: false });

    // Sync GSAP with Lenis Scroll
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);


    // -------------------------------------------------------------
    // Custom Cursor Interaction
    // -------------------------------------------------------------
    const cursor = document.getElementById('custom-cursor');
    const cursorDot = document.getElementById('custom-cursor-dot');
    
    document.addEventListener('mousemove', (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15
      });
      gsap.to(cursorDot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.05
      });
    });

    // Expand cursor on hover
    const hoverables = document.querySelectorAll('a, button, input, textarea, .skill-card, .terminal-tab');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width = '48px';
        cursor.style.height = '48px';
        cursor.style.borderColor = '#ffffff';
        cursor.style.backgroundColor = 'rgba(255,255,255,0.05)';
        cursorDot.style.backgroundColor = '#ffffff';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.width = '24px';
        cursor.style.height = '24px';
        cursor.style.borderColor = '#e5c158';
        cursor.style.backgroundColor = 'transparent';
        cursorDot.style.backgroundColor = '#e5c158';
      });
    });


    // -------------------------------------------------------------
    // Mobile Navigation Drawer Toggle
    // -------------------------------------------------------------
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    let isMenuOpen = false;

    menuToggle.addEventListener('click', () => {
      isMenuOpen = !isMenuOpen;
      if (isMenuOpen) {
        mobileMenu.classList.remove('hidden');
        setTimeout(() => {
          mobileMenu.style.transform = 'translateX(0)';
        }, 10);
        menuToggle.innerHTML = '<i data-lucide="x" class="w-6 h-6 text-white"></i>';
      } else {
        mobileMenu.style.transform = 'translateX(100%)';
        setTimeout(() => {
          mobileMenu.classList.add('hidden');
        }, 500);
        menuToggle.innerHTML = '<i data-lucide="menu" class="w-6 h-6 text-white"></i>';
      }
      lucide.createIcons();
    });

    // Close menu when clicking link
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        isMenuOpen = false;
        mobileMenu.style.transform = 'translateX(100%)';
        setTimeout(() => {
          mobileMenu.classList.add('hidden');
        }, 500);
        menuToggle.innerHTML = '<i data-lucide="menu" class="w-6 h-6 text-white"></i>';
        lucide.createIcons();
      });
    });


    // -------------------------------------------------------------
    // Magnetic Button Interactions
    // -------------------------------------------------------------
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    if (!isTouchDevice) {
      magneticBtns.forEach(btn => {
        const wrap = btn.closest('.magnetic-wrap');
        if (wrap) {
          wrap.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(btn, {
              x: x * 0.4,
              y: y * 0.4,
              duration: 0.3,
              ease: 'power2.out'
            });
          });
          
          wrap.addEventListener('mouseleave', () => {
            gsap.to(btn, {
              x: 0,
              y: 0,
              duration: 0.5,
              ease: 'elastic.out(1, 0.3)'
            });
          });
        }
      });
    }

    // -------------------------------------------------------------
    // Three.js (WebGL) 3D Immersive Canvas setup
    // -------------------------------------------------------------
    let scene, camera, renderer, starGeometry, starField, shapeGeometry, shapeMesh;
    const canvasElement = document.getElementById('webgl-canvas');
    
    // Adaptive performance settings based on device
    const performanceSettings = {
      starCount: isMobile ? 800 : 3000,
      pixelRatio: isMobile ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2),
      enableShapes: !isMobile, // Disable heavier 3D shapes on mobile for performance
    };

    function initWebGL() {
      // Create Scene
      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x030303, 0.015);

      // Create Camera
      camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = isMobile ? 24 : 30;

      // Renderer
      renderer = new THREE.WebGLRenderer({
        canvas: canvasElement,
        antialias: true,
        alpha: true
      });
      renderer.setPixelRatio(performanceSettings.pixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);

      // Light Sources
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
      scene.add(ambientLight);

      const dirLight1 = new THREE.DirectionalLight(0xe5c158, 2.0); // luxury gold
      dirLight1.position.set(10, 20, 15);
      scene.add(dirLight1);

      const dirLight2 = new THREE.DirectionalLight(0x8b5cf6, 1.5); // indigo/purple
      dirLight2.position.set(-10, -20, -15);
      scene.add(dirLight2);

      // 1. Particle Star Field Background
      const starCount = performanceSettings.starCount;
      starGeometry = new THREE.BufferGeometry();
      const starPositions = new Float32Array(starCount * 3);
      const starColors = new Float32Array(starCount * 3);

      for (let i = 0; i < starCount * 3; i += 3) {
        // Disperse stars in cubic shell
        const scale = isMobile ? 90 : 120;
        starPositions[i] = (Math.random() - 0.5) * scale;
        starPositions[i+1] = (Math.random() - 0.5) * scale;
        starPositions[i+2] = (Math.random() - 0.5) * (scale - 20);

        // Blended luxury colors for particles (Golds, Purples, Silvers)
        const rand = Math.random();
        if (rand < 0.4) {
          // Purple glow star
          starColors[i] = 0.54;   // R: 139
          starColors[i+1] = 0.36; // G: 92
          starColors[i+2] = 0.96; // B: 246
        } else if (rand < 0.8) {
          // Luxury gold star
          starColors[i] = 0.90;   // R: 229
          starColors[i+1] = 0.75; // G: 193
          starColors[i+2] = 0.34; // B: 88
        } else {
          // Ice silver star
          starColors[i] = 0.8;
          starColors[i+1] = 0.85;
          starColors[i+2] = 0.95;
        }
      }

      starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
      starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

      // Texture loader for soft points
      const starMaterial = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      starField = new THREE.Points(starGeometry, starMaterial);
      scene.add(starField);

      // 2. Central Morphing 3D Geometry representing Jason's Work (Torus Knot)
      const knotSegments = isMobile ? 64 : 150;
      const knotTubular = isMobile ? 8 : 16;
      shapeGeometry = new THREE.TorusKnotGeometry(isMobile ? 4.5 : 6, isMobile ? 1.2 : 1.8, knotSegments, knotTubular);
      
      const shapeMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xe5c158,
        metalness: 0.9,
        roughness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        wireframe: true,
        transparent: true,
        opacity: isMobile ? 0.75 : 0.85,
        emissive: 0x1d1000
      });

      shapeMesh = new THREE.Mesh(shapeGeometry, shapeMaterial);
      scene.add(shapeMesh);

      // Mouse Interaction coordinates
      let targetX = 0, targetY = 0;
      document.addEventListener('mousemove', (event) => {
        targetX = (event.clientX - window.innerWidth / 2) * 0.015;
        targetY = (event.clientY - window.innerHeight / 2) * 0.015;
      });

      // Render Loop with smooth drifting
      const clock = new THREE.Clock();
      
      function animateWebGLScene() {
        requestAnimationFrame(animateWebGLScene);
        
        const elapsedTime = clock.getElapsedTime();

        // Slow standard rotations
        starField.rotation.y = elapsedTime * 0.015;
        starField.rotation.x = elapsedTime * 0.005;

        shapeMesh.rotation.y = elapsedTime * 0.12;
        shapeMesh.rotation.z = elapsedTime * 0.08;

        // Mouse Parallax drift on camera
        camera.position.x += (targetX - camera.position.x) * 0.05;
        camera.position.y += (-targetY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
      }

      animateWebGLScene();

      // Handle Resizing
      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      });
    }

    // Run WebGL Initialization
    initWebGL();


    // -------------------------------------------------------------
    // GSAP ScrollTrigger Animations & Parallax Choreography
    // -------------------------------------------------------------
    
    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Hero Entry Reveals
    gsap.to('.hero-reveal', {
      opacity: 1,
      y: 0,
      duration: 1.2,
      stagger: 0.2,
      ease: 'power3.out',
      delay: 0.3
    });

    // 3D Geometry Position/Scale changes synced with Page Scroll sections
    // Section 1: Hero to About
    gsap.timeline({
      scrollTrigger: {
        trigger: "#about",
        start: "top bottom",
        end: "top top",
        scrub: 1
      }
    })
    .to(shapeMesh.position, { x: 8, y: 0, z: -10 })
    .to(shapeMesh.scale, { x: 0.65, y: 0.65, z: 0.65 }, "<")
    .to(shapeMesh.material, { color: 0x8b5cf6, emissive: 0x10002b }, "<"); // Shifts color to purple

    // Section 2: About to Skills
    gsap.timeline({
      scrollTrigger: {
        trigger: "#skills",
        start: "top bottom",
        end: "top top",
        scrub: 1
      }
    })
    .to(shapeMesh.position, { x: -8, y: 3, z: -5 })
    .to(shapeMesh.scale, { x: 0.8, y: 0.8, z: 0.8 }, "<")
    .to(shapeMesh.material, { color: 0xe5c158, emissive: 0x1d1000 }, "<"); // back to gold

    // Section 3: Skills to Projects
    gsap.timeline({
      scrollTrigger: {
        trigger: "#projects",
        start: "top bottom",
        end: "top top",
        scrub: 1
      }
    })
    .to(shapeMesh.position, { x: 0, y: -2, z: -15 })
    .to(shapeMesh.scale, { x: 0.4, y: 0.4, z: 0.4 }, "<")
    .to(shapeMesh.material, { wireframe: true, opacity: 0.4 }, "<");

    // Section 4: Projects to Contact
    gsap.timeline({
      scrollTrigger: {
        trigger: "#contact",
        start: "top bottom",
        end: "top top",
        scrub: 1
      }
    })
    .to(shapeMesh.position, { x: 6, y: -4, z: -8 })
    .to(shapeMesh.scale, { x: 0.7, y: 0.7, z: 0.7 }, "<")
    .to(shapeMesh.material, { color: 0x3b82f6, opacity: 0.7 }, "<");


    // -------------------------------------------------------------
    // Horizontal Scroll pinned container for Projects Showcase
    // -------------------------------------------------------------
    const track = document.getElementById('projects-track');
    
    // Determine the scroll length based on window size
    function getScrollAmount() {
      let trackWidth = track.scrollWidth;
      return -(trackWidth - window.innerWidth);
    }

    // Responsive ScrollTrigger Switcher: Horizontal scroll on large, vertical stack on small devices
    let mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      // Horizontal desktop configuration
      gsap.to(track, {
        x: () => getScrollAmount(),
        ease: "none",
        scrollTrigger: {
          trigger: "#projects",
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          invalidateOnRefresh: true,
        }
      });
    });

    mm.add("(max-width: 767px)", () => {
      // Mobile stack configuration - reset transform matrix
      gsap.set(track, { x: 0, position: 'relative' });
      // Change list direction dynamically if needed, tailwind handles stack nicely
    });


    // -------------------------------------------------------------
    // Interactive Developer Terminal Mockup JS Code
    // -------------------------------------------------------------
    const inputField = document.getElementById('terminal-input');
    const textOutput = document.getElementById('terminal-text-output');
    
    // Commands Database
    const commands = {
      help: `Available shell systems:
  - about       View biological and organizational specifications
  - skills      Inspect JSON manifest of core proficiencies
  - projects    Enumerate details on active development pipelines
  - mql5        Review Valkyrie Algorithmic structural overview
  - clear       Wipe terminal frame logs
  - contact     Initiate communication protocol`,
      
      about: `================ JASON OCHOLLA PROFILE ===============
NAME        : Jason Ocholla
ROLE        : Senior Software & Web Architect
EXPERTISE   : Frontend, Backend API Design, 3D WebGL Rendering
LOCATION    : United Kingdom / Kenya (Available Globally)
MOTTO       : "Architecture balance, clean execution, solid results"
BIO         : Immersive developer optimizing applications with GSAP, Next.js, and Three.js.`,
      
      skills: `{
  "core_competencies": {
    "languages": ["TypeScript", "Python", "JavaScript ES6+", "SQL", "MQL5 (C++)", "HTML5/CSS3"],
    "frameworks": ["React", "Next.js", "FastAPI", "Express.js", "Django", "Tailwind CSS"],
    "technologies": ["Three.js", "Docker", "Git/GitHub", "Redis", "Nginx", "PostgreSQL", "AWS"]
  },
  "metrics": {
    "engineering_discipline": 1.00,
    "creative_visual_flow": 0.95,
    "system_optimization": 0.90
  }
}`,

      mql5: `================ VALKYRIE EA STATUS REPORT ================
COMPILER    : MetaEditor (MQL5 Compiler v5.00)
STRATEGY    : Volatility prediction utilizing local statistical bounds
INTEGRATION : MT5 Terminal <--> Python Socket API Broker Gateway
PERFORMANCE : Locked latency metrics, automated risk calculation matrix
SAFETY      : Implemented equity guards, dynamic slippage reduction core`,

      projects: `Enumerating Active Projects:
1. [AETHER DEFI]     - High-throughput Next.js DeFi dashboard with WebSocket support.
2. [VALKYRIE EA]     - Machine learning statistical-based Expert Advisor in MQL5.
3. [SYNTAXFORGE AI]  - local suggestions engine using llama.cpp and FastAPI.
4. [STELLARMAP 3D]   - Three.js star tracking telemetry module rendering 60FPS.`,

      contact: `Directing communication pipeline...
Email : jason@ocholla.dev
Status: Listening on port 443 for connection vectors. Use form below to transmit directly!`
    };

    // Terminal tab switcher function
    window.switchTab = function(tab) {
      // Toggle Tab Styles
      document.querySelectorAll('.terminal-tab').forEach(el => {
        el.classList.remove('border-luxury-gold', 'text-white');
        el.classList.add('border-transparent', 'text-slate-500');
        // change inner icon color if active
        const icon = el.querySelector('i');
        if (icon) icon.className = icon.className.replace('text-luxury-gold', 'text-slate-500');
      });

      const activeTab = document.getElementById(`tab-${tab}`);
      if (activeTab) {
        activeTab.classList.remove('border-transparent', 'text-slate-500');
        activeTab.classList.add('border-luxury-gold', 'text-white');
        const icon = activeTab.querySelector('i');
        if (icon) {
          icon.className = icon.className.replace('text-slate-500', 'text-luxury-gold');
        }
      }

      // Output Tab Contents to Terminal
      if (tab === 'about') {
        typeInTerminal(commands.about);
      } else if (tab === 'skills') {
        typeInTerminal(commands.skills);
      } else if (tab === 'mql5') {
        typeInTerminal(commands.mql5);
      } else if (tab === 'help') {
        typeInTerminal(commands.help);
      }
    }

    // Simulate Typing into terminal
    let typingTimer = null;
    function typeInTerminal(text) {
      if (typingTimer) clearTimeout(typingTimer);
      textOutput.textContent = '';
      let index = 0;
      
      // Speed up typing for large text
      const charsPerTick = text.length > 150 ? 5 : 1;
      
      function type() {
        if (index < text.length) {
          textOutput.textContent += text.substring(index, index + charsPerTick);
          index += charsPerTick;
          document.getElementById('terminal-screen').scrollTop = document.getElementById('terminal-screen').scrollHeight;
          typingTimer = setTimeout(type, 10);
        }
      }
      type();
    }

    // Default load tab About
    switchTab('about');

    // Live Command Shell processing
    inputField.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const input = inputField.value.trim().toLowerCase();
        inputField.value = '';

        if (!input) return;

        // Print Input
        textOutput.textContent += `\n\njason@ocholla:~$ ${input}\n`;

        if (commands[input]) {
          textOutput.textContent += commands[input];
        } else if (input === 'clear') {
          textOutput.textContent = 'bash terminal log cleared.';
        } else {
          textOutput.textContent += `Command not recognized: '${input}'. Type 'help' to review directory.`;
        }
        
        // Scroll to bottom
        setTimeout(() => {
          document.getElementById('terminal-screen').scrollTop = document.getElementById('terminal-screen').scrollHeight;
        }, 10);
      }
    });


    // -------------------------------------------------------------
    // Contact Form submission & Captcha Verification
    // -------------------------------------------------------------
    const captchaCodeSpan = document.getElementById('captcha-code');
    const captchaInput = document.getElementById('captcha-input');
    const formStatus = document.getElementById('form-status');
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('form-submit-btn');
    const subjectSelect = document.getElementById('subject');
    const subjectOtherWrapper = document.getElementById('subject-other-wrapper');
    const subjectOtherInput = document.getElementById('subject-other');

    const web3FormsAccessKey = '82721d04-a172-4ed6-b5dd-928285bec7b8';

    window.generateCaptcha = function() {
      const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
      let code = '';
      for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      if (captchaCodeSpan) {
        captchaCodeSpan.textContent = code;
      }
    };
    generateCaptcha();

    if (subjectSelect) {
      subjectSelect.addEventListener('change', () => {
        const showOther = subjectSelect.value === 'custom_request';
        if (subjectOtherWrapper) {
          subjectOtherWrapper.classList.toggle('hidden', !showOther);
        }
        if (subjectOtherInput) {
          subjectOtherInput.required = showOther;
          if (!showOther) {
            subjectOtherInput.value = '';
          }
        }
      });
    }

    window.handleFormSubmit = async function(event) {
      event.preventDefault();

      if (!captchaInput || !captchaCodeSpan || !formStatus || !contactForm || !submitBtn) {
        return;
      }

      const enteredCaptcha = captchaInput.value.trim().toUpperCase();
      const actualCaptcha = captchaCodeSpan.textContent || '';

      formStatus.className = 'rounded-lg p-4 font-mono text-xs border hidden';

      if (enteredCaptcha !== actualCaptcha) {
        formStatus.classList.remove('hidden');
        formStatus.classList.add('bg-red-950/40', 'border-red-500/30', 'text-red-400');
        formStatus.innerHTML = '<i data-lucide="shield-alert" class="w-4 h-4 inline-block mr-1.5 align-middle"></i><strong>Verification Failure:</strong> Human validation failed.';
        generateCaptcha();
        captchaInput.value = '';
        lucide.createIcons();
        return;
      }

      submitBtn.textContent = 'Transmitting...';
      submitBtn.disabled = true;

      const templateParams = {
        name: document.getElementById('name')?.value || '',
        email: document.getElementById('email')?.value || '',
        subject: document.getElementById('subject')?.value || '',
        message: document.getElementById('message')?.value || ''
      };

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            access_key: web3FormsAccessKey,
            name: templateParams.name,
            email: templateParams.email,
            subject: templateParams.subject,
            message: templateParams.message
          })
        });

        const result = await response.json();

        if (!response.ok || result.success !== true) {
          throw new Error(result.message || 'Web3Forms submission failed.');
        }

        formStatus.classList.remove('hidden');
        formStatus.classList.add('bg-emerald-950/40', 'border-emerald-500/30', 'text-emerald-400');
        formStatus.innerHTML = '<i data-lucide="check-circle" class="w-4 h-4 inline-block mr-1.5 align-middle"></i><strong>Transmission Confirmed:</strong> Message dispatched.';
        contactForm.reset();
      } catch (error) {
        formStatus.classList.remove('hidden');
        formStatus.classList.add('bg-red-950/40', 'border-red-500/30', 'text-red-400');
        formStatus.innerHTML = '<strong>Transmission Error:</strong> Please verify your Web3Forms access key and try again.';
      } finally {
        submitBtn.textContent = 'Transmit Transmission';
        submitBtn.disabled = false;
        generateCaptcha();
        lucide.createIcons();
      }
    }
  