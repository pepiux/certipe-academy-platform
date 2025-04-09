
-- Función para verificar la contraseña
CREATE OR REPLACE FUNCTION public.check_password(user_email VARCHAR, user_password VARCHAR)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE email = user_email 
    AND password = crypt(user_password, password)
  );
END;
$$;

-- Función para crear un nuevo usuario
CREATE OR REPLACE FUNCTION public.create_user(
  user_email VARCHAR, 
  user_password VARCHAR,
  user_first_name VARCHAR,
  user_last_name VARCHAR
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id UUID;
BEGIN
  new_user_id := gen_random_uuid();
  
  INSERT INTO public.profiles (
    id, 
    email, 
    password, 
    first_name, 
    last_name, 
    is_admin
  ) VALUES (
    new_user_id,
    user_email,
    crypt(user_password, gen_salt('bf')),
    user_first_name,
    user_last_name,
    FALSE
  );
  
  RETURN new_user_id;
END;
$$;

-- Función para actualizar la contraseña
CREATE OR REPLACE FUNCTION public.update_password(user_id UUID, new_password VARCHAR)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles
  SET password = crypt(new_password, gen_salt('bf'))
  WHERE id = user_id;
END;
$$;

-- Función para actualizar el profile
CREATE OR REPLACE FUNCTION public.update_profile(
  user_id UUID,
  new_first_name VARCHAR,
  new_last_name VARCHAR,
  new_avatar_url VARCHAR
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles
  SET 
    first_name = COALESCE(new_first_name, first_name),
    last_name = COALESCE(new_last_name, last_name),
    avatar_url = COALESCE(new_avatar_url, avatar_url),
    updated_at = NOW()
  WHERE id = user_id;
END;
$$;
