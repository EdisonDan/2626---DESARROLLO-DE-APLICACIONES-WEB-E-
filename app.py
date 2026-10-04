import os

from flask import Flask, flash, redirect, render_template, request, url_for
from flask_login import (LoginManager, current_user, login_required,
                         login_user, logout_user)
from flask_wtf.csrf import CSRFProtect
from psycopg2 import errors

from conexion.conexion import get_connection, init_db
from forms.cliente_form import ClienteForm
from forms.facturacion_form import FacturacionForm
from forms.login_form import LoginForm
from forms.producto_form import ProductoForm
from forms.proveedor_form import ProveedorForm
from forms.usuario_form import UsuarioForm
from models import Usuario

app = Flask(__name__)
# La clave se lee del entorno; en Render se genera automáticamente (render.yaml).
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "clave-solo-para-desarrollo-local")
csrf = CSRFProtect(app)  # protege también los POST de eliminar

login_manager = LoginManager(app)
login_manager.login_view = "login"
login_manager.login_message = "Inicia sesión para acceder a esta página."
login_manager.login_message_category = "warning"


@login_manager.user_loader
def load_user(user_id):
    return Usuario.obtener_por_id(int(user_id))


# ---------------------------------------------------------------------------
# Utilidades de base de datos (consultas parametrizadas, cierre garantizado)
# ---------------------------------------------------------------------------
def consultar(sql, params=(), uno=False):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(sql, params)
            return cur.fetchone() if uno else cur.fetchall()
    finally:
        conn.close()


def ejecutar(sql, params=()):
    """INSERT / UPDATE / DELETE con commit(). Devuelve filas afectadas."""
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(sql, params)
            filas = cur.rowcount
        conn.commit()
        return filas
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def opciones_proveedores():
    filas = consultar("SELECT id_proveedor, nombre FROM proveedores ORDER BY nombre")
    return [(f["id_proveedor"], f["nombre"]) for f in filas]


def opciones_clientes():
    filas = consultar("SELECT id_cliente, nombre, cedula FROM clientes ORDER BY nombre")
    return [(f["id_cliente"], f"{f['nombre']} ({f['cedula']})") for f in filas]


def eliminar_registro(sql, id_registro, nombre, destino):
    """DELETE ... WHERE id = %s, controlando la restricción de clave foránea."""
    try:
        if ejecutar(sql, (id_registro,)):
            flash(f"{nombre} eliminado correctamente.", "success")
        else:
            flash("El registro no existe.", "warning")
    except errors.ForeignKeyViolation:
        flash(f"No se puede eliminar: {nombre.lower()} tiene registros relacionados.", "danger")
    return redirect(url_for(destino))


def pagina_siguiente():
    """Evita redirecciones abiertas: solo rutas internas."""
    destino = request.args.get("next", "")
    return destino if destino.startswith("/") and not destino.startswith("//") else None


init_db()


# ---------------------------------------------------------------------------
# Públicas y autenticación
# ---------------------------------------------------------------------------
@app.route("/")
def inicio():
    return render_template("index.html")


@app.route("/registro", methods=["GET", "POST"])
def registro():
    if current_user.is_authenticated:
        return redirect(url_for("dashboard"))
    form = UsuarioForm()
    if form.validate_on_submit():
        try:
            Usuario.crear(form.usuario.data.strip(), form.password.data)
            flash("Cuenta creada. Ya puedes iniciar sesión.", "success")
            return redirect(url_for("login"))
        except errors.UniqueViolation:
            form.usuario.errors.append("Ese nombre de usuario ya existe.")
    return render_template("registro.html", form=form)


@app.route("/login", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for("dashboard"))
    form = LoginForm()
    if form.validate_on_submit():
        usuario = Usuario.obtener_por_usuario(form.usuario.data.strip())
        if usuario and usuario.verificar_password(form.password.data):
            login_user(usuario)
            flash(f"Bienvenido, {usuario.usuario}.", "success")
            return redirect(pagina_siguiente() or url_for("dashboard"))
        flash("Usuario o contraseña incorrectos.", "danger")
    return render_template("login.html", form=form)


