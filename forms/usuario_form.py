import re

from flask_wtf import FlaskForm
from wtforms import PasswordField, StringField, SubmitField
from wtforms.validators import DataRequired, EqualTo, Length, Regexp, ValidationError


def _password_segura(form, field):
    p = field.data or ""
    if not (re.search(r"[A-Za-z]", p) and re.search(r"\d", p)):
        raise ValidationError("La contraseña debe combinar letras y números.")


class UsuarioForm(FlaskForm):
    usuario = StringField("Usuario", validators=[
        DataRequired(message="El usuario es obligatorio."),
        Length(min=3, max=50, message="Debe tener entre 3 y 50 caracteres."),
        Regexp(r"^[A-Za-z0-9_.-]+$", message="Solo letras, números, punto, guion y guion bajo."),
    ])
    password = PasswordField("Contraseña", validators=[
        DataRequired(message="La contraseña es obligatoria."),
        Length(min=6, max=72, message="Debe tener entre 6 y 72 caracteres."),
        _password_segura,
    ])
    confirmar = PasswordField("Confirmar contraseña", validators=[
        DataRequired(message="Confirme la contraseña."),
        EqualTo("password", message="Las contraseñas no coinciden."),
    ])
    submit = SubmitField("Crear cuenta")
