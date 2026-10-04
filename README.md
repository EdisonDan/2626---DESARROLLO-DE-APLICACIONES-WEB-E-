# Tienda Nova — Proyecto Integrador Final

Sistema web académico para administrar una tienda de periféricos, accesorios gaming y tecnología. Integra los avances de las semanas 13 a 16: PostgreSQL, autenticación, CRUD completo, relaciones entre tablas y despliegue en Render.

## Tecnologías

- Python 3.12 y Flask.
- PostgreSQL mediante `psycopg2-binary`.
- Flask-WTF y WTForms para formularios, validaciones y protección CSRF.
- Flask-Login para autenticación, sesiones y rutas privadas.
- Werkzeug para generar y comprobar hashes de contraseñas.
- Jinja2, Bootstrap, CSS y JavaScript para la interfaz.
- Gunicorn y Render para publicación del backend.

## Modelo relacional

| Tabla | Clave primaria | Relación |
|---|---|---|
| `usuarios` | `id` | Autenticación del sistema |
| `proveedores` | `id_proveedor` | Un proveedor tiene muchos productos |
| `productos` | `id_producto` | `id_proveedor` → `proveedores` |
| `clientes` | `id_cliente` | Un cliente tiene muchas facturas |
| `facturas` | `id_factura` | `id_cliente` → `clientes` |

El archivo `sql/esquema.sql` crea la estructura. `sql/datos_demo.sql` carga información inicial únicamente cuando no existen proveedores.

## Funcionalidades finales

- Registro de usuarios con contraseña protegida mediante `generate_password_hash()`.
- Login con `check_password_hash()`, sesión con Flask-Login y cierre de sesión por POST.
- Rutas administrativas protegidas con `@login_required`.
- CRUD completo de periféricos, clientes, proveedores y facturación.
- Consultas SQL parametrizadas con `%s` para evitar concatenar datos recibidos.
- `JOIN` entre productos y proveedores, y entre facturas y clientes.
- Búsqueda de periféricos mediante `WHERE` e `ILIKE`.
- Confirmación visual antes de eliminar y protección CSRF en formularios POST.
- Restricciones `ON DELETE RESTRICT` para proteger registros relacionados.

## Estructura principal

```text
app.py
models.py
conexion/
  conexion.py
forms/
sql/
  esquema.sql
  datos_demo.sql
templates/
  components/
static/
  css/style.css
  js/script.js
requirements.txt
render.yaml
```

## Ejecución local

1. Instala PostgreSQL y crea la base de datos:

```sql
CREATE DATABASE tienda_nova;
```

2. Prepara y activa el entorno virtual en PowerShell:

```powershell
python -m venv venv
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

3. Crea el archivo local de configuración:

```powershell
Copy-Item .env.example .env
notepad .env
```

4. Completa `DB_PASSWORD` y cambia `SECRET_KEY`. El archivo `.env` está ignorado por Git y no debe subirse.

5. Ejecuta el sistema:

```powershell
python app.py
```

6. Abre `http://127.0.0.1:5000`, crea una cuenta e inicia sesión. Al arrancar, Flask ejecuta `sql/esquema.sql` y, si corresponde, carga `sql/datos_demo.sql`.

## Despliegue en Render

1. En Render selecciona **New → Blueprint**.
2. Conecta este repositorio y usa `render.yaml`.
3. El Blueprint crea PostgreSQL y el servicio Flask, enlaza `DATABASE_URL`, genera `SECRET_KEY` y ejecuta `gunicorn app:app`.
4. En la URL pública registra un usuario y prueba: Login → Listar → Agregar → Modificar → Eliminar → consulta relacionada → Cerrar sesión.

GitHub Pages muestra únicamente una demostración estática del frontend. Flask, el login, las sesiones y PostgreSQL funcionan localmente y en Render.

## Prueba de defensa

1. Registrar un usuario y mostrar que la columna `password` contiene un hash.
2. Intentar entrar con una contraseña incorrecta.
3. Iniciar sesión correctamente y comprobar el nombre del usuario en la barra.
4. Abrir Periféricos y explicar el `JOIN` con Proveedores.
5. Agregar, editar y eliminar un registro.
6. Repetir el CRUD en Clientes, Proveedores y Facturación si el docente lo solicita.
7. Cerrar sesión e intentar abrir `/dashboard` para demostrar la redirección al login.
8. Reiniciar la aplicación y verificar la persistencia en PostgreSQL.

## Enlaces de entrega

- Repositorio: `https://github.com/EdisonDan/2626---DESARROLLO-DE-APLICACIONES-WEB-E-`
- GitHub Pages: `https://edisondan.github.io/2626---DESARROLLO-DE-APLICACIONES-WEB-E-/`
- Render: pegar aquí la URL pública una vez creado el Blueprint.
