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

// Función para realizar peticiones al backend
const apiRequest = async (endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', data?: any) => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
      credentials: 'include', // Incluir cookies para autenticación
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(responseData.message || 'Error en la petición');
    }
    
    return responseData;
  } catch (error: any) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Autenticación mediante el backend
export const signInWithEmail = async (email: string, password: string): Promise<Profile | null> => {
  try {
    const data = await apiRequest('/auth/login', 'POST', { email, password });
    return data.user;
  } catch (error: any) {
    toast.error(error.message || 'Error al iniciar sesión');
    throw error;
  }
};

// Registro mediante el backend
export const signUpWithEmail = async (
  email: string, 
  password: string, 
  firstName: string, 
  lastName: string
): Promise<Profile | null> => {
  try {
    const data = await apiRequest('/auth/register', 'POST', {
      email,
      password,
      firstName,
      lastName
    });
    
    return data.user;
  } catch (error: any) {
    toast.error(error.message || 'Error al registrarse');
    throw error;
  }
};

// Obtener perfil mediante el backend
export const fetchProfileByEmail = async (email: string): Promise<Profile | null> => {
  try {
    const data = await apiRequest('/auth/profile', 'POST', { email });
    return data.profile;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};

// Actualizar perfil mediante el backend
export const updateProfileData = async (id: string, data: Partial<Profile>): Promise<void> => {
  try {
    await apiRequest('/auth/profile/update', 'PUT', { id, ...data });
    toast.success('Perfil actualizado');
  } catch (error: any) {
    toast.error(error.message || 'Error al actualizar el perfil');
    throw error;
  }
};

// Cambiar contraseña mediante el backend
export const changePassword = async (id: string, currentPassword: string, newPassword: string): Promise<void> => {
  try {
    await apiRequest('/auth/password/change', 'POST', {
      id,
      currentPassword,
      newPassword
    });
    
    toast.success('Contraseña actualizada');
  } catch (error: any) {
    toast.error(error.message || 'Error al cambiar la contraseña');
    throw error;
  }
};

// Recuperar contraseña (solicitar código)
export const requestPasswordReset = async (email: string): Promise<void> => {
  try {
    await apiRequest('/auth/password/reset/request', 'POST', { email });
    toast.success('Código de verificación enviado a tu correo');
  } catch (error: any) {
    toast.error(error.message || 'Error al solicitar recuperación de contraseña');
    throw error;
  }
};

// Verificar código de recuperación
export const verifyResetCode = async (email: string, code: string): Promise<boolean> => {
  try {
    const data = await apiRequest('/auth/password/reset/verify', 'POST', { email, code });
    return data.valid;
  } catch (error: any) {
    toast.error(error.message || 'Código de verificación inválido');
    throw error;
  }
};

// Establecer nueva contraseña
export const setNewPassword = async (email: string, code: string, newPassword: string): Promise<void> => {
  try {
    await apiRequest('/auth/password/reset/complete', 'POST', {
      email,
      code,
      newPassword
    });
    
    toast.success('Contraseña restablecida con éxito');
  } catch (error: any) {
    toast.error(error.message || 'Error al restablecer la contraseña');
    throw error;
  }
};
