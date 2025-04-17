
import React from "react";
import { Outlet } from "react-router-dom";
import Logo from "@/components/Logo";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Background with branding */}
      <div className="hidden md:flex md:w-[60%] bg-auth-pattern bg-cover bg-center p-8 flex-col justify-between">
        <Logo size="large" />
        <div className="text-white max-w-xl">
          <h1 className="text-4xl font-bold mb-4">
            Certification Academy Platform
          </h1>
          <p className="text-xl opacity-90">
            We make digital products that drive you to stand out. 
            Master certification courses and advance your professional career.
          </p>
        </div>
        <div className="text-white/70 text-sm">
          © 2025 Inflex. Todos los derechos reservados.
        </div>
      </div>

      {/* Right side - Auth forms */}
      <div className="w-full md:w-[40%] flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          {/* Solución para que el logo se vea en modo móvil con un fondo que contraste */}
          <div className="md:hidden mb-8 flex justify-center">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Logo textColor="text-primary" />
            </div>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
