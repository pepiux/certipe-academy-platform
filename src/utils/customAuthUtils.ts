
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import * as bcrypt from 'bcryptjs';

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
    // Obtener el usuario de la base de datos por email
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      throw new Error('Credenciales inválidas');
    }

    // Verificar la contraseña manualmente
    // En producción, esto se haría en el backend por seguridad
    const passwordMatch = await bcrypt.compare(password, data.password);
    
    if (!passwordMatch) {
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

    // Generar un hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Crear un nuevo usuario
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: crypto.randomUUID(),
        email: email,
        password: hashedPassword,
        first_name: firstName,
        last_name: lastName,
        is_admin: false
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as Profile;
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
    // Obtener el perfil del usuario
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (profileError || !profile) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar la contraseña actual
    const passwordMatch = await bcrypt.compare(currentPassword, profile.password);
    
    if (!passwordMatch) {
      throw new Error('Contraseña actual incorrecta');
    }

    // Generar hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Actualizar la contraseña
    const { error } = await supabase
      .from('profiles')
      .update({ password: hashedPassword })
      .eq('id', id);

    if (error) throw error;
    toast.success('Contraseña actualizada');
  } catch (error: any) {
    toast.error(error.message || 'Error al cambiar la contraseña');
    throw error;
  }
};
