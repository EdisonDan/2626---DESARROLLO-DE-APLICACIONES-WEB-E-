-- ============================================================
-- Tienda Nova - Esquema PostgreSQL
-- Se puede ejecutar varias veces: recrea la estructura si falta.
-- Relaciones:
--   proveedores 1 --- N productos      (productos.id_proveedor)
--   clientes    1 --- N facturas       (facturas.id_cliente)
-- ============================================================

CREATE TABLE IF NOT EXISTS usuarios (
    id        SERIAL PRIMARY KEY,
    usuario   VARCHAR(50) UNIQUE NOT NULL,
    password  VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS proveedores (
    id_proveedor  SERIAL PRIMARY KEY,
    nombre        VARCHAR(100) NOT NULL,
    ruc           VARCHAR(13)  NOT NULL UNIQUE,
    descripcion   VARCHAR(250) NOT NULL,
    telefono      VARCHAR(10)  NOT NULL,
    ciudad        VARCHAR(60)  NOT NULL,
    categoria     VARCHAR(60)  NOT NULL
);

CREATE TABLE IF NOT EXISTS clientes (
    id_cliente  SERIAL PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL,
    cedula      VARCHAR(10)  NOT NULL UNIQUE,
    telefono    VARCHAR(10)  NOT NULL,
    email       VARCHAR(120) NOT NULL,
    ciudad      VARCHAR(60)  NOT NULL
);

CREATE TABLE IF NOT EXISTS productos (
    id_producto   SERIAL PRIMARY KEY,
    codigo        VARCHAR(10)  NOT NULL UNIQUE,
    nombre        VARCHAR(80)  NOT NULL,
    categoria     VARCHAR(60)  NOT NULL,
    precio        NUMERIC(10,2) NOT NULL CHECK (precio > 0),
    stock         INTEGER NOT NULL CHECK (stock >= 0),
    id_proveedor  INTEGER NOT NULL
        REFERENCES proveedores (id_proveedor) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS facturas (
    id_factura  SERIAL PRIMARY KEY,
    numero      VARCHAR(20) NOT NULL UNIQUE,
    id_cliente  INTEGER NOT NULL
        REFERENCES clientes (id_cliente) ON DELETE RESTRICT,
    fecha       DATE NOT NULL,
    subtotal    NUMERIC(10,2) NOT NULL CHECK (subtotal > 0),
    estado      VARCHAR(10) NOT NULL
        CHECK (estado IN ('Pagada', 'Pendiente', 'Anulada'))
);
