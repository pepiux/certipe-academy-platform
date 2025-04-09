
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Facebook, Linkedin } from 'lucide-react';

const formSchema = z.object({
  firstName: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
  lastName: z.string().min(2, { message: 'El apellido debe tener al menos 2 caracteres.' }),
  email: z.string().email({ message: 'Ingresa un correo electrónico válido.' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
});

const Register = () => {
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'linkedin_oidc') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      toast.error(error.message || `Error en registro con ${provider}`);
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Juan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido</FormLabel>
                    <FormControl>
                      <Input placeholder="Pérez" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input placeholder="tu@ejemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>
          </form>
        </Form>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              O registrarse con
            </span>
          </div>
        </div>
        
        <div className="flex justify-center gap-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => handleSocialLogin('google')}
            className="rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
              <path fill="#FFC107" d="M43.6,20H24v8h11.3c-1.1,5.2-5.5,8-11.3,8c-6.6,0-12-5.4-12-12s5.4-12,12-12c3.1,0,5.8,1.2,8,3.1l6.1-6.1C33.7,5.5,29.1,4,24,4C12.9,4,4,12.9,4,24s8.9,20,20,20s20-8.9,20-20C44,22.6,43.9,21.3,43.6,20z"/>
              <path fill="#FF3D00" d="M6.3,14.7l7.1,5.4C15.1,15.1,19.3,12,24,12c3.1,0,5.8,1.2,8,3.1l6.1-6.1C33.7,5.5,29.1,4,24,4C16.3,4,9.6,8.4,6.3,14.7z"/>
              <path fill="#4CAF50" d="M24,44c5,0,9.6-1.6,13.5-4.3l-6.6-5.5c-2.1,1.4-4.7,2.2-6.9,2.2c-5.8,0-10.3-3.8-11.3-8h-7v5.7C9.6,39.8,16.3,44,24,44z"/>
              <path fill="#1976D2" d="M12.7,28.4h0.1L6,34c-0.4-0.8-0.7-1.6-1-2.4C4.4,29.9,4,26.9,4,24s0.4-5.9,1-8.6c0.3-0.9,0.6-1.7,1-2.4l6.8,5.7l0,0c-0.6,1.6-1,3.4-1,5.3C11.8,25.1,12.1,26.8,12.7,28.4z"/>
            </svg>
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => handleSocialLogin('facebook')}
            className="rounded-full"
          >
            <Facebook className="h-5 w-5 text-[#1877F2]" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => handleSocialLogin('linkedin_oidc')}
            className="rounded-full"
          >
            <Linkedin className="h-5 w-5 text-[#0A66C2]" />
          </Button>
        </div>

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
