// Scroll reveal
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Modal Data
const projectData = {
    bitacora: {
        title: "Bitácora de Vuelos",
        tagline: "Gestión Operativa · Android/iOS",
        description: `Esta solución nació de la necesidad de los pilotos de abandonar el registro manual, propenso a errores y difícil de auditar. Desarrollé una herramienta que no solo registra, sino que **gestiona automáticamente el estatus legal** del personal, garantizando seguridad y cumplimiento normativo.`,
        features: [
            "Gestión Automática: Algoritmos que determinan la vigencia legal de los pilotos.",
            "Centralización de Datos: Historial completo accesible desde cualquier lugar.",
            "Reportes Profesionales: Automatización de la bitácora física en formato PDF.",
            "Sincronización Total: Funcionamiento offline con respaldo inmediato en la nube."
        ],
        stack: ["Flutter", "Firebase Firestore", "RevenueCat", "Workmanager", "AdMob"],
        challenges: [
            "Arquitectura en Capas: Separación estricta entre presentación, servicios y repositorio de datos.",
            "Tareas en 2do Plano: Uso de Workmanager para re-evaluar estados de autonomía sin abrir la app.",
            "Monetización Híbrida: Flujo de Rewarded Ads para desbloquear funciones temporales."
        ],
        images: ["images/app_progreso.png", "images/app_registrar.png", "images/app_alerta.png"]
    },
    alfaverde: {
        title: "Gestión Alfaverde",
        tagline: "Gestión de Materiales · Web App",
        description: `ALFAVERDE necesitaba eliminar la pérdida de información y la falta de evidencia en sus pesajes. Desarrollé un sistema que vincula cada transacción con fotos y videos, garantizando una **trazabilidad del 100%** y agilizando la facturación a través de una red local robusta.`,
        features: [
            "Trazabilidad Multimedia: Cada registro incluye evidencia visual del material.",
            "Conectividad Ágil: Acceso desde smartphones sin configuración (vía QR).",
            "Facturación Instantánea: Órdenes de servicio en PDF generadas al momento."
        ],
        stack: ["Python", "Flask", "SQLite", "ReportLab", "QR Code lib"],
        challenges: [
            "Arquitectura Off-the-Grid: Diseñado para funcionar 100% en red local sin internet.",
            "ES Modules: Frontend moderno sin necesidad de builders complejos."
        ],
        images: ["images/alfaverde_registro.png", "images/alfaverde_factura.png"]
    },
    java: {
        title: "Gestión de Compras",
        tagline: "Gestión de Inventario · Desktop",
        description: `El reto era agilizar el flujo de compras en un entorno de alta velocidad y asegurar que los cierres diarios fueran exactos. Creé una herramienta de escritorio que procesa cálculos financieros en tiempo real y asegura los datos atómicamente, eliminando errores de balanceo.`,
        features: [
            "Cálculo Financiero: Procesamiento instantáneo de precios y totales.",
            "Seguridad de Datos: Persistencia digital que previene la pérdida de cierres.",
            "Agilidad de Usuario: Interfaz diseñada para digitación rápida.",
            "Reportes de Cierre: Resúmenes automáticos para auditoría financiera diaria."
        ],
        stack: ["Java 21", "Java Swing", "Maven", "iTextPDF", "JUnit 5"],
        challenges: [
            "Patrón Singleton: Optimización de memoria y consistencia de estado en ventanas GUI.",
            "Persistencia Atómica: Operaciones seguras con java.nio.file para evitar corrupción de datos."
        ],
        image: "images/sistema_chatarreria.png"
    }
};

const modalOverlay = document.getElementById('modal-overlay');
const modalContent = document.getElementById('modal-content');
const modalClose = document.querySelector('.modal-close');

function openModal(projectId) {
    const data = projectData[projectId];
    if (!data) return;

    modalContent.innerHTML = `
        <div class="modal-project-header">
            <span class="modal-project-tagline">${data.tagline}</span>
            <h2 class="modal-project-title">${data.title}</h2>
        </div>
        <div class="modal-grid">
            <div class="modal-body">
                <span class="modal-section-title">Sobre el proyecto</span>
                <p>${data.description}</p>
                
                <span class="modal-section-title">Funcionalidades Clave</span>
                <ul class="modal-list">
                    ${data.features.map(f => `<li>${f}</li>`).join('')}
                </ul>
            </div>
            <div class="modal-sidebar">
                <div class="modal-sidebar-card">
                    <span class="modal-section-title">Enfoque Técnico</span>
                    <ul class="modal-list" style="font-size: 0.85rem; margin-top: 10px;">
                        ${data.challenges.map(c => `<li>${c}</li>`).join('')}
                    </ul>
                </div>
                <div class="modal-sidebar-card">
                    <span class="modal-section-title">Stack Tecnológico</span>
                    <div class="tags">
                        ${data.stack.map(s => `<span class="tag tag-gray">${s}</span>`).join('')}
                    </div>
                </div>
                ${projectId === 'bitacora' ? `
                <a href="https://play.google.com/store/apps/details?id=com.bitacoravuelos.app" target="_blank" class="btn-primary" style="display: block; text-align: center;">Ver en Play Store</a>
                ` : ''}
            </div>
        </div>

        <div class="modal-gallery-full">
            <span class="modal-section-title">Capturas del Sistema (Click para ampliar)</span>
            <div class="${projectId === 'bitacora' ? 'gallery-mobile' : 'gallery-stack'}">
                ${data.images ? data.images.map(img => `
                    <div class="${projectId === 'bitacora' ? 'modal-image-mobile-container' : 'modal-image-full-container'} zoomable">
                        <img src="${img}" alt="${data.title}">
                    </div>
                `).join('') : `
                    <div class="modal-image-full-container zoomable">
                        <img src="${data.image}" alt="${data.title}">
                    </div>
                `}
            </div>
        </div>
    `;

    // Re-attach lightbox listeners to new images
    attachLightboxListeners();

    modalOverlay.classList.add('active');
    document.body.classList.add('modal-open');
}

// LIGHTBOX LOGIC
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');

function attachLightboxListeners() {
    document.querySelectorAll('.zoomable img').forEach(img => {
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightbox.classList.add('active');
            document.body.classList.add('lightbox-open');
        });
    });
}

lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('active');
    document.body.classList.remove('lightbox-open');
});

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.classList.remove('active');
        document.body.classList.remove('lightbox-open');
    }
});

document.querySelectorAll('.btn-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const projectId = btn.getAttribute('data-project');
        openModal(projectId);
    });
});

modalClose.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
    document.body.classList.remove('modal-open');
});

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.classList.remove('modal-open');
    }
});
