/**
 * OPTICONTROL PRO - Lógica de Aplicación
 * Sistema integral para ópticas y clínicas optométricas:
 * 1. Control de pacientes, refracción clínica y gabinete extendido (queratometría, PIO, AV SC/CC).
 * 2. Órdenes de laboratorio con costo de maquila, costo de armazón y margen real.
 * 3. Corte de caja diario, arqueo de efectivo, registro de gastos y reporte WhatsApp al dueño.
 * 4. Campañas CRM de retención (revisión anual, lentes de contacto, listos sin recoger).
 * 5. Escáner de código de barras y QR con cámara web.
 * 6. Control de personal, asesores y comisiones de venta.
 * 7. Control de licencias y límite demo de 10 pacientes.
 */

// ==========================================================================
// ESTADO GLOBAL DE LA APLICACIÓN
// ==========================================================================
const AppState = {
  activeTab: 'inicio',
  patients: [],
  orders: [],
  inventory: [],
  appointments: [],
  expenses: [],
  cashCuts: [],
  currentPatientCRMFilter: 'todos',
  currentOrderFilter: 'todos',
  currentCajaSubtab: 'movimientos',
  currentEditingPatientId: null,
  currentEditingOrderId: null,
  settings: {
    nombre: 'Óptica Visión Clara',
    eslogan: 'Cuidamos la salud de tus ojos',
    telefono: '5512345678',
    whatsapp: '525512345678',
    direccion: 'Av. Hidalgo #124, Centro',
    optometrista: 'Lic. Opt. Alejandro Ramos V.',
    cedula: '12345678',
    especialidad: 'Optometría Clínica & Contactología',
    logo: null,
    diasEntrega: 3,
    garantiaDias: 30,
    mensajeTicket: 'Garantía de 30 días en adaptación de graduación. ¡Gracias por su confianza!',
    asesores: ['Laura Morales', 'Carlos Gómez', 'Alejandro Ramos'],
    comisionPorcentaje: 3,
    fondoInicialCaja: 500,
    telefonoDuenio: '525512345678'
  }
};

// ==========================================================================
// DATOS DE EJEMPLO INICIALES
// ==========================================================================
const INITIAL_DEMO_DATA = {
  patients: [
    {
      id: 'p-1',
      folio: 'PAC-101',
      nombre: 'Carlos Mendoza Ruiz',
      telefono: '5541238901',
      edad: 34,
      ocupacion: 'Ingeniero de Software',
      fechaRegistro: '2026-03-10',
      antecedentes: 'Uso de computadora 10h al día. Fatiga ocular frecuente.',
      rx: {
        od: { esf: '-2.50', cil: '-0.75', eje: '90', add: '', dp: '31.5', av: '20/20' },
        oi: { esf: '-2.75', cil: '-1.00', eje: '85', add: '', dp: '31.0', av: '20/20' },
        tipoMica: 'Monofocal',
        material: 'Policarbonato',
        tratamientos: ['Filtro Azul (Blue Defense)', 'Antirreflejante'],
        armazon: 'Ray-Ban RB5154 Negro',
        observaciones: 'Miopía con astigmatismo miópico compuesto.'
      },
      gabinete: {
        k1_od: '43.00', k2_od: '43.75', ejeK_od: '90°',
        k1_oi: '43.25', k2_oi: '44.00', ejeK_oi: '85°',
        pio_od: '15', pio_oi: '15',
        avSc_od: '20/200', avSc_oi: '20/200',
        sintomas: ['Fatiga por pantallas', 'Ojo seco / ardor'],
        esLenteContacto: 'No',
        fechaReemplazoLC: ''
      }
    },
    {
      id: 'p-2',
      folio: 'PAC-102',
      nombre: 'Sofía Valenzuela Gómez',
      telefono: '5587654321',
      edad: 48,
      ocupacion: 'Docente',
      fechaRegistro: '2026-03-15',
      antecedentes: 'Dificultad progresiva en lectura de cerca.',
      rx: {
        od: { esf: '+1.25', cil: '-0.50', eje: '180', add: '+2.00', dp: '32.0', av: '20/25' },
        oi: { esf: '+1.50', cil: '-0.50', eje: '175', add: '+2.00', dp: '32.0', av: '20/25' },
        tipoMica: 'Progresivo Digital HD',
        material: 'Hi-Index 1.67',
        tratamientos: ['Fotocromático (Transitions)', 'Antirreflejante Verde'],
        armazon: 'Vogue Eyewear VO5276 Carey',
        observaciones: 'Presbicia y ligera hipermetropía.'
      },
      gabinete: {
        k1_od: '43.50', k2_od: '44.00', ejeK_od: '180°',
        k1_oi: '43.50', k2_oi: '44.00', ejeK_oi: '175°',
        pio_od: '16', pio_oi: '17',
        avSc_od: '20/60', avSc_oi: '20/70',
        sintomas: ['Dificultad de cerca', 'Cefaleas frecuentes'],
        esLenteContacto: 'No',
        fechaReemplazoLC: ''
      }
    },
    {
      id: 'p-3',
      folio: 'PAC-103',
      nombre: 'Mateo Hernández Silva',
      telefono: '5523456789',
      edad: 16,
      ocupacion: 'Estudiante',
      fechaRegistro: '2026-03-22',
      antecedentes: 'Primer examen de la vista. Dolor de cabeza en el colegio.',
      rx: {
        od: { esf: '-1.00', cil: '-0.25', eje: '10', add: '', dp: '29.5', av: '20/20' },
        oi: { esf: '-1.25', cil: '-0.50', eje: '15', add: '', dp: '30.0', av: '20/20' },
        tipoMica: 'Monofocal',
        material: 'Policarbonato',
        tratamientos: ['Antirreflejante', 'Filtro Azul'],
        armazon: 'Oakley Chamfer Gris',
        observaciones: 'Miopía simple de aparición reciente.'
      },
      gabinete: {
        k1_od: '', k2_od: '', ejeK_od: '',
        k1_oi: '', k2_oi: '', ejeK_oi: '',
        pio_od: '14', pio_oi: '14',
        avSc_od: '20/80', avSc_oi: '20/100',
        sintomas: ['Visión borrosa lejos', 'Cefaleas frecuentes'],
        esLenteContacto: 'No',
        fechaReemplazoLC: ''
      }
    },
    {
      id: 'p-4',
      folio: 'PAC-104',
      nombre: 'Lucía Morales Garza',
      telefono: '5598761234',
      edad: 52,
      ocupacion: 'Contadora',
      fechaRegistro: '2026-03-28',
      antecedentes: 'Usuaria previa de bifocales, busca opción estética.',
      rx: {
        od: { esf: '+2.00', cil: '-1.25', eje: '45', add: '+2.25', dp: '31.0', av: '20/30' },
        oi: { esf: '+2.25', cil: '-1.50', eje: '135', add: '+2.25', dp: '31.5', av: '20/30' },
        tipoMica: 'Progresivo Premium',
        material: 'Policarbonato',
        tratamientos: ['Antirreflejante Crizal', 'Blue Defense'],
        armazon: 'Carolina Herrera CH004 Dorado',
        observaciones: 'Hipermetropía con astigmatismo y presbicia.'
      },
      gabinete: {
        k1_od: '43.25', k2_od: '44.50', ejeK_od: '45°',
        k1_oi: '43.50', k2_oi: '44.75', ejeK_oi: '135°',
        pio_od: '16', pio_oi: '15',
        avSc_od: '20/100', avSc_oi: '20/120',
        sintomas: ['Dificultad de cerca', 'Fatiga por pantallas'],
        esLenteContacto: 'No',
        fechaReemplazoLC: ''
      }
    },
    {
      id: 'p-5',
      folio: 'PAC-105',
      nombre: 'Mariana Ríos Castillo',
      telefono: '5534567890',
      edad: 29,
      ocupacion: 'Diseñadora Digital',
      fechaRegistro: '2025-05-12', // Hace más de 10 meses -> Campaña Revisión Anual
      antecedentes: 'Usuaria de lentes de contacto tóricos mensuales y gotas lubricantes.',
      rx: {
        od: { esf: '-3.25', cil: '-1.25', eje: '180', add: '', dp: '31.0', av: '20/20' },
        oi: { esf: '-3.00', cil: '-1.00', eje: '175', add: '', dp: '31.0', av: '20/20' },
        tipoMica: 'Monofocal',
        material: 'Hi-Index 1.67',
        tratamientos: ['Filtro Azul (Blue Defense)', 'Antirreflejante'],
        armazon: 'Ray-Ban RB5154 Negro',
        observaciones: 'Excelente candidata a reemplazo de lentes de contacto y revisión de fondo.'
      },
      gabinete: {
        k1_od: '42.75', k2_od: '43.50', ejeK_od: '180°',
        k1_oi: '42.50', k2_oi: '43.25', ejeK_oi: '175°',
        pio_od: '13', pio_oi: '14',
        avSc_od: '20/400', avSc_oi: '20/400',
        sintomas: ['Fatiga por pantallas', 'Ojo seco / ardor'],
        esLenteContacto: 'Blandos Tóricos',
        fechaReemplazoLC: '2026-04-10'
      }
    }
  ],
  orders: [
    {
      id: 'ord-1',
      folio: 'ORD-1001',
      patientId: 'p-1',
      patientName: 'Carlos Mendoza Ruiz',
      telefono: '5541238901',
      fechaPedido: new Date().toISOString().split('T')[0],
      fechaPrometida: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      laboratorio: 'Laboratorio Óptico Central',
      asesor: 'Laura Morales',
      inventoryItemId: 'inv-1',
      stockDescontado: true,
      descripcion: 'Monofocal Policarbonato con Filtro Azul + Armazón Ray-Ban',
      total: 2850,
      anticipo: 1500,
      saldo: 1350,
      costoLab: 450,
      costoArmazon: 550,
      estatus: 'listo',
      abonos: [
        { fecha: new Date().toISOString().split('T')[0], monto: 1500, metodo: 'Tarjeta' }
      ]
    },
    {
      id: 'ord-2',
      folio: 'ORD-1002',
      patientId: 'p-2',
      patientName: 'Sofía Valenzuela Gómez',
      telefono: '5587654321',
      fechaPedido: new Date().toISOString().split('T')[0],
      fechaPrometida: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
      laboratorio: 'Essilor Pro Lab',
      asesor: 'Carlos Gómez',
      inventoryItemId: 'inv-2',
      stockDescontado: true,
      descripcion: 'Progresivo Digital HD Transitions 1.67 + Armazón Vogue',
      total: 4800,
      anticipo: 2500,
      saldo: 2300,
      costoLab: 1100,
      costoArmazon: 400,
      estatus: 'taller',
      abonos: [
        { fecha: new Date().toISOString().split('T')[0], monto: 2500, metodo: 'Transferencia' }
      ]
    },
    {
      id: 'ord-3',
      folio: 'ORD-1003',
      patientId: 'p-4',
      patientName: 'Lucía Morales Garza',
      telefono: '5598761234',
      fechaPedido: new Date().toISOString().split('T')[0],
      fechaPrometida: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
      laboratorio: 'Laboratorio Óptico Central',
      asesor: 'Laura Morales',
      inventoryItemId: 'inv-4',
      stockDescontado: true,
      descripcion: 'Progresivo Premium + Armazón Carolina Herrera',
      total: 5200,
      anticipo: 3000,
      saldo: 2200,
      costoLab: 950,
      costoArmazon: 650,
      estatus: 'taller',
      abonos: [
        { fecha: new Date().toISOString().split('T')[0], monto: 3000, metodo: 'Efectivo' }
      ]
    }
  ],
  inventory: [
    { id: 'inv-1', codigo: 'RB-5154', marca: 'Ray-Ban', modelo: 'Clubmaster RB5154', tipo: 'Armazón', costo: 1100, precio: 2200, stock: 4, color: 'Negro / Dorado' },
    { id: 'inv-2', codigo: 'VG-5276', marca: 'Vogue', modelo: 'VO5276 Cat-Eye', tipo: 'Armazón', costo: 850, precio: 1750, stock: 3, color: 'Carey Habana' },
    { id: 'inv-3', codigo: 'OK-CHAM', marca: 'Oakley', modelo: 'Chamfer Sport', tipo: 'Armazón', costo: 1200, precio: 2400, stock: 5, color: 'Gris Mate' },
    { id: 'inv-4', codigo: 'CH-004', marca: 'Carolina Herrera', modelo: 'CH-004 Elegant', tipo: 'Armazón', costo: 1400, precio: 2850, stock: 2, color: 'Dorado / Rose' },
    { id: 'inv-5', codigo: 'SOL-CLEAN', marca: 'Opti-Clean', modelo: 'Spray Limpiador 60ml + Microfibra', tipo: 'Accesorio', costo: 25, precio: 90, stock: 24, color: 'Universal' },
    { id: 'inv-6', codigo: 'SOL-LENS', marca: 'Renu Fresh', modelo: 'Solución Lentes de Contacto 355ml', tipo: 'Accesorio', costo: 110, precio: 220, stock: 12, color: 'N/A' }
  ],
  appointments: [
    { id: 'apt-1', patientName: 'Roberto Garza Díaz', telefono: '5533221100', fecha: new Date().toISOString().split('T')[0], hora: '11:00', motivo: 'Examen de la vista completo', estatus: 'programada' },
    { id: 'apt-2', patientName: 'Carlos Mendoza Ruiz', telefono: '5541238901', fecha: new Date().toISOString().split('T')[0], hora: '16:30', motivo: 'Entrega y ajuste de lentes', estatus: 'programada' }
  ],
  expenses: [
    { id: 'exp-1', fecha: new Date().toISOString().split('T')[0], concepto: 'Motomensajería entrega de micas Lab', monto: 120, categoria: 'Laboratorio / Taller' },
    { id: 'exp-2', fecha: new Date().toISOString().split('T')[0], concepto: 'Paño microfibra y spray limpiador', monto: 85, categoria: 'Insumos / Materiales' }
  ],
  cashCuts: [
    {
      id: 'cut-1',
      fecha: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      hora: '20:15',
      totalCobrado: 4500,
      efectivo: 3000,
      tarjeta: 1500,
      transferencia: 0,
      gastos: 205,
      fondoInicial: 500,
      efectivoEsperado: 3295,
      gananciaBruta: 2450
    }
  ]
};

// ==========================================================================
// INICIALIZACIÓN Y PERSISTENCIA (LOCALSTORAGE)
// ==========================================================================
function initApp() {
  loadData();
  renderLicenseBadge();
  updateHeaderBranding();
  setupEventListeners();

  const fechaFiltroEl = document.getElementById('cajaFechaFiltro');
  if (fechaFiltroEl && !fechaFiltroEl.value) {
    fechaFiltroEl.value = new Date().toISOString().split('T')[0];
  }

  switchTab('inicio');
  
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}

