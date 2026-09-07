from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, TelField, SubmitField
from wtforms.validators import DataRequired, Length, Regexp


class ProveedorForm(FlaskForm):
    nombre = StringField("Nombre del proveedor", validators=[
        DataRequired(message="El nombre es obligatorio."),
        Length(min=3, max=100, message="Debe tener entre 3 y 100 caracteres.")
    ])
    ruc = StringField("RUC", validators=[
        DataRequired(message="El RUC es obligatorio."),
        Regexp(r"^\d{13}$", message="El RUC debe tener exactamente 13 dígitos.")
    ])
    descripcion = TextAreaField("Descripción", validators=[
        DataRequired(message="La descripción es obligatoria."),
        Length(min=10, max=250, message="Debe tener entre 10 y 250 caracteres.")
    ])
    telefono = TelField("Teléfono", validators=[
        DataRequired(message="El teléfono es obligatorio."),
        Regexp(r"^\d{7,10}$", message="Ingrese un teléfono válido.")
    ])
    ciudad = StringField("Ciudad", validators=[DataRequired(message="La ciudad es obligatoria.")])
    categoria = StringField("Categoría", validators=[DataRequired(message="La categoría es obligatoria.")])
    submit = SubmitField("Guardar proveedor")
