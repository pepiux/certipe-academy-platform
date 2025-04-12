
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { toast } from "sonner";
import authService from "@/services/authService";

// Importar íconos locales
import googleIcon from "@/assets/icons/google-icon.svg";
import facebookIcon from "@/assets/icons/facebook-icon.svg";
import linkedinIcon from "@/assets/icons/linkedin-icon.svg";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Por favor, complete todos los campos");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Por favor, ingrese un correo electrónico válido");
      return;
    }

    setIsLoading(true);
    
    try {
      // Llamar al servicio de autenticación
      const success = await authService.login({ email, password });
      
      if (success) {
        navigate("/dashboard");
      } else {
        toast.error("Credenciales incorrectas");
      }
    } catch (error) {
      toast.error("Error al iniciar sesión. Por favor, inténtelo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast.info(`Iniciando sesión con ${provider}...`);
    // Aquí implementarías la integración con OAuth para el proveedor seleccionado
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
