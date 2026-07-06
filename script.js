/**
 * script.js - OPEN+
 * Semanas 6 y 7: Validaciones dinamicas + Catalogo con arreglos
 * Autor: Daniel Garzon - Desarrollo de Aplicaciones Web 2026
 */

// ─── Semana 7: Arreglo inicial de productos (datos del proyecto) ─────────────
const productos = [
  { nombre: 'Teclado Mecanico RGB', descripcion: 'Teclado gaming con switches azules y retroiluminacion RGB', categoria: 'teclado' },
  { nombre: 'Mouse Inalambrico Pro', descripcion: 'Mouse ergonomico con 3200 DPI y bateria de larga duracion', categoria: 'mouse' },
  { nombre: 'Monitor Full HD 24"', descripcion: 'Monitor IPS 24 pulgadas 1080p ideal para trabajo y entretenimiento', categoria: 'pantalla' },
  { nombre: 'Audifonos Gaming 7.1', descripcion: 'Audifonos con sonido surround y microfono retractil para gaming', categoria: 'audifonos' },
  { nombre: 'Mousepad XL Antideslizante', descripcion: 'Mousepad extra grande con base de goma antideslizante y bordes cosidos', categoria: 'mousepad' }
];

// ─── Iconos por categoria ────────────────────────────────────────────────────
const iconosCategoria = {
  teclado:  'TECLADO',
  mouse:    'MOUSE',
  pantalla: 'PANTALLA',
  audifonos:'AUDIFONOS',
  mousepad: 'MOUSEPAD',
  otro:     'OTRO'
};

const emojisCategoria = {
  teclado:  'keyboard',
  mouse:    'mouse-fill',
  pantalla: 'display',
  audifonos:'headphones',
  mousepad: 'tablet',
  otro:     'box-seam'
};

// ─── Estado global ───────────────────────────────────────────────────────────
let totalRegistros = 0;

// ─── Referencias al DOM ─────────────────────────────────────────────────────
const formulario      = document.getElementById('formProducto');
const inputNombre     = document.getElementById('prodNombre');
const inputDesc       = document.getElementById('prodDescripcion');
const selectCategoria = document.getElementById('prodCategoria');
const catalogoEl      = document.getElementById('catalogo-productos');
const mensajeCatalogo = document.getElementById('mensajeCatalogo');
const contadorEl      = document.getElementById('contadorRegistros');
const alertaExito     = document.getElementById('alertaExito');

// ─── Actualizar contador ──────────────────────────────────────────────────────
function actualizarContador() {
  contadorEl.textContent = totalRegistros;
}

// ─── Marcar campo como invalido ───────────────────────────────────────────────
function marcarInvalido(campo, msgEl, texto) {
  campo.classList.remove('is-valid');
  campo.classList.add('is-invalid');
  msgEl.textContent = texto;
}

// ─── Marcar campo como valido ─────────────────────────────────────────────────
function marcarValido(campo, msgEl) {
  campo.classList.remove('is-invalid');
  campo.classList.add('is-valid');
  msgEl.textContent = '';
}

// ─── Limpiar estado de un campo ───────────────────────────────────────────────
function limpiarCampo(campo, msgEl) {
  campo.classList.remove('is-valid', 'is-invalid');
  msgEl.textContent = '';
}

// ─── Validar campo Nombre ─────────────────────────────────────────────────────
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

// ─── Validar campo Descripcion ────────────────────────────────────────────────
function validarDescripcion() {
  const msgEl = document.getElementById('msgDesc');
  const valor = inputDesc.value.trim();
  if (valor === '') {
    marcarInvalido(inputDesc, msgEl, 'La descripcion no puede estar vacia.');
    return false;
  }
  if (valor.length < 20) {
    marcarInvalido(inputDesc, msgEl, 'La descripcion es muy corta (' + valor.length + '/20 caracteres minimos).');
    return false;
  }
  marcarValido(inputDesc, msgEl);
  return true;
}

// ─── Validar campo Categoria ──────────────────────────────────────────────────
function validarCategoria() {
  const msgEl = document.getElementById('msgCategoria');
  if (selectCategoria.value === '') {
    marcarInvalido(selectCategoria, msgEl, 'Debes seleccionar una categoria.');
    return false;
  }
  marcarValido(selectCategoria, msgEl);
  return true;
}

