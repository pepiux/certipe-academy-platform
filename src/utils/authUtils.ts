
// Este archivo ahora contiene solo funcionalidades específicas de autenticación social
// que se integrarán con nuestro backend
import { toast } from 'sonner';

export type SocialProvider = 'google' | 'facebook' | 'linkedin_oidc';

export const handleSocialLogin = async (provider: SocialProvider) => {
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    
    // Redirigir al usuario a la URL de autenticación social del backend
    window.location.href = `${API_URL}/auth/${provider}/login`;
  } catch (error: any) {
    toast.error(error.message || `Error en inicio de sesión con ${provider}`);
  }
};
