// =========================================
// NEXUS SAAS PLATFORM - JAVASCRIPT FUNCTIONS
// =========================================

// === GLOBAL VARIABLES ===
let currentUser = null;
let userSubscription = null;

// === SOFTWARE CATALOG ===
const softwareCatalog = [
    {
        id: 1,
        name: "Text Editor",
        description: "Editor de texto simple y gratuito para tomar notas y escribir documentos básicos.",
        icon: "📝",
        requiredPlan: "free",
        category: "productivity",
        features: ["Editor básico", "Guardar localmente", "Vista previa"]
    },
    {
        id: 2,
        name: "Neural Designer",
        description: "Editor de diseño gráfico con IA integrada para crear logotipos, banners y contenido visual profesional.",
        icon: "🎨",
        requiredPlan: "basic",
        category: "design",
        features: ["Editor vectorial", "Plantillas IA", "Exportar HD"]
    },
    {
        id: 3,
        name: "Code Matrix",
        description: "IDE avanzado en la nube con autocompletado inteligente y debugging automatizado.",
        icon: "💻",
        requiredPlan: "pro",
        category: "development",
        features: ["Sintaxis highlighting", "Debug IA", "Git integrado"]
    },
    {
        id: 4,
        name: "Data Vision",
        description: "Herramienta de análisis de datos con visualizaciones interactivas y machine learning.",
        icon: "📊",
        requiredPlan: "pro",
        category: "analytics",
        features: ["Gráficos dinámicos", "ML automático", "Exportar reportes"]
    },
    {
        id: 5,
        name: "Cloud Manager",
        description: "Panel de control para administrar servidores y servicios en la nube de forma intuitiva.",
        icon: "☁️",
        requiredPlan: "enterprise",
        category: "infrastructure",
        features: ["Multi-cloud", "Monitoreo 24/7", "Auto-scaling"]
    },
    {
        id: 6,
        name: "Neural Writer",
        description: "Editor de texto con IA que ayuda a crear contenido, corregir gramática y optimizar SEO.",
        icon: "✍️",
        requiredPlan: "basic",
        category: "content",
        features: ["Corrección IA", "Optimización SEO", "Templates"]
    },
    {
        id: 7,
        name: "Crypto Analytics",
        description: "Plataforma de análisis de criptomonedas con alertas inteligentes y trading automatizado.",
        icon: "₿",
        requiredPlan: "pro",
        category: "finance",
        features: ["Trading bots", "Alertas personalizadas", "Portfolio tracking"]
    },
    {
        id: 8,
        name: "Social Nexus",
        description: "Gestor de redes sociales con programación automática y análisis de engagement.",
        icon: "📱",
        requiredPlan: "basic",
        category: "social",
        features: ["Auto-posting", "Analytics", "Multi-account"]
    },
    {
        id: 9,
        name: "AI Assistant",
        description: "Asistente personal con IA para automatizar tareas, gestionar calendario y procesar emails.",
        icon: "🤖",
        requiredPlan: "enterprise",
        category: "productivity",
        features: ["Automatización", "Calendario IA", "Email processing"]
    }
];

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
    // Check if user is logged in
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
    
    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem('nexusUsers') || '[]');
    if (existingUsers.find(user => user.email === data.email)) {
        alert('⚠️ Ya existe una cuenta con este email');
        return;
    }
    
    // Create new user with email as name by default
    const emailName = data.email.split('@')[0];
    const newUser = {
        id: Date.now(),
        name: emailName.charAt(0).toUpperCase() + emailName.slice(1),
        email: data.email,
        password: data.password,
        registeredAt: new Date().toISOString()
    };
    
    // Save user
    existingUsers.push(newUser);
    localStorage.setItem('nexusUsers', JSON.stringify(existingUsers));
    
    // Login user automatically
    currentUser = { id: newUser.id, name: newUser.name, email: newUser.email };
    userSubscription = { plan: 'free', startDate: new Date().toISOString() };
    
    localStorage.setItem('nexusUser', JSON.stringify(currentUser));
    localStorage.setItem('nexusSubscription', JSON.stringify(userSubscription));
    
    // Success feedback
    alert('🚀 CUENTA CREADA CORRECTAMENTE\n\n⚡ ¡Bienvenido a NEXUS SaaS!');
    
    hideAuthModal();
    updateAuthUI();
    updateDashboard();
    event.target.reset();
}

function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Get users from localStorage
    const existingUsers = JSON.parse(localStorage.getItem('nexusUsers') || '[]');
    const user = existingUsers.find(u => u.email === data.email && u.password === data.password);
    
    if (!user) {
        alert('⚠️ Canal neural o código de acceso incorrectos');
        return;
    }
    
    // Login user
    currentUser = { id: user.id, name: user.name, email: user.email };
    
    // Load subscription or set free plan
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
    // Simular login con Google (en producción usar Google OAuth)
    alert('🔍 CONECTANDO CON GOOGLE...\n\nRedirigiendo a Google OAuth...');
    
    // Simular respuesta de Google después de 2 segundos
    setTimeout(() => {
        const googleUser = {
            id: Date.now(),
            name: 'Usuario Google',
            email: 'usuario@gmail.com',
            provider: 'google',
            registeredAt: new Date().toISOString()
        };
        
        // Guardar usuario
        const existingUsers = JSON.parse(localStorage.getItem('nexusUsers') || '[]');
        if (!existingUsers.find(user => user.email === googleUser.email)) {
            existingUsers.push(googleUser);
            localStorage.setItem('nexusUsers', JSON.stringify(existingUsers));
        }
        
        // Login automático
        currentUser = { id: googleUser.id, name: googleUser.name, email: googleUser.email };
        userSubscription = { plan: 'free', startDate: new Date().toISOString() };
        
        localStorage.setItem('nexusUser', JSON.stringify(currentUser));
        localStorage.setItem('nexusSubscription', JSON.stringify(userSubscription));
        
        alert('✅ CONECTADO CON GOOGLE\n\n¡Bienvenido a NEXUS SaaS!');
        
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
        // Simulate payment processing
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
            loadSoftware(); // Reload software with new permissions
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
        const hasAccess = checkSoftwareAccess(software.requiredPlan);
        const softwareCard = document.createElement('div');
        softwareCard.className = 'software-card';
        softwareCard.style.animationDelay = `${index * 0.1}s`;
        
        softwareCard.innerHTML = `
            <div class="software-icon">${software.icon}</div>
            <div class="software-info">
                <h3 class="software-name">${software.name}</h3>
                <p class="software-description">${software.description}</p>
                ${!hasAccess ? `<div class="subscription-required">🔒 Requiere plan ${subscriptionPlans[software.requiredPlan].name}</div>` : ''}
                <div class="software-actions">
                    <button class="launch-btn" onclick="launchSoftware(${software.id})" ${!hasAccess ? 'disabled' : ''}>
                        ${hasAccess ? 'Ejecutar App' : 'Bloqueado'}
                    </button>
                    ${!hasAccess ? `<button class="subscribe-btn" onclick="showSubscriptionModal()">Suscribirse</button>` : ''}
                </div>
            </div>
        `;
        
        container.appendChild(softwareCard);
    });
}

