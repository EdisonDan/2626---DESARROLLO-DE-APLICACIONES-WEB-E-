/**
 * script.js - OPEN+
 * Semanas 6 y 7: Validaciones dinámicas + Catálogo con arreglos y objetos
 * Autor: Daniel Garzón - Desarrollo de Aplicaciones Web 2026
 *
 * Estructura preparada para futura migración a Flask:
 *   - productos[]  →  equivale a una consulta de base de datos
 *   - renderizar*  →  equivale a templates Jinja2
 *   - stats[]      →  equivale a context variables en views.py
 */

'use strict';

// =============================================================
// DATOS: Arreglo principal de productos (Semana 7)
// Futuro Flask: estos datos vendrán de la BD vía SQLAlchemy
// =============================================================
const productos = [
  { nombre: 'Teclado Mecánico RGB',       descripcion: 'Teclado gaming con switches azules y retroiluminación RGB',         categoria: 'teclado',   disponible: true  },
  { nombre: 'Mouse Inalámbrico Pro',       descripcion: 'Mouse ergonómico con 3200 DPI y batería de larga duración',         categoria: 'mouse',     disponible: true  },
  { nombre: 'Monitor Full HD 24"',         descripcion: 'Monitor IPS 24 pulgadas 1080p ideal para trabajo y entretenimiento', categoria: 'pantalla',  disponible: true  },
  { nombre: 'Audífonos Gaming 7.1',        descripcion: 'Audífonos con sonido surround y micrófono retráctil para gaming',   categoria: 'audifonos', disponible: false },
  { nombre: 'Mousepad XL Antideslizante',  descripcion: 'Mousepad extra grande con base de goma y bordes cosidos',           categoria: 'mousepad',  disponible: true  }
];

// Objeto de metadatos por categoría (Semana 7: uso de objetos JS)
const metaCategoria = {
  teclado:   { emoji: '⌨️',  label: 'Teclado',   color: 'primary'  },
  mouse:     { emoji: '🖱️',  label: 'Mouse',     color: 'success'  },
  pantalla:  { emoji: '🖥️',  label: 'Pantalla',  color: 'info'     },
  audifonos: { emoji: '🎧',  label: 'Audífonos', color: 'warning'  },
  mousepad:  { emoji: '🖰️',  label: 'Mousepad',  color: 'secondary'},
  otro:      { emoji: '📦',  label: 'Otro',      color: 'dark'     }
};

// Objeto de estadísticas para la sección Quiénes Somos
const stats = [
  { valor: '500+', texto: 'Clientes satisfechos' },
  { valor: '50+',  texto: 'Productos disponibles' },
  { valor: '3 años', texto: 'En el mercado' },
  { valor: '24h',  texto: 'Tiempo de entrega' }
];

// =============================================================
// ESTADO GLOBAL
// =============================================================
let totalRegistros = 0;
let filtroActivo   = 'todos';

// =============================================================
// REFERENCIAS AL DOM
// =============================================================
const formulario      = document.getElementById('formProducto');
const inputNombre     = document.getElementById('prodNombre');
const inputDesc       = document.getElementById('prodDescripcion');
const selectCategoria = document.getElementById('prodCategoria');
const catalogoEl      = document.getElementById('catalogo-productos');
const mensajeCatalogo = document.getElementById('mensajeCatalogo');
const contadorEl      = document.getElementById('contadorRegistros');
const alertaExito     = document.getElementById('alertaExito');
const cuerpoTabla     = document.getElementById('cuerpoTabla');
const mensajeTabla    = document.getElementById('mensajeTabla');
const filtrosEl       = document.getElementById('filtros');
const statsGridEl     = document.getElementById('statsGrid');

// =============================================================
// HELPERS DE VALIDACIÓN (Semana 6 — conservados)
// =============================================================
function marcarInvalido(campo, msgEl, texto) {
  campo.classList.remove('is-valid');
  campo.classList.add('is-invalid');
  msgEl.textContent = texto;
}

function marcarValido(campo, msgEl) {
  campo.classList.remove('is-invalid');
  campo.classList.add('is-valid');
  msgEl.textContent = '';
}

function limpiarCampo(campo, msgEl) {
  campo.classList.remove('is-valid', 'is-invalid');
  msgEl.textContent = '';
}

