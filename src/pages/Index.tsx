
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "@/services/authService";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirigir según el estado de autenticación
    if (authService.isAuthenticated()) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Redireccionando...</h1>
        <p className="text-xl text-gray-600">Por favor espere un momento.</p>
      </div>
    </div>
  );
};

export default Index;
