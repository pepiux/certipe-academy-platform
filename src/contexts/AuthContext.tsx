
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  signInWithEmail, 
  signUpWithEmail,
  fetchProfileByEmail,
  updateProfileData,
  changePassword,
  Profile
} from '@/utils/customAuthUtils';

type AuthContextType = {
  user: Profile | null;
  profile: Profile | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  changeUserPassword: (currentPassword: string, newPassword: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Nombre de la clave para almacenar la sesión en localStorage
const SESSION_STORAGE_KEY = 'certipe_auth_session';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Cargar sesión guardada al iniciar
  useEffect(() => {
    const loadSession = async () => {
      try {
        const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);
        
        if (savedSession) {
          const sessionData = JSON.parse(savedSession);
          const email = sessionData.email;
          
          if (email) {
            const userProfile = await fetchProfileByEmail(email);
            if (userProfile) {
              setUser(userProfile);
              setProfile(userProfile);
              navigate('/dashboard');
            } else {
              // Sesión inválida o expirada
              localStorage.removeItem(SESSION_STORAGE_KEY);
            }
          }
        }
      } catch (error) {
        console.error('Error loading session:', error);
        localStorage.removeItem(SESSION_STORAGE_KEY);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    try {
      const userProfile = await signInWithEmail(email, password);
      if (userProfile) {
        setUser(userProfile);
        setProfile(userProfile);
        
        // Guardar sesión en localStorage
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({
          email: userProfile.email,
          timestamp: new Date().toISOString()
        }));
        
        toast.success('Inicio de sesión exitoso');
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al iniciar sesión');
      throw error;
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const userProfile = await signUpWithEmail(email, password, firstName, lastName);
      if (userProfile) {
        // En registro no iniciamos sesión automáticamente, solo mostramos mensaje de éxito
        toast.success('Registro exitoso. Ahora puedes iniciar sesión.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al registrarse');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Eliminar sesión del localStorage
      localStorage.removeItem(SESSION_STORAGE_KEY);
      
      // Limpiar estado
      setUser(null);
      setProfile(null);
      
      toast.info('Sesión cerrada');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Error al cerrar sesión');
      throw error;
    }
  };

  const updateProfile = async (data: Partial<Profile>) => {
    if (!user) return;
    
    try {
      await updateProfileData(user.id, data);
      
      // Actualizar estado local
      setProfile(prev => prev ? { ...prev, ...data } : null);
      setUser(prev => prev ? { ...prev, ...data } : null);
      
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar el perfil');
      throw error;
    }
  };

  const changeUserPassword = async (currentPassword: string, newPassword: string) => {
    if (!user) return;
    
    try {
      await changePassword(user.id, currentPassword, newPassword);
    } catch (error: any) {
      throw error;
    }
  };

  const value = {
    user,
    profile,
    signIn,
    signUp,
    signOut,
    loading,
    updateProfile,
    changeUserPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
