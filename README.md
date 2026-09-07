# Tienda Nova — Proyecto Integrador

Aplicación Flask para administrar una tienda de periféricos, accesorios gaming y tecnología.

La aplicación utiliza Flask-WTF, validación CSRF, SQLite y plantillas Jinja2. La base local se crea automáticamente en `data/tienda_perifericos.db`.

## Ejecutar localmente

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python app.py
```

Abre http://127.0.0.1:5000/.

## Rutas principales

- `/productos` — catálogo de periféricos almacenados en SQLite.
- `/productos/nuevo` — formulario GET/POST para registrar periféricos.
- `/clientes`, `/clientes/nuevo` — módulo de clientes.
- `/proveedores`, `/proveedores/nuevo` — módulo de proveedores tecnológicos.
- `/facturacion`, `/facturacion/nueva` — módulo de facturación.

La base de datos debe probarse localmente; GitHub Pages conserva únicamente la parte estática del proyecto.
