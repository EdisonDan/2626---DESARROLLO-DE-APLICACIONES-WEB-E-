# Tienda Nova — Proyecto Integrador

Aplicación Flask para administrar una tienda de periféricos, accesorios gaming y tecnología.
Usa **PostgreSQL**, **Flask-WTF** (validación + CSRF), **Flask-Login** (sesiones), **Werkzeug** (hash de contraseñas) y plantillas **Jinja2** con Bootstrap.

## Modelo relacional (`sql/esquema.sql`)

| Tabla | Clave primaria | Claves foráneas |
|---|---|---|
| `usuarios` | `id` | — |
| `proveedores` | `id_proveedor` | — |
| `clientes` | `id_cliente` | — |
| `productos` | `id_producto` | `id_proveedor → proveedores` |
| `facturas` | `id_factura` | `id_cliente → clientes` |

## Ejecutar localmente

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
copy .env.example .env      # completa DB_PASSWORD y SECRET_KEY (el .env NO se sube a GitHub)
# crear la base en PostgreSQL:  CREATE DATABASE tienda_nova;
python app.py
```

Al iniciar, la app ejecuta `sql/esquema.sql` (crea las tablas si no existen) y carga datos de demostración si la base está vacía.
Abre http://127.0.0.1:5000/ → **Crear cuenta** → **Iniciar sesión**.

## Funcionalidades

- **Login:** `/registro`, `/login`, `/logout`, `/dashboard`; contraseñas con `generate_password_hash` / `check_password_hash`; rutas internas protegidas con `@login_required`.
- **CRUD completo** (SELECT / INSERT / UPDATE / DELETE parametrizados) en Periféricos, Clientes, Proveedores y Facturación.
- **JOIN:** periféricos con su proveedor, facturas con su cliente, conteos con `LEFT JOIN`.
- **WHERE:** búsqueda de periféricos por nombre, código o categoría.
- Confirmación visual (modal Bootstrap) antes de eliminar; claves foráneas con `ON DELETE RESTRICT` (no se borra un proveedor con productos ni un cliente con facturas).

## Despliegue en Render

1. Sube el repositorio a GitHub.
2. En Render: **New → Blueprint** y selecciona el repositorio (usa `render.yaml`: crea PostgreSQL + servicio web, genera `SECRET_KEY` y conecta `DATABASE_URL`).
3. Abre la URL pública, crea una cuenta y prueba: Login → Listar → Agregar → Modificar → Eliminar → consulta relacionada → Cerrar sesión.

GitHub Pages solo publica la parte estática (`index.html`); Flask y PostgreSQL se comprueban en local y en Render.
