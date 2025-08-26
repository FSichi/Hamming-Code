/**
 * Scripts Index - Entry Point
 * 
 * Punto de entrada único para todos los módulos de la aplicación.
 * Permite una carga ordenada y controlada de dependencias.
 * 
 * @author Facundo Sichi
 * @version 1.0.0
 */

// Verificar que el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

/**
 * Inicializa la aplicación verificando dependencias
 */
function initializeApp() {
    try {
        // Verificar que todos los módulos estén cargados
        const modules = {
            'AppConfig': typeof AppConfig !== 'undefined',
            'HammingEncoder': typeof HammingEncoder !== 'undefined',
            'ErrorSimulator': typeof ErrorSimulator !== 'undefined',
            'UIManager': typeof UIManager !== 'undefined',
            'HammingCodeApp': typeof HammingCodeApp !== 'undefined'
        };

        // Verificar módulos faltantes
        const missingModules = Object.keys(modules).filter(module => !modules[module]);
        
        if (missingModules.length > 0) {
            console.error('❌ Módulos faltantes:', missingModules);
            showLoadingError('Error al cargar módulos: ' + missingModules.join(', '));
            return;
        }

        // Configurar logging
        if (AppConfig?.DEBUG?.ENABLED) {
            console.log('🔧 Modo Debug habilitado');
            console.log('📦 Módulos cargados:', Object.keys(modules));
        }

        // Inicializar aplicación
        if (typeof window !== 'undefined') {
            window.app = new HammingCodeApp();
            console.log('🚀 Aplicación inicializada correctamente');
        }

    } catch (error) {
        console.error('💥 Error al inicializar aplicación:', error);
        showLoadingError('Error crítico al inicializar la aplicación');
    }
}

/**
 * Muestra un error de carga en la interfaz
 * @param {string} message - Mensaje de error
 */
function showLoadingError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'loading-error';
    errorDiv.innerHTML = `
        <div class="error-content">
            <h2>⚠️ Error de Carga</h2>
            <p>${message}</p>
            <button onclick="location.reload()" class="retry-btn">🔄 Reintentar</button>
        </div>
    `;
    
    // Agregar estilos inline
    errorDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        color: white;
        font-family: 'Inter', sans-serif;
    `;
    
    const errorContent = errorDiv.querySelector('.error-content');
    errorContent.style.cssText = `
        background: #1e293b;
        padding: 2rem;
        border-radius: 12px;
        text-align: center;
        max-width: 400px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    `;
    
    const retryBtn = errorDiv.querySelector('.retry-btn');
    retryBtn.style.cssText = `
        background: #0ea5e9;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        margin-top: 1rem;
        cursor: pointer;
        font-size: 1rem;
    `;

    document.body.appendChild(errorDiv);
}

// Exportar función de inicialización para testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initializeApp };
}
