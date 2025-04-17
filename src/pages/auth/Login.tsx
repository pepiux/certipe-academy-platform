
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { toast } from "sonner";  // We'll use only sonner for toasts
import authService from "@/services/authService";

// Importar íconos locales
import googleIcon from "@/assets/icons/google-icon.svg";
import facebookIcon from "@/assets/icons/facebook-icon.svg";
import linkedinIcon from "@/assets/icons/linkedin-icon.svg";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("password");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Por favor, complete todos los campos", {
        duration: 3000
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Por favor, ingrese un correo electrónico válido", {
        duration: 3000
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await authService.login({ email, password });
      
      if (success) {
        // Clear any previous toasts
        toast.dismiss();
        
        // Show success message with shorter duration
        toast.success("Inicio de sesión exitoso", {
          duration: 3000
        });
        
        // Navigate to dashboard
        navigate("/dashboard");
      } else {
        toast.error("Credenciales incorrectas", {
          duration: 3000
        });
      }
    } catch (error) {
      toast.error("Error al iniciar sesión. Por favor, inténtelo de nuevo.", {
        duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast.info(`Iniciando sesión con ${provider}...`);
    setTimeout(() => {
      localStorage.setItem('auth_token', 'token-social-demo');
      localStorage.setItem('user', JSON.stringify({
        id: 2,
        name: `Usuario ${provider}`,
        email: `user.${provider.toLowerCase()}@example.com`,
        role: 'user'
      }));
      toast.success(`Inicio de sesión con ${provider} exitoso`);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="animate-fadeIn">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">Sign In</h1>
        <p className="text-muted-foreground mt-2">
          Accede a tu cuenta para continuar
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email"
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Contraseña</Label>
            <Link 
              to="/forgot-password" 
              className="text-sm text-primary hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <div className="relative">
            <Input 
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? (
                <EyeOffIcon size={18} className="text-gray-500" />
              ) : (
                <EyeIcon size={18} className="text-gray-500" />
              )}
            </button>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-background px-2 text-muted-foreground">
              O continuar con
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSocialLogin("Google")}
            className="flex items-center justify-center"
          >
            <img 
              src={googleIcon} 
              alt="Google" 
              style={{ width: "24px", height: "24px" }} 
            />
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSocialLogin("Facebook")}
            className="flex items-center justify-center"
          >
            <img 
              src={facebookIcon} 
              alt="Facebook" 
              style={{ width: "24px", height: "24px" }} 
            />
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSocialLogin("LinkedIn")}
            className="flex items-center justify-center"
          >
            <img 
              src={linkedinIcon} 
              alt="LinkedIn" 
              style={{ width: "24px", height: "24px" }} 
            />
          </Button>
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        ¿No tienes una cuenta?{" "}
        <Link
          to="/register"
          className="font-medium text-primary hover:underline"
        >
          Registrarse
        </Link>
      </p>
    </div>
  );
};

export default Login;
