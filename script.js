/**
 * script.js - OPEN+
 * Semanas 6 y 7: Validaciones dinamicas + Catalogo con arreglos
 * Autor: Daniel Garzon - Desarrollo de Aplicaciones Web 2026
 */

// --- Semana 7: Arreglo inicial de productos ---
const productos = [
  { nombre: 'Teclado Mecanico RGB', descripcion: 'Teclado gaming con switches azules y retroiluminacion RGB', categoria: 'teclado' },
  { nombre: 'Mouse Inalambrico Pro', descripcion: 'Mouse ergonomico con 3200 DPI y bateria de larga duracion', categoria: 'mouse' },
  { nombre: 'Monitor Full HD 24"', descripcion: 'Monitor IPS 24 pulgadas 1080p ideal para trabajo y entretenimiento', categoria: 'pantalla' },
  { nombre: 'Audifonos Gaming 7.1', descripcion: 'Audifonos con sonido surround y microfono retractil para gaming', categoria: 'audifonos' },
  { nombre: 'Mousepad XL Antideslizante', descripcion: 'Mousepad extra grande con base de goma antideslizante y bordes cosidos', categoria: 'mousepad' }
];

// --- Emojis e iconos por categoria ---
const emojisCategoria = {
  teclado:   '⌨️',
  mouse:     '🖱️',
  pantalla:  '🖥️',
  audifonos: '🎧',
  mousepad:  '🖰️',
  otro:      '📦'
};

const nombresCategoria = {
  teclado:   'Teclado',
  mouse:     'Mouse',
  pantalla:  'Pantalla',
  audifonos: 'Audifonos',
  mousepad:  'Mousepad',
  otro:      'Otro'
};

// --- Estado global ---
let totalRegistros = 0;

// --- Referencias al DOM ---
const formulario      = document.getElementById('formProducto');
const inputNombre     = document.getElementById('prodNombre');
const inputDesc       = document.getElementById('prodDescripcion');
const selectCategoria = document.getElementById('prodCategoria');
const catalogoEl      = document.getElementById('catalogo-productos');
const mensajeCatalogo = document.getElementById('mensajeCatalogo');
const contadorEl      = document.getElementById('contadorRegistros');
const alertaExito     = document.getElementById('alertaExito');

// --- Actualizar contador ---
function actualizarContador() {
  contadorEl.textContent = totalRegistros;
}

// --- Marcar campo invalido ---
function marcarInvalido(campo, msgEl, texto) {
  campo.classList.remove('is-valid');
  campo.classList.add('is-invalid');
  msgEl.textContent = texto;
}

// --- Marcar campo valido ---
function marcarValido(campo, msgEl) {
  campo.classList.remove('is-invalid');
  campo.classList.add('is-valid');
  msgEl.textContent = '';
}

// --- Limpiar campo ---
function limpiarCampo(campo, msgEl) {
  campo.classList.remove('is-valid', 'is-invalid');
  msgEl.textContent = '';
}

// --- Validar Nombre ---
function validarNombre() {
  const msgEl = document.getElementById('msgNombre');
  const valor = inputNombre.value.trim();
  if (valor === '') {
    marcarInvalido(inputNombre, msgEl, 'El nombre no puede estar vacio.');
    return false;
  }
  if (valor.length < 5) {
    marcarInvalido(inputNombre, msgEl, 'El nombre debe tener al menos 5 caracteres.');
    return false;
  }
  marcarValido(inputNombre, msgEl);
  return true;
}

// --- Validar Descripcion ---
function validarDescripcion() {
  const msgEl = document.getElementById('msgDesc');
  const valor = inputDesc.value.trim();
  if (valor === '') {
    marcarInvalido(inputDesc, msgEl, 'La descripcion no puede estar vacia.');
    return false;
  }
  if (valor.length < 20) {
    marcarInvalido(inputDesc, msgEl, 'Descripcion muy corta (' + valor.length + '/20 caracteres minimos).');
    return false;
  }
  marcarValido(inputDesc, msgEl);
  return true;
}

// --- Validar Categoria ---
function validarCategoria() {
  const msgEl = document.getElementById('msgCategoria');
  if (selectCategoria.value === '') {
    marcarInvalido(selectCategoria, msgEl, 'Debes seleccionar una categoria.');
    return false;
  }
  marcarValido(selectCategoria, msgEl);
  return true;
}

