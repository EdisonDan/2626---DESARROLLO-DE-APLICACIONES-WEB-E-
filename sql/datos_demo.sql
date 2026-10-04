-- Datos de demostración (se cargan solo si la tabla proveedores está vacía).
INSERT INTO proveedores (nombre, ruc, descripcion, telefono, ciudad, categoria) VALUES
 ('TechImport Ecuador', '1790012345001', 'Distribuidor de teclados, mouse y accesorios para computadora.', '022345678', 'Quito', 'Periféricos'),
 ('Gaming Supply', '1790023456001', 'Proveedor de productos gaming y accesorios para jugadores.', '023456789', 'Quito', 'Gaming'),
 ('Digital Store Mayorista', '1790034567001', 'Distribuidor de audio, conectividad y accesorios tecnológicos.', '024567890', 'Guayaquil', 'Tecnología'),
 ('Componentes Andinos', '1790045678001', 'Proveedor de webcams, micrófonos y dispositivos para oficina.', '022678901', 'Cuenca', 'Oficina');

INSERT INTO clientes (nombre, cedula, telefono, email, ciudad) VALUES
 ('Juan Pérez', '1723456789', '0991234567', 'juan.perez@example.com', 'Quito'),
 ('María López', '1712345678', '0987654321', 'maria.lopez@example.com', 'Guayaquil'),
 ('Carlos Ruiz', '1709876543', '0974561230', 'carlos.ruiz@example.com', 'Cuenca');

INSERT INTO productos (codigo, nombre, categoria, precio, stock, id_proveedor) VALUES
 ('TEC-001', 'Teclado mecánico RGB', 'Teclados', 45.90, 30, 1),
 ('MOU-001', 'Mouse gamer 7200 DPI', 'Mouse', 22.50, 18, 2),
 ('AUD-001', 'Audífonos inalámbricos', 'Audio', 38.00, 4, 3),
 ('WEB-001', 'Webcam Full HD', 'Webcams', 29.99, 12, 4);

INSERT INTO facturas (numero, id_cliente, fecha, subtotal, estado) VALUES
 ('F-001', 1, '2026-08-12', 45.90, 'Pagada'),
 ('F-002', 2, '2026-08-12', 22.50, 'Pendiente'),
 ('F-003', 3, '2026-08-11', 38.00, 'Anulada');
