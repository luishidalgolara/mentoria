// ==========================================
// MENTOR-IA PLATAFORM - MAIN CORE
// Archivo 1 de 2 - Funcionalidades principales
// ==========================================

//=== GLOBAL VARIABLES ===
let currentUser = null;
let userSubscription = null;

// === SOFTWARE CATALOG ===
const softwareCatalog = [
    {
        id: 1,
        name: "Comprender la mente detras de la Inteligencia Artificial",
        description: "Descubre como piensa una IA: sus tecnicas, estructuras y el tipo de razonamiento que usa para aprender, decidir y adaptarse. Aprenderas a pensar como un ingeniero de IA: analitico, creativo y orientado a soluciones inteligentes.",
        icon: "📝",
        requiredPlan: "basic",
        category: "productivity",
        features: ["Editor basico", "Guardar locamente", "Vista previa"]
    },
    {
        id: 2,
        name: "Diseno y arquitectura visual de aplicaciones y webs",
        description: "Aprenderas a crear interfaces atractivas, funcionales y coherentes con la identidad de tu proyecto. Desde la eleccion de colores, tipografias y estilos visuales, hasta la estructura de navegacion y arquitectura de la informacion, desarrollaras aplicaciones y sitios que no solo funcionan, sino que tambien ofrecen una experiencia intuitiva y profesional.",
        icon: "🎨",
        requiredPlan: "basic",
        category: "design",
        features: ["Editor vectorial", "Plantillas IA", "Exportar HD"]
    },
    {
        id: 3,
        name: "Desarrollaras pensamiento logico-computacional",
        description: "Entrena tu mente para razonar como una maquina. Aprenderas a traducir ideas complejas en pasos claros y estructuras de codigo, construyendo sistemas capaces de tomar decisiones automaticas y eficientes.",
        icon: "💻",
        requiredPlan: "pro",
        category: "development",
        features: ["Sintaxis highlighting", "Debug IA", "git integrado"]
    },
    {
        id: 4,
        name: "Detectar patrones y comportamientos ocultos en los datos",
        description: "La clave de la IA esta en los datos. Dominaras tecnicas para reconocer tendencias, relaciones y comportamientos en grandes volumenes de informacion, y transformar esos hallazgos en decisiones inteligentes.",
        icon: "📊",
        requiredPlan: "pro",
        category: "analytics",
        features: ["Graficos dinamicos", "ML automatico", "Exportar reportes"]
    },
    {
        id: 5,
        name: "Cloud Manager",
        description: "Panel de control para administrar servidores y servicios en la nube de forma intuitiva",
        icon: "☁️",
        requiredPlan: "enterprise",
        category: "infrastructure",
        features: ["Multi-cloud", "Monitoreo 24/7", "Auto-scaling"]
    },
    {
        id: 6,
        name: "Neural Whiter",
        description: "Editor de texto con IA que ayuda a crear contenido, corregir gramatica y optimizar SEO.",
        icon: "✍️",
        requiredPlan: "basic",
        category: "content",
        features: ["Correcion IA", "Optimizacion SEO", "Templates"]
    }
]

// === SUBSCRIPTION PLANS ===
const subscriptionPlans = {
    free: {
        name: "Free",
        price: 0,
        features: ["Acceso limitado", "2 aplicaciones básicas", "Soporte comunidad"]
    },
    basic: {
        name: "Básico",
        price: 9.99,
        features: ["Aplicaciones básicas", "5GB almacenamiento", "Soporte email"]
    },
    pro: {
        name: "Pro",
        price: 29.99,
        features: ["Todas las aplicaciones", "100GB almacenamiento", "Soporte prioritario"]
    },
    enterprise: {
        name: "Enterprise",
        price: 99.99,
        features: ["Acceso completo", "Almacenamiento ilimitado", "Soporte 24/7", "API personalizada"]
    }
};