// --- Crear tarjeta de producto (mejorada) ---
function crearTarjeta(nombre, descripcion, categoria) {
  const emoji    = emojisCategoria[categoria]  || '📦';
  const etiqueta = nombresCategoria[categoria] || 'Otro';

  const col = document.createElement('div');
  col.classList.add('col-sm-6', 'col-lg-4');

  const card = document.createElement('div');
  card.classList.add('card', 'h-100', 'text-center', 'p-3', 'tarjeta-producto');

  // Emoji grande
  const emojiEl = document.createElement('div');
  emojiEl.classList.add('card-emoji');
  emojiEl.textContent = emoji;

  // Badge de categoria
  const badge = document.createElement('span');
  badge.classList.add('badge', 'bg-danger', 'mb-2');
  badge.textContent = etiqueta;

  // Titulo
  const titulo = document.createElement('h5');
  titulo.classList.add('card-title');
  titulo.textContent = nombre;

  // Descripcion
  const desc = document.createElement('p');
  desc.classList.add('card-text', 'text-muted', 'small');
  desc.textContent = descripcion;

  // Boton eliminar (fondo solido)
  const btnEliminar = document.createElement('button');
  btnEliminar.classList.add('btn', 'btn-danger', 'btn-sm', 'mt-2', 'w-100');
  btnEliminar.innerHTML = '&#128465; Eliminar';

  btnEliminar.addEventListener('click', function () {
    col.remove();
    totalRegistros--;
    actualizarContador();
    verificarCatalogo();
  });

  card.appendChild(emojiEl);
  card.appendChild(badge);
  card.appendChild(titulo);
  card.appendChild(desc);
  card.appendChild(btnEliminar);
  col.appendChild(card);
  return col;
}

// --- Verificar si el catalogo esta vacio ---
function verificarCatalogo() {
  if (totalRegistros === 0) {
    mensajeCatalogo.classList.remove('d-none');
  } else {
    mensajeCatalogo.classList.add('d-none');
  }
}

// --- Renderizar productos iniciales ---
function renderizarProductosIniciales() {
  productos.forEach(function (prod) {
    const tarjeta = crearTarjeta(prod.nombre, prod.descripcion, prod.categoria);
    catalogoEl.appendChild(tarjeta);
    totalRegistros++;
  });
  actualizarContador();
  verificarCatalogo();
}

// --- Mostrar alerta exito ---
function mostrarAlertaExito() {
  alertaExito.classList.remove('d-none');
  setTimeout(function () {
    alertaExito.classList.add('d-none');
  }, 3000);
}

// --- Limpiar formulario ---
function limpiarFormulario() {
  formulario.reset();
  limpiarCampo(inputNombre,     document.getElementById('msgNombre'));
  limpiarCampo(inputDesc,       document.getElementById('msgDesc'));
  limpiarCampo(selectCategoria, document.getElementById('msgCategoria'));
}

// --- EVENTO: submit ---
formulario.addEventListener('submit', function (evento) {
  evento.preventDefault();

  const nombreValido      = validarNombre();
  const descripcionValida = validarDescripcion();
  const categoriaValida   = validarCategoria();

  if (!nombreValido || !descripcionValida || !categoriaValida) return;

  const nombre      = inputNombre.value.trim();
  const descripcion = inputDesc.value.trim();
  const categoria   = selectCategoria.value;

  productos.push({ nombre, descripcion, categoria });

  const tarjeta = crearTarjeta(nombre, descripcion, categoria);
  catalogoEl.appendChild(tarjeta);
  totalRegistros++;
  actualizarContador();
  verificarCatalogo();
  mostrarAlertaExito();
  limpiarFormulario();
});

// --- EVENTOS: validacion en tiempo real ---
inputNombre.addEventListener('input', validarNombre);
inputDesc.addEventListener('input', validarDescripcion);
selectCategoria.addEventListener('change', validarCategoria);

inputNombre.addEventListener('blur', validarNombre);
inputDesc.addEventListener('blur', validarDescripcion);
selectCategoria.addEventListener('blur', validarCategoria);

// --- Inicializar al cargar la pagina ---
document.addEventListener('DOMContentLoaded', function () {
  renderizarProductosIniciales();
});
