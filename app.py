from pathlib import Path
import sqlite3

from flask import Flask, flash, redirect, render_template, url_for

from forms.cliente_form import ClienteForm
from forms.facturacion_form import FacturacionForm
from forms.producto_form import ProductoForm
from forms.proveedor_form import ProveedorForm

app = Flask(__name__)
app.config["SECRET_KEY"] = "cambia-esta-clave-en-produccion"

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
DATABASE = DATA_DIR / "ferreteria.db"


# --- Persistencia SQLite para productos ---
def get_db_connection():
    DATA_DIR.mkdir(exist_ok=True)
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db_connection()
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS productos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            codigo TEXT NOT NULL UNIQUE,
            nombre TEXT NOT NULL,
            categoria TEXT NOT NULL,
            precio REAL NOT NULL CHECK (precio > 0),
            stock INTEGER NOT NULL CHECK (stock >= 0)
        )
        """
    )
    conn.commit()
    conn.close()


init_db()

# --- Datos demostrativos de los módulos que se integrarán progresivamente ---
clientes_data = [
    {"id": 1, "nombre": "Juan Pérez", "cedula": "1723456789", "telefono": "0991234567", "ciudad": "Quito", "tipo": "VIP"},
    {"id": 2, "nombre": "María López", "cedula": "1712345678", "telefono": "0987654321", "ciudad": "Guayaquil", "tipo": "Regular"},
    {"id": 3, "nombre": "Carlos Ruiz", "cedula": "1709876543", "telefono": "0974561230", "ciudad": "Cuenca", "tipo": "Regular"},
    {"id": 4, "nombre": "Ana Torres", "cedula": "1798765432", "telefono": "0963452109", "ciudad": "Quito", "tipo": "VIP"},
    {"id": 5, "nombre": "Luis Mora", "cedula": "1787654321", "telefono": "0952341098", "ciudad": "Ambato", "tipo": "Regular"},
]

proveedores_data = [
    {"nombre": "Proveedor Andino", "ruc": "1790012345001", "descripcion": "Suministro de herramientas y materiales de construcción.", "telefono": "022345678", "ciudad": "Quito", "categoria": "Herramientas"},
    {"nombre": "Distribuidora Quito", "ruc": "1790023456001", "descripcion": "Proveedor de equipos eléctricos y cableado.", "telefono": "023456789", "ciudad": "Quito", "categoria": "Eléctricos"},
    {"nombre": "Comercial Centro", "ruc": "1790034567001", "descripcion": "Materiales para construcción y ferretería general.", "telefono": "024567890", "ciudad": "Guayaquil", "categoria": "Construcción"},
    {"nombre": "Pinturas del Ecuador", "ruc": "1790045678001", "descripcion": "Distribuidor oficial de pinturas y recubrimientos.", "telefono": "022678901", "ciudad": "Cuenca", "categoria": "Pintura"},
]

facturas_data = [
    {"numero": "F-001", "cliente": "Juan Pérez", "fecha": "12/08/2026", "subtotal": 25.00, "estado": "Pagada"},
    {"numero": "F-002", "cliente": "María López", "fecha": "12/08/2026", "subtotal": 48.50, "estado": "Pendiente"},
    {"numero": "F-003", "cliente": "Carlos Ruiz", "fecha": "11/08/2026", "subtotal": 16.75, "estado": "Pagada"},
    {"numero": "F-004", "cliente": "Ana Torres", "fecha": "10/08/2026", "subtotal": 92.30, "estado": "Pagada"},
    {"numero": "F-005", "cliente": "Luis Mora", "fecha": "09/08/2026", "subtotal": 34.00, "estado": "Anulada"},
]


@app.route("/")
def inicio():
    return render_template("index.html")


@app.route("/productos")
def productos():
    conn = get_db_connection()
    productos_data = conn.execute(
        "SELECT id, codigo, nombre, categoria, precio, stock FROM productos ORDER BY id DESC"
    ).fetchall()
    conn.close()
    return render_template("productos.html", productos=productos_data)


@app.route("/productos/nuevo", methods=["GET", "POST"])
def nuevo_producto():
    form = ProductoForm()

    if form.validate_on_submit():
        conn = get_db_connection()
        try:
            conn.execute(
                """
                INSERT INTO productos (codigo, nombre, categoria, precio, stock)
                VALUES (?, ?, ?, ?, ?)
                """,
                (
                    form.codigo.data,
                    form.nombre.data,
                    form.categoria.data,
                    form.precio.data,
                    form.stock.data,
                ),
            )
            conn.commit()
            flash("Producto registrado correctamente en SQLite.", "success")
            return redirect(url_for("productos"))
        except sqlite3.IntegrityError:
            form.codigo.errors.append("Ya existe un producto con ese código.")
        finally:
            conn.close()

    return render_template(
        "formulario_producto.html",
        form=form,
        titulo="Registrar producto",
    )


@app.route("/clientes")
def clientes():
    return render_template("clientes.html", clientes=clientes_data)


@app.route("/clientes/nuevo", methods=["GET", "POST"])
def nuevo_cliente():
    form = ClienteForm()
    if form.validate_on_submit():
        clientes_data.append({
            "id": len(clientes_data) + 1,
            "nombre": form.nombre.data,
            "cedula": form.cedula.data,
            "telefono": form.telefono.data,
            "ciudad": form.ciudad.data,
            "tipo": "Regular",
        })
        flash("Cliente registrado correctamente.", "success")
        return redirect(url_for("clientes"))
    return render_template("formulario_cliente.html", form=form, titulo="Registrar cliente")


@app.route("/proveedores")
def proveedores():
    return render_template("proveedores.html", proveedores=proveedores_data)


@app.route("/proveedores/nuevo", methods=["GET", "POST"])
def nuevo_proveedor():
    form = ProveedorForm()
    if form.validate_on_submit():
        proveedores_data.append({
            "nombre": form.nombre.data,
            "ruc": form.ruc.data,
            "descripcion": form.descripcion.data,
            "telefono": form.telefono.data,
            "ciudad": form.ciudad.data,
            "categoria": form.categoria.data,
        })
        flash("Proveedor registrado correctamente.", "success")
        return redirect(url_for("proveedores"))
    return render_template("formulario_proveedor.html", form=form, titulo="Registrar proveedor")


@app.route("/facturacion")
def facturacion():
    return render_template("facturacion.html", facturas=facturas_data)


@app.route("/facturacion/nueva", methods=["GET", "POST"])
def nueva_factura():
    form = FacturacionForm()
    if form.validate_on_submit():
        facturas_data.append({
            "numero": form.numero.data,
            "cliente": form.cliente.data,
            "fecha": form.fecha.data.strftime("%d/%m/%Y"),
            "subtotal": form.subtotal.data,
            "estado": form.estado.data,
        })
        flash("Factura registrada correctamente.", "success")
        return redirect(url_for("facturacion"))
    return render_template("formulario_facturacion.html", form=form, titulo="Registrar factura")


if __name__ == "__main__":
    app.run(debug=True)
