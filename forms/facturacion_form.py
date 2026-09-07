from flask_wtf import FlaskForm
from wtforms import StringField, DateField, DecimalField, SelectField, SubmitField
from wtforms.validators import DataRequired, NumberRange


class FacturacionForm(FlaskForm):
    numero = StringField("Número de factura", validators=[DataRequired(message="El número de factura es obligatorio.")])
    cliente = StringField("Cliente", validators=[DataRequired(message="El cliente es obligatorio.")])
    fecha = DateField("Fecha", format="%Y-%m-%d", validators=[DataRequired(message="La fecha es obligatoria.")])
    subtotal = DecimalField("Subtotal", places=2, validators=[
        DataRequired(message="El subtotal es obligatorio."),
        NumberRange(min=0.01, message="El subtotal debe ser mayor que 0.")
    ])
    estado = SelectField("Estado", choices=[("Pagada", "Pagada"), ("Pendiente", "Pendiente"), ("Anulada", "Anulada")], validators=[DataRequired(message="Seleccione un estado.")])
    submit = SubmitField("Guardar factura")
