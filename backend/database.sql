-- PostgreSQL Compatible Schema for Solar Generator Monitoring System

-- Create usuarios table
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  correo VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create dispositivos table
CREATE TABLE IF NOT EXISTS dispositivos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  serie VARCHAR(255) UNIQUE NOT NULL,
  estado VARCHAR(50) DEFAULT 'OFFLINE',
  id_usuario INTEGER REFERENCES usuarios(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create mediciones table
CREATE TABLE IF NOT EXISTS mediciones (
  id SERIAL PRIMARY KEY,
  voltaje DECIMAL(5, 2) NOT NULL,
  corriente DECIMAL(5, 2) NOT NULL,
  potencia DECIMAL(8, 2) NOT NULL,
  temperatura DECIMAL(5, 2) NOT NULL,
  porcentaje_bateria DECIMAL(5, 2) NOT NULL,
  id_dispositivo INTEGER REFERENCES dispositivos(id),
  fecha TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create ubicaciones (GPS) table
CREATE TABLE IF NOT EXISTS ubicaciones (
  id SERIAL PRIMARY KEY,
  latitud DECIMAL(10, 8) NOT NULL,
  longitud DECIMAL(11, 8) NOT NULL,
  id_dispositivo INTEGER REFERENCES dispositivos(id),
  fecha TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create alertas table
CREATE TABLE IF NOT EXISTS alertas (
  id SERIAL PRIMARY KEY,
  tipo VARCHAR(100) NOT NULL,
  mensaje TEXT,
  id_dispositivo INTEGER REFERENCES dispositivos(id),
  fecha TIMESTAMP NOT NULL,
  leida BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create configuracion table
CREATE TABLE IF NOT EXISTS configuracion (
  id SERIAL PRIMARY KEY,
  nombre_dispositivo VARCHAR(255),
  intervalo_envio INTEGER DEFAULT 60,
  id_dispositivo INTEGER REFERENCES dispositivos(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_dispositivo_fecha ON mediciones(id_dispositivo, fecha);
CREATE INDEX IF NOT EXISTS idx_dispositivo_fecha_ubicaciones ON ubicaciones(id_dispositivo, fecha);
CREATE INDEX IF NOT EXISTS idx_dispositivo_leida ON alertas(id_dispositivo, leida);
CREATE INDEX IF NOT EXISTS idx_usuarios_correo ON usuarios(correo);
CREATE INDEX IF NOT EXISTS idx_dispositivos_serie ON dispositivos(serie);
CREATE INDEX IF NOT EXISTS idx_dispositivos_usuario ON dispositivos(id_usuario);