@app.route("/logout", methods=["GET", "POST"])
@login_required
def logout():
    logout_user()
    flash("Sesión cerrada correctamente.", "info")
    return redirect(url_for("login"))


@app.route("/dashboard")
@login_required
def dashboard():
    resumen = consultar(
        """
        SELECT (SELECT COUNT(*) FROM productos)   AS productos,
               (SELECT COUNT(*) FROM clientes)    AS clientes,
               (SELECT COUNT(*) FROM proveedores) AS proveedores,
               (SELECT COUNT(*) FROM facturas)    AS facturas
        """,
        uno=True,
    )
    return render_template("dashboard.html", resumen=resumen)


# ---------------------------------------------------------------------------
# Productos (JOIN con proveedores + búsqueda con WHERE)
# ---------------------------------------------------------------------------
@app.route("/productos")
@login_required
def productos():
    q = request.args.get("q", "").strip()
    sql = """
        SELECT p.id_producto, p.codigo, p.nombre, p.categoria, p.precio, p.stock,
               pr.nombre AS proveedor
        FROM productos p
        JOIN proveedores pr ON pr.id_proveedor = p.id_proveedor
    """
    params = ()
    if q:
        sql += " WHERE p.nombre ILIKE %s OR p.codigo ILIKE %s OR p.categoria ILIKE %s"
        params = (f"%{q}%",) * 3
    sql += " ORDER BY p.id_producto DESC"
    return render_template("productos.html", productos=consultar(sql, params), q=q)


@app.route("/productos/nuevo", methods=["GET", "POST"])
@login_required
def nuevo_producto():
    form = ProductoForm()
    form.id_proveedor.choices = opciones_proveedores()
    if form.validate_on_submit():
        try:
            ejecutar(
                """INSERT INTO productos (codigo, nombre, categoria, precio, stock, id_proveedor)
                   VALUES (%s, %s, %s, %s, %s, %s)""",
                (form.codigo.data, form.nombre.data, form.categoria.data,
                 form.precio.data, form.stock.data, form.id_proveedor.data),
            )
            flash("Periférico registrado correctamente en PostgreSQL.", "success")
            return redirect(url_for("productos"))
        except errors.UniqueViolation:
            form.codigo.errors.append("Ya existe un periférico con ese código.")
    return render_template("formulario_producto.html", form=form, titulo="Registrar periférico")


@app.route("/productos/<int:id_producto>/editar", methods=["GET", "POST"])
@login_required
def editar_producto(id_producto):
    fila = consultar("SELECT * FROM productos WHERE id_producto = %s", (id_producto,), uno=True)
    if not fila:
        flash("El periférico no existe.", "warning")
        return redirect(url_for("productos"))
    form = ProductoForm(data=fila) if request.method == "GET" else ProductoForm()
    form.id_proveedor.choices = opciones_proveedores()
    if form.validate_on_submit():
        try:
            ejecutar(
                """UPDATE productos
                   SET codigo = %s, nombre = %s, categoria = %s, precio = %s,
                       stock = %s, id_proveedor = %s
                   WHERE id_producto = %s""",
                (form.codigo.data, form.nombre.data, form.categoria.data,
                 form.precio.data, form.stock.data, form.id_proveedor.data, id_producto),
            )
            flash("Periférico actualizado correctamente.", "success")
            return redirect(url_for("productos"))
        except errors.UniqueViolation:
            form.codigo.errors.append("Ya existe otro periférico con ese código.")
    return render_template("formulario_producto.html", form=form, titulo="Editar periférico")


@app.route("/productos/<int:id_producto>/eliminar", methods=["POST"])
@login_required
def eliminar_producto(id_producto):
    return eliminar_registro("DELETE FROM productos WHERE id_producto = %s",
                             id_producto, "Periférico", "productos")


# ---------------------------------------------------------------------------
# Clientes
# ---------------------------------------------------------------------------
@app.route("/clientes")
@login_required
def clientes():
    filas = consultar(
        """
        SELECT c.id_cliente, c.nombre, c.cedula, c.telefono, c.email, c.ciudad,
               COUNT(f.id_factura) AS facturas
        FROM clientes c
        LEFT JOIN facturas f ON f.id_cliente = c.id_cliente
        GROUP BY c.id_cliente
        ORDER BY c.id_cliente DESC
        """
    )
    return render_template("clientes.html", clientes=filas)


