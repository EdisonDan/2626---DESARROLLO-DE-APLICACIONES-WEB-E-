/**
 * script.js - OPEN+
 * Semanas 6, 7 y 8: Validaciones + Catálogo + Bootstrap Modal/Spinner
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
const alertaError     = document.getElementById('alertaError');
const cuerpoTabla     = document.getElementById('cuerpoTabla');
const mensajeTabla    = document.getElementById('mensajeTabla');
const filtrosEl       = document.getElementById('filtros');
const statsGridEl     = document.getElementById('statsGrid');
const spinnerEl       = document.getElementById('spinnerRegistro');
const btnVerUltimo    = document.getElementById('btnVerUltimo');

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
      <div class="card-footer bg-transparent border-0 pb-3 text-center d-flex gap-2">
        <button class="btn btn-outline-primary btn-sm btn-detalle flex-fill"
                data-index="${index}" aria-label="Ver detalle de ${prod.nombre}">
          🔎 Detalle
        </button>
        <button class="btn btn-danger btn-sm btn-eliminar flex-fill"
                data-index="${index}" aria-label="Eliminar ${prod.nombre}">
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

  col.querySelector('.btn-detalle').addEventListener('click', function () {
    const idx = parseInt(this.dataset.index);
    abrirModal(idx);
  });

  return col;
}

// =============================================================
// RENDER: Catálogo completo con filtro activo
// =============================================================
function renderizarCatalogo() {
  catalogoEl.innerHTML = '';
  totalRegistros = 0;

  const productosFiltrados = filtroActivo === 'todos'
    ? productos
    : productos.filter(p => p.categoria === filtroActivo);

  if (productos.length === 0) {
    mensajeCatalogo.classList.remove('d-none');
  } else {
    mensajeCatalogo.classList.add('d-none');
  }

  productosFiltrados.forEach(function (prod) {
    const realIndex = productos.indexOf(prod);
    const tarjeta = crearTarjeta(prod, realIndex);
    catalogoEl.appendChild(tarjeta);
    totalRegistros++;
  });

  actualizarContador();
}

// =============================================================
// RENDER: Tabla de registros (Semana 7 + columna Detalle Semana 8)
// =============================================================
function renderizarTabla() {
  cuerpoTabla.innerHTML = '';

  if (productos.length === 0) {
    mensajeTabla.classList.remove('d-none');
    return;
  }
  mensajeTabla.classList.add('d-none');

  productos.forEach(function (prod, i) {
    const meta = metaCategoria[prod.categoria] || metaCategoria.otro;

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
      <td>
        <button class="btn btn-outline-primary btn-sm btn-detalle-tabla"
                data-index="${i}"
                data-bs-toggle="modal" data-bs-target="#modalProducto"
                aria-label="Ver detalle de ${prod.nombre}">
          🔎 Ver
        </button>
      </td>
    `;

    tr.querySelector('.btn-detalle-tabla').addEventListener('click', function () {
      abrirModal(parseInt(this.dataset.index));
    });

    cuerpoTabla.appendChild(tr);
  });
}

// =============================================================
// RENDER: Filtros de categoría
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
// MODAL — Semana 8
// Rellena y abre el modal con los datos del producto seleccionado
// =============================================================
function abrirModal(index) {
  const prod = productos[index];
  if (!prod) return;

  const meta = metaCategoria[prod.categoria] || metaCategoria.otro;

  document.getElementById('modalEmoji').textContent      = meta.emoji;
  document.getElementById('modalNombre').textContent     = prod.nombre;
  document.getElementById('modalCategoria').innerHTML    = `<span class="badge bg-${meta.color}">${meta.label}</span>`;
  document.getElementById('modalDescripcion').textContent = prod.descripcion;
  document.getElementById('modalEstado').innerHTML       = prod.disponible
    ? '<span class="badge bg-success">Disponible</span>'
    : '<span class="badge bg-danger">Agotado</span>';

  const modal = new bootstrap.Modal(document.getElementById('modalProducto'));
  modal.show();
}

// =============================================================
// SPINNER — Semana 8
// Muestra el spinner 1.2 s antes de registrar el producto
// =============================================================
function mostrarSpinner() {
  return new Promise(function (resolve) {
    spinnerEl.classList.remove('d-none');
    setTimeout(function () {
      spinnerEl.classList.add('d-none');
      resolve();
    }, 1200);
  });
}

// =============================================================
// UTILIDADES
// =============================================================
function actualizarContador() {
  contadorEl.textContent = productos.length;
}

function mostrarAlertaExito() {
  alertaError.classList.add('d-none');
  alertaExito.classList.remove('d-none', 'show');
  alertaExito.classList.add('show');
  setTimeout(function () {
    alertaExito.classList.remove('show');
    alertaExito.classList.add('d-none');
  }, 3000);
}

function mostrarAlertaError() {
  alertaExito.classList.add('d-none');
  alertaError.classList.remove('d-none', 'show');
  alertaError.classList.add('show');
  setTimeout(function () {
    alertaError.classList.remove('show');
    alertaError.classList.add('d-none');
  }, 4000);
}

function limpiarFormulario() {
  formulario.reset();
  limpiarCampo(inputNombre,     document.getElementById('msgNombre'));
  limpiarCampo(inputDesc,       document.getElementById('msgDesc'));
  limpiarCampo(selectCategoria, document.getElementById('msgCategoria'));
}

// =============================================================
// EVENTO: submit del formulario
// Semana 8: incorpora spinner y alerta de error
// =============================================================
formulario.addEventListener('submit', async function (evento) {
  evento.preventDefault();

  const nombreValido      = validarNombre();
  const descripcionValida = validarDescripcion();
  const categoriaValida   = validarCategoria();

  if (!nombreValido || !descripcionValida || !categoriaValida) {
    mostrarAlertaError();
    return;
  }

  // Deshabilitar botón durante el proceso
  const btnSubmit = formulario.querySelector('[type="submit"]');
  btnSubmit.disabled = true;

  // Mostrar spinner simulando proceso de carga
  await mostrarSpinner();

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

  // Habilitar botón "Ver detalle" del último producto
  btnVerUltimo.disabled = false;
  btnVerUltimo.dataset.index = productos.length - 1;
  btnVerUltimo.onclick = function () {
    abrirModal(productos.length - 1);
  };

  btnSubmit.disabled = false;

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
