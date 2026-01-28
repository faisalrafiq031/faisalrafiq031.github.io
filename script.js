document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        body.classList.toggle('light-mode');

        if (body.classList.contains('dark-mode')) {
            icon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        }
        createPopper(event.clientX, event.clientY);
    });

    // Load saved theme or default to dark
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.replace('dark-mode', 'light-mode');
        icon.classList.replace('fa-sun', 'fa-moon');
    } else {
        // Default or explicitly dark
        body.classList.add('dark-mode');
        icon.classList.replace('fa-moon', 'fa-sun');
    }

    // 2. Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // 3. Navbar Scroll Effect & Back to Top
    const navbar = document.querySelector('.navbar');
    const backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 3. Reveal Animations
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        reveals.forEach(el => {
            const windowHeight = window.innerHeight;
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < windowHeight - elementVisible) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check

    // 4. Hero Canvas Animation (Particles/Popper Effect)
    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor(x, y, size, color, speedX, speedY) {
            this.x = x || Math.random() * canvas.width;
            this.y = y || Math.random() * canvas.height;
            this.size = size || Math.random() * 5 + 1;
            this.color = color || 'rgba(98, 159, 173, 0.3)';
            this.speedX = speedX || Math.random() * 2 - 1;
            this.speedY = speedY || Math.random() * 2 - 1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < 80; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    initParticles();
    animate();

    // 5. "Popper" Click Effect (Improved)
    function createPopper(x, y) {
        const colors = ['#0C2C55', '#296374', '#629FAD', '#EDEDCE'];
        for (let i = 0; i < 25; i++) {
            const size = Math.random() * 10 + 2;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const speedX = (Math.random() - 0.5) * 15;
            const speedY = (Math.random() - 0.5) * 15;

            const p = new Particle(x, y, size, color, speedX, speedY);
            p.life = 1.0;
            p.gravity = 0.2;
            p.update = function () {
                this.x += this.speedX;
                this.y += this.speedY;
                this.speedY += this.gravity; // Gravity effect
                this.life -= 0.015;
                if (this.life <= 0) {
                    const index = particles.indexOf(this);
                    if (index > -1) particles.splice(index, 1);
                }
            };
            p.draw = function () {
                ctx.globalAlpha = this.life;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1.0;
            };
            particles.push(p);
        }
    }

    window.addEventListener('click', (e) => {
        createPopper(e.clientX, e.clientY);
    });

    // 6. Smooth Scroll for Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // 7. Form Submission (Using Fetch for Formspree)
    const form = document.querySelector('.contact-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button');
        const originalText = btn.innerText;

        btn.innerText = 'Sending...';
        btn.disabled = true;

        const formData = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                btn.innerText = 'Sent Successfully!';
                btn.style.background = '#28a745';
                btn.style.borderColor = '#28a745';
                form.reset();
            } else {
                throw new Error();
            }
        } catch (error) {
            btn.innerText = 'Error! Try Again';
            btn.style.background = '#dc3545';
            btn.style.borderColor = '#dc3545';
        }

        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = '';
            btn.style.borderColor = '';
            btn.disabled = false;
        }, 5000);
    });
});