@app.route("/clientes/nuevo", methods=["GET", "POST"])
@login_required
def nuevo_cliente():
    form = ClienteForm()
    if form.validate_on_submit():
        try:
            ejecutar(
                """INSERT INTO clientes (nombre, cedula, telefono, email, ciudad)
                   VALUES (%s, %s, %s, %s, %s)""",
                (form.nombre.data, form.cedula.data, form.telefono.data,
                 form.email.data, form.ciudad.data),
            )
            flash("Cliente registrado correctamente.", "success")
            return redirect(url_for("clientes"))
        except errors.UniqueViolation:
            form.cedula.errors.append("Ya existe un cliente con esa cédula.")
    return render_template("formulario_cliente.html", form=form, titulo="Registrar cliente")


@app.route("/clientes/<int:id_cliente>/editar", methods=["GET", "POST"])
@login_required
def editar_cliente(id_cliente):
    fila = consultar("SELECT * FROM clientes WHERE id_cliente = %s", (id_cliente,), uno=True)
    if not fila:
        flash("El cliente no existe.", "warning")
        return redirect(url_for("clientes"))
    form = ClienteForm(data=fila) if request.method == "GET" else ClienteForm()
    if form.validate_on_submit():
        try:
            ejecutar(
                """UPDATE clientes
                   SET nombre = %s, cedula = %s, telefono = %s, email = %s, ciudad = %s
                   WHERE id_cliente = %s""",
                (form.nombre.data, form.cedula.data, form.telefono.data,
                 form.email.data, form.ciudad.data, id_cliente),
            )
            flash("Cliente actualizado correctamente.", "success")
            return redirect(url_for("clientes"))
        except errors.UniqueViolation:
            form.cedula.errors.append("Ya existe otro cliente con esa cédula.")
    return render_template("formulario_cliente.html", form=form, titulo="Editar cliente")


@app.route("/clientes/<int:id_cliente>/eliminar", methods=["POST"])
@login_required
def eliminar_cliente(id_cliente):
    return eliminar_registro("DELETE FROM clientes WHERE id_cliente = %s",
                             id_cliente, "Cliente", "clientes")


# ---------------------------------------------------------------------------
# Proveedores
# ---------------------------------------------------------------------------
@app.route("/proveedores")
@login_required
def proveedores():
    filas = consultar(
        """
        SELECT pr.id_proveedor, pr.nombre, pr.ruc, pr.descripcion, pr.telefono,
               pr.ciudad, pr.categoria, COUNT(p.id_producto) AS productos
        FROM proveedores pr
        LEFT JOIN productos p ON p.id_proveedor = pr.id_proveedor
        GROUP BY pr.id_proveedor
        ORDER BY pr.id_proveedor DESC
        """
    )
    return render_template("proveedores.html", proveedores=filas)


@app.route("/proveedores/nuevo", methods=["GET", "POST"])
@login_required
def nuevo_proveedor():
    form = ProveedorForm()
    if form.validate_on_submit():
        try:
            ejecutar(
                """INSERT INTO proveedores (nombre, ruc, descripcion, telefono, ciudad, categoria)
                   VALUES (%s, %s, %s, %s, %s, %s)""",
                (form.nombre.data, form.ruc.data, form.descripcion.data,
                 form.telefono.data, form.ciudad.data, form.categoria.data),
            )
            flash("Proveedor registrado correctamente.", "success")
            return redirect(url_for("proveedores"))
        except errors.UniqueViolation:
            form.ruc.errors.append("Ya existe un proveedor con ese RUC.")
    return render_template("formulario_proveedor.html", form=form, titulo="Registrar proveedor")


