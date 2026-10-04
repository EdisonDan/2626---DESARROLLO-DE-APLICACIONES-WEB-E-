// OPEN+ — lógica del sitio estático (catálogo, filtros, registro, tabla y modal)
const EMOJIS = { teclado: '⌨️', mouse: '🖱️', pantalla: '🖥️', audifonos: '🎧', mousepad: '🟦', otro: '📦' };
const NOMBRES = { teclado: 'Teclado', mouse: 'Mouse', pantalla: 'Pantalla', audifonos: 'Audífonos', mousepad: 'Mousepad', otro: 'Otro' };

const productos = [
  { nombre: 'Teclado Mecánico RGB', descripcion: 'Switches rojos, retroiluminación RGB y construcción en aluminio.', categoria: 'teclado', estado: 'Disponible' },
  { nombre: 'Mouse Gamer 7200 DPI', descripcion: 'Sensor óptico de alta precisión con 6 botones programables.', categoria: 'mouse', estado: 'Disponible' },
  { nombre: 'Monitor 24" Full HD', descripcion: 'Panel IPS de 75 Hz, ideal para estudio, oficina y gaming casual.', categoria: 'pantalla', estado: 'Pocas unidades' },
  { nombre: 'Audífonos Inalámbricos', descripcion: 'Bluetooth 5.0, micrófono integrado y hasta 30 horas de batería.', categoria: 'audifonos', estado: 'Disponible' },
  { nombre: 'Mousepad XL Gamer', descripcion: 'Superficie antideslizante de 80x30 cm con bordes cosidos.', categoria: 'mousepad', estado: 'Agotado' },
  { nombre: 'Webcam Full HD 1080p', descripcion: 'Enfoque automático y micrófono dual para clases y reuniones.', categoria: 'otro', estado: 'Disponible' },
];
let filtroActual = 'todos';
let ultimo = null;

const $ = (id) => document.getElementById(id);
const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const claseEstado = (e) => (e === 'Disponible' ? 'bg-success' : e === 'Agotado' ? 'bg-danger' : 'bg-warning text-dark');
const badgeEstado = (e) => `<span class="badge ${claseEstado(e)}">${esc(e)}</span>`;

function renderizarStats() {
  const cats = new Set(productos.map((p) => p.categoria)).size;
  const disp = productos.filter((p) => p.estado === 'Disponible').length;
  const datos = [[productos.length, 'Productos'], [cats, 'Categorías'], [disp, 'Disponibles'], ['10%', 'Dto. mayorista']];
  $('statsGrid').innerHTML = datos.map(([n, t]) => `<div class="stat-card"><strong>${n}</strong><span>${t}</span></div>`).join('');
}

function crearFiltros() {
  const cats = ['todos', ...new Set(productos.map((p) => p.categoria))];
  $('filtros').innerHTML = cats.map((c) =>
    `<button type="button" class="filtro-btn ${c === filtroActual ? 'activo' : ''}" data-cat="${c}">${c === 'todos' ? 'Todos' : NOMBRES[c]}</button>`).join('');
  $('filtros').querySelectorAll('button').forEach((b) => b.addEventListener('click', () => { filtroActual = b.dataset.cat; renderizarCatalogo(); crearFiltros(); }));
}

function renderizarCatalogo() {
  const lista = productos.map((p, i) => ({ ...p, i })).filter((p) => filtroActual === 'todos' || p.categoria === filtroActual);
  $('mensajeCatalogo').classList.toggle('d-none', productos.length > 0);
  $('catalogo-productos').innerHTML = lista.map((p) => `
    <div class="col-sm-6 col-lg-4 col-xl-3 reveal visible">
      <article class="tarjeta-producto">
        <div class="tarjeta-emoji" aria-hidden="true">${EMOJIS[p.categoria]}</div>
        <span class="badge badge-cat mb-2">${NOMBRES[p.categoria]}</span>
        <h3>${esc(p.nombre)}</h3>
        <p>${esc(p.descripcion)}</p>
        ${badgeEstado(p.estado)}
        <button type="button" class="btn btn-outline-secondary btn-sm mt-3" data-detalle="${p.i}">Ver detalle</button>
      </article>
    </div>`).join('');
  $('catalogo-productos').querySelectorAll('[data-detalle]').forEach((b) => b.addEventListener('click', () => abrirModal(productos[b.dataset.detalle])));
}