// =============================================================
// VALIDACIONES (Semana 6 — conservadas íntegramente)
// =============================================================
function validarNombre() {
  const msgEl = document.getElementById('msgNombre');
  const valor = inputNombre.value.trim();
  if (valor === '') {
    marcarInvalido(inputNombre, msgEl, 'El nombre no puede estar vacío.');
    return false;
  }
  if (valor.length < 5) {
    marcarInvalido(inputNombre, msgEl, 'El nombre debe tener al menos 5 caracteres.');
    return false;
  }
  marcarValido(inputNombre, msgEl);
  return true;
}

function validarDescripcion() {
  const msgEl = document.getElementById('msgDesc');
  const valor = inputDesc.value.trim();
  if (valor === '') {
    marcarInvalido(inputDesc, msgEl, 'La descripción no puede estar vacía.');
    return false;
  }
  if (valor.length < 20) {
    marcarInvalido(inputDesc, msgEl, `Descripción muy corta (${valor.length}/20 caracteres mínimos).`);
    return false;
  }
  marcarValido(inputDesc, msgEl);
  return true;
}

function validarCategoria() {
  const msgEl = document.getElementById('msgCategoria');
  if (selectCategoria.value === '') {
    marcarInvalido(selectCategoria, msgEl, 'Debes seleccionar una categoría.');
    return false;
  }
  marcarValido(selectCategoria, msgEl);
  return true;
}

// =============================================================
// RENDER: Tarjeta de producto (Semana 7 — estructura repetitiva)
// Futuro Flask: {% include 'components/tarjeta_producto.html' %}
// =============================================================
function crearTarjeta(prod, index) {
  const meta = metaCategoria[prod.categoria] || metaCategoria.otro;

  const col = document.createElement('div');
  col.classList.add('col-sm-6', 'col-lg-4');
  col.setAttribute('data-categoria', prod.categoria);

  // CONDICIÓN: badge de disponibilidad según estado del producto
  const estadoBadge = prod.disponible
    ? '<span class="badge bg-success ms-1">Disponible</span>'
    : '<span class="badge bg-danger ms-1">Agotado</span>';

  col.innerHTML = `
    <div class="card tarjeta-producto h-100">
      <div class="card-body text-center p-3">
        <div class="card-emoji" aria-hidden="true">${meta.emoji}</div>
        <span class="badge bg-${meta.color} mb-2">${meta.label}</span>
        ${estadoBadge}
        <h5 class="card-title mt-2">${prod.nombre}</h5>
        <p class="card-text text-muted small">${prod.descripcion}</p>
      </div>
      <div class="card-footer bg-transparent border-0 pb-3 text-center">
        <button class="btn btn-danger btn-sm btn-eliminar w-100" data-index="${index}" aria-label="Eliminar ${prod.nombre}">
          🗑️ Eliminar
        </button>
      </div>
    </div>
  `;

  col.querySelector('.btn-eliminar').addEventListener('click', function () {
    const idx = parseInt(this.dataset.index);
    productos.splice(idx, 1);
    renderizarCatalogo();
    renderizarTabla();
    crearFiltros();
  });

  return col;
}

// =============================================================
// RENDER: Catálogo completo con filtro activo
// Estructura repetitiva: forEach sobre productos[]
// =============================================================
function renderizarCatalogo() {
  catalogoEl.innerHTML = '';
  totalRegistros = 0;

  const productosFiltrados = filtroActivo === 'todos'
    ? productos
    : productos.filter(p => p.categoria === filtroActivo);

  // CONDICIÓN: mostrar mensaje si no hay productos
  if (productos.length === 0) {
    mensajeCatalogo.classList.remove('d-none');
  } else {
    mensajeCatalogo.classList.add('d-none');
  }

  // Estructura repetitiva: un forEach genera cada tarjeta sin repetir HTML
  productosFiltrados.forEach(function (prod) {
    const realIndex = productos.indexOf(prod);
    const tarjeta = crearTarjeta(prod, realIndex);
    catalogoEl.appendChild(tarjeta);
    totalRegistros++;
  });

  actualizarContador();
}

