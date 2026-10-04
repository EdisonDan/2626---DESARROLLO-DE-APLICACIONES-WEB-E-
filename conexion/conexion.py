"""Conexión centralizada a PostgreSQL.

Las credenciales NUNCA van en el código: se leen de variables de entorno
(o de un archivo .env local que no se sube a GitHub).

Opción 1 (Render):  DATABASE_URL=postgresql://usuario:clave@host:5432/basedatos
Opción 2 (local):   DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
"""
import os
from pathlib import Path

import psycopg2
import psycopg2.extras

BASE_DIR = Path(__file__).resolve().parent.parent
SQL_DIR = BASE_DIR / "sql"


def _cargar_env():
    """Carga un archivo .env local (si existe) sin depender de librerías extra."""
    env_file = BASE_DIR / ".env"
    if not env_file.exists():
        return
    for linea in env_file.read_text(encoding="utf-8").splitlines():
        linea = linea.strip()
        if not linea or linea.startswith("#") or "=" not in linea:
            continue
        clave, valor = linea.split("=", 1)
        os.environ.setdefault(clave.strip(), valor.strip().strip('"').strip("'"))


_cargar_env()


def get_connection():
    """Devuelve una conexión nueva. Los cursores devuelven filas tipo diccionario."""
    url = os.environ.get("DATABASE_URL")
    if url:
        return psycopg2.connect(
            url,
            cursor_factory=psycopg2.extras.RealDictCursor,
            sslmode=os.environ.get("DB_SSLMODE", "prefer"),
        )
    return psycopg2.connect(
        host=os.environ.get("DB_HOST", "localhost"),
        port=os.environ.get("DB_PORT", "5432"),
        dbname=os.environ.get("DB_NAME", "tienda_nova"),
        user=os.environ.get("DB_USER", "postgres"),
        password=os.environ.get("DB_PASSWORD", ""),
        cursor_factory=psycopg2.extras.RealDictCursor,
        sslmode=os.environ.get("DB_SSLMODE", "prefer"),
    )


def init_db():
    """Crea las tablas (esquema.sql) y, si la BD está vacía, carga datos de demostración."""
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute((SQL_DIR / "esquema.sql").read_text(encoding="utf-8"))
            cur.execute("SELECT COUNT(*) AS total FROM proveedores")
            if cur.fetchone()["total"] == 0:
                demo = SQL_DIR / "datos_demo.sql"
                if demo.exists():
                    cur.execute(demo.read_text(encoding="utf-8"))
        conn.commit()
    finally:
        conn.close()
