from flask import Flask, render_template, redirect, url_for, flash
from forms.producto_form import ProductoForm
from forms.cliente_form import ClienteForm
from forms.proveedor_form import ProveedorForm
from forms.facturacion_form import FacturacionForm

app = Flask(__name__)
app.config["SECRET_KEY"] = "cambia-esta-clave-en-produccion"

productos_data = [
    {"codigo": "P001", "nombre": "Martillo", "categoria": "Herramientas", "precio": 8.50, "stock": 25},
    {"codigo": "P002", "nombre": "Destornillador", "categoria": "Herramientas", "precio": 4.20, "stock": 30},
    {"codigo": "P003", "nombre": "Taladro", "categoria": "Eléctricos", "precio": 45.00, "stock": 10},
    {"codigo": "P004", "nombre": "Pintura blanca", "categoria": "Pintura", "precio": 12.00, "stock": 50},
    {"codigo": "P005", "nombre": "Llave inglesa", "categoria": "Herramientas", "precio": 6.75, "stock": 3},
    {"codigo": "P006", "nombre": "Cable eléctrico 10m", "categoria": "Eléctricos", "precio": 9.80, "stock": 0},
]

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
    return render_template("productos.html", productos=productos_data)

@app.route("/productos/nuevo", methods=["GET", "POST"])
def nuevo_producto():
    form = ProductoForm()
    if form.validate_on_submit():
        productos_data.append({"codigo": form.codigo.data, "nombre": form.nombre.data, "categoria": form.categoria.data, "precio": form.precio.data, "stock": form.stock.data})
        flash("Producto registrado correctamente.", "success")
        return redirect(url_for("productos"))
    return render_template("formulario_producto.html", form=form, titulo="Registrar producto")

@app.route("/clientes")
def clientes():
    return render_template("clientes.html", clientes=clientes_data)

@app.route("/clientes/nuevo", methods=["GET", "POST"])
def nuevo_cliente():
    form = ClienteForm()
    if form.validate_on_submit():
        clientes_data.append({"id": len(clientes_data) + 1, "nombre": form.nombre.data, "cedula": form.cedula.data, "telefono": form.telefono.data, "ciudad": form.ciudad.data, "tipo": "Regular"})
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
        proveedores_data.append({"nombre": form.nombre.data, "ruc": form.ruc.data, "descripcion": form.descripcion.data, "telefono": form.telefono.data, "ciudad": form.ciudad.data, "categoria": form.categoria.data})
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
        facturas_data.append({"numero": form.numero.data, "cliente": form.cliente.data, "fecha": form.fecha.data.strftime("%d/%m/%Y"), "subtotal": form.subtotal.data, "estado": form.estado.data})
        flash("Factura registrada correctamente.", "success")
        return redirect(url_for("facturacion"))
    return render_template("formulario_facturacion.html", form=form, titulo="Registrar factura")

if __name__ == "__main__":
    app.run(debug=True)
