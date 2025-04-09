
-- Este archivo contiene las instrucciones SQL necesarias para configurar la base de datos
-- Este sistema está diseñado para ser independiente de Supabase y poder migrarse fácilmente

-- Estructura de la tabla de perfiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índice para búsqueda por email
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Nota: Este archivo SQL es compatible con PostgreSQL
-- Para MySQL, deberías adaptar los tipos de datos:
-- UUID -> CHAR(36)
-- TIMESTAMP WITH TIME ZONE -> TIMESTAMP