// === INITIALIZATION ===
window.addEventListener('load', function() {
    setTimeout(() => {
        document.getElementById('loadingScreen').classList.add('hidden');
        initializeApp();
    }, 2000);
});

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    
    // Close modals on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideAuthModal();
            hideSubscriptionModal();
            closeApp();
        }
    });
});

// === THEME MANAGEMENT ===
function initializeTheme() {
    const savedTheme = localStorage.getItem('nexus-theme') || 'dark';
    applyTheme(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nexus-theme', theme);
    
    const themeButton = document.getElementById('themeToggle');
    if (themeButton) {
        themeButton.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
}

// === MAIN INITIALIZATION ===
function initializeApp() {
    initializeAuth();
    initializeTheme();
    initializeAnimations();
    loadSoftware();
    updateDashboard();
}

// === USER AUTHENTICATION SYSTEM ===
function initializeAuth() {
    const savedUser = localStorage.getItem('nexusUser');
    const savedSubscription = localStorage.getItem('nexusSubscription');
    
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        userSubscription = savedSubscription ? JSON.parse(savedSubscription) : { plan: 'free' };
        updateAuthUI();
        updateDashboard();
    }
}

function showAuthModal(type) {
    const overlay = document.getElementById('authOverlay');
    const title = document.getElementById('authTitle');
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    
    if (type === 'register') {
        title.textContent = 'CREAR CUENTA';
        registerForm.style.display = 'block';
        loginForm.style.display = 'none';
    } else {
        title.textContent = 'INICIAR SESIÓN';
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    }
    
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function hideAuthModal() {
    const overlay = document.getElementById('authOverlay');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
}

function handleRegister(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    const existingUsers = JSON.parse(localStorage.getItem('nexusUsers') || '[]');
    if (existingUsers.find(user => user.email === data.email)) {
        alert('⚠️ Ya existe una cuenta con este email');
        return;
    }
    
    const emailName = data.email.split('@')[0];
    const newUser = {
        id: Date.now(),
        name: emailName.charAt(0).toUpperCase() + emailName.slice(1),
        email: data.email,
        password: data.password,
        registeredAt: new Date().toISOString()
    };
    
    existingUsers.push(newUser);
    localStorage.setItem('nexusUsers', JSON.stringify(existingUsers));
    
    currentUser = { id: newUser.id, name: newUser.name, email: newUser.email };
    userSubscription = { plan: 'free', startDate: new Date().toISOString() };
    
    localStorage.setItem('nexusUser', JSON.stringify(currentUser));
    localStorage.setItem('nexusSubscription', JSON.stringify(userSubscription));
    
    alert('🚀 CUENTA CREADA CORRECTAMENTE\n\n⚡ ¡Bienvenido a Mentor-IA!');
    
    hideAuthModal();
    updateAuthUI();
    updateDashboard();
    event.target.reset();
}

function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    const existingUsers = JSON.parse(localStorage.getItem('nexusUsers') || '[]');
    const user = existingUsers.find(u => u.email === data.email && u.password === data.password);
    
    if (!user) {
        alert('⚠️ Canal neural o código de acceso incorrectos');
        return;
    }
    
    currentUser = { id: user.id, name: user.name, email: user.email };
    
    const savedSubscription = localStorage.getItem(`nexusSubscription_${user.id}`);
    userSubscription = savedSubscription ? JSON.parse(savedSubscription) : { plan: 'free' };
    
    if (data.rememberMe) {
        localStorage.setItem('nexusUser', JSON.stringify(currentUser));
        localStorage.setItem('nexusSubscription', JSON.stringify(userSubscription));
    } else {
        sessionStorage.setItem('nexusUser', JSON.stringify(currentUser));
        sessionStorage.setItem('nexusSubscription', JSON.stringify(userSubscription));
    }
    
    alert(`🔗 ACCESO AUTORIZADO\n\nBienvenido de vuelta, ${user.name}!\nPlan actual: ${subscriptionPlans[userSubscription.plan].name}`);
    
    hideAuthModal();
    updateAuthUI();
    updateDashboard();
    event.target.reset();
}

function logout() {
    currentUser = null;
    userSubscription = null;
    localStorage.removeItem('nexusUser');
    localStorage.removeItem('nexusSubscription');
    sessionStorage.removeItem('nexusUser');
    sessionStorage.removeItem('nexusSubscription');
    
    alert('🔐 SESIÓN TERMINADA\n\nHasta pronto, agente!');
    updateAuthUI();
    updateDashboard();
}

function updateAuthUI() {
    const registerBtn = document.getElementById('registerBtn');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');
    const currentPlan = document.getElementById('currentPlan');
    
    if (currentUser) {
        registerBtn.style.display = 'none';
        userMenu.style.display = 'flex';
        userName.textContent = currentUser.name;
        currentPlan.textContent = subscriptionPlans[userSubscription?.plan || 'free'].name;
    } else {
        registerBtn.style.display = 'flex';
        userMenu.style.display = 'none';
    }
}

// === GOOGLE AUTHENTICATION ===
function loginWithGoogle() {
    alert('🔍 CONECTANDO CON GOOGLE...\n\nRedirigiendo a Google OAuth...');
    
    setTimeout(() => {
        const googleUser = {
            id: Date.now(),
            name: 'Usuario Google',
            email: 'usuario@gmail.com',
            provider: 'google',
            registeredAt: new Date().toISOString()
        };
        
        const existingUsers = JSON.parse(localStorage.getItem('nexusUsers') || '[]');
        if (!existingUsers.find(user => user.email === googleUser.email)) {
            existingUsers.push(googleUser);
            localStorage.setItem('nexusUsers', JSON.stringify(existingUsers));
        }
        
        currentUser = { id: googleUser.id, name: googleUser.name, email: googleUser.email };
        userSubscription = { plan: 'free', startDate: new Date().toISOString() };
        
        localStorage.setItem('nexusUser', JSON.stringify(currentUser));
        localStorage.setItem('nexusSubscription', JSON.stringify(userSubscription));
        
        alert('✅ CONECTADO CON GOOGLE\n\n¡Bienvenido a Mentor-IA!');
        
        hideAuthModal();
        updateAuthUI();
        updateDashboard();
    }, 2000);
}

// === SUBSCRIPTION SYSTEM ===
function showSubscriptionModal() {
    const overlay = document.getElementById('subscriptionOverlay');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function hideSubscriptionModal() {
    const overlay = document.getElementById('subscriptionOverlay');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
}

function subscribe(planType, price) {
    if (!currentUser) {
        hideSubscriptionModal();
        alert('🔐 REGISTRO REQUERIDO\n\nPara suscribirte necesitas crear una cuenta.\n\n¡Es rápido y gratis!');
        showAuthModal('register');
        return;
    }
    
    const planName = subscriptionPlans[planType].name;
    const confirmMessage = `💳 SUSCRIPCIÓN ${planName.toUpperCase()}\n\nPrecio: ${price}/mes\n\n¿Confirmas la suscripción?`;
    
    if (confirm(confirmMessage)) {
        setTimeout(() => {
            userSubscription = {
                plan: planType,
                price: price,
                startDate: new Date().toISOString(),
                status: 'active'
            };
            
            localStorage.setItem('nexusSubscription', JSON.stringify(userSubscription));
            localStorage.setItem(`nexusSubscription_${currentUser.id}`, JSON.stringify(userSubscription));
            
            alert(`🎉 ¡SUSCRIPCIÓN ACTIVADA!\n\nPlan: ${planName}\nPrecio: ${price}/mes\n\n✅ Ya tienes acceso a todas las funcionalidades de tu plan.`);
            
            updateAuthUI();
            updateDashboard();
            loadSoftware();
            hideSubscriptionModal();
        }, 2000);
        
        alert('⚡ PROCESANDO PAGO...\n\nConectando con el procesador de pagos...');
    }
}

// === SOFTWARE MANAGEMENT ===
function loadSoftware() {
    loadSoftwareGrid('featuredSoftware', softwareCatalog.slice(0, 4));
    loadSoftwareGrid('allSoftware', softwareCatalog);
}

function loadSoftwareGrid(containerId, softwareList) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    softwareList.forEach((software, index) => {
        const softwareCard = document.createElement('div');
        softwareCard.className = 'software-card';
        softwareCard.style.animationDelay = `${index * 0.1}s`;
        
        softwareCard.innerHTML = `
            <div class="software-icon">${software.icon}</div>
            <div class="software-info">
                <h3 class="software-name">${software.name}</h3>
                <p class="software-description">${software.description}</p>
            </div>
        `;
        
        container.appendChild(softwareCard);
    });
}

function checkSoftwareAccess(requiredPlan) {
    if (requiredPlan === 'free') {
        return true;
    }
    
    if (!currentUser || !userSubscription) {
        return false;
    }
    
    const planHierarchy = ['free', 'basic', 'pro', 'enterprise'];
    const userPlanIndex = planHierarchy.indexOf(userSubscription.plan);
    const requiredPlanIndex = planHierarchy.indexOf(requiredPlan);
    
    return userPlanIndex >= requiredPlanIndex;
}

function launchSoftware(softwareId) {
    const software = softwareCatalog.find(s => s.id === softwareId);
    if (!software) return;
    
    if (!currentUser && software.requiredPlan !== 'free') {
        const shouldRegister = confirm(
            `🔐 REGISTRO REQUERIDO\n\nPara usar "${software.name}" necesitas una cuenta.\n\n¿Quieres crear una cuenta gratis?`
        );
        
        if (shouldRegister) {
            showAuthModal('register');
        }
        return;
    }
    
    if (currentUser && !checkSoftwareAccess(software.requiredPlan)) {
        alert(`🔒 PLAN REQUERIDO\n\nPara usar "${software.name}" necesitas el plan ${subscriptionPlans[software.requiredPlan].name}.\n\n¿Quieres ver los planes disponibles?`);
        showSubscriptionModal();
        return;
    }
    
    showAppModal(software);
}

// === APP MODAL SYSTEM ===
function showAppModal(software) {
    const overlay = document.getElementById('appOverlay');
    const title = document.getElementById('appTitle');
    const content = document.getElementById('appContent');
    
    title.textContent = software.name;
    content.innerHTML = generateAppContent(software);
    
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    initializeAppFeatures(software);
}

function closeApp() {
    const overlay = document.getElementById('appOverlay');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
}

// === DASHBOARD MANAGEMENT ===
function updateDashboard() {
    const dashboardContainer = document.getElementById('dashboardContainer');
    if (!dashboardContainer) return;
    
    if (!currentUser || !userSubscription || userSubscription.plan === 'free') {
        dashboardContainer.innerHTML = `
            <div class="no-access-message">
                <h3>🔐 Dashboard Premium</h3>
                <p>Suscríbete para acceder a tu dashboard personalizado con:</p>
                <ul style="text-align: left; margin: 2rem 0; color: var(--text-secondary);">
                    <li>📊 Analytics de uso</li>
                    <li>📈 Estadísticas detalladas</li>
                    <li>🎯 Métricas de productividad</li>
                    <li>📱 Apps favoritas</li>
                    <li>⚙️ Configuración avanzada</li>
                </ul>
                <button onclick="showSubscriptionModal()" style="background: var(--gradient-neon); border: none; color: white; padding: 1rem 2rem; border-radius: 15px; cursor: pointer; font-weight: 700; text-transform: uppercase;">🚀 Suscribirse Ahora</button>
            </div>
        `;
    } else {
        dashboardContainer.innerHTML = `
            <div class="dashboard-content">
                <div class="dashboard-widget">
                    <h4 class="widget-title">📊 Uso de Apps</h4>
                    <div style="color: var(--text-secondary);">
                        <p>Neural Designer: <span style="color: var(--neon-blue);">24h</span></p>
                        <p>Code Matrix: <span style="color: var(--neon-green);">18h</span></p>
                        <p>Data Vision: <span style="color: var(--neon-purple);">12h</span></p>
                    </div>
                </div>
                
                <div class="dashboard-widget">
                    <h4 class="widget-title">⚡ Productividad</h4>
                    <div style="color: var(--text-secondary);">
                        <p>Tareas completadas: <span style="color: var(--neon-green);">47</span></p>
                        <p>Proyectos activos: <span style="color: var(--neon-blue);">8</span></p>
                        <p>Eficiencia: <span style="color: var(--neon-pink);">94%</span></p>
                    </div>
                </div>
                
                <div class="dashboard-widget">
                    <h4 class="widget-title">📈 Tu Plan</h4>
                    <div style="color: var(--text-secondary);">
                        <p>Plan actual: <span style="color: var(--neon-green);">${subscriptionPlans[userSubscription.plan].name}</span></p>
                        <p>Apps disponibles: <span style="color: var(--neon-blue);">${getAvailableAppsCount()}</span></p>
                        <p>Almacenamiento: <span style="color: var(--neon-purple);">67% usado</span></p>
                    </div>
                </div>
                
                <div class="dashboard-widget">
                    <h4 class="widget-title">🎯 Apps Favoritas</h4>
                    <div style="color: var(--text-secondary);">
                        <p>🎨 Neural Designer</p>
                        <p>💻 Code Matrix</p>
                        <p>📊 Data Vision</p>
                        <button onclick="showPage('software')" style="background: var(--neon-blue); border: none; color: white; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; margin-top: 1rem;">Ver Todas</button>
                    </div>
                </div>
            </div>
        `;
    }
}

function getAvailableAppsCount() {
    if (!userSubscription) return 0;
    
    return softwareCatalog.filter(app => checkSoftwareAccess(app.requiredPlan)).length;
}

// === PAGE NAVIGATION ===
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        window.scrollTo(0, 0);
        
        if (pageId === 'dashboard') {
            updateDashboard();
        }
    }
}

