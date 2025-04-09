
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { getUserInitials } from "@/utils/userUtils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const formSchema = z.object({
  first_name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  last_name: z.string().min(2, {
    message: "El apellido debe tener al menos 2 caracteres.",
  }),
  current_password: z.string().optional(),
  new_password: z.string().optional(),
  confirm_password: z.string().optional(),
}).refine((data) => {
  // If any password field is filled, all password fields must be filled
  const hasCurrentPassword = !!data.current_password;
  const hasNewPassword = !!data.new_password;
  const hasConfirmPassword = !!data.confirm_password;
  
  // Either all password fields are empty or all are filled
  return (
    (!hasCurrentPassword && !hasNewPassword && !hasConfirmPassword) ||
    (hasCurrentPassword && hasNewPassword && hasConfirmPassword)
  );
}, {
  message: "Todos los campos de contraseña deben completarse para cambiar la contraseña.",
  path: ["current_password"],
}).refine((data) => {
  // If new_password is provided, it must be at least 6 characters
  if (data.new_password && data.new_password.length < 6) {
    return false;
  }
  return true;
}, {
  message: "La nueva contraseña debe tener al menos 6 caracteres.",
  path: ["new_password"],
}).refine((data) => {
  // If both new_password and confirm_password are provided, they must match
  if (data.new_password && data.confirm_password && data.new_password !== data.confirm_password) {
    return false;
  }
  return true;
}, {
  message: "Las contraseñas no coinciden.",
  path: ["confirm_password"],
});

const Profile = () => {
  const { user, profile, updateProfile, changeUserPassword } = useAuth();
  const [saving, setSaving] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setSaving(true);
      
      // Update profile information
      await updateProfile({
        first_name: values.first_name,
        last_name: values.last_name,
      });
      
      // If password fields are filled, change password
      if (values.current_password && values.new_password) {
        await changeUserPassword(values.current_password, values.new_password);
      }
      
      // Reset password fields
      form.setValue("current_password", "");
      form.setValue("new_password", "");
      form.setValue("confirm_password", "");
      
      toast.success("Perfil actualizado correctamente");
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setSaving(false);
    }
  };

  if (!user || !profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="container py-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Mi Perfil</h1>
        <p className="text-muted-foreground">
          Gestiona tu información personal y preferencias de cuenta
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
            <CardDescription>
              Actualiza tu información personal y credenciales de acceso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {getUserInitials(profile.first_name, profile.last_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <p className="font-medium">{profile.first_name} {profile.last_name}</p>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                </div>
              </div>

              <div className="flex-1">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="first_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="last_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Apellido</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div>
                      <h3 className="text-base font-medium mb-2">Cambiar Contraseña</h3>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="current_password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contraseña Actual</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="new_password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nueva Contraseña</FormLabel>
                                <FormControl>
                                  <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="confirm_password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirmar Contraseña</FormLabel>
                                <FormControl>
                                  <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    <Button type="submit" disabled={saving}>
                      {saving ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sesión Actual</CardTitle>
            <CardDescription>
              Información sobre tu sesión actual en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID de Usuario</span>
                <span className="font-mono">{user.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Último acceso</span>
                <span>{new Date(user.created_at || '').toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rol</span>
                <span>{profile.is_admin ? "Administrador" : "Usuario"}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
