/**
 * Error Simulation Module
 * 
 * Este módulo maneja toda la lógica relacionada con la simulación
 * de errores en la transmisión, incluyendo errores simples, dobles
 * y triples para demostrar las limitaciones de los códigos Hamming.
 * 
 * @author Facundo Sichi
 * @version 1.0.0
 */

class ErrorSimulator {
    constructor() {
        this.errorPositions = [];
        this.errorMode = 'single'; // 'single', 'double', 'triple'
    }

    /**
     * Establece el modo de error
     * @param {string} mode - Modo de error ('single', 'double', 'triple')
     */
    setErrorMode(mode) {
        if (['single', 'double', 'triple'].includes(mode)) {
            this.errorMode = mode;
            this.errorPositions = [];
        }
    }

    /**
     * Simula un error simple en una posición aleatoria
     * @param {number[]} data - Datos a modificar
     * @returns {Object} Resultado de la simulación
     */
    simulateSingleError(data) {
        if (data.length === 0) {
            throw new Error('No hay datos para simular errores');
        }

        const transmittedData = [...data];
        const errorPos = Math.floor(Math.random() * data.length) + 1; // 1-indexed
        
        // Aplicar error (0-indexed para array)
        transmittedData[errorPos - 1] = transmittedData[errorPos - 1] === 0 ? 1 : 0;
        
        this.errorPositions = [errorPos];
        
        return {
            data: transmittedData,
            positions: this.errorPositions,
            message: `Error simulado en posición ${errorPos}`,
            type: 'info'
        };
    }

    /**
     * Simula dos errores en posiciones aleatorias diferentes
     * @param {number[]} data - Datos a modificar
     * @returns {Object} Resultado de la simulación
     */
    simulateDoubleError(data) {
        if (data.length < 2) {
            throw new Error('Se necesitan al menos 2 bits para simular doble error');
        }

        const transmittedData = [...data];
        
        // Generar dos posiciones diferentes
        const pos1 = Math.floor(Math.random() * data.length) + 1;
        let pos2;
        do {
            pos2 = Math.floor(Math.random() * data.length) + 1;
        } while (pos2 === pos1);

        this.errorPositions = [pos1, pos2];
        
        // Aplicar ambos errores (0-indexed para array)
        transmittedData[pos1 - 1] = transmittedData[pos1 - 1] === 0 ? 1 : 0;
        transmittedData[pos2 - 1] = transmittedData[pos2 - 1] === 0 ? 1 : 0;
        
        return {
            data: transmittedData,
            positions: this.errorPositions,
            message: `⚠️ Dos errores simulados en posiciones ${pos1} y ${pos2} - ¡El código Hamming fallará!`,
            type: 'warning'
        };
    }

    /**
     * Simula tres errores en posiciones aleatorias diferentes
     * @param {number[]} data - Datos a modificar
     * @returns {Object} Resultado de la simulación
     */
    simulateTripleError(data) {
        if (data.length < 3) {
            throw new Error('Se necesitan al menos 3 bits para simular triple error');
        }

        const transmittedData = [...data];
        
        // Generar tres posiciones diferentes
        const positions = new Set();
        while (positions.size < 3) {
            const pos = Math.floor(Math.random() * data.length) + 1;
            positions.add(pos);
        }
        
        this.errorPositions = Array.from(positions);
        
        // Aplicar todos los errores (0-indexed para array)
        this.errorPositions.forEach(pos => {
            transmittedData[pos - 1] = transmittedData[pos - 1] === 0 ? 1 : 0;
        });
        
        return {
            data: transmittedData,
            positions: this.errorPositions,
            message: `💥 Tres errores simulados en posiciones ${this.errorPositions.join(', ')} - ¡Detección pero corrección INCORRECTA!`,
            type: 'danger'
        };
    }

    /**
     * Simula errores según el modo actual
     * @param {number[]} data - Datos a modificar
     * @returns {Object} Resultado de la simulación
     */
    simulate(data) {
        switch (this.errorMode) {
            case 'single':
                return this.simulateSingleError(data);
            case 'double':
                return this.simulateDoubleError(data);
            case 'triple':
                return this.simulateTripleError(data);
            default:
                throw new Error(`Modo de error desconocido: ${this.errorMode}`);
        }
    }

    /**
     * Simula un error manual en una posición específica
     * @param {number[]} data - Datos a modificar
     * @param {number} position - Posición del error (1-indexed)
     * @returns {Object} Resultado de la simulación
     */
    simulateManualError(data, position) {
        if (position < 1 || position > data.length) {
            throw new Error('Posición de error inválida');
        }

        const transmittedData = [...data];
        transmittedData[position - 1] = transmittedData[position - 1] === 0 ? 1 : 0;
        
        this.errorPositions = [position];
        
        return {
            data: transmittedData,
            positions: this.errorPositions,
            message: `Error manual aplicado en posición ${position}`,
            type: 'info'
        };
    }

    /**
     * Resetea el estado del simulador
     */
    reset() {
        this.errorPositions = [];
    }

    /**
     * Obtiene las posiciones de los errores actuales
     * @returns {number[]} Array con las posiciones de errores
     */
    getErrorPositions() {
        return [...this.errorPositions];
    }

    /**
     * Verifica si hay errores activos
     * @returns {boolean} True si hay errores
     */
    hasErrors() {
        return this.errorPositions.length > 0;
    }

    /**
     * Obtiene información sobre el tipo de error actual
     * @returns {Object} Información del error
     */
    getErrorInfo() {
        const count = this.errorPositions.length;
        
        if (count === 0) {
            return {
                count: 0,
                description: 'Sin errores',
                canCorrect: true,
                mode: this.errorMode
            };
        }
        
        return {
            count,
            positions: this.errorPositions,
            description: count === 1 ? 'Error simple' : `${count} errores múltiples`,
            canCorrect: count === 1,
            mode: this.errorMode
        };
    }
}

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ErrorSimulator;
}
