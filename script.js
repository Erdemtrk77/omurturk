document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Interactive Galaxy Canvas Background ---
    const canvas = document.getElementById('galaxy-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');

        let width, height;
        let stars = [];
        let mouse = { x: null, y: null, radius: 150 };

        function initCanvas() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            stars = [];

            const count = Math.floor((width * height) / 3500);
            for (let i = 0; i < count; i++) {
                stars.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    size: Math.random() * 1.5 + 0.3,
                    alpha: Math.random() * 0.8 + 0.2,
                    speed: Math.random() * 0.2 + 0.05,
                    color: Math.random() > 0.7 ? '#06b6d4' : (Math.random() > 0.5 ? '#a855f7' : '#ffffff')
                });
            }
        }

        function drawStars() {
            ctx.clearRect(0, 0, width, height);

            if (mouse.x && mouse.y) {
                const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, mouse.radius);
                gradient.addColorStop(0, 'rgba(168, 85, 247, 0.12)');
                gradient.addColorStop(0.5, 'rgba(6, 182, 212, 0.05)');
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
                ctx.fill();
            }

            stars.forEach(star => {
                star.alpha += (Math.random() - 0.5) * 0.02;
                if (star.alpha < 0.2) star.alpha = 0.2;
                if (star.alpha > 0.9) star.alpha = 0.9;

                star.y -= star.speed;
                if (star.y < 0) star.y = height;

                ctx.save();
                ctx.globalAlpha = star.alpha;
                ctx.fillStyle = star.color;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });

            requestAnimationFrame(drawStars);
        }

        window.addEventListener('resize', initCanvas);
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        initCanvas();
        drawStars();
    }

    // --- 2. Mobile Menu Toggle ---
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if(mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        document.querySelectorAll('#mobile-menu a').forEach(link => {
            link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
        });
    }

    // --- 3. Command Palette Modal (Ctrl + K) ---
    const cmdBtn = document.getElementById('cmd-btn');
    const cmdModal = document.getElementById('cmd-modal');
    const cmdInput = document.getElementById('cmd-input');

    if(cmdBtn && cmdModal && cmdInput) {
        function openCmdModal() {
            cmdModal.classList.remove('hidden');
            cmdInput.focus();
        }

        function closeCmdModal() {
            cmdModal.classList.add('hidden');
        }

        cmdBtn.addEventListener('click', openCmdModal);

        window.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                openCmdModal();
            }
            if (e.key === 'Escape') {
                closeCmdModal();
            }
        });

        cmdModal.addEventListener('click', (e) => {
            if (e.target === cmdModal) closeCmdModal();
        });

        document.querySelectorAll('.cmd-item').forEach(item => {
            item.addEventListener('click', closeCmdModal);
        });
    }

    // --- 4. Copy Email Feature ---
    const copyBtn = document.getElementById('copy-email-btn');
    if(copyBtn) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText('omurturk@example.com');
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fa-solid fa-check text-emerald-400"></i><span>Kopyalandı!</span>';
            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
            }, 2000);
        });
    }

// --- 5. Form Submit Notification ---
    const contactForm = document.getElementById('contact-form');
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('🚀 Mesajınız başarıyla kozmik evrene iletildi! En kısa sürede dönüş yapacağım.');
            e.target.reset();
        });
    }

});


