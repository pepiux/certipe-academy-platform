
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type Profile = {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  is_admin: boolean;
  email: string | null;
  created_at: string;
  updated_at: string;
};

export const signInWithEmail = async (email: string, password: string): Promise<Profile | null> => {
  try {
    // Verificar credenciales con la tabla profiles
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      throw new Error('Credenciales inválidas');
    }

    // Verificar password usando la extensión pgcrypto de Postgres
    const { data: passwordCheck, error: passwordError } = await supabase
      .rpc('check_password', { 
        user_email: email, 
        user_password: password 
      });

    if (passwordError || !passwordCheck) {
      throw new Error('Credenciales inválidas');
    }

    return data as Profile;
  } catch (error: any) {
    toast.error(error.message || 'Error al iniciar sesión');
    throw error;
  }
};

export const signUpWithEmail = async (
  email: string, 
  password: string, 
  firstName: string, 
  lastName: string
): Promise<Profile | null> => {
  try {
    // Verificar si el correo ya existe
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      throw new Error('Este correo electrónico ya está registrado');
    }

    // Crear un nuevo usuario con contraseña encriptada
    const { data, error } = await supabase
      .rpc('create_user', {
        user_email: email,
        user_password: password,
        user_first_name: firstName,
        user_last_name: lastName
      });

    if (error) {
      throw error;
    }

    // Obtener el perfil recién creado
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (profileError) {
      throw profileError;
    }

    return profile as Profile;
  } catch (error: any) {
    toast.error(error.message || 'Error al registrarse');
    throw error;
  }
};

export const fetchProfileByEmail = async (email: string): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      return null;
    }

    return data as Profile;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};

export const updateProfileData = async (id: string, data: Partial<Profile>): Promise<void> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', id);

    if (error) throw error;
    toast.success('Perfil actualizado');
  } catch (error: any) {
    toast.error(error.message || 'Error al actualizar el perfil');
    throw error;
  }
};

export const changePassword = async (id: string, currentPassword: string, newPassword: string): Promise<void> => {
  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', id)
      .single();

    if (profileError || !profile) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar la contraseña actual
    const { data: passwordCheck, error: passwordError } = await supabase
      .rpc('check_password', { 
        user_email: profile.email, 
        user_password: currentPassword 
      });

    if (passwordError || !passwordCheck) {
      throw new Error('Contraseña actual incorrecta');
    }

    // Actualizar la contraseña
    const { error } = await supabase
      .rpc('update_password', { 
        user_id: id, 
        new_password: newPassword 
      });

    if (error) throw error;
    toast.success('Contraseña actualizada');
  } catch (error: any) {
    toast.error(error.message || 'Error al cambiar la contraseña');
    throw error;
  }
};
