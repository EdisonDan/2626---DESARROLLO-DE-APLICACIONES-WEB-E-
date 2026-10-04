"""Modelo de usuario compatible con Flask-Login (UserMixin) y acceso a la tabla usuarios."""
from flask_login import UserMixin
from werkzeug.security import check_password_hash, generate_password_hash

from conexion.conexion import get_connection


class Usuario(UserMixin):
    def __init__(self, id, usuario, password):
        self.id = id
        self.usuario = usuario
        self.password = password

    def verificar_password(self, password_plano):
        # Nunca se compara texto plano con lo almacenado: se usa el hash.
        return check_password_hash(self.password, password_plano)

    @staticmethod
    def _desde_fila(fila):
        return Usuario(fila["id"], fila["usuario"], fila["password"]) if fila else None

    @staticmethod
    def obtener_por_id(user_id):
        conn = get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute("SELECT id, usuario, password FROM usuarios WHERE id = %s", (user_id,))
                return Usuario._desde_fila(cur.fetchone())
        finally:
            conn.close()

    @staticmethod
    def obtener_por_usuario(nombre):
        conn = get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute("SELECT id, usuario, password FROM usuarios WHERE usuario = %s", (nombre,))
                return Usuario._desde_fila(cur.fetchone())
        finally:
            conn.close()

    @staticmethod
    def crear(nombre, password_plano):
        """Inserta el usuario con la contraseña protegida por hash."""
        conn = get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO usuarios (usuario, password) VALUES (%s, %s)",
                    (nombre, generate_password_hash(password_plano)),
                )
            conn.commit()
        finally:
            conn.close()