// --- THREE.JS GEZEGEN SİSTEMİ (DIŞA AÇILMIŞ VE BOYUTU BÜYÜTÜLMÜŞ) ---
function init3DHeroPlanets() {
    const canvas = document.getElementById('hero-3d-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    
    // Kamera mesafesi sabit, düzeni bozmuyoruz
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.z = 12.0;

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    
    function resizeCanvas() {
        const size = canvas.parentElement.clientWidth || 500;
        renderer.setSize(size, size, false); // Kilit burada, asla silinmeyecek!
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        camera.aspect = 1;
        camera.updateProjectionMatrix();
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
    sunLight.position.set(10, 10, 10);
    scene.add(sunLight);

    const textureLoader = new THREE.TextureLoader();

    const EARTH_ORBIT_SECONDS = 30; 
    const EARTH_SPIN_SECONDS = 5; 

    // GEZEGENLER BÜYÜTÜLDÜ VE DIŞA DOĞRU İTİLDİ (4.6 / 3.9 / 3.3)
    const planetConfigs = [
        // En Dış Çizgi
        { name: 'Earth', radius: 0.24, orbitR: 4.6, period: 1.0, spinPeriod: 1.0, glow: 0x2563eb, texture: 'img/earth.jpg' },
        { name: 'Mars', radius: 0.20, orbitR: 4.6, period: 1.88, spinPeriod: 1.03, glow: 0xef4444, texture: 'img/mars.jpg' },
        { name: 'Jupiter', radius: 0.30, orbitR: 4.6, period: 11.86, spinPeriod: 0.41, glow: 0xf59e0b, texture: 'img/jupiter.jpg' },
        
        // Orta Kesikli Çizgi
        { name: 'Saturn', radius: 0.25, orbitR: 3.9, period: 29.46, spinPeriod: 0.45, glow: 0xd97706, hasRing: true, texture: 'img/saturn.jpg' },
        { name: 'Neptune', radius: 0.22, orbitR: 3.9, period: 164.8, spinPeriod: 0.67, glow: 0x06b6d4, texture: 'img/neptune.jpg' },
        
        // İç Çizgi (Fotoğrafın baskısından kurtuldu, tamamen dışarı çıktı)
        { name: 'Venus', radius: 0.21, orbitR: 3.3, period: 0.615, spinPeriod: -243, glow: 0x22d3ee, texture: 'img/venus.jpg' },
        { name: 'Mercury', radius: 0.18, orbitR: 3.3, period: 0.24, spinPeriod: 58.6, glow: 0xec4899, texture: 'img/mercury.jpg' }
    ];

    const planets = [];

    planetConfigs.forEach((cfg, index) => {
        const geometry = new THREE.SphereGeometry(cfg.radius, 64, 64); 
        const texture = textureLoader.load(cfg.texture);
        
        const material = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.4,
            metalness: 0.1,
            emissive: cfg.glow,
            emissiveIntensity: 0.2 
        });

        const mesh = new THREE.Mesh(geometry, material);
        
        // Halka oranları gezegen büyüklüğüne göre otomatik
        if (cfg.hasRing) {
            const ringGeo = new THREE.RingGeometry(cfg.radius * 1.3, cfg.radius * 1.9, 64);
            const ringMat = new THREE.MeshStandardMaterial({
                color: 0xf59e0b,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.85
            });
            const ringMesh = new THREE.Mesh(ringGeo, ringMat);
            ringMesh.rotation.x = Math.PI / 2.8;
            mesh.add(ringMesh);
        }

        const angle = (index / planetConfigs.length) * Math.PI * 2;
        scene.add(mesh);

        planets.push({
            mesh: mesh,
            orbitR: cfg.orbitR,
            angle: angle,
            speed: (Math.PI * 2) / (EARTH_ORBIT_SECONDS * cfg.period * 60),
            selfSpeed: (Math.PI * 2) / (EARTH_SPIN_SECONDS * cfg.spinPeriod * 60)
        });
    });

    function animate() {
        requestAnimationFrame(animate);
        planets.forEach(p => {
            p.angle += p.speed;
            p.mesh.position.x = Math.cos(p.angle) * p.orbitR;
            p.mesh.position.y = Math.sin(p.angle) * p.orbitR;
            p.mesh.position.z = 0; 
            p.mesh.rotation.y += p.selfSpeed; 
        });
        renderer.render(scene, camera);
    }
    animate();
}



// --- 5. GERÇEK E-POSTA GÖNDERME MOTORU & TOAST BİLDİRİMİ ---
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnIcon = document.getElementById('btn-icon');
    
    // Toast Elementleri
    const toast = document.getElementById('cosmic-toast');
    const toastTitle = document.getElementById('toast-title');
    const toastMsg = document.getElementById('toast-message');
    const toastIconWrap = document.getElementById('toast-icon-wrapper');
    const toastIcon = document.getElementById('toast-icon');

    // Toast Animasyon Fonksiyonu
    function showToast(type, title, message) {
        if(!toast) return;
        
        toastTitle.innerText = title;
        toastMsg.innerText = message;

        // Başarılı veya Hata durumuna göre renk/ikon değiştir
        if(type === 'success') {
            toast.className = 'fixed top-24 right-4 sm:top-auto sm:bottom-10 sm:right-10 z-[200] transform translate-x-0 opacity-100 transition-all duration-500 glass-card border border-white/10 p-4 pr-8 rounded-2xl flex items-center gap-4 shadow-[0_0_30px_rgba(16,185,129,0.2)]';
            toastIconWrap.className = 'w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-emerald-500/20 text-emerald-500';
            toastIcon.className = 'fa-solid fa-check text-lg';
        } else {
            toast.className = 'fixed top-24 right-4 sm:top-auto sm:bottom-10 sm:right-10 z-[200] transform translate-x-0 opacity-100 transition-all duration-500 glass-card border border-white/10 p-4 pr-8 rounded-2xl flex items-center gap-4 shadow-[0_0_30px_rgba(244,63,94,0.2)]';
            toastIconWrap.className = 'w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-rose-500/20 text-rose-500';
            toastIcon.className = 'fa-solid fa-triangle-exclamation text-lg';
        }

        // 4 Saniye Sonra Ekrana Kaydırarak Gizle
        setTimeout(() => {
            toast.classList.remove('translate-x-0', 'opacity-100');
            toast.classList.add('translate-x-[150%]', 'opacity-0');
        }, 4000);
    }

    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            // Butonu 'Gönderiliyor' moduna al
            const originalText = btnText.innerText;
            btnText.innerText = 'Gönderiliyor...';
            btnIcon.className = 'fa-solid fa-spinner fa-spin text-sm'; 
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-75', 'cursor-not-allowed');

            const formData = new FormData(contactForm);

            fetch('https://formsubmit.co/ajax/erdemtrk7@gmail.com', {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                // Başarılı Durumu
                btnText.innerText = 'Başarıyla Gönderildi!';
                btnIcon.className = 'fa-solid fa-check text-sm';
                submitBtn.classList.remove('bg-space-950', 'border-white/5', 'hover:bg-space-800');
                submitBtn.classList.add('bg-emerald-600', 'hover:bg-emerald-500');
                
                // Havalı Bildirimi Ateşle
                showToast('success', 'İletişim Kuruldu!', 'Kozmik mesajınız başarıyla evrene iletildi. En kısa sürede dönüş yapacağım.');
                contactForm.reset();

                // 4 Saniye Sonra Butonu Sıfırla
                setTimeout(() => {
                    btnText.innerText = originalText;
                    btnIcon.className = 'fa-solid fa-paper-plane text-sm';
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('opacity-75', 'cursor-not-allowed', 'bg-emerald-600', 'hover:bg-emerald-500');
                    submitBtn.classList.add('bg-space-950', 'border-white/5', 'hover:bg-space-800');
                }, 4000);
            })
            .catch(error => {
                // Hata Durumu (Alert kalktı, yerine hata Toast'u geldi)
                showToast('error', 'İletim Başarısız!', 'Kozmik ağda bir sorun oluştu. Lütfen internet bağlantınızı kontrol edip tekrar deneyin.');
                
                btnText.innerText = originalText;
                btnIcon.className = 'fa-solid fa-paper-plane text-sm';
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
            });
        });
    }