// === FORM FUNCTIONS ===
function handleContactForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    alert(`🔗 TRANSMISIÓN RECIBIDA\n\nAgente: ${data.name}\nCanal: ${data.email}\n\n⚡ Nuestro equipo te responderá en menos de 24 horas.`);
    event.target.reset();
}

// === UTILITY FUNCTIONS ===
function requireAuth(action) {
    if (!currentUser) {
        const shouldRegister = confirm(
            '🔐 ACCESO REQUERIDO\n\nPara usar esta funcionalidad necesitas una cuenta en el sistema.\n\n¿Deseas crear una cuenta ahora?'
        );
        
        if (shouldRegister) {
            showAuthModal('register');
        }
        return false;
    }
    return true;
}

// === ANIMATION FUNCTIONS ===
function initializeAnimations() {
    createFloatingElements();
    createBackgroundParticles();
    
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (header && window.scrollY > 100) {
            header.style.background = 'rgba(10, 10, 15, 0.98)';
            header.style.borderBottom = '1px solid var(--neon-blue)';
        } else if (header) {
            header.style.background = 'rgba(10, 10, 15, 0.9)';
            header.style.borderBottom = '1px solid var(--glass-border)';
        }
    });
}

function createFloatingElements() {
    const container = document.getElementById('floatingElements');
    if (!container) return;
    
    for (let i = 0; i < 15; i++) {
        const element = document.createElement('div');
        element.className = 'floating-element';
        element.style.left = Math.random() * 100 + '%';
        element.style.animationDelay = Math.random() * 8 + 's';
        element.style.animationDuration = (8 + Math.random() * 4) + 's';
        container.appendChild(element);
    }
}

function createBackgroundParticles() {
    const bg = document.querySelector('.animated-bg');
    if (!bg) return;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'bg-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (6 + Math.random() * 3) + 's';
        bg.appendChild(particle);
    }
}

function enhancedInit() {
    try {
        initializeApp();
        console.log('🚀 NEXUS SaaS System initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing NEXUS SaaS System:', error);
    }
}

enhancedInit();