// =============================================================
// RENDER: Tabla de registros (Semana 7 — segunda estructura repetitiva)
// Futuro Flask: tabla renderizada vía Jinja2 for loop
// =============================================================
function renderizarTabla() {
  cuerpoTabla.innerHTML = '';

  // CONDICIÓN: mostrar advertencia si la tabla está vacía
  if (productos.length === 0) {
    mensajeTabla.classList.remove('d-none');
    return;
  }
  mensajeTabla.classList.add('d-none');

  // Estructura repetitiva sobre productos[]
  productos.forEach(function (prod, i) {
    const meta = metaCategoria[prod.categoria] || metaCategoria.otro;

    // CONDICIÓN: clase de fila según disponibilidad
    const estadoHtml = prod.disponible
      ? '<span class="badge bg-success">Disponible</span>'
      : '<span class="badge bg-danger">Agotado</span>';

    const tr = document.createElement('tr');
    tr.className = prod.disponible ? '' : 'table-danger';
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${meta.emoji}</td>
      <td>${prod.nombre}</td>
      <td><span class="badge bg-${meta.color}">${meta.label}</span></td>
      <td>${estadoHtml}</td>
    `;
    cuerpoTabla.appendChild(tr);
  });
}

// =============================================================
// RENDER: Filtros de categoría
// Generados dinámicamente desde las categorías presentes en productos[]
// =============================================================
function crearFiltros() {
  filtrosEl.innerHTML = '';

  const categorias = ['todos', ...new Set(productos.map(p => p.categoria))];

  categorias.forEach(function (cat) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-sm ' + (cat === filtroActivo ? 'btn-dark' : 'btn-outline-secondary');

    if (cat === 'todos') {
      btn.textContent = `📋 Todos (${productos.length})`;
    } else {
      const meta = metaCategoria[cat] || metaCategoria.otro;
      const count = productos.filter(p => p.categoria === cat).length;
      btn.textContent = `${meta.emoji} ${meta.label} (${count})`;
    }

    btn.addEventListener('click', function () {
      filtroActivo = cat;
      crearFiltros();
      renderizarCatalogo();
    });

    filtrosEl.appendChild(btn);
  });
}

// =============================================================
// RENDER: Stats (sección Quiénes Somos)
// Estructura repetitiva sobre arreglo stats[]
// =============================================================
function renderizarStats() {
  statsGridEl.innerHTML = '';
  stats.forEach(function (stat) {
    const div = document.createElement('div');
    div.className = 'stat-card';
    div.innerHTML = `<strong>${stat.valor}</strong><span>${stat.texto}</span>`;
    statsGridEl.appendChild(div);
  });
}

// =============================================================
// UTILIDADES
// =============================================================
function actualizarContador() {
  contadorEl.textContent = productos.length;
}

function mostrarAlertaExito() {
  alertaExito.classList.remove('d-none');
  setTimeout(function () {
    alertaExito.classList.add('d-none');
  }, 3000);
}

function limpiarFormulario() {
  formulario.reset();
  limpiarCampo(inputNombre,     document.getElementById('msgNombre'));
  limpiarCampo(inputDesc,       document.getElementById('msgDesc'));
  limpiarCampo(selectCategoria, document.getElementById('msgCategoria'));
}

// =============================================================
// EVENTO: submit del formulario
// Registra nuevo producto y re-renderiza secciones dinámicas
// =============================================================
formulario.addEventListener('submit', function (evento) {
  evento.preventDefault();

  const nombreValido      = validarNombre();
  const descripcionValida = validarDescripcion();
  const categoriaValida   = validarCategoria();

  if (!nombreValido || !descripcionValida || !categoriaValida) return;

  const nuevoProducto = {
    nombre:      inputNombre.value.trim(),
    descripcion: inputDesc.value.trim(),
    categoria:   selectCategoria.value,
    disponible:  true
  };

  productos.push(nuevoProducto);

  renderizarCatalogo();
  renderizarTabla();
  crearFiltros();
  mostrarAlertaExito();
  limpiarFormulario();

  document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// =============================================================
// EVENTOS: validación en tiempo real (Semana 6 — conservados)
// =============================================================
inputNombre.addEventListener('input', validarNombre);
inputDesc.addEventListener('input', validarDescripcion);
selectCategoria.addEventListener('change', validarCategoria);

inputNombre.addEventListener('blur', validarNombre);
inputDesc.addEventListener('blur', validarDescripcion);
selectCategoria.addEventListener('blur', validarCategoria);

// =============================================================
// INICIALIZACIÓN
// =============================================================
document.addEventListener('DOMContentLoaded', function () {
  renderizarStats();
  crearFiltros();
  renderizarCatalogo();
  renderizarTabla();
});