// ─── Semana 7: Crear tarjeta de producto (funcion reutilizable) ───────────────
function crearTarjeta(nombre, descripcion, categoria) {
  const etiqueta = iconosCategoria[categoria] || 'OTRO';

  const col = document.createElement('div');
  col.classList.add('col-sm-6', 'col-lg-4');

  const card = document.createElement('div');
  card.classList.add('card', 'h-100', 'text-center', 'p-3');

  const badge = document.createElement('span');
  badge.classList.add('badge', 'bg-danger', 'mb-2');
  badge.textContent = etiqueta;

  const titulo = document.createElement('h5');
  titulo.classList.add('card-title', 'mt-1');
  titulo.textContent = nombre;

  const desc = document.createElement('p');
  desc.classList.add('card-text', 'text-muted', 'small');
  desc.textContent = descripcion;

  const btnEliminar = document.createElement('button');
  btnEliminar.classList.add('btn', 'btn-outline-danger', 'btn-sm', 'mt-2', 'w-100');
  btnEliminar.textContent = 'Eliminar';

  // Evento eliminar
  btnEliminar.addEventListener('click', function () {
    col.remove();
    totalRegistros--;
    actualizarContador();
    // Condicion: si no quedan productos, mostrar mensaje
    verificarCatalogo();
  });

  card.appendChild(badge);
  card.appendChild(titulo);
  card.appendChild(desc);
  card.appendChild(btnEliminar);
  col.appendChild(card);
  return col;
}

// ─── Semana 7: Verificar si el catalogo esta vacio (condicion) ────────────────
function verificarCatalogo() {
  if (totalRegistros === 0) {
    mensajeCatalogo.classList.remove('d-none');
  } else {
    mensajeCatalogo.classList.add('d-none');
  }
}

// ─── Semana 7: Renderizar arreglo inicial de productos ────────────────────────
function renderizarProductosIniciales() {
  productos.forEach(function (prod) {
    const tarjeta = crearTarjeta(prod.nombre, prod.descripcion, prod.categoria);
    catalogoEl.appendChild(tarjeta);
    totalRegistros++;
  });
  actualizarContador();
  verificarCatalogo();
}

// ─── Mostrar alerta de exito ──────────────────────────────────────────────────
function mostrarAlertaExito() {
  alertaExito.classList.remove('d-none');
  setTimeout(function () {
    alertaExito.classList.add('d-none');
  }, 3000);
}

// ─── Limpiar formulario ───────────────────────────────────────────────────────
function limpiarFormulario() {
  formulario.reset();
  limpiarCampo(inputNombre, document.getElementById('msgNombre'));
  limpiarCampo(inputDesc, document.getElementById('msgDesc'));
  limpiarCampo(selectCategoria, document.getElementById('msgCategoria'));
}

// ─── EVENTO: submit del formulario ───────────────────────────────────────────
formulario.addEventListener('submit', function (evento) {
  evento.preventDefault(); // Semana 6: evita recarga de pagina

  const nombreValido      = validarNombre();
  const descripcionValida = validarDescripcion();
  const categoriaValida   = validarCategoria();

  // Solo registrar si todo es valido
  if (!nombreValido || !descripcionValida || !categoriaValida) return;

  const nombre      = inputNombre.value.trim();
  const descripcion = inputDesc.value.trim();
  const categoria   = selectCategoria.value;

  // Semana 7: agregar al arreglo y renderizar
  const nuevoProd = { nombre, descripcion, categoria };
  productos.push(nuevoProd);

  const tarjeta = crearTarjeta(nombre, descripcion, categoria);
  catalogoEl.appendChild(tarjeta);
  totalRegistros++;
  actualizarContador();
  verificarCatalogo();
  mostrarAlertaExito();
  limpiarFormulario();
});

// ─── EVENTOS: validacion en tiempo real (input) y al salir (blur) ─────────────
inputNombre.addEventListener('input', validarNombre);
inputDesc.addEventListener('input', validarDescripcion);
selectCategoria.addEventListener('change', validarCategoria);

inputNombre.addEventListener('blur', validarNombre);
inputDesc.addEventListener('blur', validarDescripcion);
selectCategoria.addEventListener('blur', validarCategoria);

// ─── Inicializar: renderizar productos del arreglo al cargar la pagina ────────
document.addEventListener('DOMContentLoaded', function () {
  renderizarProductosIniciales();
});
