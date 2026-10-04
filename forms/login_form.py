from flask_wtf import FlaskForm
from wtforms import PasswordField, StringField, SubmitField
from wtforms.validators import DataRequired, Length


class LoginForm(FlaskForm):
    usuario = StringField("Usuario", validators=[
        DataRequired(message="El usuario es obligatorio."),
        Length(min=3, max=50, message="Debe tener entre 3 y 50 caracteres."),
    ])
    password = PasswordField("Contraseña", validators=[
        DataRequired(message="La contraseña es obligatoria."),
    ])
    submit = SubmitField("Iniciar sesión")