@app.route("/proveedores/<int:id_proveedor>/editar", methods=["GET", "POST"])
@login_required
def editar_proveedor(id_proveedor):
    fila = consultar("SELECT * FROM proveedores WHERE id_proveedor = %s", (id_proveedor,), uno=True)
    if not fila:
        flash("El proveedor no existe.", "warning")
        return redirect(url_for("proveedores"))
    form = ProveedorForm(data=fila) if request.method == "GET" else ProveedorForm()
    if form.validate_on_submit():
        try:
            ejecutar(
                """UPDATE proveedores
                   SET nombre = %s, ruc = %s, descripcion = %s, telefono = %s,
                       ciudad = %s, categoria = %s
                   WHERE id_proveedor = %s""",
                (form.nombre.data, form.ruc.data, form.descripcion.data,
                 form.telefono.data, form.ciudad.data, form.categoria.data, id_proveedor),
            )
            flash("Proveedor actualizado correctamente.", "success")
            return redirect(url_for("proveedores"))
        except errors.UniqueViolation:
            form.ruc.errors.append("Ya existe otro proveedor con ese RUC.")
    return render_template("formulario_proveedor.html", form=form, titulo="Editar proveedor")


@app.route("/proveedores/<int:id_proveedor>/eliminar", methods=["POST"])
@login_required
def eliminar_proveedor(id_proveedor):
    return eliminar_registro("DELETE FROM proveedores WHERE id_proveedor = %s",
                             id_proveedor, "Proveedor", "proveedores")


# ---------------------------------------------------------------------------
# Facturación (JOIN con clientes)
# ---------------------------------------------------------------------------
@app.route("/facturacion")
@login_required
def facturacion():
    filas = consultar(
        """
        SELECT f.id_factura, f.numero, c.nombre AS cliente, f.fecha, f.subtotal, f.estado
        FROM facturas f
        JOIN clientes c ON c.id_cliente = f.id_cliente
        ORDER BY f.id_factura DESC
        """
    )
    return render_template("facturacion.html", facturas=filas)


@app.route("/facturacion/nueva", methods=["GET", "POST"])
@login_required
def nueva_factura():
    form = FacturacionForm()
    form.id_cliente.choices = opciones_clientes()
    if form.validate_on_submit():
        try:
            ejecutar(
                """INSERT INTO facturas (numero, id_cliente, fecha, subtotal, estado)
                   VALUES (%s, %s, %s, %s, %s)""",
                (form.numero.data, form.id_cliente.data, form.fecha.data,
                 form.subtotal.data, form.estado.data),
            )
            flash("Factura registrada correctamente.", "success")
            return redirect(url_for("facturacion"))
        except errors.UniqueViolation:
            form.numero.errors.append("Ya existe una factura con ese número.")
    return render_template("formulario_facturacion.html", form=form, titulo="Registrar factura")


@app.route("/facturacion/<int:id_factura>/editar", methods=["GET", "POST"])
@login_required
def editar_factura(id_factura):
    fila = consultar("SELECT * FROM facturas WHERE id_factura = %s", (id_factura,), uno=True)
    if not fila:
        flash("La factura no existe.", "warning")
        return redirect(url_for("facturacion"))
    form = FacturacionForm(data=fila) if request.method == "GET" else FacturacionForm()
    form.id_cliente.choices = opciones_clientes()
    if form.validate_on_submit():
        try:
            ejecutar(
                """UPDATE facturas
                   SET numero = %s, id_cliente = %s, fecha = %s, subtotal = %s, estado = %s
                   WHERE id_factura = %s""",
                (form.numero.data, form.id_cliente.data, form.fecha.data,
                 form.subtotal.data, form.estado.data, id_factura),
            )
            flash("Factura actualizada correctamente.", "success")
            return redirect(url_for("facturacion"))
        except errors.UniqueViolation:
            form.numero.errors.append("Ya existe otra factura con ese número.")
    return render_template("formulario_facturacion.html", form=form, titulo="Editar factura")


@app.route("/facturacion/<int:id_factura>/eliminar", methods=["POST"])
@login_required
def eliminar_factura(id_factura):
    return eliminar_registro("DELETE FROM facturas WHERE id_factura = %s",
                             id_factura, "Factura", "facturacion")


if __name__ == "__main__":
    app.run(debug=os.environ.get("FLASK_DEBUG") == "1")