if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init3DHeroPlanets();
} else {
    document.addEventListener('DOMContentLoaded', init3DHeroPlanets);
}

// --- 7. DÖNEREK GELEN ELİT BLOG MODAL MOTORU ---
function initPlanetBlogModal() {
    const readMoreBtns = document.querySelectorAll('.read-more-btn');
    const modal = document.getElementById('planet-modal');
    const modalCloseBtn = document.getElementById('planet-modal-close');
    
    const modalCategory = document.getElementById('modal-category');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const contentInner = document.getElementById('planet-content-inner');
    const planetSurface = document.getElementById('planet-surface');
    const modalGlow = document.getElementById('modal-glow');

    if (!modal || !readMoreBtns.length) return;

    readMoreBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            const card = btn.closest('article');
            if (!card) return;

            const category = card.querySelector('.category-badge')?.innerText || 'Genel';
            const title = card.querySelector('h4')?.innerText || 'Başlık';
            const hiddenContent = card.querySelector('.article-content')?.innerHTML || '<p>İçerik bulunamadı.</p>';
            const theme = btn.getAttribute('data-theme') || 'theme-cyan';

            // Temaya Göre Neon Glow
            if (modalGlow) {
                if (theme === 'theme-purple') modalGlow.className = "absolute -top-24 -left-24 w-72 h-72 rounded-full bg-cosmic-purple/30 blur-3xl pointer-events-none";
                else if (theme === 'theme-emerald') modalGlow.className = "absolute -top-24 -left-24 w-72 h-72 rounded-full bg-emerald-500/30 blur-3xl pointer-events-none";
                else if (theme === 'theme-rose') modalGlow.className = "absolute -top-24 -left-24 w-72 h-72 rounded-full bg-rose-500/30 blur-3xl pointer-events-none";
                else modalGlow.className = "absolute -top-24 -left-24 w-72 h-72 rounded-full bg-cosmic-cyan/30 blur-3xl pointer-events-none";
            }

            // İçerik Basa
            if (modalCategory) modalCategory.innerText = category;
            if (modalTitle) modalTitle.innerText = title;
            if (modalBody) modalBody.innerHTML = hiddenContent;

            // Modalı Aç
            modal.classList.remove('opacity-0', 'pointer-events-none');
            modal.classList.add('opacity-100');

            // 3D Dönerek Büyüme Efekti
            setTimeout(() => {
                if (planetSurface) {
                    planetSurface.style.transform = 'scale(1) rotate(0deg)';
                    planetSurface.style.opacity = '1';
                }
                if (contentInner) {
                    contentInner.classList.remove('opacity-0');
                    contentInner.classList.add('opacity-100');
                }
            }, 30);
        });
    });

    function closeModal() {
        if (contentInner) {
            contentInner.classList.remove('opacity-100');
            contentInner.classList.add('opacity-0');
        }

        if (planetSurface) {
            planetSurface.style.transform = 'scale(0.7) rotate(-8deg)';
            planetSurface.style.opacity = '0';
        }

        setTimeout(() => {
            modal.classList.remove('opacity-100');
            modal.classList.add('opacity-0', 'pointer-events-none');
        }, 300);
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('opacity-100')) {
            closeModal();
        }
    });
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initPlanetBlogModal();
} else {
    document.addEventListener('DOMContentLoaded', initPlanetBlogModal);
}