
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import RegisterForm, { RegisterFormValues } from '@/components/auth/RegisterForm';
import SocialLogin from '@/components/auth/SocialLogin';

const Register = () => {
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: RegisterFormValues) => {
    try {
      setLoading(true);
      await signUp(
        values.email, 
        values.password, 
        values.firstName, 
        values.lastName
      );
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6 px-4 py-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Crear una cuenta</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Completa el formulario para crear tu cuenta
        </p>
      </div>
      
      <div className="space-y-4">
        <RegisterForm onSubmit={handleSubmit} loading={loading} />
        
        <SocialLogin mode="register" />

        <div className="text-center">
          <p className="text-sm text-gray-500">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/" className="text-blue-600 hover:text-blue-800">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
