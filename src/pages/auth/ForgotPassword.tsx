import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, ChevronRight, Mail, Check } from "lucide-react";
import { requestPasswordReset, verifyResetCode, setNewPassword } from "@/utils/customAuthUtils";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Email, 2: Verification, 3: New Password
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Por favor, ingrese su correo electrónico");
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
      // Llamar al backend para solicitar el código de recuperación
      await requestPasswordReset(email);
      setStep(2);
    } catch (error) {
      // El manejo de errores lo hace la función requestPasswordReset
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitToken = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast.error("Por favor, ingrese el código de verificación");
      return;
    }

    if (token.length !== 6) {
      toast.error("El código de verificación debe tener 6 dígitos");
      return;
    }

    setIsLoading(true);
    
    try {
      // Verificar el código con el backend
      const isValid = await verifyResetCode(email, token);
      
      if (isValid) {
        setStep(3);
      }
    } catch (error) {
      // El manejo de errores lo hace la función verifyResetCode
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      toast.error("Por favor, complete todos los campos");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("La nueva contraseña debe tener al menos 8 caracteres");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true);
    
    try {
      // Enviar la nueva contraseña al backend
      await setNewPassword(email, token, newPassword);
      
      // Redirigir al login después de éxito
      window.location.href = "/";
    } catch (error) {
      // El manejo de errores lo hace la función setNewPassword
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">Recuperar contraseña</h1>
        <p className="text-muted-foreground mt-2">
          {step === 1 && "Te enviaremos un código de verificación a tu correo electrónico"}
          {step === 2 && "Ingresa el código de verificación enviado a tu correo"}
          {step === 3 && "Crea una nueva contraseña para tu cuenta"}
        </p>
      </div>

      {step === 1 && (
        <form onSubmit={handleSubmitEmail} className="space-y-4">
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

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? "Enviando..." : "Enviar código de verificación"}
            {!isLoading && <ChevronRight className="ml-2" size={16} />}
          </Button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmitToken} className="space-y-4">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Mail size={24} className="text-primary" />
            </div>
          </div>
          
          <p className="text-center text-sm mb-4">
            Hemos enviado un código de verificación a <strong>{email}</strong>
          </p>
          
          <div className="space-y-2">
            <Label htmlFor="token">Código de verificación</Label>
            <Input 
              id="token"
              placeholder="000000"
              value={token}
              onChange={(e) => setToken(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
              required
              autoComplete="one-time-code"
              className="text-center text-lg tracking-widest"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? "Verificando..." : "Verificar código"}
            {!isLoading && <ChevronRight className="ml-2" size={16} />}
          </Button>
          
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-sm text-primary hover:underline inline-flex items-center"
            >
              <ArrowLeft className="mr-1" size={14} /> Volver
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmitNewPassword} className="space-y-4">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Check size={24} className="text-primary" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="new-password">Nueva contraseña</Label>
            <Input 
              id="new-password"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmar contraseña</Label>
            <Input 
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? "Actualizando..." : "Guardar nueva contraseña"}
          </Button>
        </form>
      )}

      <p className="mt-8 text-center text-sm text-muted-foreground">
        <Link
          to="/"
          className="font-medium text-primary hover:underline"
        >
          Volver al inicio de sesión
        </Link>
      </p>
    </div>
  );
};

export default ForgotPassword;
