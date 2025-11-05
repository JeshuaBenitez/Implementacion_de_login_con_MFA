-- ─────────────────────────────────────────────────────────────
-- Base: loginmfa  (PostgreSQL)
-- Tablas: usuario, codigo_otp
-- ─────────────────────────────────────────────────────────────

-- Opcional: esquema dedicado
-- CREATE SCHEMA IF NOT EXISTS mfa;
-- SET search_path TO mfa, public;

-- 1) USUARIO
DROP TABLE IF EXISTS codigo_otp;
DROP TABLE IF EXISTS usuario;

CREATE TABLE usuario (
  id_usuario       BIGSERIAL PRIMARY KEY,
  nombre           VARCHAR(50)        NOT NULL,
  apellido         VARCHAR(50),
  contrasenia      VARCHAR(120)       NOT NULL,     -- almacena hash (BCrypt)
  correo           VARCHAR(120)       NOT NULL,
  fecha_creacion   TIMESTAMP          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  enabled          BOOLEAN            NOT NULL DEFAULT TRUE
);

-- índice único por correo (evita duplicados)
CREATE UNIQUE INDEX idx_usuario_correo_unique ON usuario (correo);

-- 2) CODIGO_OTP
CREATE TABLE codigo_otp (
  id_otp           BIGSERIAL PRIMARY KEY,
  codigo           INTEGER             NOT NULL,    -- 6 dígitos (000000–999999)
  fecha_creacion   TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_expiracion TIMESTAMP           NOT NULL,
  usado            BOOLEAN             NOT NULL DEFAULT FALSE,
  dispositivo      VARCHAR(100)        NOT NULL,    -- agente/cliente/origen
  id_usuario       BIGINT              NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

-- Asegura que el código sea de 6 dígitos (0..999999)
ALTER TABLE codigo_otp
  ADD CONSTRAINT chk_codigo_6dig CHECK (codigo >= 0 AND codigo <= 999999);

-- Mantén solo un OTP activo válido por (usuario, código) y que no esté expirado ni usado (índice parcial)
CREATE INDEX idx_otp_active ON codigo_otp (id_usuario, codigo)
  WHERE usado = FALSE AND fecha_expiracion > NOW();

-- (Opcional) acelerar búsquedas por usuario
CREATE INDEX idx_otp_usuario ON codigo_otp (id_usuario);

-- (Opcional) limpiar caducados con un job externo (cron) o con TTL en app.
-- Puedes luego crear una VIEW de “otp_activo” si quieres:

-- CREATE OR REPLACE VIEW v_otp_activo AS
-- SELECT * FROM codigo_otp
-- WHERE usado = FALSE AND fecha_expiracion > NOW();
