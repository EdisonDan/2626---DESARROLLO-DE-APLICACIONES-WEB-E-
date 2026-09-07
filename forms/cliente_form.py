from flask_wtf import FlaskForm
from wtforms import StringField, TelField, EmailField, SubmitField
from wtforms.validators import DataRequired, Length, Email, Regexp


class ClienteForm(FlaskForm):
    nombre = StringField("Nombre completo", validators=[
        DataRequired(message="El nombre es obligatorio."),
        Length(min=3, max=100, message="Debe tener entre 3 y 100 caracteres.")
    ])
    cedula = StringField("Cédula", validators=[
        DataRequired(message="La cédula es obligatoria."),
        Regexp(r"^\d{10}$", message="La cédula debe tener exactamente 10 dígitos.")
    ])
    telefono = TelField("Teléfono", validators=[
        DataRequired(message="El teléfono es obligatorio."),
        Regexp(r"^\d{7,10}$", message="Ingrese un teléfono válido.")
    ])
    email = EmailField("Correo electrónico", validators=[
        DataRequired(message="El correo es obligatorio."),
        Email(message="Ingrese un correo válido.")
    ])
    ciudad = StringField("Ciudad", validators=[
        DataRequired(message="La ciudad es obligatoria.")
    ])
    submit = SubmitField("Guardar cliente")
