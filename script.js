/**
 * script.js — OPEN+
 * Semana 6: Validaciones dinámicas con JavaScript
 * Autor: Daniel Garzón — Desarrollo de Aplicaciones Web 2026
 */

// ─── Estado global ────────────────────────────────────────────────
let totalRegistros = 0;

// ─── Referencias al DOM ───────────────────────────────────────────
const formulario      = document.getElementById('formProducto');
const inputNombre     = document.getElementById('prodNombre');
const inputDesc       = document.getElementById('prodDescripcion');
const selectCategoria = document.getElementById('prodCategoria');
const listaProductos  = document.getElementById('listaProductos');
const contadorEl      = document.getElementById('contadorRegistros');
const alertaExito     = document.getElementById('alertaExito');

// ─── Íconos por categoría ─────────────────────────────────────────
const iconosCategoria = {
  teclado:   '⌨️',
  mouse:     '🖱️',
  pantalla:  '🖥️',
  audifonos: '🎧',
  mousepad:  '🖱️',
  otro:      '📦'
};

// ─── Actualizar contador ──────────────────────────────────────────
function actualizarContador() {
  contadorEl.textContent = totalRegistros;
}

// ─── Marcar campo como inválido ───────────────────────────────────
function marcarInvalido(campo, msgEl, texto) {
  campo.classList.remove('is-valid');
  campo.classList.add('is-invalid');
  msgEl.textContent = texto;
}

// ─── Marcar campo como válido ─────────────────────────────────────
function marcarValido(campo, msgEl) {
  campo.classList.remove('is-invalid');
  campo.classList.add('is-valid');
  msgEl.textContent = '';
}

// ─── Limpiar estado de un campo ───────────────────────────────────
function limpiarCampo(campo, msgEl) {
  campo.classList.remove('is-valid', 'is-invalid');
  msgEl.textContent = '';
}

// ─── Validar campo Nombre ─────────────────────────────────────────
function validarNombre() {
  const msgEl = document.getElementById('msgNombre');
  const valor = inputNombre.value.trim();

  if (valor === '') {
    marcarInvalido(inputNombre, msgEl, '⚠️ El nombre no puede estar vacío.');
    return false;
  }
  if (valor.length < 5) {
    marcarInvalido(inputNombre, msgEl, '⚠️ El nombre debe tener al menos 5 caracteres.');
    return false;
  }
  marcarValido(inputNombre, msgEl);
  return true;
}

// ─── Validar campo Descripción ────────────────────────────────────
function validarDescripcion() {
  const msgEl = document.getElementById('msgDesc');
  const valor = inputDesc.value.trim();

  if (valor === '') {
    marcarInvalido(inputDesc, msgEl, '⚠️ La descripción no puede estar vacía.');
    return false;
  }
  if (valor.length < 20) {
    marcarInvalido(inputDesc, msgEl, `⚠️ La descripción es muy corta (${valor.length}/20 caracteres mínimos).`);
    return false;
  }
  marcarValido(inputDesc, msgEl);
  return true;
}

// ─── Validar campo Categoría ──────────────────────────────────────
function validarCategoria() {
  const msgEl = document.getElementById('msgCategoria');

  if (selectCategoria.value === '') {
    marcarInvalido(selectCategoria, msgEl, '⚠️ Debes seleccionar una categoría.');
    return false;
  }
  marcarValido(selectCategoria, msgEl);
  return true;
}

// ─── Crear tarjeta de producto ────────────────────────────────────
function crearTarjetaProducto(nombre, descripcion, categoria) {
  const icono = iconosCategoria[categoria] || '📦';
  const categoriaTexto = selectCategoria.options[selectCategoria.selectedIndex].text;

  const col = document.createElement('div');
  col.classList.add('col-sm-6', 'col-lg-4');

  const card = document.createElement('div');
  card.classList.add('card', 'h-100', 'text-center', 'p-3', 'producto-dinamico');

  const iconoEl = document.createElement('div');
  iconoEl.classList.add('card-icon');
  iconoEl.textContent = icono;

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const badge = document.createElement('span');
  badge.classList.add('badge', 'bg-danger', 'mb-2');
  badge.textContent = categoriaTexto;

  const titulo = document.createElement('h5');
  titulo.classList.add('card-title');
  titulo.textContent = nombre;

  const desc = document.createElement('p');
  desc.classList.add('card-text');
  desc.textContent = descripcion;

  const btnEliminar = document.createElement('button');
  btnEliminar.classList.add('btn', 'btn-outline-danger', 'btn-sm', 'mt-2', 'w-100');
  btnEliminar.textContent = '🗑️ Eliminar';

  // Evento: eliminar tarjeta
  btnEliminar.addEventListener('click', function () {
    col.remove();
    totalRegistros--;
    actualizarContador();
  });

  cardBody.appendChild(badge);
  cardBody.appendChild(titulo);
  cardBody.appendChild(desc);
  cardBody.appendChild(btnEliminar);
  card.appendChild(iconoEl);
  card.appendChild(cardBody);
  col.appendChild(card);

  return col;
}

// ─── Mostrar alerta de éxito ──────────────────────────────────────
function mostrarAlertaExito() {
  alertaExito.classList.remove('d-none');
  setTimeout(function () {
    alertaExito.classList.add('d-none');
  }, 3000);
}

// ─── Limpiar formulario después de registrar ─────────────────────
function limpiarFormulario() {
  formulario.reset();
  limpiarCampo(inputNombre, document.getElementById('msgNombre'));
  limpiarCampo(inputDesc, document.getElementById('msgDesc'));
  limpiarCampo(selectCategoria, document.getElementById('msgCategoria'));
}

// ─── EVENTO: submit del formulario ───────────────────────────────
formulario.addEventListener('submit', function (evento) {
  evento.preventDefault(); // Evita que la página se recargue

  // Validar todos los campos
  const nombreValido      = validarNombre();
  const descripcionValida = validarDescripcion();
  const categoriaValida   = validarCategoria();

  // Solo registrar si todo es válido
  if (!nombreValido || !descripcionValida || !categoriaValida) return;

  const nombre      = inputNombre.value.trim();
  const descripcion = inputDesc.value.trim();
  const categoria   = selectCategoria.value;

  const tarjeta = crearTarjetaProducto(nombre, descripcion, categoria);
  listaProductos.appendChild(tarjeta);

  totalRegistros++;
  actualizarContador();
  mostrarAlertaExito();
  limpiarFormulario();
});

// ─── EVENTO: input (validación en tiempo real) ────────────────────
inputNombre.addEventListener('input', validarNombre);
inputDesc.addEventListener('input', validarDescripcion);
selectCategoria.addEventListener('change', validarCategoria);

// ─── EVENTO: blur (validar al salir del campo) ────────────────────
inputNombre.addEventListener('blur', validarNombre);
inputDesc.addEventListener('blur', validarDescripcion);
selectCategoria.addEventListener('blur', validarCategoria);
