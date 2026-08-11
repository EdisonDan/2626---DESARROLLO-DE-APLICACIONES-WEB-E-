# =============================================
# OPEN+ — Aplicación Flask
# Daniel Garzón — 2026
# =============================================

from flask import Flask, render_template

app = Flask(__name__)

# ---- Datos de demostración ----

PRODUCTOS = [
    {"id": 1, "nombre": "Teclado Mecánico RGB", "precio": 45.99, "stock": 30, "categoria": "Teclados", "emoji": "⌨️"},
    {"id": 2, "nombre": "Mouse Gaming 6400 DPI", "precio": 28.50, "stock": 50, "categoria": "Mouse", "emoji": "🖱️"},
    {"id": 3, "nombre": "Audífonos Inalámbricos", "precio": 62.00, "stock": 20, "categoria": "Audio", "emoji": "🎧"},
    {"id": 4, "nombre": "Monitor 24\" Full HD", "precio": 189.99, "stock": 10, "categoria": "Monitores", "emoji": "🖥️"},
    {"id": 5, "nombre": "Webcam 1080p", "precio": 35.00, "stock": 25, "categoria": "Cámaras", "emoji": "📷"},
    {"id": 6, "nombre": "Hub USB-C 7 en 1", "precio": 22.75, "stock": 40, "categoria": "Accesorios", "emoji": "🔌"},
]

CLIENTES = [
    {"id": 1, "nombre": "Carlos Mendoza",    "email": "cmendoza@gmail.com",   "ciudad": "Quito",     "tipo": "Mayorista"},
    {"id": 2, "nombre": "Ana Torres",        "email": "atorres@hotmail.com",  "ciudad": "Guayaquil", "tipo": "Minorista"},
    {"id": 3, "nombre": "Luis Paredes",      "email": "lparedes@yahoo.com",   "ciudad": "Cuenca",    "tipo": "Mayorista"},
    {"id": 4, "nombre": "Sofía Ramírez",     "email": "sramirez@gmail.com",   "ciudad": "Quito",     "tipo": "Minorista"},
    {"id": 5, "nombre": "Empresa TechSur",   "email": "info@techsur.ec",      "ciudad": "Ambato",    "tipo": "Corporativo"},
]

PROVEEDORES = [
    {"id": 1, "empresa": "TechDistrib S.A.",    "contacto": "Marco Vega",    "telefono": "0991234567", "pais": "Ecuador",  "categoria": "Periféricos"},
    {"id": 2, "empresa": "GlobalTech Import",   "contacto": "Diana López",   "telefono": "0987654321", "pais": "Colombia", "categoria": "Monitores"},
    {"id": 3, "empresa": "ElectroMundo Cía.",   "contacto": "Roberto Silva", "telefono": "0976543210", "pais": "Ecuador",  "categoria": "Audio"},
    {"id": 4, "empresa": "AsiaComponents Co.",  "contacto": "Yuki Tanaka",   "telefono": "0965432109", "pais": "Perú",     "categoria": "Accesorios"},
]

FACTURAS = [
    {"id": "F-001", "cliente": "Carlos Mendoza",  "fecha": "2026-07-15", "total": 274.97, "estado": "Pagada",   "items": 3},
    {"id": "F-002", "cliente": "Ana Torres",       "fecha": "2026-07-22", "total":  89.49, "estado": "Pendiente","items": 2},
    {"id": "F-003", "cliente": "Empresa TechSur",  "fecha": "2026-08-01", "total": 569.95, "estado": "Pagada",   "items": 5},
    {"id": "F-004", "cliente": "Luis Paredes",     "fecha": "2026-08-05", "total": 127.50, "estado": "Anulada",  "items": 1},
    {"id": "F-005", "cliente": "Sofía Ramírez",    "fecha": "2026-08-10", "total":  62.00, "estado": "Pendiente","items": 1},
]

# ---- Rutas ----

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/productos')
def productos():
    total_stock = sum(p['stock'] for p in PRODUCTOS)
    return render_template('productos.html', productos=PRODUCTOS, total_stock=total_stock)

@app.route('/clientes')
def clientes():
    mayoristas = sum(1 for c in CLIENTES if c['tipo'] == 'Mayorista')
    return render_template('clientes.html', clientes=CLIENTES, mayoristas=mayoristas)

@app.route('/proveedores')
def proveedores():
    return render_template('proveedores.html', proveedores=PROVEEDORES)

@app.route('/facturacion')
def facturacion():
    total_ventas = sum(f['total'] for f in FACTURAS if f['estado'] == 'Pagada')
    pendientes   = sum(1 for f in FACTURAS if f['estado'] == 'Pendiente')
    return render_template('facturacion.html', facturas=FACTURAS,
                           total_ventas=total_ventas, pendientes=pendientes)

if __name__ == '__main__':
    app.run(debug=True)
