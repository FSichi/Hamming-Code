/**
 * Hamming Code Encoder Module
 * 
 * Este módulo contiene toda la lógica relacionada con la codificación
 * y decodificación de códigos Hamming, incluyendo el cálculo de bits
 * de paridad y la generación de síndromes de error.
 * 
 * @author Facundo Sichi
 * @version 1.0.0
 */

class HammingEncoder {
    /**
     * Verifica si un número es potencia de 2
     * @param {number} n - Número a verificar
     * @returns {boolean} True si es potencia de 2
     */
    static isPowerOfTwo(n) {
        return (n & (n - 1)) === 0 && n > 0;
    }

    /**
     * Valida que la entrada contenga solo bits (0s y 1s)
     * @param {string} input - Cadena de entrada
     * @returns {boolean} True si es válida
     */
    static validateInput(input) {
        return /^[01]+$/.test(input) && input.length > 0;
    }

    /**
     * Codifica una secuencia de datos usando el código Hamming
     * @param {string} data - Datos binarios a codificar
     * @returns {number[]} Array con la palabra código Hamming
     */
    static encode(data) {
        const n = data.length;
        let r = 0;
        
        // Calcular número de bits de paridad necesarios
        // Fórmula: 2^r >= n + r + 1
        while ((1 << r) < (n + r + 1)) {
            r++;
        }
        
        const totalBits = n + r;
        const encoded = new Array(totalBits + 1).fill(0); // 1-indexed
        
        let dataIndex = 0;
        
        // Colocar bits de datos en posiciones que no son potencias de 2
        for (let i = 1; i <= totalBits; i++) {
            if (!this.isPowerOfTwo(i)) {
                encoded[i] = parseInt(data[dataIndex++]);
            }
        }
        
        // Calcular y colocar bits de paridad
        for (let i = 0; i < r; i++) {
            const parityPos = 1 << i; // Posiciones 1, 2, 4, 8, 16...
            let parity = 0;
            
            // Calcular paridad para todas las posiciones que tienen
            // el bit i activado en su representación binaria
            for (let j = 1; j <= totalBits; j++) {
                if ((j & parityPos) !== 0) {
                    parity ^= encoded[j];
                }
            }
            
            encoded[parityPos] = parity;
        }
        
        // Retornar sin el índice 0
        return encoded.slice(1);
    }

    /**
     * Calcula el síndrome de error para detectar errores
     * @param {number[]} data - Palabra código recibida
     * @returns {number[]} Síndrome de error
     */
    static calculateSyndrome(data) {
        const n = data.length;
        let r = 0;
        
        // Determinar número de bits de paridad
        while ((1 << r) < (n + 1)) {
            r++;
        }
        
        const syndrome = [];
        const indexed = [0, ...data]; // Convertir a 1-indexed
        
        // Calcular cada bit del síndrome
        for (let i = 0; i < r; i++) {
            const parityPos = 1 << i;
            let parity = 0;
            
            // Recalcular paridad para esta posición
            for (let j = 1; j <= n; j++) {
                if ((j & parityPos) !== 0) {
                    parity ^= indexed[j];
                }
            }
            
            syndrome[i] = parity;
        }
        
        return syndrome;
    }

    /**
     * Convierte un síndrome a la posición del error
     * @param {number[]} syndrome - Síndrome de error
     * @returns {number} Posición del error (0 si no hay error)
     */
    static syndromeToPosition(syndrome) {
        let position = 0;
        
        // Interpretar síndrome como número binario
        for (let i = 0; i < syndrome.length; i++) {
            position += syndrome[i] * (1 << i);
        }
        
        return position;
    }

    /**
     * Corrige un error en la posición especificada
     * @param {number[]} data - Datos con error
     * @param {number} position - Posición del error (1-indexed)
     * @returns {number[]} Datos corregidos
     */
    static correctError(data, position) {
        if (position === 0 || position > data.length) {
            return [...data]; // Sin error o posición inválida
        }
        
        const corrected = [...data];
        // Invertir bit en la posición del error (convertir a 0-indexed)
        corrected[position - 1] = corrected[position - 1] === 0 ? 1 : 0;
        
        return corrected;
    }

    /**
     * Obtiene información detallada sobre la codificación
     * @param {string} originalData - Datos originales
     * @param {number[]} encodedData - Datos codificados
     * @returns {Object} Información de la codificación
     */
    static getEncodingInfo(originalData, encodedData) {
        const dataBits = originalData.length;
        const totalBits = encodedData.length;
        const parityBits = totalBits - dataBits;
        const efficiency = (dataBits / totalBits * 100).toFixed(1);
        
        return {
            dataBits,
            parityBits,
            totalBits,
            efficiency: `${efficiency}%`,
            overhead: `${parityBits} bits`
        };
    }
}

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HammingEncoder;
}