function renderizarTabla() {
  $('mensajeTabla').classList.toggle('d-none', productos.length > 0);
  $('cuerpoTabla').innerHTML = productos.map((p, i) => `
    <tr><td>${i + 1}</td><td aria-hidden="true">${EMOJIS[p.categoria]}</td><td class="fw-semibold">${esc(p.nombre)}</td>
    <td>${NOMBRES[p.categoria]}</td><td>${badgeEstado(p.estado)}</td>
    <td><button type="button" class="btn btn-outline-secondary btn-sm" data-fila="${i}">Ver</button></td></tr>`).join('');
  $('cuerpoTabla').querySelectorAll('[data-fila]').forEach((b) => b.addEventListener('click', () => abrirModal(productos[b.dataset.fila])));
  $('contadorRegistros').textContent = productos.length;
}

function abrirModal(p) {
  $('modalEmoji').textContent = EMOJIS[p.categoria];
  $('modalNombre').textContent = p.nombre;
  $('modalCategoria').textContent = NOMBRES[p.categoria];
  $('modalDescripcion').textContent = p.descripcion;
  $('modalEstado').innerHTML = badgeEstado(p.estado);
  bootstrap.Modal.getOrCreateInstance($('modalProducto')).show();
}

function refrescarTodo() { renderizarStats(); crearFiltros(); renderizarCatalogo(); renderizarTabla(); }

function marcar(idCampo, idMsg, mensaje) {
  $(idCampo).classList.toggle('is-invalid', !!mensaje);
  $(idMsg).textContent = mensaje;
  return !mensaje;
}

function iniciarFormulario() {
  const form = $('formProducto');
  const campos = {
    nombre: () => marcar('prodNombre', 'msgNombre', $('prodNombre').value.trim().length < 3 ? 'El nombre debe tener al menos 3 caracteres.' : ''),
    desc: () => marcar('prodDescripcion', 'msgDesc', $('prodDescripcion').value.trim().length < 20 ? 'La descripción debe tener al menos 20 caracteres.' : ''),
    cat: () => marcar('prodCategoria', 'msgCategoria', !$('prodCategoria').value ? 'Selecciona una categoría.' : ''),
  };
  ['prodNombre', 'prodDescripcion', 'prodCategoria'].forEach((id, i) => $(id).addEventListener('input', Object.values(campos)[i]));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const valido = Object.values(campos).map((f) => f()).every(Boolean);
    $('alertaExito').classList.add('d-none');
    $('alertaError').classList.toggle('d-none', valido);
    if (valido) $('alertaError').classList.add('show');
    if (!valido) return;
    $('spinnerRegistro').classList.remove('d-none');
    setTimeout(() => {
      ultimo = { nombre: $('prodNombre').value.trim(), descripcion: $('prodDescripcion').value.trim(), categoria: $('prodCategoria').value, estado: 'Disponible' };
      productos.push(ultimo);
      form.reset();
      $('spinnerRegistro').classList.add('d-none');
      $('alertaExito').classList.remove('d-none');
      $('alertaExito').classList.add('show');
      $('btnVerUltimo').disabled = false;
      refrescarTodo();
    }, 700);
  });
  $('btnVerUltimo').addEventListener('click', () => ultimo && abrirModal(ultimo));
}

function iniciarContacto() {
  const boton = document.querySelector('#contacto button.btn-primary');
  boton.addEventListener('click', () => {
    const ids = ['nombre', 'correo', 'asunto', 'mensajeContacto'];
    const vacios = ids.filter((id) => !$(id).value.trim());
    ids.forEach((id) => $(id).classList.toggle('is-invalid', vacios.includes(id)));
    const emailMal = $('correo').value.trim() && !/^\S+@\S+\.\S+$/.test($('correo').value);
    if (emailMal) $('correo').classList.add('is-invalid');
    boton.textContent = vacios.length || emailMal ? 'Revisa los campos marcados' : '✅ Mensaje enviado (demostración)';
    if (!vacios.length && !emailMal) ids.forEach((id) => ($(id).value = ''));
    setTimeout(() => (boton.textContent = 'Enviar mensaje'), 2500);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  refrescarTodo();
  iniciarFormulario();
  iniciarContacto();
  const obs = new IntersectionObserver((es) => es.forEach((x) => x.isIntersecting && (x.target.classList.add('visible'), obs.unobserve(x.target))), { threshold: 0.12 });
  document.querySelectorAll('.section-title, .stats-grid, .info-aside, .ratio, .table-responsive').forEach((el) => { el.classList.add('reveal'); obs.observe(el); });
});
