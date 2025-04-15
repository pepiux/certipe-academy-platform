import apiClient from './api/client';
import { toast } from 'sonner';

// Interfaces para los tipos de datos
interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: number;
    name: string;
    email: string;
    role?: string;
  };
  token: string;
}

// Servicio de autenticación
const authService = {
  /**
   * Inicia sesión de un usuario
   */
  async login(credentials: LoginCredentials): Promise<boolean> {
    try {
      // Simulamos una respuesta exitosa para desarrollo
      // En producción, esto sería una llamada real a la API
      const response = {
        user: {
          id: 1,
          name: 'Usuario Demo',
          email: credentials.email,
          role: 'user'
        },
        token: 'token-demo-123456'
      };
      
      // Guardar token y datos de usuario
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      return true;
    } catch (error) {
      return false;
    }
  },
  
  /**
   * Registra un nuevo usuario
   */
  async register(userData: RegisterData): Promise<boolean> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', userData);
      
      // Guardar token y datos de usuario
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      toast.success('Registro exitoso');
      return true;
    } catch (error) {
      return false;
    }
  },
  
  /**
   * Cierra la sesión del usuario
   */
  async logout(): Promise<void> {
    try {
      // Llamar al endpoint de logout (opcional, depende de tu implementación en Laravel)
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Error al cerrar sesión en el servidor', error);
    } finally {
      // Limpiar datos de sesión locales
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      toast.info('Sesión cerrada correctamente');
    }
  },
  
  /**
   * Solicita recuperación de contraseña
   */
  async forgotPassword(email: string): Promise<boolean> {
    try {
      await apiClient.post('/auth/forgot-password', { email });
      toast.success('Se ha enviado un correo con las instrucciones para recuperar tu contraseña');
      return true;
    } catch (error) {
      return false;
    }
  },
  
  /**
   * Resetea la contraseña con el token recibido
   */
  async resetPassword(token: string, password: string, passwordConfirmation: string): Promise<boolean> {
    try {
      await apiClient.post('/auth/reset-password', {
        token,
        password,
        password_confirmation: passwordConfirmation
      });
      toast.success('Contraseña actualizada correctamente');
      return true;
    } catch (error) {
      return false;
    }
  },
  
  /**
   * Obtiene el usuario actual
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  },
  
  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }
};

export default authService;
