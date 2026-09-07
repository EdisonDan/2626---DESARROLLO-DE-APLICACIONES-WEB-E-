# Proyecto Integrador: Flask + SQLite

## Ejecutar localmente

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python app.py
```

Abre http://127.0.0.1:5000/.

La base de datos SQLite se crea automáticamente en `data/ferreteria.db` al iniciar la aplicación. El módulo de productos utiliza el flujo formulario Flask-WTF -> validación -> INSERT parametrizado -> SELECT -> tabla Jinja2.

## Rutas principales

- `/productos` — consulta los productos almacenados en SQLite.
- `/productos/nuevo` — formulario GET/POST para registrar productos.
- `/clientes`, `/clientes/nuevo` — módulo demostrativo de clientes.
- `/proveedores`, `/proveedores/nuevo` — módulo demostrativo de proveedores.
- `/facturacion`, `/facturacion/nueva` — módulo demostrativo de facturación.