function checkSoftwareAccess(requiredPlan) {
    // Acceso libre para apps gratuitas
    if (requiredPlan === 'free') {
        return true;
    }
    
    // Sin usuario logueado = sin acceso a apps premium
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
    
    // Si no está logueado y es una app premium, pedir registro
    if (!currentUser && software.requiredPlan !== 'free') {
        const shouldRegister = confirm(
            `🔐 REGISTRO REQUERIDO\n\nPara usar "${software.name}" necesitas una cuenta.\n\n¿Quieres crear una cuenta gratis?`
        );
        
        if (shouldRegister) {
            showAuthModal('register');
        }
        return;
    }
    
    // Si está logueado pero no tiene el plan necesario
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
    
    // Initialize app-specific functionality
    initializeAppFeatures(software);
}

function closeApp() {
    const overlay = document.getElementById('appOverlay');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
}

function generateAppContent(software) {
    switch (software.category) {
        case 'productivity':
            if (software.id === 1) {
                return generateTextEditorApp();
            } else {
                return generateAIApp();
            }
        case 'design':
            return generateDesignApp();
        case 'development':
            return generateCodeApp();
        case 'analytics':
            return generateAnalyticsApp();
        case 'infrastructure':
            return generateCloudApp();
        case 'content':
            return generateWriterApp();
        case 'finance':
            return generateCryptoApp();
        case 'social':
            return generateSocialApp();
        default:
            return generateDefaultApp(software);
    }
}

function generateDesignApp() {
    return `
        <div style="display: grid; grid-template-columns: 200px 1fr; gap: 1rem; height: 500px;">
            <div style="background: var(--glass-bg); border-radius: 15px; padding: 1rem;">
                <h4 style="color: var(--neon-blue); margin-bottom: 1rem;">🎨 Herramientas</h4>
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    <button onclick="selectTool('brush')" style="background: var(--glass-bg); border: 1px solid var(--neon-blue); color: var(--neon-blue); padding: 0.5rem; border-radius: 8px; cursor: pointer;">🖌️ Pincel</button>
                    <button onclick="selectTool('text')" style="background: var(--glass-bg); border: 1px solid var(--neon-blue); color: var(--neon-blue); padding: 0.5rem; border-radius: 8px; cursor: pointer;">📝 Texto</button>
                    <button onclick="selectTool('shapes')" style="background: var(--glass-bg); border: 1px solid var(--neon-blue); color: var(--neon-blue); padding: 0.5rem; border-radius: 8px; cursor: pointer;">⭕ Formas</button>
                </div>
                <h4 style="color: var(--neon-purple); margin: 2rem 0 1rem 0;">🤖 IA Tools</h4>
                <button onclick="generateWithAI()" style="background: var(--gradient-neon); border: none; color: white; padding: 0.8rem; border-radius: 8px; cursor: pointer; width: 100%;">Generar con IA</button>
            </div>
            <div style="background: white; border-radius: 15px; position: relative; overflow: hidden;">
                <canvas id="designCanvas" style="width: 100%; height: 100%; cursor: crosshair;"></canvas>
                <div id="canvasTools" style="position: absolute; top: 10px; right: 10px; display: flex; gap: 0.5rem;">
                    <button onclick="clearCanvas()" style="background: var(--neon-pink); border: none; color: white; padding: 0.5rem; border-radius: 8px; cursor: pointer;">🗑️</button>
                    <button onclick="saveDesign()" style="background: var(--neon-green); border: none; color: white; padding: 0.5rem; border-radius: 8px; cursor: pointer;">💾</button>
                </div>
            </div>
        </div>
    `;
}

function generateCodeApp() {
    return `
        <div style="display: grid; grid-template-rows: auto 1fr auto; height: 500px; gap: 1rem;">
            <div style="display: flex; gap: 1rem; align-items: center;">
                <select id="languageSelect" style="background: var(--glass-bg); border: 1px solid var(--neon-blue); color: var(--text-primary); padding: 0.5rem; border-radius: 8px;">
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="html">HTML</option>
                    <option value="css">CSS</option>
                </select>
                <button onclick="runCode()" style="background: var(--neon-green); border: none; color: white; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer;">▶️ Ejecutar</button>
                <button onclick="formatCode()" style="background: var(--neon-blue); border: none; color: white; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer;">🎨 Formatear</button>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; height: 100%;">
                <div>
                    <h4 style="color: var(--neon-blue); margin-bottom: 0.5rem;">📝 Editor</h4>
                    <textarea id="codeEditor" style="width: 100%; height: 90%; background: #1a1a1a; color: #00ff00; border: 1px solid var(--neon-blue); border-radius: 8px; padding: 1rem; font-family: 'Courier New', monospace; font-size: 14px;" placeholder="// Escribe tu código aquí...
console.log('¡Hola desde NEXUS Code!');">
                    </textarea>
                </div>
                <div>
                    <h4 style="color: var(--neon-pink); margin-bottom: 0.5rem;">📺 Salida</h4>
                    <div id="codeOutput" style="width: 100%; height: 90%; background: #0a0a0a; color: var(--neon-green); border: 1px solid var(--neon-pink); border-radius: 8px; padding: 1rem; font-family: 'Courier New', monospace; font-size: 14px; overflow-y: auto;">
                        > Esperando código para ejecutar...
                    </div>
                </div>
            </div>
            <div style="background: var(--glass-bg); padding: 1rem; border-radius: 8px;">
                <strong style="color: var(--neon-blue);">🤖 Asistente IA:</strong> 
                <span style="color: var(--text-secondary);">Escribe tu código y presiona ejecutar. El autocompletado inteligente te ayudará mientras escribes.</span>
            </div>
        </div>
    `;
}

