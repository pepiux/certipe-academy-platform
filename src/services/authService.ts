
import apiClient from './api/client';
import { toast } from 'sonner';
import { useMock } from '@/services/serviceAdapter';

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
      if (useMock()) {
        // Simulamos una respuesta exitosa para desarrollo
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
      } else {
        // Llamar al backend PHP
        console.log('Enviando credenciales al backend:', credentials);
        
        // Llamada directa al endpoint PHP
        const response = await fetch('/php/auth.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials)
        });
        
        // Verificar respuesta HTTP
        if (!response.ok) {
          console.error('Error HTTP:', response.status, response.statusText);
          const errorText = await response.text();
          console.error('Respuesta de error:', errorText);
          return false;
        }
        
        const data = await response.json();
        console.log('Respuesta del backend:', data);
        
        if (data.error) {
          console.error('Error de autenticación:', data.error);
          toast.error(data.error || "Credenciales incorrectas");
          return false;
        }
        
        // Guardar token y datos de usuario
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        return true;
      }
    } catch (error) {
      console.error('Error completo:', error);
      toast.error("Error de inicio de sesión");
      return false;
    }
  },
  
  /**
   * Registra un nuevo usuario
   */
  async register(userData: RegisterData): Promise<boolean> {
    try {
      if (useMock()) {
        // Simulamos una respuesta exitosa para desarrollo
        const response = {
          user: {
            id: 1,
            name: userData.name,
            email: userData.email,
            role: 'user'
          },
          token: 'token-demo-123456'
        };
        
        // Guardar token y datos de usuario
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        toast.success('Registro exitoso');
        return true;
      } else {
        // Llamar al backend PHP
        const response = await apiClient.post<AuthResponse>('/register.php', userData);
        
        // Guardar token y datos de usuario
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        toast.success('Registro exitoso');
        return true;
      }
    } catch (error) {
      toast.error("Error en el registro");
      return false;
    }
  },
  
  /**
   * Cierra la sesión del usuario
   */
  async logout(): Promise<void> {
    try {
      if (!useMock()) {
        // Llamar al endpoint de logout (opcional)
        await apiClient.post('/logout.php', {});
      }
    } catch (error) {
      console.error('Error al cerrar sesión en el servidor', error);
    } finally {
      // Limpiar datos de sesión locales
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      // El mensaje de éxito se mostrará desde el componente Header
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
