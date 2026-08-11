# OPEN+ — Sistema de Gestión de Periféricos

Proyecto Integrador – Desarrollo de Aplicaciones Web  
**Daniel Garzón | 2026**

---

## 🗂️ Estructura del proyecto

```
OPEN+/
├── app.py                     ← Aplicación Flask principal
├── requirements.txt           ← Dependencias Python
│
├── templates/
│   ├── base.html              ← Plantilla base (Jinja2)
│   ├── index.html             ← Página principal informativa
│   ├── productos.html         ← Módulo Productos
│   ├── clientes.html          ← Módulo Clientes
│   ├── proveedores.html       ← Módulo Proveedores
│   └── facturacion.html       ← Módulo Facturación
│
└── static/
    ├── css/
    │   └── style.css          ← Estilos del proyecto
    ├── js/
    │   └── script.js          ← JavaScript del proyecto
    └── img/
        └── (imágenes)
```

---

## 🚀 Instalación y ejecución local

```bash
# 1. Crear entorno virtual
python -m venv venv

# 2. Activar entorno virtual
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 3. Instalar dependencias
pip install -r requirements.txt

# 4. Ejecutar la aplicación
python app.py
```

Accede desde el navegador en: **http://127.0.0.1:5000**

---

## 🔗 Rutas disponibles

| Ruta           | Módulo       |
|----------------|-------------|
| `/`            | Inicio       |
| `/productos`   | Productos    |
| `/clientes`    | Clientes     |
| `/proveedores` | Proveedores  |
| `/facturacion` | Facturación  |

---

## 📌 Tecnologías utilizadas

- **Python + Flask** — Backend y enrutamiento
- **Jinja2** — Motor de plantillas (herencia con `base.html`)
- **Bootstrap 5.3** — Diseño responsive
- **HTML5 / CSS3 / JavaScript** — Frontend

> ⚠️ En esta etapa no se requiere base de datos. Los datos son demostrativos.
