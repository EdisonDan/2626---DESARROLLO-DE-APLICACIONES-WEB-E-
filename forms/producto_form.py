from flask_wtf import FlaskForm
from wtforms import StringField, DecimalField, IntegerField, SelectField, SubmitField
from wtforms.validators import DataRequired, InputRequired, Length, NumberRange


class ProductoForm(FlaskForm):
    codigo = StringField("Código", validators=[
        DataRequired(message="El código es obligatorio."),
        Length(min=2, max=10, message="Debe tener entre 2 y 10 caracteres.")
    ])
    nombre = StringField("Nombre", validators=[
        DataRequired(message="El nombre es obligatorio."),
        Length(min=3, max=80, message="Debe tener entre 3 y 80 caracteres.")
    ])
    categoria = StringField("Categoría", validators=[
        DataRequired(message="La categoría es obligatoria.")
    ])
    precio = DecimalField("Precio", places=2, validators=[
        DataRequired(message="El precio es obligatorio."),
        NumberRange(min=0.01, message="El precio debe ser mayor que 0.")
    ])
    stock = IntegerField("Stock", validators=[
        InputRequired(message="El stock es obligatorio."),  # DataRequired rechazaría el valor 0
        NumberRange(min=0, message="El stock no puede ser negativo.")
    ])
    id_proveedor = SelectField("Proveedor", coerce=int, validators=[
        DataRequired(message="Seleccione un proveedor.")
    ])
    submit = SubmitField("Guardar producto")