function loadData() {
  try {
    const savedPatients = localStorage.getItem('optica_patients');
    AppState.patients = savedPatients ? JSON.parse(savedPatients) : INITIAL_DEMO_DATA.patients;

    const savedOrders = localStorage.getItem('optica_orders');
    AppState.orders = savedOrders ? JSON.parse(savedOrders) : INITIAL_DEMO_DATA.orders;

    const savedInventory = localStorage.getItem('optica_inventory');
    AppState.inventory = savedInventory ? JSON.parse(savedInventory) : INITIAL_DEMO_DATA.inventory;

    const savedAppointments = localStorage.getItem('optica_appointments');
    AppState.appointments = savedAppointments ? JSON.parse(savedAppointments) : INITIAL_DEMO_DATA.appointments;

    const savedExpenses = localStorage.getItem('optica_expenses');
    AppState.expenses = savedExpenses ? JSON.parse(savedExpenses) : INITIAL_DEMO_DATA.expenses;

    const savedCuts = localStorage.getItem('optica_cash_cuts');
    AppState.cashCuts = savedCuts ? JSON.parse(savedCuts) : INITIAL_DEMO_DATA.cashCuts;

    const savedSettings = localStorage.getItem('optica_app_settings');
    if (savedSettings) {
      AppState.settings = Object.assign(AppState.settings, JSON.parse(savedSettings));
    }
  } catch (e) {
    console.error('Error cargando datos de LocalStorage:', e);
  }
}

function saveData(key) {
  try {
    if (key === 'patients' || !key) localStorage.setItem('optica_patients', JSON.stringify(AppState.patients));
    if (key === 'orders' || !key) localStorage.setItem('optica_orders', JSON.stringify(AppState.orders));
    if (key === 'inventory' || !key) localStorage.setItem('optica_inventory', JSON.stringify(AppState.inventory));
    if (key === 'appointments' || !key) localStorage.setItem('optica_appointments', JSON.stringify(AppState.appointments));
    if (key === 'expenses' || !key) localStorage.setItem('optica_expenses', JSON.stringify(AppState.expenses));
    if (key === 'cash_cuts' || !key) localStorage.setItem('optica_cash_cuts', JSON.stringify(AppState.cashCuts));
    if (key === 'settings' || !key) localStorage.setItem('optica_app_settings', JSON.stringify(AppState.settings));
  } catch (e) {
    showToast('Error guardando datos', 'error');
  }
}

// ==========================================================================
// CONTROL DE LICENCIA Y LÍMITE DEMO
// ==========================================================================
function checkCanAddClient() {
  const license = LicenseManager.getLicenseStatus();
  if (license.isPro) {
    return true;
  }
  if (AppState.patients.length >= 10) {
    openDemoLimitModal();
    return false;
  }
  return true;
}

function renderLicenseBadge() {
  const license = LicenseManager.getLicenseStatus();
  const badgeEl = document.getElementById('headerLicenseBadge');
  const demoBanner = document.getElementById('demoBannerContainer');

  if (license.isPro) {
    badgeEl.className = 'license-pill pro';
    badgeEl.innerHTML = `
      <svg viewBox="0 0 24 24" fill="currentColor">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
      PRO Activo
    `;
    badgeEl.onclick = () => openModal('modalLicenciaInfo');
    if (demoBanner) demoBanner.innerHTML = '';
  } else {
    const count = AppState.patients.length;
    badgeEl.className = 'license-pill demo';
    badgeEl.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      Demo: ${count}/10
    `;
    badgeEl.onclick = () => openDemoLimitModal();

    if (demoBanner) {
      demoBanner.innerHTML = `
        <div class="demo-banner">
          <div class="demo-banner-text">
            <span>⚡ Modo Demostración: <strong>${count} de 10</strong> pacientes capturados.</span>
          </div>
          <button class="btn-unlock-demo" onclick="openDemoLimitModal()">Liberar Sistema</button>
        </div>
      `;
    }
  }
}

function openDemoLimitModal() {
  const installId = LicenseManager.getInstallationId();
  document.getElementById('demoModalInstallId').textContent = installId;
  document.getElementById('licenseKeyInput').value = '';
  openModal('modalDemoLimit');
}

function handleActivateFromModal() {
  const input = document.getElementById('licenseKeyInput').value.trim();
  if (!input) {
    showToast('Por favor escribe tu clave de activación', 'error');
    return;
  }

  const res = LicenseManager.activateLicense(input);
  if (res.success) {
    showToast('🎉 ¡Licencia PRO Activada con Éxito!', 'success');
    closeModal('modalDemoLimit');
    renderLicenseBadge();
    renderDashboard();
  } else {
    showToast(res.message, 'error');
  }
}

// ==========================================================================
// NAVEGACIÓN Y RUTAS (TABS)
// ==========================================================================
function switchTab(tabName) {
  AppState.activeTab = tabName;

  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });

  document.querySelectorAll('.view-section').forEach(view => {
    view.classList.remove('active');
  });

  const targetView = document.getElementById(`view-${tabName}`);
  if (targetView) {
    targetView.classList.add('active');
  }

  if (tabName === 'inicio') renderDashboard();
  if (tabName === 'pacientes') renderPatientsList();
  if (tabName === 'ordenes') renderOrdersList();
  if (tabName === 'caja') renderCajaView();
  if (tabName === 'citas') renderAppointmentsList();
  if (tabName === 'inventario') renderInventoryList();
  if (tabName === 'ajustes') renderSettings();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================================================
// DASHBOARD / INICIO
// ==========================================================================
function renderDashboard() {
  const totalPacientes = AppState.patients.length;
  const ordenesActivas = AppState.orders.filter(o => o.estatus === 'taller' || o.estatus === 'listo').length;
  const saldoPorCobrar = AppState.orders.reduce((acc, o) => acc + (o.estatus !== 'cancelado' ? (o.saldo || 0) : 0), 0);
  const totalVentas = AppState.orders.reduce((acc, o) => acc + (o.estatus !== 'cancelado' ? (o.total || 0) : 0), 0);

  const countPacientesEl = document.getElementById('dashTotalPacientes');
  if (countPacientesEl) countPacientesEl.textContent = totalPacientes;

  const countOrdenesEl = document.getElementById('dashOrdenesActivas');
  if (countOrdenesEl) countOrdenesEl.textContent = ordenesActivas;

  const saldoCobrarEl = document.getElementById('dashSaldoCobrar');
  if (saldoCobrarEl) saldoCobrarEl.textContent = `$${saldoPorCobrar.toLocaleString('es-MX')}`;

  const ventasEl = document.getElementById('dashTotalVentas');
  if (ventasEl) ventasEl.textContent = `$${totalVentas.toLocaleString('es-MX')}`;

  renderDashboardUrgentOrders();
  renderDashboardAppointments();
}

function renderDashboardUrgentOrders() {
  const container = document.getElementById('dashUrgentOrdersList');
  if (!container) return;

  const urgentOrders = AppState.orders.filter(o => o.estatus === 'listo' || o.estatus === 'taller').slice(0, 4);

  if (urgentOrders.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 20px; color: var(--text-tertiary);">
        <p>No hay órdenes en taller o pendientes de entrega.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = urgentOrders.map(order => `
    <div class="work-card" onclick="openEditOrderModal('${order.id}')">
      <div class="work-main">
        <div class="work-patient">${escapeHtml(order.patientName)}</div>
        <div class="work-details">
          <span>${order.folio}</span>
          <span>•</span>
          <span>${formatDate(order.fechaPrometida)}</span>
          <span class="badge-status badge-${order.estatus}">${order.estatus}</span>
        </div>
      </div>
      <div class="work-actions" onclick="event.stopPropagation()">
        ${order.estatus === 'listo' ? `
          <button class="icon-btn-sm whatsapp" title="Avisar por WhatsApp que sus lentes están listos" onclick="sendOrderReadyWhatsApp('${order.id}')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
            </svg>
          </button>
        ` : ''}
        <button class="icon-btn-sm" title="Ver Ticket" onclick="printOrderTicket('${order.id}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 6 2 18 2 18 9"/>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
            <rect x="6" y="14" width="12" height="8"/>
          </svg>
        </button>
      </div>
    </div>
  `).join('');
}

function renderDashboardAppointments() {
  const container = document.getElementById('dashAppointmentsList');
  if (!container) return;

  const upcoming = AppState.appointments.slice(0, 3);

  if (upcoming.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 14px; color: var(--text-tertiary); font-size: 0.85rem;">
        No hay citas agendadas para hoy.
      </div>
    `;
    return;
  }

  container.innerHTML = upcoming.map(apt => `
    <div class="work-card" style="margin-bottom: 8px;">
      <div class="work-main">
        <div class="work-patient">${escapeHtml(apt.patientName)}</div>
        <div class="work-details">
          <span>⏰ ${apt.hora} hrs</span>
          <span>•</span>
          <span>${escapeHtml(apt.motivo)}</span>
        </div>
      </div>
      <div class="work-actions">
        <button class="icon-btn-sm whatsapp" title="Recordar cita por WhatsApp" onclick="sendAppointmentWhatsApp('${apt.id}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
          </svg>
        </button>
      </div>
    </div>
  `).join('');
}

// ==========================================================================
// PACIENTES, GRADUACIONES Y GABINETE EXTENDIDO
// ==========================================================================
let currentPatientSearch = '';

function setPatientCRMFilter(filter) {
  AppState.currentPatientCRMFilter = filter;
  document.querySelectorAll('.patient-crm-chip').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.crm === filter);
  });

  const bannerContainer = document.getElementById('crmCampaignBannerContainer');
  if (bannerContainer) {
    if (filter === 'anual') {
      bannerContainer.innerHTML = `
        <div class="crm-campaign-banner">
          <div style="font-size: 1.2rem;">🔔</div>
          <div style="flex: 1;">
            <div style="font-weight: 700; color: #fff; font-size: 0.85rem;">Campaña: Revisión Anual Preventiva</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px;">
              Mostrando pacientes examinados hace más de 10 meses. Presiona el botón de WhatsApp para enviarles una invitación a reajustar su graduación.
            </div>
          </div>
        </div>
      `;
    } else if (filter === 'contacto') {
      bannerContainer.innerHTML = `
        <div class="crm-campaign-banner" style="border-left-color: var(--accent-cyan);">
          <div style="font-size: 1.2rem;">👁️</div>
          <div style="flex: 1;">
            <div style="font-weight: 700; color: #fff; font-size: 0.85rem;">Campaña: Contactología & Reemplazo</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px;">
              Pacientes adaptados a lentes de contacto blandos o tóricos. Envíales recordatorio para renovar sus blisters y soluciones de mantenimiento.
            </div>
          </div>
        </div>
      `;
    } else if (filter === 'sinrecoger') {
      bannerContainer.innerHTML = `
        <div class="crm-campaign-banner" style="border-left-color: var(--warning);">
          <div style="font-size: 1.2rem;">⏳</div>
          <div style="flex: 1;">
            <div style="font-weight: 700; color: #fff; font-size: 0.85rem;">Alerta: Lentes Listos sin Recoger</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px;">
              Pacientes con anteojos terminados en sucursal pendientes de entrega. Recuérdales pasar a recogerlos para liberar espacio y liquidar saldos.
            </div>
          </div>
        </div>
      `;
    } else {
      bannerContainer.innerHTML = '';
    }
  }

  renderPatientsList();
}

