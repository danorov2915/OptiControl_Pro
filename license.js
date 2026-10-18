/**
 * Sistema de Licenciamiento y Activación para Óptica App
 * Maneja la validación de la versión Demo (máx. 10 clientes)
 * y la verificación/generación de claves de activación ilimitadas.
 */

const LicenseManager = (() => {
  const STORAGE_KEY_LICENSE = 'optica_app_license';
  const STORAGE_KEY_DEVICE = 'optica_installation_id';
  const SALT = 'OPTICA_PRO_SECRET_KEY_2026_MX';
  const MASTER_KEYS = [
    'OPTICAPRO-FULL-2026',
    'VISION-ILIMITADA-2026',
    'OPTICA-VIP-PREMIUM-9999'
  ];

  // Obtener o generar un ID único de instalación para este dispositivo
  function getInstallationId() {
    let id = localStorage.getItem(STORAGE_KEY_DEVICE);
    if (!id) {
      const randPart = Math.random().toString(36).substring(2, 6).toUpperCase();
      const timePart = Date.now().toString(36).substring(3, 7).toUpperCase();
      id = `OPT-${randPart}-${timePart}`;
      localStorage.setItem(STORAGE_KEY_DEVICE, id);
    }
    return id;
  }

  // Algoritmo simple de hash determinista para firma de claves
  function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0; // Convertir a entero de 32 bits
    }
    return Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
  }

  // Generador oficial de clave de activación basado en ID de instalación o Nombre de óptica
  function generateKey(identifier) {
    const cleanId = (identifier || '').trim().toUpperCase();
    if (!cleanId) return null;

    const hash1 = simpleHash(cleanId + SALT);
    const hash2 = simpleHash(SALT + cleanId + 'PRO_VERSION');
    
    // Formato: OPT-XXXX-XXXX-XXXX
    const p1 = hash1.substring(0, 4);
    const p2 = hash2.substring(0, 4);
    const p3 = hash1.substring(4, 8);
    return `OPT-${p1}-${p2}-${p3}`;
  }

  // Validar una clave ingresada por el usuario
  function validateKey(inputKey) {
    if (!inputKey) return false;
    const cleanKey = inputKey.trim().toUpperCase();

    // 1. Verificar si es una clave maestra
    if (MASTER_KEYS.includes(cleanKey)) {
      return { valid: true, type: 'MAESTRA', message: 'Licencia Maestra Ilimitada Activada' };
    }

    // 2. Verificar contra el ID de instalación actual
    const currentId = getInstallationId();
    const expectedKey = generateKey(currentId);
    if (cleanKey === expectedKey) {
      return { valid: true, type: 'DISPOSITIVO', message: 'Licencia Activada para este dispositivo' };
    }

    // 3. Verificar si fue generada con el nombre de la óptica
    try {
      const settings = JSON.parse(localStorage.getItem('optica_app_settings') || '{}');
      if (settings.nombre) {
        const expectedNameKey = generateKey(settings.nombre);
        if (cleanKey === expectedNameKey) {
          return { valid: true, type: 'NEGOCIO', message: 'Licencia Activada para ' + settings.nombre };
        }
      }
    } catch (e) {}

    return { valid: false, message: 'Clave de activación inválida o no corresponde a esta instalación.' };
  }

  // Obtener estado actual de la licencia
  function getLicenseStatus() {
    const saved = localStorage.getItem(STORAGE_KEY_LICENSE);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.isPro) {
          return {
            isPro: true,
            key: parsed.key,
            type: parsed.type || 'PRO',
            activatedAt: parsed.activatedAt,
            maxClients: Infinity
          };
        }
      } catch (e) {}
    }

    return {
      isPro: false,
      maxClients: 10,
      installationId: getInstallationId()
    };
  }

  // Activar la licencia en este navegador/dispositivo
  function activateLicense(key) {
    const result = validateKey(key);
    if (result.valid) {
      const licenseData = {
        isPro: true,
        key: key.trim().toUpperCase(),
        type: result.type,
        activatedAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY_LICENSE, JSON.stringify(licenseData));
      return { success: true, message: result.message };
    }
    return { success: false, message: result.message };
  }

  // Función para re-bloquear (modo demo para pruebas)
  function deactivateLicense() {
    localStorage.removeItem(STORAGE_KEY_LICENSE);
  }

  return {
    getInstallationId,
    generateKey,
    validateKey,
    getLicenseStatus,
    activateLicense,
    deactivateLicense
  };
})();

// Exportar globalmente
window.LicenseManager = LicenseManager;
