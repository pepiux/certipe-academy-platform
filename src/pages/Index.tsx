
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-md w-full p-6 rounded-lg bg-white shadow-lg">
        <h1 className="text-4xl font-bold mb-4">Certification Academy</h1>
        <p className="text-xl text-gray-600 mb-8">
          Domina certificaciones profesionales y avanza en tu carrera
        </p>
        
        <div className="space-y-4">
          <Link to="/register" className="block">
            <Button className="w-full">Crear una cuenta</Button>
          </Link>
          <p className="text-sm text-gray-500">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