function renderPatientsList() {
  const container = document.getElementById('patientsListContainer');
  if (!container) return;

  let filtered = AppState.patients;

  // Filtro de texto / escáner
  if (currentPatientSearch) {
    const q = currentPatientSearch.toLowerCase().trim();
    filtered = filtered.filter(p => 
      p.nombre.toLowerCase().includes(q) ||
      (p.telefono && p.telefono.includes(q)) ||
      (p.folio && p.folio.toLowerCase().includes(q))
    );
  }

  // Filtro CRM
  const now = new Date();
  if (AppState.currentPatientCRMFilter === 'anual') {
    filtered = filtered.filter(p => {
      if (!p.fechaRegistro) return false;
      const regDate = new Date(p.fechaRegistro);
      const diffDays = (now - regDate) / (1000 * 60 * 60 * 24);
      return diffDays >= 280; // ~9.5 a 12 meses o más
    });
  } else if (AppState.currentPatientCRMFilter === 'contacto') {
    filtered = filtered.filter(p => {
      const g = p.gabinete || {};
      return (g.esLenteContacto && g.esLenteContacto !== 'No') || 
             (p.rx && p.rx.tipoMica && p.rx.tipoMica.toLowerCase().includes('contacto'));
    });
  } else if (AppState.currentPatientCRMFilter === 'sinrecoger') {
    filtered = filtered.filter(p => {
      return AppState.orders.some(o => o.patientId === p.id && o.estatus === 'listo');
    });
  }

  const titleEl = document.getElementById('patientListTitle');
  if (titleEl) {
    titleEl.textContent = `Directorio (${filtered.length} paciente${filtered.length === 1 ? '' : 's'})`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: var(--text-tertiary);">
        <p>No se encontraron pacientes con el criterio seleccionado.</p>
        <button class="btn-primary" style="margin: 16px auto; max-width: 220px;" onclick="promptNewPatient()">
          + Agregar Paciente
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(patient => {
    const rx = patient.rx || {};
    const od = rx.od || {};
    const oi = rx.oi || {};
    const gab = patient.gabinete || {};
    const initials = patient.nombre.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

    // Comprobar si tiene orden lista sin recoger
    const readyOrder = AppState.orders.find(o => o.patientId === patient.id && o.estatus === 'listo');

    return `
      <div class="patient-card">
        <div class="patient-card-header">
          <div class="patient-avatar">${initials}</div>
          <div class="patient-info-meta">
            <div class="patient-name">${escapeHtml(patient.nombre)}</div>
            <div class="patient-sub">
              <span>${patient.folio || 'S/F'}</span>
              <span>•</span>
              <span>${patient.edad ? patient.edad + ' años' : 'Edad N/E'}</span>
              <span>•</span>
              <span>📞 ${patient.telefono || 'Sin tel'}</span>
            </div>
          </div>
        </div>

        <!-- Mini tabla de graduación -->
        <div class="patient-rx-preview">
          <table class="rx-mini-table">
            <thead>
              <tr>
                <th>Ojo</th>
                <th>ESF</th>
                <th>CIL</th>
                <th>EJE</th>
                <th>ADD</th>
                <th>DP</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="color: var(--primary);">OD</td>
                <td>${od.esf || '0.00'}</td>
                <td>${od.cil || '0.00'}</td>
                <td>${od.eje ? od.eje + '°' : '-'}</td>
                <td>${od.add || '-'}</td>
                <td>${od.dp || '-'}</td>
              </tr>
              <tr>
                <td style="color: #A78BFA;">OI</td>
                <td>${oi.esf || '0.00'}</td>
                <td>${oi.cil || '0.00'}</td>
                <td>${oi.eje ? oi.eje + '°' : '-'}</td>
                <td>${oi.add || '-'}</td>
                <td>${oi.dp || '-'}</td>
              </tr>
            </tbody>
          </table>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px; font-size: 0.72rem; color: var(--accent-cyan);">
            <span>👓 ${rx.tipoMica || 'Monofocal'} | ${rx.material || 'CR-39'}</span>
            ${gab.esLenteContacto && gab.esLenteContacto !== 'No' ? `<span style="color: var(--gold); font-weight: 700;">👁️ LC: ${gab.esLenteContacto}</span>` : ''}
          </div>

          ${(gab.k1_od || gab.pio_od) ? `
            <div style="margin-top: 6px; padding-top: 4px; border-top: 1px dashed rgba(255,255,255,0.08); font-size: 0.7rem; color: var(--text-secondary); display: flex; gap: 10px;">
              ${gab.k1_od ? `<span>K OD: ${gab.k1_od}/${gab.k2_od || ''}</span>` : ''}
              ${gab.pio_od ? `<span>PIO: OD ${gab.pio_od} / OI ${gab.pio_oi || ''} mmHg</span>` : ''}
            </div>
          ` : ''}
        </div>

        <div class="patient-card-footer">
          ${AppState.currentPatientCRMFilter === 'anual' ? `
            <button class="btn-card-action" style="color: #25D366; font-weight: 700;" onclick="sendAnnualReviewWhatsApp('${patient.id}')">
              🔔 Invitar Examen Anual
            </button>
          ` : AppState.currentPatientCRMFilter === 'contacto' ? `
            <button class="btn-card-action" style="color: var(--accent-cyan); font-weight: 700;" onclick="sendContactLensRefillWhatsApp('${patient.id}')">
              👁️ Recordar Reemplazo LC
            </button>
          ` : readyOrder ? `
            <button class="btn-card-action" style="color: #25D366; font-weight: 700;" onclick="sendOrderReadyWhatsApp('${readyOrder.id}')">
              📦 Avisar que está Listo
            </button>
          ` : `
            <button class="btn-card-action" onclick="sendRxWhatsApp('${patient.id}')">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#25D366">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
              </svg>
              Receta
            </button>
          `}
          <button class="btn-card-action primary" onclick="promptNewOrderForPatient('${patient.id}')">
            + Orden
          </button>
          <button class="btn-card-action" onclick="openEditPatientModal('${patient.id}')">
            Editar
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function promptNewPatient() {
  if (!checkCanAddClient()) {
    return;
  }
  AppState.currentEditingPatientId = null;
  resetPatientForm();
  openModal('modalPaciente');
}

function openEditPatientModal(patientId) {
  const patient = AppState.patients.find(p => p.id === patientId);
  if (!patient) return;

  AppState.currentEditingPatientId = patientId;
  fillPatientForm(patient);
  openModal('modalPaciente');
}

function toggleCabinetDrawer() {
  const drawer = document.getElementById('cabinetDrawer');
  const icon = document.getElementById('cabinetToggleIcon');
  if (!drawer) return;

  drawer.classList.toggle('open');
  if (icon) {
    icon.textContent = drawer.classList.contains('open') ? '▲' : '▼';
  }
}

function resetPatientForm() {
  document.getElementById('patientFormTitle').textContent = 'Nuevo Paciente & Graduación';
  document.getElementById('pNombre').value = '';
  document.getElementById('pTelefono').value = '';
  document.getElementById('pEdad').value = '';
  document.getElementById('pOcupacion').value = '';
  document.getElementById('pAntecedentes').value = '';

  // Rx OD
  document.getElementById('rxOdEsf').value = '';
  document.getElementById('rxOdCil').value = '';
  document.getElementById('rxOdEje').value = '';
  document.getElementById('rxOdAdd').value = '';
  document.getElementById('rxOdDp').value = '';
  document.getElementById('rxOdAv').value = '20/20';

  // Rx OI
  document.getElementById('rxOiEsf').value = '';
  document.getElementById('rxOiCil').value = '';
  document.getElementById('rxOiEje').value = '';
  document.getElementById('rxOiAdd').value = '';
  document.getElementById('rxOiDp').value = '';
  document.getElementById('rxOiAv').value = '20/20';

  document.getElementById('rxTipoMica').value = 'Monofocal';
  document.getElementById('rxMaterial').value = 'Policarbonato';
  document.getElementById('rxArmazon').value = '';
  populateArmazonSelectInPatientModal('');
  document.getElementById('rxObservaciones').value = '';

  document.querySelectorAll('.treatment-cb').forEach(cb => cb.checked = false);

  // Gabinete extendido
  document.getElementById('pK1_OD').value = '';
  document.getElementById('pK2_OD').value = '';
  document.getElementById('pEjeK_OD').value = '';
  document.getElementById('pK1_OI').value = '';
  document.getElementById('pK2_OI').value = '';
  document.getElementById('pEjeK_OI').value = '';
  document.getElementById('pPio_OD').value = '';
  document.getElementById('pPio_OI').value = '';
  document.getElementById('pAvSc_OD').value = '';
  document.getElementById('pAvSc_OI').value = '';
  document.getElementById('pEsLenteContacto').value = 'No';
  document.getElementById('pFechaReemplazoLC').value = '';
  document.querySelectorAll('.symptom-cb').forEach(cb => cb.checked = false);

  const drawer = document.getElementById('cabinetDrawer');
  if (drawer) drawer.classList.remove('open');
  const icon = document.getElementById('cabinetToggleIcon');
  if (icon) icon.textContent = '▼';
}

function populateArmazonSelectInPatientModal(currentVal) {
  const select = document.getElementById('rxArmazonSelect');
  if (!select) return;

  let html = '<option value="">-- Seleccionar del Inventario (Opcional) --</option>';
  AppState.inventory.forEach(item => {
    const isSel = currentVal && currentVal.includes(item.codigo);
    const stockBadge = item.stock > 0 ? `Stock: ${item.stock}` : 'AGOTADO';
    html += `<option value="${item.id}" ${isSel ? 'selected' : ''}>[${item.codigo}] ${escapeHtml(item.marca)} ${escapeHtml(item.modelo || '')} (${escapeHtml(item.color || 'N/A')}) - ${stockBadge} - $${item.precio}</option>`;
  });
  select.innerHTML = html;
}

function handlePatientArmazonSelectChange() {
  const select = document.getElementById('rxArmazonSelect');
  const itemId = select.value;
  if (!itemId) return;

  const item = AppState.inventory.find(i => i.id === itemId);
  if (item) {
    document.getElementById('rxArmazon').value = `${item.marca} ${item.modelo || ''} (${item.codigo}) ${item.color || ''}`.trim();
  }
}

function fillPatientForm(p) {
  document.getElementById('patientFormTitle').textContent = 'Editar: ' + p.nombre;
  document.getElementById('pNombre').value = p.nombre || '';
  document.getElementById('pTelefono').value = p.telefono || '';
  document.getElementById('pEdad').value = p.edad || '';
  document.getElementById('pOcupacion').value = p.ocupacion || '';
  document.getElementById('pAntecedentes').value = p.antecedentes || '';

  const rx = p.rx || {};
  const od = rx.od || {};
  const oi = rx.oi || {};

  document.getElementById('rxOdEsf').value = od.esf || '';
  document.getElementById('rxOdCil').value = od.cil || '';
  document.getElementById('rxOdEje').value = od.eje || '';
  document.getElementById('rxOdAdd').value = od.add || '';
  document.getElementById('rxOdDp').value = od.dp || '';
  document.getElementById('rxOdAv').value = od.av || '20/20';

  document.getElementById('rxOiEsf').value = oi.esf || '';
  document.getElementById('rxOiCil').value = oi.cil || '';
  document.getElementById('rxOiEje').value = oi.eje || '';
  document.getElementById('rxOiAdd').value = oi.add || '';
  document.getElementById('rxOiDp').value = oi.dp || '';
  document.getElementById('rxOiAv').value = oi.av || '20/20';

  document.getElementById('rxTipoMica').value = rx.tipoMica || 'Monofocal';
  document.getElementById('rxMaterial').value = rx.material || 'Policarbonato';
  document.getElementById('rxArmazon').value = rx.armazon || '';
  populateArmazonSelectInPatientModal(rx.armazon || '');
  document.getElementById('rxObservaciones').value = rx.observaciones || '';

  const treatments = rx.tratamientos || [];
  document.querySelectorAll('.treatment-cb').forEach(cb => {
    cb.checked = treatments.includes(cb.value);
  });

  // Gabinete clínico extendido
  const gab = p.gabinete || {};
  document.getElementById('pK1_OD').value = gab.k1_od || '';
  document.getElementById('pK2_OD').value = gab.k2_od || '';
  document.getElementById('pEjeK_OD').value = gab.ejeK_od || '';
  document.getElementById('pK1_OI').value = gab.k1_oi || '';
  document.getElementById('pK2_OI').value = gab.k2_oi || '';
  document.getElementById('pEjeK_OI').value = gab.ejeK_oi || '';
  document.getElementById('pPio_OD').value = gab.pio_od || '';
  document.getElementById('pPio_OI').value = gab.pio_oi || '';
  document.getElementById('pAvSc_OD').value = gab.avSc_od || '';
  document.getElementById('pAvSc_OI').value = gab.avSc_oi || '';
  document.getElementById('pEsLenteContacto').value = gab.esLenteContacto || 'No';
  document.getElementById('pFechaReemplazoLC').value = gab.fechaReemplazoLC || '';

  const sintomas = gab.sintomas || [];
  document.querySelectorAll('.symptom-cb').forEach(cb => {
    cb.checked = sintomas.includes(cb.value);
  });
}

function savePatientFromForm(e) {
  e.preventDefault();

  const nombre = document.getElementById('pNombre').value.trim();
  if (!nombre) {
    showToast('El nombre del paciente es obligatorio', 'error');
    return;
  }

  if (!AppState.currentEditingPatientId && !checkCanAddClient()) {
    return;
  }

  const selectedTreatments = Array.from(document.querySelectorAll('.treatment-cb:checked')).map(cb => cb.value);
  const selectedSymptoms = Array.from(document.querySelectorAll('.symptom-cb:checked')).map(cb => cb.value);

  const rxData = {
    od: {
      esf: document.getElementById('rxOdEsf').value.trim(),
      cil: document.getElementById('rxOdCil').value.trim(),
      eje: document.getElementById('rxOdEje').value.trim(),
      add: document.getElementById('rxOdAdd').value.trim(),
      dp: document.getElementById('rxOdDp').value.trim(),
      av: document.getElementById('rxOdAv').value.trim()
    },
    oi: {
      esf: document.getElementById('rxOiEsf').value.trim(),
      cil: document.getElementById('rxOiCil').value.trim(),
      eje: document.getElementById('rxOiEje').value.trim(),
      add: document.getElementById('rxOiAdd').value.trim(),
      dp: document.getElementById('rxOiDp').value.trim(),
      av: document.getElementById('rxOiAv').value.trim()
    },
    tipoMica: document.getElementById('rxTipoMica').value,
    material: document.getElementById('rxMaterial').value,
    tratamientos: selectedTreatments,
    armazon: document.getElementById('rxArmazon').value.trim(),
    observaciones: document.getElementById('rxObservaciones').value.trim()
  };

  const gabineteData = {
    k1_od: document.getElementById('pK1_OD').value.trim(),
    k2_od: document.getElementById('pK2_OD').value.trim(),
    ejeK_od: document.getElementById('pEjeK_OD').value.trim(),
    k1_oi: document.getElementById('pK1_OI').value.trim(),
    k2_oi: document.getElementById('pK2_OI').value.trim(),
    ejeK_oi: document.getElementById('pEjeK_OI').value.trim(),
    pio_od: document.getElementById('pPio_OD').value.trim(),
    pio_oi: document.getElementById('pPio_OI').value.trim(),
    avSc_od: document.getElementById('pAvSc_OD').value.trim(),
    avSc_oi: document.getElementById('pAvSc_OI').value.trim(),
    sintomas: selectedSymptoms,
    esLenteContacto: document.getElementById('pEsLenteContacto').value,
    fechaReemplazoLC: document.getElementById('pFechaReemplazoLC').value
  };

  if (AppState.currentEditingPatientId) {
    const idx = AppState.patients.findIndex(p => p.id === AppState.currentEditingPatientId);
    if (idx !== -1) {
      AppState.patients[idx] = Object.assign(AppState.patients[idx], {
        nombre,
        telefono: document.getElementById('pTelefono').value.trim(),
        edad: document.getElementById('pEdad').value.trim(),
        ocupacion: document.getElementById('pOcupacion').value.trim(),
        antecedentes: document.getElementById('pAntecedentes').value.trim(),
        rx: rxData,
        gabinete: gabineteData
      });
      showToast('Paciente actualizado correctamente', 'success');
    }
  } else {
    const nextNum = AppState.patients.length + 101;
    const newPatient = {
      id: 'p-' + Date.now(),
      folio: 'PAC-' + nextNum,
      nombre,
      telefono: document.getElementById('pTelefono').value.trim(),
      edad: document.getElementById('pEdad').value.trim(),
      ocupacion: document.getElementById('pOcupacion').value.trim(),
      antecedentes: document.getElementById('pAntecedentes').value.trim(),
      fechaRegistro: new Date().toISOString().split('T')[0],
      rx: rxData,
      gabinete: gabineteData
    };
    AppState.patients.unshift(newPatient);
    showToast('Paciente registrado correctamente', 'success');
  }

  saveData('patients');
  closeModal('modalPaciente');
  renderLicenseBadge();
  renderPatientsList();
  renderDashboard();
}

// ==========================================================================
// ÓRDENES DE TRABAJO, COSTOS DE LABORATORIO Y MARGEN REAL
// ==========================================================================
function renderOrdersList() {
  const container = document.getElementById('ordersListContainer');
  if (!container) return;

  let filtered = AppState.orders;
  if (AppState.currentOrderFilter !== 'todos') {
    filtered = filtered.filter(o => o.estatus === AppState.currentOrderFilter);
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: var(--text-tertiary);">
        <p>No hay órdenes en esta categoría.</p>
        <button class="btn-primary" style="margin: 16px auto; max-width: 220px;" onclick="promptNewOrder()">
          + Crear Nueva Orden
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(order => {
    const ganancia = (order.total || 0) - (order.costoLab || 0) - (order.costoArmazon || 0);

    return `
      <div class="patient-card">
        <div class="patient-card-header">
          <div class="patient-info-meta" style="margin-left: 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="font-family: monospace; font-weight: 800; color: var(--accent-cyan);">${order.folio}</span>
              <div>
                ${order.inventoryItemId ? `<span style="font-size: 0.68rem; background: rgba(0, 180, 216, 0.15); color: var(--accent-cyan); padding: 2px 7px; border-radius: 6px; font-weight: 700; margin-right: 6px;">📦 Stock Descontado</span>` : ''}
                <span class="badge-status badge-${order.estatus}">${order.estatus}</span>
              </div>
            </div>
            <div class="patient-name">${escapeHtml(order.patientName)}</div>
            <div class="patient-sub">
              <span>📅 Promesa: ${formatDate(order.fechaPrometida)}</span>
              <span>•</span>
              <span>📞 ${order.telefono || 'Sin tel'}</span>
              ${order.asesor ? `<span>• 👤 ${escapeHtml(order.asesor)}</span>` : ''}
            </div>
          </div>
        </div>

        <div style="background: rgba(11, 19, 43, 0.6); border-radius: 10px; padding: 10px; margin: 8px 0; font-size: 0.8rem;">
          <div style="color: #fff; margin-bottom: 4px;"><strong>Trabajo:</strong> ${escapeHtml(order.descripcion)}</div>
          <div style="color: var(--text-secondary); display: flex; justify-content: space-between;">
            <span><strong>Lab:</strong> ${escapeHtml(order.laboratorio || 'Taller Interno')}</span>
            ${(order.costoLab || order.costoArmazon) ? `<span style="color: var(--accent-cyan);">Margen: <strong>$${ganancia.toFixed(2)}</strong></span>` : ''}
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; background: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 8px; text-align: center; margin-bottom: 10px;">
          <div>
            <div style="font-size: 0.68rem; color: var(--text-tertiary);">TOTAL</div>
            <div style="font-weight: 800; color: #fff;">$${order.total}</div>
          </div>
          <div>
            <div style="font-size: 0.68rem; color: var(--text-tertiary);">ANTICIPO</div>
            <div style="font-weight: 800; color: var(--success);">$${order.anticipo || 0}</div>
          </div>
          <div>
            <div style="font-size: 0.68rem; color: var(--text-tertiary);">SALDO</div>
            <div style="font-weight: 800; color: ${order.saldo > 0 ? 'var(--warning)' : '#94A3B8'};">$${order.saldo || 0}</div>
          </div>
        </div>

        <div class="patient-card-footer">
          <button class="btn-card-action" onclick="printOrderTicket('${order.id}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 6 2 18 2 18 9"/>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
              <rect x="6" y="14" width="12" height="8"/>
            </svg>
            Recibo
          </button>
          ${order.saldo > 0 ? `
            <button class="btn-card-action primary" onclick="openAbonoModal('${order.id}')">
              💵 Abonar
            </button>
          ` : ''}
          <button class="btn-card-action" onclick="openEditOrderModal('${order.id}')">
            Estatus
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function populateInventorySelectInOrderModal(selectedItemId) {
  const select = document.getElementById('ordArmazonSelect');
  if (!select) return;

  let html = '<option value="">-- Sin armazón / Armazón propio del cliente --</option>';
  AppState.inventory.forEach(item => {
    const isSel = item.id === selectedItemId;
    const stockBadge = item.stock > 0 ? `Stock: ${item.stock}` : '⚠️ AGOTADO (0)';
    html += `<option value="${item.id}" ${isSel ? 'selected' : ''}>[${item.codigo}] ${escapeHtml(item.marca)} ${escapeHtml(item.modelo || '')} - ${stockBadge} - $${item.precio} (Costo: $${item.costo})</option>`;
  });
  select.innerHTML = html;
  updateOrderArmazonStockInfo(selectedItemId);
}

function updateOrderArmazonStockInfo(itemId) {
  const infoEl = document.getElementById('ordArmazonStockInfo');
  if (!infoEl) return;

  if (!itemId) {
    infoEl.style.display = 'none';
    infoEl.innerHTML = '';
    return;
  }

  const item = AppState.inventory.find(i => i.id === itemId);
  if (!item) {
    infoEl.style.display = 'none';
    return;
  }

  infoEl.style.display = 'block';
  if (item.stock > 0) {
    infoEl.innerHTML = `📦 <strong>${escapeHtml(item.marca)} ${escapeHtml(item.modelo || '')}</strong>: ${item.stock} en existencia | Costo: <strong>$${item.costo}</strong> | Precio venta: <strong>$${item.precio}</strong>`;
    infoEl.style.color = 'var(--accent-cyan)';
  } else {
    infoEl.innerHTML = `⚠️ <strong>${escapeHtml(item.marca)} ${escapeHtml(item.modelo || '')}</strong>: Sin existencias en stock (0 piezas).`;
    infoEl.style.color = 'var(--warning)';
  }
}

function handleOrderArmazonSelectChange() {
  const itemId = document.getElementById('ordArmazonSelect').value;
  updateOrderArmazonStockInfo(itemId);

  if (itemId) {
    const item = AppState.inventory.find(i => i.id === itemId);
    if (item) {
      document.getElementById('ordCostoArmazon').value = item.costo;

      // Si el total está vacío o es 0, sugerir el precio de venta del armazón
      const totalEl = document.getElementById('ordTotal');
      if (!totalEl.value || parseFloat(totalEl.value) === 0) {
        totalEl.value = item.precio;
      }

      // Actualizar descripción
      const descEl = document.getElementById('ordDescripcion');
      const frameTag = `Armazón: ${item.marca} ${item.modelo || ''} (${item.codigo})`;
      if (descEl.value.includes('Armazón:')) {
        descEl.value = descEl.value.replace(/Armazón:[^,\n+]*/i, frameTag);
      } else if (descEl.value.trim()) {
        descEl.value += ` + ${frameTag}`;
      } else {
        descEl.value = frameTag;
      }

      calculateOrderBalance();
    }
  } else {
    document.getElementById('ordCostoArmazon').value = 0;
    calculateOrderBalance();
  }
}

function promptNewOrder() {
  populatePatientSelectInOrderModal();
  populateAdvisorsInOrderModal();
  populateInventorySelectInOrderModal('');
  resetOrderForm();
  openModal('modalOrden');
}

function promptNewOrderForPatient(patientId) {
  populatePatientSelectInOrderModal();
  populateAdvisorsInOrderModal();
  resetOrderForm();
  document.getElementById('ordPatientSelect').value = patientId;

  // Si el paciente tiene un armazón que coincide con inventario, preseleccionarlo
  const patient = AppState.patients.find(p => p.id === patientId);
  let matchedItemId = '';
  if (patient && patient.rx && patient.rx.armazon) {
    const matched = AppState.inventory.find(i => patient.rx.armazon.includes(i.codigo) || (patient.rx.armazon.toLowerCase().includes(i.marca.toLowerCase()) && patient.rx.armazon.toLowerCase().includes(i.modelo.toLowerCase())));
    if (matched) matchedItemId = matched.id;
  }

  populateInventorySelectInOrderModal(matchedItemId);
  if (matchedItemId) {
    document.getElementById('ordArmazonSelect').value = matchedItemId;
    handleOrderArmazonSelectChange();
  }

  handlePatientSelectChange();
  openModal('modalOrden');
}

function populatePatientSelectInOrderModal() {
  const select = document.getElementById('ordPatientSelect');
  select.innerHTML = '<option value="">-- Selecciona un Paciente --</option>' +
    AppState.patients.map(p => `
      <option value="${p.id}">${escapeHtml(p.nombre)} (${p.folio})</option>
    `).join('');
}

function populateAdvisorsInOrderModal() {
  const select = document.getElementById('ordAsesor');
  if (!select) return;
  const advisors = (AppState.settings.asesores && AppState.settings.asesores.length > 0)
    ? AppState.settings.asesores
    : ['General / Sucursal'];

  select.innerHTML = advisors.map(a => `<option value="${escapeHtml(a)}">${escapeHtml(a)}</option>`).join('');
}

function handlePatientSelectChange() {
  const patientId = document.getElementById('ordPatientSelect').value;
  const patient = AppState.patients.find(p => p.id === patientId);
  if (!patient) return;

  const rx = patient.rx || {};
  let desc = `${rx.tipoMica || 'Monofocal'} ${rx.material || 'CR-39'}`;
  if (rx.tratamientos && rx.tratamientos.length > 0) {
    desc += ` con ${rx.tratamientos.join(', ')}`;
  }
  if (rx.armazon) {
    desc += ` + Armazón: ${rx.armazon}`;
    // Intentar auto-seleccionar en ordArmazonSelect si no hay uno seleccionado
    const currentSelectVal = document.getElementById('ordArmazonSelect').value;
    if (!currentSelectVal) {
      const matched = AppState.inventory.find(i => rx.armazon.includes(i.codigo) || (rx.armazon.toLowerCase().includes(i.marca.toLowerCase()) && rx.armazon.toLowerCase().includes(i.modelo.toLowerCase())));
      if (matched) {
        document.getElementById('ordArmazonSelect').value = matched.id;
        updateOrderArmazonStockInfo(matched.id);
        document.getElementById('ordCostoArmazon').value = matched.costo;
        calculateOrderBalance();
      }
    }
  }

  document.getElementById('ordDescripcion').value = desc;
}

function resetOrderForm() {
  AppState.currentEditingOrderId = null;
  document.getElementById('ordFolio').value = 'ORD-' + (AppState.orders.length + 1001);
  document.getElementById('ordFechaPedido').value = new Date().toISOString().split('T')[0];
  
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + (AppState.settings.diasEntrega || 3));
  document.getElementById('ordFechaPrometida').value = deliveryDate.toISOString().split('T')[0];
  
  document.getElementById('ordLaboratorio').value = 'Laboratorio Óptico Central';
  document.getElementById('ordDescripcion').value = '';
  document.getElementById('ordTotal').value = '';
  document.getElementById('ordAnticipo').value = '';
  document.getElementById('ordAnticipoMetodo').value = 'Efectivo';
  document.getElementById('ordCostoLab').value = '';
  document.getElementById('ordCostoArmazon').value = '';
  document.getElementById('ordEstatus').value = 'taller';
  document.getElementById('ordArmazonSelect').value = '';
  updateOrderArmazonStockInfo('');

  calculateOrderBalance();
}

function calculateOrderBalance() {
  const total = parseFloat(document.getElementById('ordTotal').value) || 0;
  const anticipo = parseFloat(document.getElementById('ordAnticipo').value) || 0;
  const costoLab = parseFloat(document.getElementById('ordCostoLab').value) || 0;
  const costoArmazon = parseFloat(document.getElementById('ordCostoArmazon').value) || 0;

  const saldo = Math.max(0, total - anticipo);
  const ganancia = total - costoLab - costoArmazon;
  const margenPct = total > 0 ? ((ganancia / total) * 100).toFixed(1) : 0;

  const saldoEl = document.getElementById('ordSaldoCalc');
  if (saldoEl) saldoEl.textContent = `$${saldo.toFixed(2)}`;

  const gananciaEl = document.getElementById('ordGananciaCalc');
  if (gananciaEl) {
    gananciaEl.textContent = `$${ganancia.toFixed(2)} (${margenPct}%)`;
    gananciaEl.style.color = ganancia >= 0 ? 'var(--success)' : 'var(--danger)';
  }
}

function saveOrderFromForm(e) {
  e.preventDefault();

  const patientId = document.getElementById('ordPatientSelect').value;
  if (!patientId) {
    showToast('Debes seleccionar un paciente', 'error');
    return;
  }

  const patient = AppState.patients.find(p => p.id === patientId);
  const total = parseFloat(document.getElementById('ordTotal').value) || 0;
  const anticipo = parseFloat(document.getElementById('ordAnticipo').value) || 0;
  const costoLab = parseFloat(document.getElementById('ordCostoLab').value) || 0;
  const costoArmazon = parseFloat(document.getElementById('ordCostoArmazon').value) || 0;
  const saldo = Math.max(0, total - anticipo);
  const asesor = document.getElementById('ordAsesor').value || 'General';
  const anticipoMetodo = document.getElementById('ordAnticipoMetodo').value || 'Efectivo';
  const inventoryItemId = document.getElementById('ordArmazonSelect').value || null;
  const newStatus = document.getElementById('ordEstatus').value;

  if (AppState.currentEditingOrderId) {
    const idx = AppState.orders.findIndex(o => o.id === AppState.currentEditingOrderId);
    if (idx !== -1) {
      const existingOrder = AppState.orders[idx];
      const prevItemId = existingOrder.inventoryItemId;
      const prevStockDescontado = existingOrder.stockDescontado;

      // 1. Si la orden se cancela y se había descontado stock -> Devolverlo al inventario
      if (newStatus === 'cancelado' && prevStockDescontado && prevItemId) {
        const prevItem = AppState.inventory.find(i => i.id === prevItemId);
        if (prevItem) {
          prevItem.stock += 1;
          saveData('inventory');
          renderInventoryList();
          showToast(`📦 Armazón devuelto a inventario por cancelación (${prevItem.marca}). Stock: ${prevItem.stock}`, 'info');
        }
        existingOrder.stockDescontado = false;
      }
      // 2. Si se reactiva una orden que estaba cancelada
      else if (existingOrder.estatus === 'cancelado' && newStatus !== 'cancelado' && inventoryItemId) {
        const item = AppState.inventory.find(i => i.id === inventoryItemId);
        if (item) {
          item.stock = Math.max(0, item.stock - 1);
          saveData('inventory');
          renderInventoryList();
          showToast(`📦 Armazón descontado del inventario (${item.marca}). Stock restante: ${item.stock}`, 'success');
        }
        existingOrder.stockDescontado = true;
      }
      // 3. Si se cambió de armazón en la orden
      else if (prevItemId !== inventoryItemId && newStatus !== 'cancelado') {
        if (prevStockDescontado && prevItemId) {
          const prevItem = AppState.inventory.find(i => i.id === prevItemId);
          if (prevItem) prevItem.stock += 1;
        }
        if (inventoryItemId) {
          const newItem = AppState.inventory.find(i => i.id === inventoryItemId);
          if (newItem) {
            newItem.stock = Math.max(0, newItem.stock - 1);
            showToast(`📦 Armazón descontado de inventario (${newItem.marca}). Stock restante: ${newItem.stock}`, 'success');
          }
          existingOrder.stockDescontado = true;
        } else {
          existingOrder.stockDescontado = false;
        }
        saveData('inventory');
        renderInventoryList();
      }

      AppState.orders[idx] = Object.assign(existingOrder, {
        laboratorio: document.getElementById('ordLaboratorio').value.trim(),
        asesor,
        inventoryItemId,
        descripcion: document.getElementById('ordDescripcion').value.trim(),
        fechaPrometida: document.getElementById('ordFechaPrometida').value,
        total,
        anticipo,
        costoLab,
        costoArmazon,
        saldo,
        estatus: newStatus
      });
      showToast('Orden actualizada correctamente', 'success');
    }
  } else {
    // NUEVA ORDEN: Descontar 1 unidad del inventario
    let stockDescontado = false;
    if (inventoryItemId && newStatus !== 'cancelado') {
      const item = AppState.inventory.find(i => i.id === inventoryItemId);
      if (item) {
        item.stock = Math.max(0, item.stock - 1);
        stockDescontado = true;
        saveData('inventory');
        renderInventoryList();
        showToast(`📦 1 armazón descontado de inventario (${item.marca} ${item.modelo}). Stock restante: ${item.stock}`, 'success');
      }
    }

    const newOrder = {
      id: 'ord-' + Date.now(),
      folio: document.getElementById('ordFolio').value.trim(),
      patientId: patient.id,
      patientName: patient.nombre,
      telefono: patient.telefono,
      fechaPedido: document.getElementById('ordFechaPedido').value,
      fechaPrometida: document.getElementById('ordFechaPrometida').value,
      laboratorio: document.getElementById('ordLaboratorio').value.trim(),
      asesor,
      inventoryItemId,
      stockDescontado,
      descripcion: document.getElementById('ordDescripcion').value.trim(),
      total,
      anticipo,
      costoLab,
      costoArmazon,
      saldo,
      estatus: newStatus,
      abonos: anticipo > 0 ? [{
        fecha: new Date().toISOString().split('T')[0],
        monto: anticipo,
        metodo: anticipoMetodo
      }] : []
    };
    AppState.orders.unshift(newOrder);
    showToast('Orden de trabajo registrada', 'success');
  }

  saveData('orders');
  closeModal('modalOrden');
  renderOrdersList();
  renderDashboard();
  if (AppState.activeTab === 'caja') renderCajaView();
}

function openEditOrderModal(orderId) {
  const order = AppState.orders.find(o => o.id === orderId);
  if (!order) return;

  AppState.currentEditingOrderId = orderId;
  populatePatientSelectInOrderModal();
  populateAdvisorsInOrderModal();
  populateInventorySelectInOrderModal(order.inventoryItemId || '');

  document.getElementById('ordPatientSelect').value = order.patientId;
  document.getElementById('ordFolio').value = order.folio;
  document.getElementById('ordFechaPedido').value = order.fechaPedido;
  document.getElementById('ordFechaPrometida').value = order.fechaPrometida;
  document.getElementById('ordLaboratorio').value = order.laboratorio || '';
  if (order.asesor) document.getElementById('ordAsesor').value = order.asesor;
  if (order.inventoryItemId) document.getElementById('ordArmazonSelect').value = order.inventoryItemId;
  updateOrderArmazonStockInfo(order.inventoryItemId || '');

  document.getElementById('ordDescripcion').value = order.descripcion;
  document.getElementById('ordTotal').value = order.total;
  document.getElementById('ordAnticipo').value = order.anticipo || 0;
  document.getElementById('ordCostoLab').value = order.costoLab || 0;
  document.getElementById('ordCostoArmazon').value = order.costoArmazon || 0;
  document.getElementById('ordEstatus').value = order.estatus;

  calculateOrderBalance();
  openModal('modalOrden');
}

// ==========================================================================
// REGISTRAR ABONO / PAGO
// ==========================================================================
let currentAbonoOrderId = null;

function openAbonoModal(orderId) {
  const order = AppState.orders.find(o => o.id === orderId);
  if (!order) return;

  currentAbonoOrderId = orderId;
  document.getElementById('abonoOrderFolio').textContent = order.folio + ' - ' + order.patientName;
  document.getElementById('abonoSaldoActual').textContent = `$${order.saldo}`;
  document.getElementById('abonoMontoInput').value = order.saldo;
  document.getElementById('abonoMontoInput').max = order.saldo;
  
  openModal('modalAbono');
}

function saveAbonoFromModal(e) {
  e.preventDefault();
  const order = AppState.orders.find(o => o.id === currentAbonoOrderId);
  if (!order) return;

  const monto = parseFloat(document.getElementById('abonoMontoInput').value) || 0;
  const metodo = document.getElementById('abonoMetodoSelect').value;

  if (monto <= 0) {
    showToast('El monto debe ser mayor a cero', 'error');
    return;
  }

  order.abonos = order.abonos || [];
  order.abonos.push({
    fecha: new Date().toISOString().split('T')[0],
    monto,
    metodo
  });

  order.anticipo = (order.anticipo || 0) + monto;
  order.saldo = Math.max(0, order.total - order.anticipo);

  if (order.saldo === 0 && order.estatus === 'listo') {
    order.estatus = 'entregado';
  }

  saveData('orders');
  closeModal('modalAbono');
  showToast(`💵 ¡Abono de $${monto.toFixed(2)} registrado!`, 'success');
  renderOrdersList();
  renderDashboard();
  if (AppState.activeTab === 'caja') renderCajaView();
}

// ==========================================================================
// CORTE DE CAJA, ARQUEO DE EFECTIVO Y FINANZAS
// ==========================================================================
function renderCajaView() {
  const fechaInput = document.getElementById('cajaFechaFiltro');
  const selectedDate = (fechaInput && fechaInput.value) ? fechaInput.value : new Date().toISOString().split('T')[0];
  if (fechaInput && !fechaInput.value) fechaInput.value = selectedDate;

  // 1. Recolectar abonos en la fecha seleccionada
  const cobrosHoy = [];
  AppState.orders.forEach(order => {
    (order.abonos || []).forEach(abono => {
      if (abono.fecha === selectedDate) {
        cobrosHoy.push({
          orderId: order.id,
          folio: order.folio,
          patientName: order.patientName,
          monto: parseFloat(abono.monto) || 0,
          metodo: abono.metodo || 'Efectivo'
        });
      }
    });
  });

  const totalCobrado = cobrosHoy.reduce((acc, c) => acc + c.monto, 0);
  const cobrosEfectivo = cobrosHoy
    .filter(c => c.metodo.toLowerCase().includes('efectivo') || c.metodo.toLowerCase().includes('anticipo'))
    .reduce((acc, c) => acc + c.monto, 0);
  const cobrosTarjeta = cobrosHoy
    .filter(c => c.metodo.toLowerCase().includes('tarjeta') || c.metodo.toLowerCase().includes('débito') || c.metodo.toLowerCase().includes('crédito'))
    .reduce((acc, c) => acc + c.monto, 0);
  const cobrosTransfer = cobrosHoy
    .filter(c => c.metodo.toLowerCase().includes('transfer') || c.metodo.toLowerCase().includes('spei'))
    .reduce((acc, c) => acc + c.monto, 0);

  // 2. Recolectar gastos en la fecha seleccionada
  const gastosHoy = AppState.expenses.filter(e => e.fecha === selectedDate);
  const totalGastos = gastosHoy.reduce((acc, e) => acc + (parseFloat(e.monto) || 0), 0);

  // 3. Arqueo de efectivo
  const fondoInicial = parseFloat(AppState.settings.fondoInicialCaja) || 500;
  const efectivoEsperado = Math.max(0, fondoInicial + cobrosEfectivo - totalGastos);

  // 4. Ganancia bruta estimada de órdenes creadas en esta fecha
  const ordenesHoy = AppState.orders.filter(o => o.fechaPedido === selectedDate);
  const gananciaBruta = ordenesHoy.reduce((acc, o) => {
    const total = o.total || 0;
    const lab = o.costoLab || 0;
    const armazon = o.costoArmazon || 0;
    return acc + (total - lab - armazon);
  }, 0);

  // 5. Inyectar datos en tarjetas superiores
  const esperadEl = document.getElementById('cajaEfectivoEsperado');
  if (esperadEl) esperadEl.textContent = `$${efectivoEsperado.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const fondoSubEl = document.getElementById('cajaFondoSubtext');
  if (fondoSubEl) fondoSubEl.textContent = `Fondo inicial: $${fondoInicial.toFixed(2)}`;

  const totCobEl = document.getElementById('cajaTotalCobrado');
  if (totCobEl) totCobEl.textContent = `$${totalCobrado.toFixed(2)}`;

  const efCobEl = document.getElementById('cajaCobrosEfectivo');
  if (efCobEl) efCobEl.textContent = `$${cobrosEfectivo.toFixed(2)}`;

  const tarjCobEl = document.getElementById('cajaCobrosTarjeta');
  if (tarjCobEl) tarjCobEl.textContent = `$${cobrosTarjeta.toFixed(2)}`;

  const transCobEl = document.getElementById('cajaCobrosTransfer');
  if (transCobEl) transCobEl.textContent = `$${cobrosTransfer.toFixed(2)}`;

  const totGastEl = document.getElementById('cajaTotalGastos');
  if (totGastEl) totGastEl.textContent = `-$${totalGastos.toFixed(2)}`;

  const ganBrutEl = document.getElementById('cajaGananciaBruta');
  if (ganBrutEl) ganBrutEl.textContent = `$${gananciaBruta.toFixed(2)}`;

  // Renderizar la subpestaña activa
  renderActiveCajaSubtab(selectedDate, cobrosHoy, gastosHoy);
}

function switchCajaSubtab(subtabName) {
  AppState.currentCajaSubtab = subtabName;

  document.querySelectorAll('.caja-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.subtab === subtabName);
  });

  const panes = ['movimientos', 'comisiones', 'proveedores', 'historial'];
  panes.forEach(p => {
    const paneEl = document.getElementById(`cajaSubtab${p.charAt(0).toUpperCase() + p.slice(1)}`);
    if (paneEl) paneEl.style.display = (p === subtabName) ? 'block' : 'none';
  });

  renderCajaView();
}

function renderActiveCajaSubtab(selectedDate, cobrosHoy, gastosHoy) {
  // Pestaña 1: Movimientos
  if (AppState.currentCajaSubtab === 'movimientos') {
    const cobrosContainer = document.getElementById('cajaCobrosHoyList');
    if (cobrosContainer) {
      if (cobrosHoy.length === 0) {
        cobrosContainer.innerHTML = `<div style="text-align: center; padding: 14px; font-size: 0.8rem; color: var(--text-tertiary);">No hay cobros registrados en esta fecha.</div>`;
      } else {
        cobrosContainer.innerHTML = cobrosHoy.map(c => `
          <div class="caja-movement-item">
            <div style="flex: 1;">
              <div style="font-weight: 700; color: #fff;">${escapeHtml(c.patientName)}</div>
              <div style="font-size: 0.75rem; color: var(--text-secondary);">${c.folio} • <span style="color: var(--accent-cyan);">${escapeHtml(c.metodo)}</span></div>
            </div>
            <div style="font-weight: 800; color: var(--success); font-size: 1rem;">+$${c.monto.toFixed(2)}</div>
          </div>
        `).join('');
      }
    }

    const gastosContainer = document.getElementById('cajaGastosHoyList');
    if (gastosContainer) {
      if (gastosHoy.length === 0) {
        gastosContainer.innerHTML = `<div style="text-align: center; padding: 14px; font-size: 0.8rem; color: var(--text-tertiary);">No hay gastos registrados en esta fecha.</div>`;
      } else {
        gastosContainer.innerHTML = gastosHoy.map(g => `
          <div class="caja-movement-item" style="border-left: 3px solid var(--danger);">
            <div style="flex: 1;">
              <div style="font-weight: 700; color: #fff;">${escapeHtml(g.concepto)}</div>
              <div style="font-size: 0.75rem; color: var(--text-secondary);">${escapeHtml(g.categoria || 'Gasto Operativo')}</div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <div style="font-weight: 800; color: var(--danger); font-size: 0.95rem;">-$${parseFloat(g.monto).toFixed(2)}</div>
              <button class="icon-btn-sm" title="Eliminar gasto" onclick="deleteExpense('${g.id}')" style="color: var(--danger);">✕</button>
            </div>
          </div>
        `).join('');
      }
    }
  }

  // Pestaña 2: Comisiones por Asesor
  if (AppState.currentCajaSubtab === 'comisiones') {
    const comisionesContainer = document.getElementById('cajaComisionesContainer');
    if (!comisionesContainer) return;

    const advisors = AppState.settings.asesores || ['Laura Morales', 'Carlos Gómez', 'Alejandro Ramos'];
    const comisionPct = parseFloat(AppState.settings.comisionPorcentaje) || 3;

    let html = `
      <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
        <span>Comisión configurada: <strong>${comisionPct}%</strong> sobre ventas</span>
        <button class="btn-text" style="color: var(--primary); font-size: 0.75rem;" onclick="switchTab('ajustes')">Modificar %</button>
      </div>
    `;

    advisors.forEach(advisor => {
      const orders = AppState.orders.filter(o => (o.asesor === advisor || (!o.asesor && advisor === 'Laura Morales')) && o.estatus !== 'cancelado');
      const totalVendido = orders.reduce((acc, o) => acc + (o.total || 0), 0);
      const totalComision = totalVendido * (comisionPct / 100);

      html += `
        <div class="patient-card" style="margin-bottom: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <div class="patient-avatar" style="width: 32px; height: 32px; font-size: 0.8rem;">${advisor.charAt(0)}</div>
              <div>
                <div style="font-weight: 700; color: #fff;">${escapeHtml(advisor)}</div>
                <div style="font-size: 0.72rem; color: var(--text-secondary);">${orders.length} venta${orders.length === 1 ? '' : 's'} registradas</div>
              </div>
            </div>
            <span class="badge-status badge-listo" style="font-size: 0.75rem;">${comisionPct}%</span>
          </div>

          <div style="display: flex; justify-content: space-between; background: rgba(0,0,0,0.25); border-radius: 8px; padding: 8px 12px; font-size: 0.85rem;">
            <div>
              <span style="color: var(--text-tertiary); font-size: 0.72rem;">TOTAL VENDIDO:</span>
              <div style="font-weight: 800; color: #fff;">$${totalVendido.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
            </div>
            <div style="text-align: right;">
              <span style="color: var(--success); font-size: 0.72rem; font-weight: 700;">COMISIÓN GANADA:</span>
              <div style="font-weight: 800; color: var(--success); font-size: 1.05rem;">$${totalComision.toFixed(2)}</div>
            </div>
          </div>
        </div>
      `;
    });

    comisionesContainer.innerHTML = html;
  }

  // Pestaña 3: Cuentas por pagar a Laboratorios Externos
  if (AppState.currentCajaSubtab === 'proveedores') {
    const provContainer = document.getElementById('cajaProveedoresContainer');
    if (!provContainer) return;

    // Agrupar órdenes con costo de laboratorio por nombre de laboratorio
    const labGroups = {};
    AppState.orders.forEach(o => {
      const labName = o.laboratorio || 'Laboratorio Externo General';
      const cost = parseFloat(o.costoLab) || 0;
      if (!labGroups[labName]) {
        labGroups[labName] = { count: 0, totalCost: 0, orders: [] };
      }
      labGroups[labName].count++;
      labGroups[labName].totalCost += cost;
      labGroups[labName].orders.push(o);
    });

    let html = `
      <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 12px;">
        Control de maquila y costos acumulados por laboratorio externo para liquidación semanal o mensual:
      </div>
    `;

    for (const [lab, data] of Object.entries(labGroups)) {
      html += `
        <div class="patient-card" style="margin-bottom: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div>
              <div style="font-weight: 700; color: #fff; font-size: 0.95rem;">🔬 ${escapeHtml(lab)}</div>
              <div style="font-size: 0.75rem; color: var(--text-secondary);">${data.count} trabajo${data.count === 1 ? '' : 's'} enviados</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 0.7rem; color: var(--text-tertiary);">MAQUILA POR PAGAR</div>
              <div style="font-size: 1.1rem; font-weight: 800; color: var(--gold);">$${data.totalCost.toFixed(2)}</div>
            </div>
          </div>

          <div style="font-size: 0.75rem; color: var(--text-secondary); border-top: 1px dashed rgba(255,255,255,0.08); padding-top: 6px;">
            Últimos trabajos: ${data.orders.slice(0, 3).map(o => `${o.folio} (${o.patientName})`).join(', ')}
          </div>
        </div>
      `;
    }

    provContainer.innerHTML = html;
  }

  // Pestaña 4: Historial de Cortes
  if (AppState.currentCajaSubtab === 'historial') {
    const histContainer = document.getElementById('cajaHistorialContainer');
    if (!histContainer) return;

    let html = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span style="font-size: 0.8rem; color: var(--text-secondary);">Arqueos archivados en sistema:</span>
        <button class="btn-primary" style="padding: 6px 12px; font-size: 0.75rem;" onclick="saveDailyCashCutToHistory()">
          💾 Guardar Corte de Hoy
        </button>
      </div>
    `;

    if (!AppState.cashCuts || AppState.cashCuts.length === 0) {
      html += `<div style="text-align: center; padding: 30px; font-size: 0.85rem; color: var(--text-tertiary);">No hay cortes guardados en el historial.</div>`;
    } else {
      AppState.cashCuts.forEach(cut => {
        html += `
          <div class="patient-card" style="margin-bottom: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-weight: 700; color: #fff;">📅 ${formatDate(cut.fecha)} ${cut.hora ? `• ${cut.hora}` : ''}</span>
              <span class="badge-status badge-listo">Archivado</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; text-align: center; background: rgba(0,0,0,0.25); border-radius: 8px; padding: 8px; font-size: 0.75rem;">
              <div>
                <span style="color: var(--text-tertiary);">Cobrado</span>
                <div style="font-weight: 700; color: #fff;">$${(cut.totalCobrado || 0).toFixed(2)}</div>
              </div>
              <div>
                <span style="color: var(--text-tertiary);">Gastos</span>
                <div style="font-weight: 700; color: var(--danger);">-$${(cut.gastos || 0).toFixed(2)}</div>
              </div>
              <div>
                <span style="color: var(--success); font-weight: 700;">Efectivo Final</span>
                <div style="font-weight: 800; color: var(--success);">$${(cut.efectivoEsperado || 0).toFixed(2)}</div>
              </div>
            </div>
          </div>
        `;
      });
    }

    histContainer.innerHTML = html;
  }
}

function openAddExpenseModal() {
  document.getElementById('expConcepto').value = '';
  document.getElementById('expMonto').value = '';
  document.getElementById('expCategoria').value = 'Laboratorio / Taller';
  openModal('modalGasto');
}

function saveExpenseFromForm(e) {
  e.preventDefault();
  const concepto = document.getElementById('expConcepto').value.trim();
  const monto = parseFloat(document.getElementById('expMonto').value) || 0;
  const categoria = document.getElementById('expCategoria').value;

  if (!concepto || monto <= 0) {
    showToast('Ingresa un concepto y monto válido', 'error');
    return;
  }

  const fechaInput = document.getElementById('cajaFechaFiltro');
  const fecha = (fechaInput && fechaInput.value) ? fechaInput.value : new Date().toISOString().split('T')[0];

  const newExpense = {
    id: 'exp-' + Date.now(),
    fecha,
    concepto,
    monto,
    categoria
  };

  AppState.expenses.unshift(newExpense);
  saveData('expenses');
  closeModal('modalGasto');
  showToast(`📉 Gasto de $${monto.toFixed(2)} registrado en caja`, 'success');
  renderCajaView();
}

function deleteExpense(expId) {
  if (confirm('¿Deseas eliminar este registro de gasto?')) {
    AppState.expenses = AppState.expenses.filter(e => e.id !== expId);
    saveData('expenses');
    showToast('Gasto eliminado', 'info');
    renderCajaView();
  }
}

function saveDailyCashCutToHistory() {
  const fechaInput = document.getElementById('cajaFechaFiltro');
  const selectedDate = (fechaInput && fechaInput.value) ? fechaInput.value : new Date().toISOString().split('T')[0];

  // Calcular totales
  let cobrosHoy = [];
  AppState.orders.forEach(order => {
    (order.abonos || []).forEach(abono => {
      if (abono.fecha === selectedDate) {
        cobrosHoy.push({ monto: parseFloat(abono.monto) || 0, metodo: abono.metodo || 'Efectivo' });
      }
    });
  });

  const totalCobrado = cobrosHoy.reduce((acc, c) => acc + c.monto, 0);
  const efectivo = cobrosHoy.filter(c => c.metodo.toLowerCase().includes('efectivo') || c.metodo.toLowerCase().includes('anticipo')).reduce((acc, c) => acc + c.monto, 0);
  const tarjeta = cobrosHoy.filter(c => c.metodo.toLowerCase().includes('tarjeta')).reduce((acc, c) => acc + c.monto, 0);
  const transferencia = cobrosHoy.filter(c => c.metodo.toLowerCase().includes('transfer')).reduce((acc, c) => acc + c.monto, 0);

  const gastosHoy = AppState.expenses.filter(e => e.fecha === selectedDate);
  const gastos = gastosHoy.reduce((acc, e) => acc + (parseFloat(e.monto) || 0), 0);

  const fondoInicial = parseFloat(AppState.settings.fondoInicialCaja) || 500;
  const efectivoEsperado = Math.max(0, fondoInicial + efectivo - gastos);

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const cutRecord = {
    id: 'cut-' + Date.now(),
    fecha: selectedDate,
    hora: timeStr,
    totalCobrado,
    efectivo,
    tarjeta,
    transferencia,
    gastos,
    fondoInicial,
    efectivoEsperado
  };

  AppState.cashCuts.unshift(cutRecord);
  saveData('cash_cuts');
  showToast('💾 Corte de caja archivado con éxito en el Historial', 'success');
  renderCajaView();
}

function sendDailyCashCutWhatsApp() {
  const fechaInput = document.getElementById('cajaFechaFiltro');
  const selectedDate = (fechaInput && fechaInput.value) ? fechaInput.value : new Date().toISOString().split('T')[0];

  let cobrosHoy = [];
  AppState.orders.forEach(order => {
    (order.abonos || []).forEach(abono => {
      if (abono.fecha === selectedDate) {
        cobrosHoy.push({ monto: parseFloat(abono.monto) || 0, metodo: abono.metodo || 'Efectivo', patient: order.patientName, folio: order.folio });
      }
    });
  });

  const totalCobrado = cobrosHoy.reduce((acc, c) => acc + c.monto, 0);
  const efectivo = cobrosHoy.filter(c => c.metodo.toLowerCase().includes('efectivo') || c.metodo.toLowerCase().includes('anticipo')).reduce((acc, c) => acc + c.monto, 0);
  const tarjeta = cobrosHoy.filter(c => c.metodo.toLowerCase().includes('tarjeta')).reduce((acc, c) => acc + c.monto, 0);
  const transferencia = cobrosHoy.filter(c => c.metodo.toLowerCase().includes('transfer')).reduce((acc, c) => acc + c.monto, 0);

  const gastosHoy = AppState.expenses.filter(e => e.fecha === selectedDate);
  const totalGastos = gastosHoy.reduce((acc, e) => acc + (parseFloat(e.monto) || 0), 0);

  const fondoInicial = parseFloat(AppState.settings.fondoInicialCaja) || 500;
  const efectivoEsperado = Math.max(0, fondoInicial + efectivo - totalGastos);

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  // Archivar también automáticamente
  saveDailyCashCutToHistory();

  let msg = `💵 *CORTE DE CAJA DIARIO - ${AppState.settings.nombre}*\n` +
    `📅 *Fecha:* ${formatDate(selectedDate)} | ⏰ *Hora:* ${timeStr} hrs\n` +
    `-----------------------------------------\n` +
    `💼 *Fondo Inicial:* $${fondoInicial.toFixed(2)}\n` +
    `💵 *Efectivo Cobrado:* $${efectivo.toFixed(2)}\n` +
    `💳 *Tarjetas (Terminal):* $${tarjeta.toFixed(2)}\n` +
    `📲 *Transferencias SPEI:* $${transferencia.toFixed(2)}\n` +
    `-----------------------------------------\n` +
    `💰 *TOTAL COBRADO:* $${totalCobrado.toFixed(2)}\n\n` +
    `📉 *GASTOS / SALIDAS:* -$${totalGastos.toFixed(2)}\n`;

  if (gastosHoy.length > 0) {
    gastosHoy.forEach(g => {
      msg += `  • ${g.concepto}: -$${parseFloat(g.monto).toFixed(2)}\n`;
    });
  }

  msg += `\n=========================================\n` +
    `🟢 *EFECTIVO ESPERADO EN CAJA:* $${efectivoEsperado.toFixed(2)}\n` +
    `   (Fondo Inicial + Efectivo - Gastos)\n` +
    `=========================================\n\n` +
    `_Reporte diario generado por Óptica Manager PRO_`;

  const phone = AppState.settings.telefonoDuenio ? AppState.settings.telefonoDuenio.replace(/\D/g, '') : '';
  const url = phone ? `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}` : `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

// ==========================================================================
// ESCÁNER DE CÓDIGOS DE BARRAS Y QR CON CÁMARA
// ==========================================================================
let scannerStream = null;
let scannerTargetInputId = null;
let scannerCurrentCamera = 'environment';
let scannerDetector = null;
let scannerScanLoopId = null;

function openBarcodeScanner(targetInputId) {
  scannerTargetInputId = targetInputId;
  const fallback = document.getElementById('scannerFallbackInputWrapper');
  if (fallback) fallback.style.display = 'none';
  const manualInp = document.getElementById('scannerManualInput');
  if (manualInp) manualInp.value = '';

  openModal('modalScanner');
  startCameraScanning();
}

function closeBarcodeScanner() {
  stopCameraScanning();
  closeModal('modalScanner');
}

async function startCameraScanning() {
  stopCameraScanning();
  const video = document.getElementById('scannerVideo');
  if (!video) return;

  if ('BarcodeDetector' in window) {
    try {
      scannerDetector = new BarcodeDetector({ formats: ['code_128', 'qr_code', 'ean_13', 'ean_8', 'upc_a'] });
    } catch (e) {
      scannerDetector = null;
    }
  }

  try {
    const constraints = {
      video: {
        facingMode: { ideal: scannerCurrentCamera },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    };
    scannerStream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = scannerStream;
    await video.play();

    if (scannerDetector) {
      runBarcodeScanLoop();
    } else {
      const fallback = document.getElementById('scannerFallbackInputWrapper');
      if (fallback) fallback.style.display = 'block';
    }
  } catch (err) {
    console.warn('Cámara no accesible:', err);
    const fallback = document.getElementById('scannerFallbackInputWrapper');
    if (fallback) fallback.style.display = 'block';
    showToast('Cámara no accesible. Puedes escribir el código.', 'info');
  }
}

function stopCameraScanning() {
  if (scannerScanLoopId) {
    cancelAnimationFrame(scannerScanLoopId);
    scannerScanLoopId = null;
  }
  if (scannerStream) {
    scannerStream.getTracks().forEach(t => t.stop());
    scannerStream = null;
  }
}

async function runBarcodeScanLoop() {
  const video = document.getElementById('scannerVideo');
  if (!video || !scannerDetector || !scannerStream) return;

  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    try {
      const barcodes = await scannerDetector.detect(video);
      if (barcodes.length > 0 && barcodes[0].rawValue) {
        applyScannedBarcode(barcodes[0].rawValue);
        return;
      }
    } catch (e) {}
  }

  scannerScanLoopId = requestAnimationFrame(runBarcodeScanLoop);
}

function flipCamera() {
  scannerCurrentCamera = (scannerCurrentCamera === 'environment') ? 'user' : 'environment';
  startCameraScanning();
}

function toggleManualScannerInput() {
  const wrapper = document.getElementById('scannerFallbackInputWrapper');
  if (!wrapper) return;
  wrapper.style.display = (wrapper.style.display === 'none') ? 'block' : 'none';
  if (wrapper.style.display === 'block') {
    const inp = document.getElementById('scannerManualInput');
    if (inp) inp.focus();
  }
}

function submitManualScannerCode() {
  const inp = document.getElementById('scannerManualInput');
  if (!inp || !inp.value.trim()) {
    showToast('Ingresa un código', 'error');
    return;
  }
  applyScannedBarcode(inp.value.trim());
}

function applyScannedBarcode(code) {
  if (scannerTargetInputId) {
    const input = document.getElementById(scannerTargetInputId);
    if (input) {
      input.value = code;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
  closeBarcodeScanner();
  showToast(`🎯 Código reconocido: ${code}`, 'success');
}

// ==========================================================================
// AGENDA DE CITAS Y RECORDATORIOS
// ==========================================================================
function renderAppointmentsList() {
  const container = document.getElementById('appointmentsListContainer');
  if (!container) return;

  if (AppState.appointments.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: var(--text-tertiary);">
        <p>No hay citas agendadas.</p>
        <button class="btn-primary" style="margin: 16px auto; max-width: 220px;" onclick="promptNewAppointment()">
          + Agendar Cita
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = AppState.appointments.map(apt => `
    <div class="patient-card">
      <div class="patient-card-header">
        <div class="patient-info-meta" style="margin-left: 0;">
          <div class="patient-name">${escapeHtml(apt.patientName)}</div>
          <div class="patient-sub">
            <span>📅 ${formatDate(apt.fecha)}</span>
            <span>•</span>
            <span>⏰ ${apt.hora} hrs</span>
            <span>•</span>
            <span>📞 ${apt.telefono || 'Sin tel'}</span>
          </div>
        </div>
      </div>
      <div style="background: rgba(11, 19, 43, 0.6); border-radius: 8px; padding: 10px; margin: 8px 0; font-size: 0.85rem;">
        <strong>Motivo:</strong> ${escapeHtml(apt.motivo)}
      </div>
      <div class="patient-card-footer">
        <button class="btn-card-action" onclick="sendAppointmentWhatsApp('${apt.id}')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="#25D366">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
          </svg>
          Recordar x WhatsApp
        </button>
        <button class="btn-card-action" style="color: var(--danger);" onclick="deleteAppointment('${apt.id}')">
          Eliminar
        </button>
      </div>
    </div>
  `).join('');
}

function promptNewAppointment() {
  document.getElementById('aptPatientName').value = '';
  document.getElementById('aptTelefono').value = '';
  document.getElementById('aptFecha').value = new Date().toISOString().split('T')[0];
  document.getElementById('aptHora').value = '10:00';
  document.getElementById('aptMotivo').value = 'Examen de la vista y graduación';
  openModal('modalCita');
}

function saveAppointmentFromForm(e) {
  e.preventDefault();
  const name = document.getElementById('aptPatientName').value.trim();
  if (!name) return;

  const newApt = {
    id: 'apt-' + Date.now(),
    patientName: name,
    telefono: document.getElementById('aptTelefono').value.trim(),
    fecha: document.getElementById('aptFecha').value,
    hora: document.getElementById('aptHora').value,
    motivo: document.getElementById('aptMotivo').value.trim(),
    estatus: 'programada'
  };

  AppState.appointments.unshift(newApt);
  saveData('appointments');
  closeModal('modalCita');
  showToast('Cita agendada con éxito', 'success');
  renderAppointmentsList();
  renderDashboard();
}

function deleteAppointment(aptId) {
  if (confirm('¿Deseas eliminar esta cita de la agenda?')) {
    AppState.appointments = AppState.appointments.filter(a => a.id !== aptId);
    saveData('appointments');
    renderAppointmentsList();
    renderDashboard();
    showToast('Cita eliminada', 'success');
  }
}

// ==========================================================================
// INVENTARIO DE ARMAZONES Y ACCESORIOS
// ==========================================================================
function renderInventoryList() {
  const container = document.getElementById('inventoryListContainer');
  if (!container) return;

  const searchInput = document.getElementById('searchInventoryInput');
  const q = searchInput ? searchInput.value.toLowerCase().trim() : '';

  let filtered = AppState.inventory;
  if (q) {
    filtered = filtered.filter(i => 
      i.codigo.toLowerCase().includes(q) ||
      i.marca.toLowerCase().includes(q) ||
      (i.modelo && i.modelo.toLowerCase().includes(q))
    );
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: var(--text-tertiary);">
        <p>No se encontraron artículos en inventario.</p>
        <button class="btn-primary" style="margin: 16px auto; max-width: 220px;" onclick="promptNewInventoryItem()">
          + Agregar Armazón
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => `
    <div class="patient-card">
      <div class="patient-card-header">
        <div class="patient-info-meta" style="margin-left: 0;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-family: monospace; font-size: 0.8rem; color: var(--accent-cyan); font-weight: 700;">${item.codigo}</span>
            <span class="badge-status ${item.stock <= 2 ? 'badge-cancelado' : 'badge-taller'}">Stock: ${item.stock}</span>
          </div>
          <div class="patient-name">${escapeHtml(item.marca)} - ${escapeHtml(item.modelo || '')}</div>
          <div class="patient-sub">
            <span>${item.tipo}</span>
            <span>•</span>
            <span>Color: ${escapeHtml(item.color || 'N/A')}</span>
          </div>
        </div>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 8px 0; border-top: 1px solid var(--border-color); font-size: 0.85rem;">
        <span style="color: var(--text-secondary);">Costo: $${item.costo}</span>
        <span style="font-weight: 800; color: var(--success);">Precio: $${item.precio}</span>
      </div>
      <div class="patient-card-footer">
        <button class="btn-card-action" onclick="adjustStock('${item.id}', -1)">- 1 Stock</button>
        <button class="btn-card-action primary" onclick="adjustStock('${item.id}', 1)">+ 1 Stock</button>
      </div>
    </div>
  `).join('');
}

function promptNewInventoryItem() {
  document.getElementById('invCodigo').value = 'ARM-' + Math.floor(1000 + Math.random() * 9000);
  document.getElementById('invMarca').value = '';
  document.getElementById('invModelo').value = '';
  document.getElementById('invColor').value = '';
  document.getElementById('invCosto').value = '';
  document.getElementById('invPrecio').value = '';
  document.getElementById('invStock').value = '1';
  openModal('modalInventario');
}

function saveInventoryFromForm(e) {
  e.preventDefault();
  const marca = document.getElementById('invMarca').value.trim();
  if (!marca) return;

  const newItem = {
    id: 'inv-' + Date.now(),
    codigo: document.getElementById('invCodigo').value.trim(),
    marca,
    modelo: document.getElementById('invModelo').value.trim(),
    tipo: document.getElementById('invTipo').value,
    color: document.getElementById('invColor').value.trim(),
    costo: parseFloat(document.getElementById('invCosto').value) || 0,
    precio: parseFloat(document.getElementById('invPrecio').value) || 0,
    stock: parseInt(document.getElementById('invStock').value) || 1
  };

  AppState.inventory.unshift(newItem);
  saveData('inventory');
  closeModal('modalInventario');
  showToast('Artículo agregado al inventario', 'success');
  renderInventoryList();
}

function adjustStock(itemId, delta) {
  const item = AppState.inventory.find(i => i.id === itemId);
  if (!item) return;

  item.stock = Math.max(0, item.stock + delta);
  saveData('inventory');
  renderInventoryList();
  showToast(`Stock de ${item.marca} actualizado: ${item.stock}`, 'success');
}

// ==========================================================================
// TICKET / RECIBO DE ÓPTICA (IMPRESIÓN Y WHATSAPP)
// ==========================================================================
let currentTicketOrder = null;

function printOrderTicket(orderId) {
  const order = AppState.orders.find(o => o.id === orderId);
  if (!order) return;

  currentTicketOrder = order;
  const patient = AppState.patients.find(p => p.id === order.patientId) || {};
  const rx = patient.rx || {};
  const od = rx.od || {};
  const oi = rx.oi || {};

  const ticketHtml = `
    <div class="ticket-preview-box" id="printableTicket">
      <div class="ticket-header">
        ${AppState.settings.logo ? `
          <div style="text-align: center; margin-bottom: 8px;">
            <img src="${AppState.settings.logo}" alt="Logo" style="max-height: 48px; max-width: 130px; object-fit: contain; display: block; margin: 0 auto;">
          </div>
        ` : ''}
        <div class="ticket-store-name">${escapeHtml(AppState.settings.nombre)}</div>
        <div class="ticket-subtitle">${escapeHtml(AppState.settings.eslogan)}</div>
        <div class="ticket-subtitle">${escapeHtml(AppState.settings.direccion)}</div>
        <div class="ticket-subtitle">Tel / WhatsApp: ${escapeHtml(AppState.settings.telefono)}</div>
      </div>

      <div class="ticket-info-row">
        <span><strong>Folio:</strong> ${order.folio}</span>
        <span><strong>Fecha:</strong> ${formatDate(order.fechaPedido)}</span>
      </div>
      <div class="ticket-info-row">
        <span><strong>Paciente:</strong> ${escapeHtml(order.patientName)}</span>
      </div>
      <div class="ticket-info-row">
        <span><strong>Fecha Entrega:</strong> ${formatDate(order.fechaPrometida)}</span>
      </div>
      ${order.asesor ? `
      <div class="ticket-info-row">
        <span><strong>Atendió:</strong> ${escapeHtml(order.asesor)}</span>
      </div>
      ` : ''}

      <div class="ticket-divider"></div>
      <div style="font-weight: bold; margin-bottom: 4px; text-align: center; font-size: 0.8rem;">
        GRADUACIÓN ÓPTICA (REFRACCIÓN)
      </div>

      <table class="ticket-rx-table">
        <thead>
          <tr>
            <th>OJO</th>
            <th>ESF</th>
            <th>CIL</th>
            <th>EJE</th>
            <th>ADD</th>
            <th>DP</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>OD</strong></td>
            <td>${od.esf || '0.00'}</td>
            <td>${od.cil || '0.00'}</td>
            <td>${od.eje ? od.eje + '°' : '-'}</td>
            <td>${od.add || '-'}</td>
            <td>${od.dp || '-'}</td>
          </tr>
          <tr>
            <td><strong>OI</strong></td>
            <td>${oi.esf || '0.00'}</td>
            <td>${oi.cil || '0.00'}</td>
            <td>${oi.eje ? oi.eje + '°' : '-'}</td>
            <td>${oi.add || '-'}</td>
            <td>${oi.dp || '-'}</td>
          </tr>
        </tbody>
      </table>

      <div style="margin: 8px 0; font-size: 0.75rem;">
        <strong>Detalle:</strong> ${escapeHtml(order.descripcion)}
      </div>

      <div class="ticket-divider"></div>

      <div class="ticket-totals">
        <div class="ticket-total-row">
          <span>Importe Total:</span>
          <span><strong>$${order.total.toFixed(2)}</strong></span>
        </div>
        <div class="ticket-total-row">
          <span>Anticipo / Abonos:</span>
          <span>$${(order.anticipo || 0).toFixed(2)}</span>
        </div>
        <div class="ticket-total-row grand-total">
          <span>Saldo Pendiente:</span>
          <span>$${(order.saldo || 0).toFixed(2)}</span>
        </div>
      </div>

      ${AppState.settings.optometrista ? `
      <div class="ticket-optometrist" style="margin-top: 14px; padding-top: 8px; text-align: center; font-size: 0.72rem; border-top: 1px dashed #cbd5e1;">
        <div style="width: 140px; height: 28px; border-bottom: 1px solid #64748b; margin: 0 auto 5px auto;"></div>
        <div style="font-weight: 700; color: #0f172a;">${escapeHtml(AppState.settings.optometrista)}</div>
        ${AppState.settings.cedula ? `<div style="font-size: 0.68rem; color: #334155;">Céd. Prof.: ${escapeHtml(AppState.settings.cedula)}</div>` : ''}
        ${AppState.settings.especialidad ? `<div style="font-size: 0.65rem; color: #64748b;">${escapeHtml(AppState.settings.especialidad)}</div>` : ''}
        <div style="font-size: 0.62rem; color: #94a3b8; text-transform: uppercase; margin-top: 2px; letter-spacing: 0.5px;">Optometrista Responsable</div>
      </div>
      ` : ''}

      <div class="ticket-footer">
        <p>${escapeHtml(AppState.settings.mensajeTicket)}</p>
        <p style="margin-top: 6px; font-size: 0.68rem; letter-spacing: 2px;">*** COMPROBANTE OFICIAL ***</p>
      </div>
    </div>
  `;

  document.getElementById('ticketModalBody').innerHTML = ticketHtml;
  openModal('modalTicket');
}

function executeTicketPrint() {
  window.print();
}

function shareTicketWhatsApp() {
  if (!currentTicketOrder) return;
  const o = currentTicketOrder;
  const patient = AppState.patients.find(p => p.id === o.patientId) || {};
  const rx = patient.rx || {};

  const msg = `👓 *COMPROBANTE DE PEDIDO - ${AppState.settings.nombre}*\n\n` +
    `👤 *Paciente:* ${o.patientName}\n` +
    `📄 *Folio:* ${o.folio}\n` +
    `📅 *Fecha Promesa:* ${formatDate(o.fechaPrometida)}\n` +
    `🕶️ *Trabajo:* ${o.descripcion}\n\n` +
    `*Graduación:*\n` +
    `OD: Esf ${rx.od?.esf || '0.00'} Cil ${rx.od?.cil || '0.00'} Eje ${rx.od?.eje || '0'}°\n` +
    `OI: Esf ${rx.oi?.esf || '0.00'} Cil ${rx.oi?.cil || '0.00'} Eje ${rx.oi?.eje || '0'}°\n\n` +
    `💰 *Total:* $${o.total}\n` +
    `💵 *Anticipo:* $${o.anticipo || 0}\n` +
    `⚖️ *Saldo Restante:* $${o.saldo || 0}\n\n` +
    (AppState.settings.optometrista ? `👨‍⚕️ *Atendió:* ${AppState.settings.optometrista}` + (AppState.settings.cedula ? ` (Céd. Prof. ${AppState.settings.cedula})` : '') + `\n` : '') +
    `📍 ${AppState.settings.direccion}\n` +
    `📞 ${AppState.settings.telefono}\n` +
    `_${AppState.settings.mensajeTicket}_`;

  const phone = o.telefono ? o.telefono.replace(/\D/g, '') : '';
  const url = phone ? `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}` : `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

// ==========================================================================
// INTEGRACIONES DE MENSAJES WHATSAPP AUTOMÁTICOS & CRM
// ==========================================================================
function sendRxWhatsApp(patientId) {
  const patient = AppState.patients.find(p => p.id === patientId);
  if (!patient) return;

  const rx = patient.rx || {};
  const msg = `👓 *RECETA DE GRADUACIÓN VISUAL*\n` +
    `*${AppState.settings.nombre}*\n\n` +
    `👤 *Paciente:* ${patient.nombre}\n` +
    `📅 *Fecha:* ${formatDate(patient.fechaRegistro)}\n\n` +
    `*Graduación Clínica:*\n` +
    `▶ *Ojo Derecho (OD):*\n` +
    `   Esfera: ${rx.od?.esf || '0.00'} | Cilindro: ${rx.od?.cil || '0.00'} | Eje: ${rx.od?.eje ? rx.od.eje + '°' : '-'}\n` +
    `   Adición: ${rx.od?.add || '-'} | DP: ${rx.od?.dp || '-'}\n\n` +
    `▶ *Ojo Izquierdo (OI):*\n` +
    `   Esfera: ${rx.oi?.esf || '0.00'} | Cilindro: ${rx.oi?.cil || '0.00'} | Eje: ${rx.oi?.eje ? rx.oi.eje + '°' : '-'}\n` +
    `   Adición: ${rx.oi?.add || '-'} | DP: ${rx.oi?.dp || '-'}\n\n` +
    `🔍 *Recomendación:* ${rx.tipoMica || 'Monofocal'} en material ${rx.material || 'Policarbonato'}.\n` +
    (rx.tratamientos?.length ? `🛡️ *Tratamientos:* ${rx.tratamientos.join(', ')}\n` : '') +
    (AppState.settings.optometrista ? `\n🩺 *Optometrista:* ${AppState.settings.optometrista}` + (AppState.settings.cedula ? ` (Céd. Prof. ${AppState.settings.cedula})` : '') + (AppState.settings.especialidad ? ` - ${AppState.settings.especialidad}` : '') + `\n` : '') +
    `\n📍 ${AppState.settings.direccion}\n📞 ${AppState.settings.telefono}`;

  const phone = patient.telefono ? patient.telefono.replace(/\D/g, '') : '';
  const url = phone ? `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}` : `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

function sendAnnualReviewWhatsApp(patientId) {
  const patient = AppState.patients.find(p => p.id === patientId);
  if (!patient) return;

  const msg = `👋 ¡Hola *${patient.nombre}*!\n\n` +
    `Te saludamos de *${AppState.settings.nombre}*. 👓✨\n\n` +
    `Notamos en tu expediente que ha pasado casi un año desde tu último examen de la vista. Realizar una revisión anual preventiva es fundamental para detectar a tiempo variaciones en tu graduación y prevenir fatiga ocular por pantallas o lectura.\n\n` +
    `🩺 ¿Te gustaría agendar una cita de valoración sin costo esta semana?\n\n` +
    `📍 Te esperamos en: ${AppState.settings.direccion}\n` +
    `📞 O responde a este mensaje para apartar tu horario. ¡Será un gusto atenderte!`;

  const phone = patient.telefono ? patient.telefono.replace(/\D/g, '') : '';
  const url = phone ? `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}` : `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

function sendContactLensRefillWhatsApp(patientId) {
  const patient = AppState.patients.find(p => p.id === patientId);
  if (!patient) return;

  const gab = patient.gabinete || {};
  const msg = `👁️ ¡Hola *${patient.nombre}*!\n\n` +
    `Te saludamos de *${AppState.settings.nombre}*.\n\n` +
    `Queremos recordarte que tus lentes de contacto (${gab.esLenteContacto || 'de uso frecuente'}) están próximos a cumplir su periodo recomendado de reemplazo.\n\n` +
    `Renovar tus lentes a tiempo y usar solución multipropósito fresca previene infecciones y mantiene tus ojos oxigenados y cómodos todo el día.\n\n` +
    `📦 Tenemos tus graduaciones listas para entrega inmediata en sucursal o puedes solicitarnos tu nuevo kit por aquí.\n` +
    `📍 ${AppState.settings.direccion} | 📞 ${AppState.settings.telefono}`;

  const phone = patient.telefono ? patient.telefono.replace(/\D/g, '') : '';
  const url = phone ? `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}` : `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

function sendOrderReadyWhatsApp(orderId) {
  const order = AppState.orders.find(o => o.id === orderId);
  if (!order) return;

  const msg = `🎉 ¡Hola *${order.patientName}*!\n\n` +
    `Te informamos de *${AppState.settings.nombre}* que tus lentes correspondientes a la orden *${order.folio}* ya están *LISTOS PARA ENTREGA* en sucursal. 👓✨\n\n` +
    `💰 *Saldo pendiente por liquidar:* $${order.saldo || 0}\n\n` +
    `📍 Puedes pasar a recogerlos en: ${AppState.settings.direccion}\n` +
    `¡Te esperamos con gusto para realizar el ajuste final en tu rostro!`;

  const phone = order.telefono ? order.telefono.replace(/\D/g, '') : '';
  const url = phone ? `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}` : `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

function sendAppointmentWhatsApp(aptId) {
  const apt = AppState.appointments.find(a => a.id === aptId);
  if (!apt) return;

  const msg = `🗓️ *RECORDATORIO DE CITA - ${AppState.settings.nombre}*\n\n` +
    `Hola *${apt.patientName}*, te recordamos tu cita programada:\n\n` +
    `📅 *Fecha:* ${formatDate(apt.fecha)}\n` +
    `⏰ *Hora:* ${apt.hora} hrs\n` +
    `📋 *Motivo:* ${apt.motivo}\n\n` +
    `📍 *Lugar:* ${AppState.settings.direccion}\n` +
    `Por favor confirma tu asistencia respondiendo a este mensaje. ¡Gracias!`;

  const phone = apt.telefono ? apt.telefono.replace(/\D/g, '') : '';
  const url = phone ? `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}` : `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

// ==========================================================================
// CONFIGURACIÓN, PERSONAL, RESPALDOS Y LICENCIA
// ==========================================================================
function renderSettings() {
  document.getElementById('cfgNombre').value = AppState.settings.nombre || '';
  document.getElementById('cfgEslogan').value = AppState.settings.eslogan || '';
  document.getElementById('cfgTelefono').value = AppState.settings.telefono || '';
  document.getElementById('cfgDireccion').value = AppState.settings.direccion || '';
  document.getElementById('cfgOptometrista').value = AppState.settings.optometrista || '';
  document.getElementById('cfgCedula').value = AppState.settings.cedula || '';
  document.getElementById('cfgEspecialidad').value = AppState.settings.especialidad || '';
  document.getElementById('cfgDiasEntrega').value = AppState.settings.diasEntrega || 3;
  document.getElementById('cfgMensajeTicket').value = AppState.settings.mensajeTicket || '';

  // Personal, comisiones y caja
  document.getElementById('cfgAsesores').value = (AppState.settings.asesores || []).join(', ');
  document.getElementById('cfgComision').value = AppState.settings.comisionPorcentaje || 3;
  document.getElementById('cfgFondoCaja').value = AppState.settings.fondoInicialCaja || 500;
  document.getElementById('cfgTelefonoDuenio').value = AppState.settings.telefonoDuenio || '';

  updateLogoPreview(AppState.settings.logo);

  const license = LicenseManager.getLicenseStatus();
  const licStatusBox = document.getElementById('cfgLicenseStatusBox');
  const installId = LicenseManager.getInstallationId();

  if (license.isPro) {
    licStatusBox.innerHTML = `
      <div style="background: rgba(16, 185, 129, 0.12); border: 1.5px solid var(--success); border-radius: 12px; padding: 14px; text-align: center;">
        <div style="font-size: 1.1rem; font-weight: 800; color: var(--success); margin-bottom: 4px;">✨ Licencia PRO Activa</div>
        <div style="font-size: 0.8rem; color: #fff;">Pacientes ilimitados y funciones completas desbloqueadas.</div>
        <div style="font-family: monospace; font-size: 0.75rem; color: var(--text-secondary); margin-top: 6px;">Clave: ${license.key}</div>
      </div>
    `;
  } else {
    licStatusBox.innerHTML = `
      <div style="background: rgba(245, 158, 11, 0.12); border: 1.5px solid var(--gold); border-radius: 12px; padding: 14px;">
        <div style="font-weight: 800; color: var(--gold); margin-bottom: 4px;">⚠️ Versión Demo (Límite 10 Clientes)</div>
        <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 10px;">
          Actualmente has registrado <strong>${AppState.patients.length} de 10</strong> pacientes permitidos.
        </p>
        <div style="font-size: 0.75rem; color: var(--text-tertiary);">Tu ID de Instalación:</div>
        <div style="font-family: monospace; font-size: 1rem; font-weight: 800; color: var(--accent-cyan); margin-bottom: 12px;">${installId}</div>
        
        <div style="display: flex; gap: 8px;">
          <input type="text" id="cfgKeyInput" class="form-control" placeholder="Pega tu clave de activación aquí" style="font-size: 0.85rem;">
          <button type="button" class="btn-primary" style="padding: 10px 16px; white-space: nowrap;" onclick="handleActivateFromSettings()">Activar</button>
        </div>
      </div>
    `;
  }
}

function handleActivateFromSettings() {
  const input = document.getElementById('cfgKeyInput').value.trim();
  if (!input) {
    showToast('Ingresa tu clave de activación', 'error');
    return;
  }
  const res = LicenseManager.activateLicense(input);
  if (res.success) {
    showToast('🎉 ¡Licencia Activada con Éxito!', 'success');
    renderLicenseBadge();
    renderSettings();
  } else {
    showToast(res.message, 'error');
  }
}

function saveSettingsFromForm(e) {
  e.preventDefault();
  AppState.settings.nombre = document.getElementById('cfgNombre').value.trim();
  AppState.settings.eslogan = document.getElementById('cfgEslogan').value.trim();
  AppState.settings.telefono = document.getElementById('cfgTelefono').value.trim();
  AppState.settings.direccion = document.getElementById('cfgDireccion').value.trim();
  AppState.settings.optometrista = document.getElementById('cfgOptometrista').value.trim();
  AppState.settings.cedula = document.getElementById('cfgCedula').value.trim();
  AppState.settings.especialidad = document.getElementById('cfgEspecialidad').value.trim();
  AppState.settings.diasEntrega = parseInt(document.getElementById('cfgDiasEntrega').value) || 3;
  AppState.settings.mensajeTicket = document.getElementById('cfgMensajeTicket').value.trim();

  // Asesores, comisiones y caja
  const rawAsesores = document.getElementById('cfgAsesores').value;
  AppState.settings.asesores = rawAsesores.split(',').map(s => s.trim()).filter(Boolean);
  AppState.settings.comisionPorcentaje = parseFloat(document.getElementById('cfgComision').value) || 0;
  AppState.settings.fondoInicialCaja = parseFloat(document.getElementById('cfgFondoCaja').value) || 0;
  AppState.settings.telefonoDuenio = document.getElementById('cfgTelefonoDuenio').value.trim();

  saveData('settings');
  showToast('Configuración guardada correctamente', 'success');
  updateHeaderBranding();
}

function handleLogoUpload(input) {
  if (input.files && input.files[0]) {
    const file = input.files[0];
    if (file.size > 2 * 1024 * 1024) {
      showToast('La imagen no debe superar los 2MB', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
      const base64 = e.target.result;
      AppState.settings.logo = base64;
      saveData('settings');
      updateLogoPreview(base64);
      updateHeaderBranding();
      showToast('Logotipo guardado con éxito', 'success');
    };
    reader.readAsDataURL(file);
  }
}

function removeLogo() {
  AppState.settings.logo = null;
  saveData('settings');
  updateLogoPreview(null);
  updateHeaderBranding();
  showToast('Logotipo eliminado', 'info');
}

function updateLogoPreview(logoUrl) {
  const imgEl = document.getElementById('cfgLogoImg');
  const placeholderEl = document.getElementById('cfgLogoEmptyPlaceholder');
  const removeBtn = document.getElementById('cfgRemoveLogoBtn');

  if (logoUrl) {
    if (imgEl) {
      imgEl.src = logoUrl;
      imgEl.style.display = 'block';
    }
    if (placeholderEl) placeholderEl.style.display = 'none';
    if (removeBtn) removeBtn.style.display = 'block';
  } else {
    if (imgEl) {
      imgEl.src = '';
      imgEl.style.display = 'none';
    }
    if (placeholderEl) placeholderEl.style.display = 'block';
    if (removeBtn) removeBtn.style.display = 'none';
  }
}

function updateHeaderBranding() {
  const brandNameEl = document.getElementById('headerBrandName');
  if (brandNameEl) brandNameEl.textContent = AppState.settings.nombre || 'Óptica Visión Clara';

  const brandIcon = document.getElementById('headerBrandIcon');
  if (!brandIcon) return;

  if (AppState.settings.logo) {
    brandIcon.style.background = 'transparent';
    brandIcon.style.boxShadow = 'none';
    brandIcon.innerHTML = `<img src="${AppState.settings.logo}" alt="Logo" style="width: 100%; height: 100%; object-fit: contain; border-radius: 10px; background: rgba(255, 255, 255, 0.08); padding: 2px;">`;
  } else {
    brandIcon.style.background = 'transparent';
    brandIcon.style.boxShadow = 'none';
    brandIcon.innerHTML = `<img src="icon-192.png" alt="OptiControl PRO" style="width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 2px 8px rgba(0, 180, 216, 0.4));">`;
  }
}

// Exportar copia de seguridad en archivo JSON
function exportBackupJSON() {
  const fullBackup = {
    exportDate: new Date().toISOString(),
    version: '2.0',
    app: 'OptiControlPro',
    settings: AppState.settings,
    patients: AppState.patients,
    orders: AppState.orders,
    inventory: AppState.inventory,
    appointments: AppState.appointments,
    expenses: AppState.expenses,
    cashCuts: AppState.cashCuts
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `Respaldo_OptiControl_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast('Copia de seguridad descargada', 'success');
}

// Importar copia de seguridad desde archivo JSON
function importBackupJSON(inputElement) {
  const file = inputElement.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (data.patients && Array.isArray(data.patients)) {
        AppState.patients = data.patients;
        saveData('patients');
      }
      if (data.orders && Array.isArray(data.orders)) {
        AppState.orders = data.orders;
        saveData('orders');
      }
      if (data.inventory && Array.isArray(data.inventory)) {
        AppState.inventory = data.inventory;
        saveData('inventory');
      }
      if (data.appointments && Array.isArray(data.appointments)) {
        AppState.appointments = data.appointments;
        saveData('appointments');
      }
      if (data.expenses && Array.isArray(data.expenses)) {
        AppState.expenses = data.expenses;
        saveData('expenses');
      }
      if (data.cashCuts && Array.isArray(data.cashCuts)) {
        AppState.cashCuts = data.cashCuts;
        saveData('cash_cuts');
      }
      if (data.settings) {
        AppState.settings = Object.assign(AppState.settings, data.settings);
        saveData('settings');
      }

      showToast('¡Datos restaurados con éxito!', 'success');
      renderLicenseBadge();
      renderDashboard();
      renderPatientsList();
      inputElement.value = '';
    } catch (err) {
      showToast('Archivo de respaldo inválido o corrupto', 'error');
    }
  };
  reader.readAsText(file);
}

// ==========================================================================
// HELPERS Y EVENT LISTENERS
// ==========================================================================
function setupEventListeners() {
  const searchInput = document.getElementById('searchPatientsInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentPatientSearch = e.target.value;
      renderPatientsList();
    });
  }

  document.querySelectorAll('.order-filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.order-filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      AppState.currentOrderFilter = chip.dataset.filter;
      renderOrdersList();
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(modal => {
        modal.classList.remove('open');
      });
      stopCameraScanning();
    }
  });
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function showToast(msg, type = 'info') {
  const toast = document.getElementById('appToast');
  if (!toast) return;

  toast.textContent = msg;
  toast.className = `toast-msg show ${type}`;
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDate(dateStr) {
  if (!dateStr) return 'N/D';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

window.addEventListener('DOMContentLoaded', initApp);