function generateAnalyticsApp() {
    return `
        <div style="height: 500px; display: grid; grid-template-rows: auto 1fr; gap: 1rem;">
            <div style="display: flex; gap: 1rem; align-items: center; padding: 1rem; background: var(--glass-bg); border-radius: 15px;">
                <button onclick="generateChart('bar')" style="background: var(--neon-blue); border: none; color: white; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer;">📊 Barras</button>
                <button onclick="generateChart('line')" style="background: var(--neon-purple); border: none; color: white; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer;">📈 Líneas</button>
                <button onclick="generateChart('pie')" style="background: var(--neon-pink); border: none; color: white; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer;">🥧 Circular</button>
                <button onclick="analyzeWithAI()" style="background: var(--gradient-neon); border: none; color: white; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer;">🤖 Análisis IA</button>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 300px; gap: 1rem;">
                <div id="chartContainer" style="background: white; border-radius: 15px; padding: 1rem; display: flex; align-items: center; justify-content: center; color: #333;">
                    <div style="text-align: center;">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">📊</div>
                        <p>Selecciona un tipo de gráfico para comenzar</p>
                    </div>
                </div>
                <div style="background: var(--glass-bg); border-radius: 15px; padding: 1rem;">
                    <h4 style="color: var(--neon-blue); margin-bottom: 1rem;">📋 Datos</h4>
                    <div id="dataPanel" style="color: var(--text-secondary); font-size: 0.9rem;">
                        <p><strong>📈 Ventas Q4 2024:</strong></p>
                        <p>Enero: $125,000</p>
                        <p>Febrero: $138,000</p>
                        <p>Marzo: $142,000</p>
                        <p>Abril: $156,000</p>
                        <br>
                        <p><strong>🎯 KPIs:</strong></p>
                        <p>Crecimiento: +24.8%</p>
                        <p>ROI: 156%</p>
                        <p>Conversión: 3.2%</p>
                        <br>
                        <button onclick="loadSampleData()" style="background: var(--neon-green); border: none; color: white; padding: 0.5rem; border-radius: 8px; cursor: pointer; width: 100%;">📂 Cargar Datos</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateCloudApp() {
    return `
        <div style="height: 500px; display: grid; grid-template-columns: 250px 1fr; gap: 1rem;">
            <div style="background: var(--glass-bg); border-radius: 15px; padding: 1rem;">
                <h4 style="color: var(--neon-blue); margin-bottom: 1rem;">☁️ Servicios</h4>
                <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 2rem;">
                    <div onclick="selectService('compute')" style="background: var(--glass-bg); border: 1px solid var(--neon-blue); color: var(--neon-blue); padding: 0.8rem; border-radius: 8px; cursor: pointer; text-align: center;">
                        <div>💻</div>
                        <div style="font-size: 0.8rem;">Compute</div>
                    </div>
                    <div onclick="selectService('storage')" style="background: var(--glass-bg); border: 1px solid var(--neon-purple); color: var(--neon-purple); padding: 0.8rem; border-radius: 8px; cursor: pointer; text-align: center;">
                        <div>💾</div>
                        <div style="font-size: 0.8rem;">Storage</div>
                    </div>
                    <div onclick="selectService('database')" style="background: var(--glass-bg); border: 1px solid var(--neon-pink); color: var(--neon-pink); padding: 0.8rem; border-radius: 8px; cursor: pointer; text-align: center;">
                        <div>🗄️</div>
                        <div style="font-size: 0.8rem;">Database</div>
                    </div>
                </div>
                <h4 style="color: var(--neon-green); margin-bottom: 1rem;">⚡ Acciones</h4>
                <button onclick="deployService()" style="background: var(--neon-green); border: none; color: white; padding: 0.8rem; border-radius: 8px; cursor: pointer; width: 100%; margin-bottom: 0.5rem;">🚀 Deploy</button>
                <button onclick="scaleService()" style="background: var(--neon-blue); border: none; color: white; padding: 0.8rem; border-radius: 8px; cursor: pointer; width: 100%;">📈 Auto Scale</button>
            </div>
            <div style="background: var(--glass-bg); border-radius: 15px; padding: 1rem;">
                <h4 style="color: var(--neon-blue); margin-bottom: 1rem;">🖥️ Dashboard de Infraestructura</h4>
                <div id="cloudDashboard" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; height: 400px;">
                    <div style="background: var(--primary-bg); border-radius: 10px; padding: 1rem;">
                        <h5 style="color: var(--neon-green);">📊 Rendimiento</h5>
                        <div style="margin-top: 1rem;">
                            <p style="color: var(--text-secondary);">CPU: <span style="color: var(--neon-green);">45%</span></p>
                            <p style="color: var(--text-secondary);">RAM: <span style="color: var(--neon-blue);">67%</span></p>
                            <p style="color: var(--text-secondary);">Disco: <span style="color: var(--neon-pink);">23%</span></p>
                            <p style="color: var(--text-secondary);">Red: <span style="color: var(--neon-purple);">12 Mbps</span></p>
                        </div>
                    </div>
                    <div style="background: var(--primary-bg); border-radius: 10px; padding: 1rem;">
                        <h5 style="color: var(--neon-blue);">🌍 Regiones Activas</h5>
                        <div style="margin-top: 1rem;">
                            <p style="color: var(--text-secondary);">🇺🇸 US-East: <span style="color: var(--neon-green);">●</span></p>
                            <p style="color: var(--text-secondary);">🇪🇺 EU-West: <span style="color: var(--neon-green);">●</span></p>
                            <p style="color: var(--text-secondary);">🇯🇵 Asia-Pacific: <span style="color: var(--neon-blue);">●</span></p>
                            <p style="color: var(--text-secondary);">🇧🇷 SA-East: <span style="color: var(--neon-pink);">●</span></p>
                        </div>
                    </div>
                    <div style="background: var(--primary-bg); border-radius: 10px; padding: 1rem; grid-column: 1 / -1;">
                        <h5 style="color: var(--neon-pink);">📈 Logs del Sistema</h5>
                        <div id="systemLogs" style="background: #000; color: var(--neon-green); padding: 1rem; border-radius: 8px; font-family: 'Courier New', monospace; font-size: 12px; margin-top: 1rem; height: 150px; overflow-y: auto;">
                            [2025-07-26 15:30:15] INFO: Sistema iniciado correctamente<br>
                            [2025-07-26 15:30:16] INFO: Conectando a base de datos...<br>
                            [2025-07-26 15:30:17] SUCCESS: Conexión establecida<br>
                            [2025-07-26 15:30:18] INFO: Balanceador de carga activo<br>
                            [2025-07-26 15:30:19] INFO: Auto-scaling configurado<br>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateWriterApp() {
    return `
        <div style="height: 500px; display: grid; grid-template-columns: 1fr 250px; gap: 1rem;">
            <div style="display: grid; grid-template-rows: auto 1fr; gap: 1rem;">
                <div style="background: var(--glass-bg); padding: 1rem; border-radius: 15px; display: flex; gap: 1rem; align-items: center;">
                    <button onclick="improveText()" style="background: var(--neon-blue); border: none; color: white; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer;">🤖 Mejorar</button>
                    <button onclick="checkGrammar()" style="background: var(--neon-green); border: none; color: white; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer;">✅ Gramática</button>
                    <button onclick="optimizeSEO()" style="background: var(--neon-purple); border: none; color: white; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer;">🎯 SEO</button>
                    <button onclick="translateText()" style="background: var(--neon-pink); border: none; color: white; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer;">🌍 Traducir</button>
                </div>
                <textarea id="textEditor" style="width: 100%; height: 100%; background: var(--glass-bg); color: var(--text-primary); border: 1px solid var(--neon-blue); border-radius: 15px; padding: 1.5rem; font-size: 16px; line-height: 1.6;" placeholder="Comienza a escribir tu contenido aquí...

La IA de NEXUS Writer te ayudará a:
- Mejorar la redacción automáticamente
- Corregir gramática y ortografía
- Optimizar para SEO
- Traducir a múltiples idiomas

¡Escribe y deja que la IA potencie tu creatividad!"></textarea>
            </div>
            <div style="background: var(--glass-bg); border-radius: 15px; padding: 1rem;">
                <h4 style="color: var(--neon-blue); margin-bottom: 1rem;">📊 Análisis</h4>
                <div id="textStats" style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 2rem;">
                    <p>Palabras: <span style="color: var(--neon-green);">247</span></p>
                    <p>Caracteres: <span style="color: var(--neon-blue);">1,432</span></p>
                    <p>Legibilidad: <span style="color: var(--neon-purple);">Buena</span></p>
                    <p>SEO Score: <span style="color: var(--neon-pink);">78%</span></p>
                </div>
                
                <h4 style="color: var(--neon-green); margin-bottom: 1rem;">🎨 Templates</h4>
                <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 2rem;">
                    <button onclick="loadTemplate('blog')" style="background: var(--glass-bg); border: 1px solid var(--neon-blue); color: var(--neon-blue); padding: 0.5rem; border-radius: 8px; cursor: pointer; text-align: left;">📝 Blog Post</button>
                    <button onclick="loadTemplate('email')" style="background: var(--glass-bg); border: 1px solid var(--neon-purple); color: var(--neon-purple); padding: 0.5rem; border-radius: 8px; cursor: pointer; text-align: left;">✉️ Email Marketing</button>
                    <button onclick="loadTemplate('social')" style="background: var(--glass-bg); border: 1px solid var(--neon-pink); color: var(--neon-pink); padding: 0.5rem; border-radius: 8px; cursor: pointer; text-align: left;">📱 Social Media</button>
                </div>
                
                <h4 style="color: var(--neon-pink); margin-bottom: 1rem;">🚀 Exportar</h4>
                <button onclick="exportContent()" style="background: var(--gradient-neon); border: none; color: white; padding: 0.8rem; border-radius: 8px; cursor: pointer; width: 100%;">💾 Guardar Contenido</button>
            </div>
        </div>
    `;
}

function generateCryptoApp() {
    return `
        <div style="height: 500px; display: grid; grid-template-rows: auto 1fr; gap: 1rem;">
            <div style="background: var(--glass-bg); padding: 1rem; border-radius: 15px; display: flex; gap: 1rem; align-items: center;">
                <select id="cryptoSelect" style="background: var(--glass-bg); border: 1px solid var(--neon-blue); color: var(--text-primary); padding: 0.5rem; border-radius: 8px;">
                    <option value="BTC">Bitcoin (BTC)</option>
                    <option value="ETH">Ethereum (ETH)</option>
                    <option value="ADA">Cardano (ADA)</option>
                    <option value="SOL">Solana (SOL)</option>
                </select>
                <button onclick="refreshCryptoData()" style="background: var(--neon-green); border: none; color: white; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer;">🔄 Actualizar</button>
                <button onclick="setAlert()" style="background: var(--neon-blue); border: none; color: white; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer;">🔔 Alerta</button>
                <button onclick="startBot()" style="background: var(--neon-purple); border: none; color: white; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer;">🤖 Trading Bot</button>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 300px; gap: 1rem;">
                <div style="background: var(--glass-bg); border-radius: 15px; padding: 1rem;">
                    <h4 style="color: var(--neon-blue); margin-bottom: 1rem;">📈 Gráfico de Precios</h4>
                    <div id="priceChart" style="background: #000; border-radius: 10px; padding: 1rem; height: 300px; display: flex; align-items: center; justify-content: center; color: var(--neon-green); font-family: 'Courier New', monospace;">
                        <div style="text-align: center;">
                            <div style="font-size: 2rem; margin-bottom: 1rem;">₿</div>
                            <div style="font-size: 1.5rem; color: var(--neon-blue);">$67,432.18</div>
                            <div style="color: var(--neon-green); margin-top: 0.5rem;">+2.34% (24h)</div>
                            <div style="margin-top: 2rem; color: var(--text-secondary);">
                                📊 Gráfico en tiempo real<br>
                                🕐 Actualización automática<br>
                                📱 Alertas inteligentes
                            </div>
                        </div>
                    </div>
                </div>
                <div style="display: grid; grid-template-rows: 1fr 1fr; gap: 1rem;">
                    <div style="background: var(--glass-bg); border-radius: 15px; padding: 1rem;">
                        <h4 style="color: var(--neon-purple); margin-bottom: 1rem;">💰 Portfolio</h4>
                        <div style="color: var(--text-secondary); font-size: 0.9rem;">
                            <p>Total: <span style="color: var(--neon-blue);">$12,456.78</span></p>
                            <p>BTC: <span style="color: var(--neon-green);">0.185</span></p>
                            <p>ETH: <span style="color: var(--neon-purple);">4.23</span></p>
                            <p>Ganancia: <span style="color: var(--neon-green);">+18.5%</span></p>
                        </div>
                    </div>
                    <div style="background: var(--glass-bg); border-radius: 15px; padding: 1rem;">
                        <h4 style="color: var(--neon-pink); margin-bottom: 1rem;">🔔 Alertas</h4>
                        <div style="color: var(--text-secondary); font-size: 0.8rem;">
                            <p>✅ BTC > $67,000</p>
                            <p>⏳ ETH < $2,500</p>
                            <p>🔄 Bot activo</p>
                            <button onclick="manageAlerts()" style="background: var(--neon-pink); border: none; color: white; padding: 0.5rem; border-radius: 8px; cursor: pointer; width: 100%; margin-top: 1rem;">⚙️ Configurar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateSocialApp() {
    return `
        <div style="height: 500px; display: grid; grid-template-columns: 250px 1fr; gap: 1rem;">
            <div style="background: var(--glass-bg); border-radius: 15px; padding: 1rem;">
                <h4 style="color: var(--neon-blue); margin-bottom: 1rem;">📱 Cuentas</h4>
                <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 2rem;">
                    <div style="background: var(--primary-bg); border: 1px solid var(--neon-blue); border-radius: 8px; padding: 0.8rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span style="color: var(--neon-blue);">📘</span>
                        <span style="color: var(--text-secondary); font-size: 0.8rem;">Facebook</span>
                        <span style="color: var(--neon-green); margin-left: auto;">●</span>
                    </div>
                    <div style="background: var(--primary-bg); border: 1px solid var(--neon-purple); border-radius: 8px; padding: 0.8rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span style="color: var(--neon-purple);">📷</span>
                        <span style="color: var(--text-secondary); font-size: 0.8rem;">Instagram</span>
                        <span style="color: var(--neon-green); margin-left: auto;">●</span>
                    </div>
                    <div style="background: var(--primary-bg); border: 1px solid var(--neon-pink); border-radius: 8px; padding: 0.8rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span style="color: var(--neon-pink);">🐦</span>
                        <span style="color: var(--text-secondary); font-size: 0.8rem;">Twitter/X</span>
                        <span style="color: var(--neon-green); margin-left: auto;">●</span>
                    </div>
                </div>
                
                <h4 style="color: var(--neon-green); margin-bottom: 1rem;">⚡ Acciones</h4>
                <button onclick="schedulePost()" style="background: var(--neon-blue); border: none; color: white; padding: 0.8rem; border-radius: 8px; cursor: pointer; width: 100%; margin-bottom: 0.5rem;">📅 Programar</button>
                <button onclick="analyzeEngagement()" style="background: var(--neon-purple); border: none; color: white; padding: 0.8rem; border-radius: 8px; cursor: pointer; width: 100%; margin-bottom: 0.5rem;">📊 Analytics</button>
                <button onclick="autoPost()" style="background: var(--gradient-neon); border: none; color: white; padding: 0.8rem; border-radius: 8px; cursor: pointer; width: 100%;">🤖 Auto-Post</button>
            </div>
            
            <div style="display: grid; grid-template-rows: auto 1fr auto; gap: 1rem;">
                <div style="background: var(--glass-bg); padding: 1rem; border-radius: 15px;">
                    <h4 style="color: var(--neon-blue); margin-bottom: 1rem;">✍️ Crear Publicación</h4>
                    <textarea id="postContent" style="width: 100%; height: 80px; background: var(--primary-bg); color: var(--text-primary); border: 1px solid var(--neon-blue); border-radius: 8px; padding: 1rem; resize: none;" placeholder="¿Qué quieres compartir hoy?"></textarea>
                    <div style="display: flex; gap: 1rem; margin-top: 1rem; align-items: center;">
                        <button onclick="addImage()" style="background: var(--neon-green); border: none; color: white; padding: 0.5rem; border-radius: 8px; cursor: pointer;">🖼️</button>
                        <button onclick="addHashtags()" style="background: var(--neon-purple); border: none; color: white; padding: 0.5rem; border-radius: 8px; cursor: pointer;">#️⃣</button>
                        <select style="background: var(--glass-bg); border: 1px solid var(--neon-blue); color: var(--text-primary); padding: 0.5rem; border-radius: 8px;">
                            <option>Publicar ahora</option>
                            <option>Programar para más tarde</option>
                            <option>Guardar como borrador</option>
                        </select>
                        <button onclick="publishPost()" style="background: var(--neon-blue); border: none; color: white; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer;">📤 Publicar</button>
                    </div>
                </div>
                
                <div style="background: var(--glass-bg); border-radius: 15px; padding: 1rem;">
                    <h4 style="color: var(--neon-purple); margin-bottom: 1rem;">📊 Dashboard</h4>
                    <div id="socialDashboard" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; text-align: center;">
                        <div style="background: var(--primary-bg); border-radius: 8px; padding: 1rem;">
                            <div style="color: var(--neon-blue); font-size: 2rem; margin-bottom: 0.5rem;">1.2K</div>
                            <div style="color: var(--text-secondary); font-size: 0.8rem;">Seguidores</div>
                        </div>
                        <div style="background: var(--primary-bg); border-radius: 8px; padding: 1rem;">
                            <div style="color: var(--neon-green); font-size: 2rem; margin-bottom: 0.5rem;">89%</div>
                            <div style="color: var(--text-secondary); font-size: 0.8rem;">Engagement</div>
                        </div>
                        <div style="background: var(--primary-bg); border-radius: 8px; padding: 1rem;">
                            <div style="color: var(--neon-pink); font-size: 2rem; margin-bottom: 0.5rem;">24</div>
                            <div style="color: var(--text-secondary); font-size: 0.8rem;">Posts Hoy</div>
                        </div>
                    </div>
                </div>
                
                <div style="background: var(--glass-bg); border-radius: 15px; padding: 1rem;">
                    <h4 style="color: var(--neon-pink); margin-bottom: 1rem;">🗓️ Programación</h4>
                    <div style="color: var(--text-secondary); font-size: 0.9rem;">
                        <p>📅 Próximas publicaciones:</p>
                        <p style="margin-top: 0.5rem;">• 18:00 - Post Instagram #marketing</p>
                        <p>• 20:30 - Tweet sobre #tecnología</p>
                        <p>• 22:00 - Facebook actualización</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateAIApp() {
    return `
        <div style="height: 500px; display: grid; grid-template-columns: 1fr 300px; gap: 1rem;">
            <div style="background: var(--glass-bg); border-radius: 15px; padding: 1rem; display: flex; flex-direction: column;">
                <h4 style="color: var(--neon-blue); margin-bottom: 1rem;">🤖 Chat con IA Assistant</h4>
                <div id="chatMessages" style="flex: 1; background: var(--primary-bg); border-radius: 10px; padding: 1rem; overflow-y: auto; margin-bottom: 1rem;">
                    <div style="color: var(--neon-blue); margin-bottom: 1rem;">
                        <strong>🤖 NEXUS AI:</strong> ¡Hola! Soy tu asistente personal con IA. Puedo ayudarte con:
                        <ul style="margin-top: 0.5rem; color: var(--text-secondary);">
                            <li>📅 Gestionar tu calendario</li>
                            <li>✉️ Procesar emails importantes</li>
                            <li>📋 Crear tareas automáticas</li>
                            <li>📊 Generar reportes</li>
                            <li>🔍 Investigar información</li>
                        </ul>
                        ¿En qué puedo ayudarte hoy?
                    </div>
                </div>
                <div style="display: flex; gap: 1rem;">
                    <input type="text" id="chatInput" style="flex: 1; background: var(--primary-bg); color: var(--text-primary); border: 1px solid var(--neon-blue); border-radius: 8px; padding: 1rem;" placeholder="Escribe tu consulta aquí...">
                    <button onclick="sendMessage()" style="background: var(--neon-blue); border: none; color: white; padding: 1rem; border-radius: 8px; cursor: pointer;">📤</button>
                </div>
                <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                    <button onclick="quickAction('calendar')" style="background: var(--neon-green); border: none; color: white; padding: 0.5rem; border-radius: 8px; cursor: pointer; font-size: 0.8rem;">📅 Calendario</button>
                    <button onclick="quickAction('email')" style="background: var(--neon-purple); border: none; color: white; padding: 0.5rem; border-radius: 8px; cursor: pointer; font-size: 0.8rem;">✉️ Emails</button>
                    <button onclick="quickAction('tasks')" style="background: var(--neon-pink); border: none; color: white; padding: 0.5rem; border-radius: 8px; cursor: pointer; font-size: 0.8rem;">📋 Tareas</button>
                </div>
            </div>
            
            <div style="display: grid; grid-template-rows: 1fr 1fr; gap: 1rem;">
                <div style="background: var(--glass-bg); border-radius: 15px; padding: 1rem;">
                    <h4 style="color: var(--neon-green); margin-bottom: 1rem;">📅 Próximos Eventos</h4>
                    <div style="color: var(--text-secondary); font-size: 0.9rem;">
                        <div style="background: var(--primary-bg); padding: 0.8rem; border-radius: 8px; margin-bottom: 0.5rem;">
                            <div style="color: var(--neon-blue);">📞 Reunión equipo</div>
                            <div style="font-size: 0.8rem;">16:00 - 17:00</div>
                        </div>
                        <div style="background: var(--primary-bg); padding: 0.8rem; border-radius: 8px; margin-bottom: 0.5rem;">
                            <div style="color: var(--neon-purple);">💼 Presentación cliente</div>
                            <div style="font-size: 0.8rem;">Mañana 10:00</div>
                        </div>
                        <div style="background: var(--primary-bg); padding: 0.8rem; border-radius: 8px;">
                            <div style="color: var(--neon-pink);">🎯 Review proyecto</div>
                            <div style="font-size: 0.8rem;">Viernes 14:00</div>
                        </div>
                    </div>
                </div>
                
                <div style="background: var(--glass-bg); border-radius: 15px; padding: 1rem;">
                    <h4 style="color: var(--neon-purple); margin-bottom: 1rem;">🎯 Tareas IA</h4>
                    <div style="color: var(--text-secondary); font-size: 0.9rem;">
                        <div style="background: var(--primary-bg); padding: 0.8rem; border-radius: 8px; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                            <span style="color: var(--neon-green);">✅</span>
                            <span>Resumen emails importantes</span>
                        </div>
                        <div style="background: var(--primary-bg); padding: 0.8rem; border-radius: 8px; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                            <span style="color: var(--neon-blue);">🔄</span>
                            <span>Procesando calendario</span>
                        </div>
                        <div style="background: var(--primary-bg); padding: 0.8rem; border-radius: 8px; display: flex; align-items: center; gap: 0.5rem;">
                            <span style="color: var(--neon-pink);">⏳</span>
                            <span>Generando reporte semanal</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateTextEditorApp() {
    return `
        <div style="height: 500px; display: grid; grid-template-rows: auto 1fr auto; gap: 1rem;">
            <div style="background: var(--glass-bg); padding: 1rem; border-radius: 15px; display: flex; gap: 1rem; align-items: center;">
                <button onclick="createNewDoc()" style="background: var(--neon-green); border: none; color: white; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer;">📄 Nuevo</button>
                <button onclick="saveDocument()" style="background: var(--neon-blue); border: none; color: white; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer;">💾 Guardar</button>
                <button onclick="downloadDoc()" style="background: var(--neon-purple); border: none; color: white; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer;">⬇️ Descargar</button>
                <select id="fontSize" onchange="changeFontSize()" style="background: var(--glass-bg); border: 1px solid var(--neon-blue); color: var(--text-primary); padding: 0.5rem; border-radius: 8px;">
                    <option value="14">14px</option>
                    <option value="16" selected>16px</option>
                    <option value="18">18px</option>
                    <option value="20">20px</option>
                </select>
            </div>
            
            <textarea id="textDocument" style="width: 100%; height: 100%; background: white; color: #333; border: 1px solid var(--neon-blue); border-radius: 15px; padding: 1.5rem; font-size: 16px; line-height: 1.6; resize: none;" placeholder="Comienza a escribir tu documento aquí...

Esta es la aplicación gratuita de NEXUS SaaS.
¡Puedes usarla sin registrarte!

Para acceder a funciones avanzadas como:
- Corrección automática con IA
- Plantillas profesionales  
- Sincronización en la nube
- Colaboración en tiempo real

Crea una cuenta y suscríbete a uno de nuestros planes premium."></textarea>
            
            <div style="background: var(--glass-bg); padding: 1rem; border-radius: 15px; display: flex; justify-content: space-between; align-items: center;">
                <div style="color: var(--text-secondary); font-size: 0.9rem;">
                    <span id="wordCount">Palabras: 0</span> | 
                    <span id="charCount">Caracteres: 0</span>
                </div>
                <div style="color: var(--neon-blue); font-size: 0.9rem;">
                    📝 Editor Gratuito - ¿Quieres más funciones? 
                    <a href="#" onclick="closeApp(); showSubscriptionModal();" style="color: var(--neon-pink);">Ver Planes</a>
                </div>
            </div>
        </div>
    `;
}

// Funciones para el editor de texto gratuito
function createNewDoc() {
    if (confirm('¿Crear un nuevo documento? Se perderá el contenido actual.')) {
        document.getElementById('textDocument').value = '';
        updateWordCount();
        alert('📄 Documento nuevo creado');
    }
}

function saveDocument() {
    const content = document.getElementById('textDocument').value;
    localStorage.setItem('nexus_free_document', content);
    alert('💾 Documento guardado localmente');
}

function downloadDoc() {
    const content = document.getElementById('textDocument').value;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `documento_nexus_${new Date().getTime()}.txt`;
    a.click();
    
    URL.revokeObjectURL(url);
    alert('⬇️ Documento descargado');
}

function changeFontSize() {
    const size = document.getElementById('fontSize').value;
    document.getElementById('textDocument').style.fontSize = size + 'px';
}

function updateWordCount() {
    const text = document.getElementById('textDocument').value;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    
    document.getElementById('wordCount').textContent = `Palabras: ${words}`;
    document.getElementById('charCount').textContent = `Caracteres: ${chars}`;
}

// === APP-SPECIFIC FUNCTIONS ===
function initializeAppFeatures(software) {
    // Initialize specific features based on app type
    if (software.category === 'development') {
        // Set up code editor features
        document.getElementById('codeEditor').addEventListener('input', function() {
            // Simulate syntax highlighting feedback
            console.log('Code updated:', this.value);
        });
    }
    
    if (software.category === 'content') {
        // Set up text analysis
        const textEditor = document.getElementById('textEditor');
        if (textEditor) {
            textEditor.addEventListener('input', updateTextStats);
        }
    }
    
    if (software.category === 'productivity') {
        if (software.id === 1) {
            // Text Editor (free app)
            const textDoc = document.getElementById('textDocument');
            if (textDoc) {
                // Load saved document
                const saved = localStorage.getItem('nexus_free_document');
                if (saved) {
                    textDoc.value = saved;
                }
                
                // Add word count update
                textDoc.addEventListener('input', updateWordCount);
                updateWordCount();
            }
        } else {
            // AI Assistant
            const chatInput = document.getElementById('chatInput');
            if (chatInput) {
                chatInput.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        sendMessage();
                    }
                });
            }
        }
    }
}

function generateDefaultApp(software) {
    return `
        <div style="height: 500px; display: flex; align-items: center; justify-content: center; text-align: center;">
            <div>
                <div style="font-size: 4rem; margin-bottom: 2rem;">${software.icon}</div>
                <h3 style="color: var(--neon-blue); margin-bottom: 1rem;">${software.name}</h3>
                <p style="color: var(--text-secondary); margin-bottom: 2rem; max-width: 400px;">${software.description}</p>
                <div style="background: var(--glass-bg); padding: 2rem; border-radius: 15px; max-width: 500px;">
                    <h4 style="color: var(--neon-green); margin-bottom: 1rem;">🚀 Funcionalidades:</h4>
                    <ul style="text-align: left; color: var(--text-secondary);">
                        ${software.features.map(feature => `<li style="margin-bottom: 0.5rem;">✅ ${feature}</li>`).join('')}
                    </ul>
                    <button onclick="alert('Funcionalidad en desarrollo')" style="background: var(--gradient-neon); border: none; color: white; padding: 1rem 2rem; border-radius: 10px; cursor: pointer; margin-top: 2rem;">🎯 Iniciar Aplicación</button>
                </div>
            </div>
        </div>
    `;
}

// === INTERACTIVE FUNCTIONS FOR APPS ===

// Design App Functions
function selectTool(tool) {
    alert(`🎨 Herramienta seleccionada: ${tool}\n\nAhora puedes usar esta herramienta en el canvas.`);
}

function generateWithAI() {
    alert('🤖 GENERANDO CON IA...\n\nCreando diseño automático basado en las tendencias actuales...');
    setTimeout(() => {
        alert('✨ ¡Diseño generado!\n\nLa IA ha creado un logotipo moderno para tu marca.');
    }, 2000);
}

function clearCanvas() {
    alert('🗑️ Canvas limpiado');
}

function saveDesign() {
    alert('💾 Diseño guardado correctamente\n\nExportado en formato PNG de alta resolución.');
}

// Code App Functions
function runCode() {
    const code = document.getElementById('codeEditor')?.value || 'console.log("¡Hola desde NEXUS Code!");';
    const output = document.getElementById('codeOutput');
    if (output) {
        output.innerHTML = `> Ejecutando código...\n\n${code}\n\n> Salida:\n¡Hola desde NEXUS Code!\n> Ejecución completada ✅`;
    }
}

function formatCode() {
    alert('🎨 Código formateado automáticamente\n\nSe aplicó el estilo estándar del lenguaje.');
}

// Analytics App Functions
function generateChart(type) {
    const container = document.getElementById('chartContainer');
    if (container) {
        const chartTypes = {
            bar: '📊 Gráfico de barras generado\n\nMostrando datos de ventas Q4 2024',
            line: '📈 Gráfico de líneas creado\n\nTendencia de crecimiento mensual',
            pie: '🥧 Gráfico circular listo\n\nDistribución por categorías'
        };
        
        container.innerHTML = `
            <div style="text-align: center; color: #333;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">${type === 'bar' ? '📊' : type === 'line' ? '📈' : '🥧'}</div>
                <p>Gráfico ${type === 'bar' ? 'de barras' : type === 'line' ? 'de líneas' : 'circular'} generado</p>
                <p style="font-size: 0.8rem; margin-top: 1rem;">Datos actualizados en tiempo real</p>
            </div>
        `;
        
        alert(chartTypes[type]);
    }
}

function analyzeWithAI() {
    alert('🤖 ANÁLISIS IA EN PROGRESO...\n\nAnalizando patrones y tendencias en los datos...');
    setTimeout(() => {
        alert('📊 ANÁLISIS COMPLETADO\n\n✅ Crecimiento del 24.8% detectado\n📈 Tendencia alcista confirmada\n🎯 Recomendación: Aumentar inversión en marketing');
    }, 3000);
}

function loadSampleData() {
    alert('📂 Datos de muestra cargados\n\nDataset: Ventas trimestrales 2024\n📊 Ready para análisis');
}

// Cloud App Functions
function selectService(service) {
    const services = {
        compute: '💻 Instancias de Compute seleccionadas',
        storage: '💾 Servicio de Storage activado',
        database: '🗄️ Base de datos configurada'
    };
    alert(services[service] || 'Servicio seleccionado');
}

function deployService() {
    alert('🚀 DESPLEGANDO SERVICIO...\n\nConfigurando recursos en la nube...');
    setTimeout(() => {
        const logs = document.getElementById('systemLogs');
        if (logs) {
            logs.innerHTML += '[2025-07-26 15:30:20] INFO: Nuevo servicio desplegado<br>';
            logs.scrollTop = logs.scrollHeight;
        }
        alert('✅ Servicio desplegado correctamente\n\nURL: https://app.nexus-cloud.com');
    }, 2000);
}

function scaleService() {
    alert('📈 AUTO-SCALING ACTIVADO\n\nEl sistema escalará automáticamente según la demanda.');
}

// Content App Functions
function updateTextStats() {
    const text = document.getElementById('textEditor')?.value || '';
    const words = text.split(/\s+/).filter(word => word.length > 0).length;
    const chars = text.length;
    
    const statsElement = document.getElementById('textStats');
    if (statsElement) {
        statsElement.innerHTML = `
            <p>Palabras: <span style="color: var(--neon-green);">${words}</span></p>
            <p>Caracteres: <span style="color: var(--neon-blue);">${chars}</span></p>
            <p>Legibilidad: <span style="color: var(--neon-purple);">${words > 100 ? 'Buena' : 'Corto'}</span></p>
            <p>SEO Score: <span style="color: var(--neon-pink);">${Math.min(100, words * 2)}%</span></p>
        `;
    }
}

function improveText() {
    alert('🤖 MEJORANDO TEXTO...\n\nLa IA está optimizando tu contenido...');
    setTimeout(() => {
        alert('✨ ¡Texto mejorado!\n\nSe optimizó la claridad y fluidez del contenido.');
    }, 2000);
}

function checkGrammar() {
    alert('✅ REVISIÓN GRAMATICAL\n\n✅ Sin errores detectados\n📝 El texto está bien estructurado');
}

function optimizeSEO() {
    alert('🎯 OPTIMIZACIÓN SEO\n\n✅ Palabras clave identificadas\n📈 Score SEO mejorado a 95%\n🔗 Sugerencias de enlaces añadidas');
}

function translateText() {
    alert('🌍 TRADUCCIÓN DISPONIBLE\n\nSelecciona idioma de destino:\n🇪🇸 Español\n🇺🇸 Inglés\n🇫🇷 Francés\n🇩🇪 Alemán');
}

function loadTemplate(type) {
    const templates = {
        blog: 'Título llamativo aquí\n\nIntroducción que engancha al lector...\n\nDesarrollo del contenido...\n\nConclusión impactante.',
        email: 'Asunto: Oferta especial para ti\n\n¡Hola [Nombre]!\n\nTenemos una propuesta irresistible...',
        social: '🚀 ¡Novedad increíble!\n\nDescubre lo último en tecnología...\n\n#tech #innovation #nexus'
    };
    
    const editor = document.getElementById('textEditor');
    if (editor) {
        editor.value = templates[type] || '';
        updateTextStats();
    }
}

function exportContent() {
    alert('💾 CONTENIDO EXPORTADO\n\n✅ Guardado en formato .docx\n📧 Enviado por email\n☁️ Sincronizado en la nube');
}

// Crypto App Functions
function refreshCryptoData() {
    alert('🔄 Actualizando datos...\n\nObteniendo precios en tiempo real...');
    setTimeout(() => {
        alert('✅ Datos actualizados\n\nÚltimos precios sincronizados');
    }, 1000);
}

function setAlert() {
    alert('🔔 CONFIGURAR ALERTA\n\nDefine tus parámetros:\n📈 Precio objetivo\n📉 Stop loss\n⏰ Frecuencia');
}

function startBot() {
    alert('🤖 TRADING BOT INICIADO\n\n✅ Algoritmo activado\n📊 Analizando mercado\n⚡ Trading automático habilitado');
}

function manageAlerts() {
    alert('⚙️ GESTIÓN DE ALERTAS\n\n🔔 3 alertas activas\n⚡ 2 bots funcionando\n📱 Notificaciones push habilitadas');
}

// Social App Functions
function schedulePost() {
    alert('📅 PROGRAMAR PUBLICACIÓN\n\nSelecciona fecha y hora:\n⏰ Hora óptima sugerida: 18:00\n📊 Mayor engagement esperado');
}

function analyzeEngagement() {
    alert('📊 ANÁLISIS DE ENGAGEMENT\n\n📈 Promedio: 89%\n🕐 Mejor hora: 18:00-20:00\n📱 Red más activa: Instagram');
}

function autoPost() {
    alert('🤖 AUTO-POST ACTIVADO\n\n✅ Contenido automático habilitado\n📅 Frecuencia: 3 posts/día\n🎯 Optimización IA activa');
}

function addImage() {
    alert('🖼️ SELECTOR DE IMAGEN\n\nElige fuente:\n📱 Galería\n🎨 Generador IA\n🌐 Stock photos');
}

function addHashtags() {
    const textarea = document.getElementById('postContent');
    if (textarea) {
        textarea.value += ' #nexus #tech #innovation #saas';
    }
}

function publishPost() {
    alert('📤 PUBLICANDO...\n\n✅ Compartido en todas las redes\n📊 Analíticas en tiempo real activas\n🔔 Te notificaremos del rendimiento');
}

// AI Assistant Functions
function sendMessage() {
    const input = document.getElementById('chatInput');
    const messages = document.getElementById('chatMessages');
    
    if (input && messages && input.value.trim()) {
        const userMessage = input.value.trim();
        
        // Add user message
        messages.innerHTML += `
            <div style="margin-bottom: 1rem; text-align: right;">
                <strong style="color: var(--neon-green);">👤 Tú:</strong> ${userMessage}
            </div>
        `;
        
        input.value = '';
        
        // Simulate AI response
        setTimeout(() => {
            const responses = [
                "🤖 He programado tu reunión para mañana a las 10:00 AM",
                "📧 He procesado 15 emails y marqué 3 como prioritarios",
                "📊 Reporte generado. Crecimiento del 12% este mes",
                "✅ Tarea completada. ¿Necesitas algo más?",
                "🔍 He encontrado la información que buscabas"
            ];
            
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            
            messages.innerHTML += `
                <div style="margin-bottom: 1rem;">
                    <strong style="color: var(--neon-blue);">🤖 NEXUS AI:</strong> ${randomResponse}
                </div>
            `;
            
            messages.scrollTop = messages.scrollHeight;
        }, 1000);
        
        messages.scrollTop = messages.scrollHeight;
    }
}

function quickAction(action) {
    const actions = {
        calendar: '📅 Revisando calendario... Tienes 3 eventos hoy',
        email: '📧 Procesando emails... 5 requieren atención',
        tasks: '📋 Actualizando tareas... 7 pendientes, 3 completadas'
    };
    
    const messages = document.getElementById('chatMessages');
    if (messages) {
        messages.innerHTML += `
            <div style="margin-bottom: 1rem;">
                <strong style="color: var(--neon-blue);">🤖 NEXUS AI:</strong> ${actions[action]}
            </div>
        `;
        messages.scrollTop = messages.scrollHeight;
    }
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
        
        // Update dashboard when showing dashboard page
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

// === ANIMATION FUNCTIONS ===
function initializeAnimations() {
    createFloatingElements();
    createBackgroundParticles();
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(10, 10, 15, 0.98)';
            header.style.borderBottom = '1px solid var(--neon-blue)';
        } else {
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
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'bg-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (6 + Math.random() * 3) + 's';
        bg.appendChild(particle);
    }
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

// Enhanced initialization with error handling
function enhancedInit() {
    try {
        initializeApp();
        console.log('🚀 NEXUS SaaS System initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing NEXUS SaaS System:', error);
    }
}

// Auto-run enhanced initialization
enhancedInit();