
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { toast } from "sonner";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Password strength calculation
  const calculatePasswordStrength = (password: string): number => {
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) score += 1; // Uppercase
    if (/[a-z]/.test(password)) score += 1; // Lowercase
    if (/[0-9]/.test(password)) score += 1; // Numbers
    if (/[^A-Za-z0-9]/.test(password)) score += 1; // Special chars
    
    return score;
  };

  const getPasswordStrength = () => {
    const score = calculatePasswordStrength(password);
    
    if (password.length === 0) return { label: "", color: "" };
    if (score <= 2) return { label: "Débil", color: "bg-red-500" };
    if (score <= 3) return { label: "Media", color: "bg-yellow-500" };
    return { label: "Fuerte", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast.error("Por favor, complete todos los campos");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Por favor, ingrese un correo electrónico válido");
      return;
    }

    // Password validation
    if (password.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    if (calculatePasswordStrength(password) < 3) {
      toast.error("Por favor, elija una contraseña más segura");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Registro exitoso. Por favor, verifica tu correo electrónico");
      setIsLoading(false);
      window.location.href = "/";
    }, 1500);
  };

  const handleSocialLogin = (provider: string) => {
    toast.info(`Registrándose con ${provider}...`);
    // Here you would implement the OAuth registration flow
  };

  return (
    <div className="animate-fadeIn">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">Crear cuenta</h1>
        <p className="text-muted-foreground mt-2">
          Regístrate para acceder a todos los cursos y recursos
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre completo</Label>
          <Input 
            id="name"
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
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
          <Label htmlFor="password">Contraseña</Label>
          <div className="relative">
            <Input 
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <EyeOffIcon size={18} />
              ) : (
                <EyeIcon size={18} />
              )}
            </button>
          </div>
          
          {password && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">{passwordStrength.label}</span>
              </div>
              <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${passwordStrength.color} transition-all duration-300`}
                  style={{ width: `${(calculatePasswordStrength(password) / 5) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? "Creando cuenta..." : "Registrarse"}
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
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSocialLogin("Facebook")}
          >
            <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" className="w-5 h-5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSocialLogin("Microsoft")}
          >
            <img src="https://www.svgrepo.com/show/303223/microsoft-logo.svg" alt="Microsoft" className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        ¿Ya tienes una cuenta?{" "}
        <Link
          to="/"
          className="font-medium text-primary hover:underline"
        >
          Iniciar sesión
        </Link>
      </p>
    </div>
  );
};

export default Register;
