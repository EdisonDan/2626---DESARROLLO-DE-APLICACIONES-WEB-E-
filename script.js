/**
 * script.js — OPEN+
 * Módulo de gestión dinámica de productos
 * Autor: Daniel Garzón — Desarrollo de Aplicaciones Web 2026
 */

// ─── Estado global ───────────────────────────────────────────────
let totalRegistros = 0;

// ─── Referencias al DOM ──────────────────────────────────────────
const formulario      = document.getElementById('formProducto');
const inputNombre     = document.getElementById('prodNombre');
const inputDesc       = document.getElementById('prodDescripcion');
const selectCategoria = document.getElementById('prodCategoria');
const listaProductos  = document.getElementById('listaProductos');
const contadorEl      = document.getElementById('contadorRegistros');
const msgNombre       = document.getElementById('msgNombre');
const msgDesc         = document.getElementById('msgDesc');
const msgCategoria    = document.getElementById('msgCategoria');

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

// ─── Mostrar/ocultar mensaje de validación ────────────────────────
function mostrarError(elemento, mensaje) {
  elemento.textContent = mensaje;
  elemento.classList.remove('d-none');
}

function ocultarError(elemento) {
  elemento.textContent = '';
  elemento.classList.add('d-none');
}

// ─── Validar formulario ───────────────────────────────────────────
function validarFormulario() {
  let valido = true;

  if (inputNombre.value.trim() === '') {
    mostrarError(msgNombre, '⚠️ El nombre del producto no puede estar vacío.');
    inputNombre.classList.add('is-invalid');
    valido = false;
  } else {
    ocultarError(msgNombre);
    inputNombre.classList.remove('is-invalid');
    inputNombre.classList.add('is-valid');
  }

  if (inputDesc.value.trim() === '') {
    mostrarError(msgDesc, '⚠️ La descripción no puede estar vacía.');
    inputDesc.classList.add('is-invalid');
    valido = false;
  } else {
    ocultarError(msgDesc);
    inputDesc.classList.remove('is-invalid');
    inputDesc.classList.add('is-valid');
  }

  if (selectCategoria.value === '') {
    mostrarError(msgCategoria, '⚠️ Debes seleccionar una categoría.');
    selectCategoria.classList.add('is-invalid');
    valido = false;
  } else {
    ocultarError(msgCategoria);
    selectCategoria.classList.remove('is-invalid');
    selectCategoria.classList.add('is-valid');
  }

  return valido;
}

// ─── Crear tarjeta de producto ────────────────────────────────────
function crearTarjetaProducto(nombre, descripcion, categoria) {
  const icono = iconosCategoria[categoria] || '📦';
  const categoriaTexto = selectCategoria.options[selectCategoria.selectedIndex].text;

  // Columna wrapper
  const col = document.createElement('div');
  col.classList.add('col-sm-6', 'col-lg-4');

  // Card
  const card = document.createElement('div');
  card.classList.add('card', 'h-100', 'text-center', 'p-3', 'producto-dinamico');

  // Ícono
  const iconoEl = document.createElement('div');
  iconoEl.classList.add('card-icon');
  iconoEl.textContent = icono;

  // Card body
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const titulo = document.createElement('h5');
  titulo.classList.add('card-title');
  titulo.textContent = nombre;

  const desc = document.createElement('p');
  desc.classList.add('card-text');
  desc.textContent = descripcion;

  const badge = document.createElement('span');
  badge.classList.add('badge', 'bg-danger', 'mb-2');
  badge.textContent = categoriaTexto;

  // Botón eliminar
  const btnEliminar = document.createElement('button');
  btnEliminar.classList.add('btn', 'btn-outline-danger', 'btn-sm', 'mt-2', 'w-100');
  btnEliminar.textContent = '🗑️ Eliminar';

  // Evento click para eliminar
  btnEliminar.addEventListener('click', function () {
    col.remove();
    totalRegistros--;
    actualizarContador();
  });

  // Ensamblar
  cardBody.appendChild(badge);
  cardBody.appendChild(titulo);
  cardBody.appendChild(desc);
  cardBody.appendChild(btnEliminar);
  card.appendChild(iconoEl);
  card.appendChild(cardBody);
  col.appendChild(card);

  return col;
}

// ─── Manejar submit del formulario ────────────────────────────────
formulario.addEventListener('submit', function (evento) {
  evento.preventDefault(); // Evita que la página se recargue

  if (!validarFormulario()) return;

  const nombre      = inputNombre.value.trim();
  const descripcion = inputDesc.value.trim();
  const categoria   = selectCategoria.value;

  const tarjeta = crearTarjetaProducto(nombre, descripcion, categoria);
  listaProductos.appendChild(tarjeta);

  totalRegistros++;
  actualizarContador();

  // Limpiar formulario
  formulario.reset();
  [inputNombre, inputDesc, selectCategoria].forEach(el => {
    el.classList.remove('is-valid', 'is-invalid');
  });
  [msgNombre, msgDesc, msgCategoria].forEach(el => ocultarError(el));
});

// ─── Limpiar validaciones al escribir ────────────────────────────
[inputNombre, inputDesc, selectCategoria].forEach(campo => {
  campo.addEventListener('input', function () {
    this.classList.remove('is-invalid');
  });
});
