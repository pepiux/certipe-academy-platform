
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { 
  Save, 
  Globe, 
  PaintBucket, 
  Bell, 
  Mail, 
  Shield, 
  Database,
  Loader2
} from "lucide-react";

const SystemSettings = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Configuración del sistema</h1>
        
        <Button className="flex gap-2">
          <Save size={16} /> Guardar cambios
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Apariencia</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
          <TabsTrigger value="integrations">Integraciones</TabsTrigger>
          <TabsTrigger value="maintenance">Mantenimiento</TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6 m-0">
          <Card>
            <CardHeader>
              <CardTitle>Información del sitio</CardTitle>
              <CardDescription>
                Configura la información básica de la plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-name">Nombre del sitio</Label>
                <Input id="site-name" defaultValue="CertiPE - Certificación Academy Platform" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="site-description">Descripción</Label>
                <Textarea 
                  id="site-description" 
                  defaultValue="Plataforma de certificación profesional para gestión de proyectos y metodologías ágiles" 
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email de administrador</Label>
                  <Input id="admin-email" type="email" defaultValue="admin@certipe.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email de contacto</Label>
                  <Input id="contact-email" type="email" defaultValue="info@certipe.com" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Configuración regional</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Zona horaria</Label>
                  <select 
                    id="timezone"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue="Europe/Madrid"
                  >
                    <option value="Europe/Madrid">Europe/Madrid (UTC+01:00)</option>
                    <option value="America/New_York">America/New York (UTC-05:00)</option>
                    <option value="America/Los_Angeles">America/Los Angeles (UTC-08:00)</option>
                    <option value="Asia/Tokyo">Asia/Tokyo (UTC+09:00)</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date-format">Formato de fecha</Label>
                  <select 
                    id="date-format"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue="DD/MM/YYYY"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="default-language">Idioma predeterminado</Label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="lang-es"
                      name="default-language"
                      className="h-4 w-4 rounded-full border border-primary text-primary focus:outline-none focus:ring-1 focus:ring-ring"
                      defaultChecked
                    />
                    <Label htmlFor="lang-es" className="font-normal">Español</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="lang-en"
                      name="default-language"
                      className="h-4 w-4 rounded-full border border-primary text-primary focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                    <Label htmlFor="lang-en" className="font-normal">English</Label>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="multi-language" />
                <Label htmlFor="multi-language">Habilitar soporte multiidioma</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6 m-0">
          <Card>
            <CardHeader>
              <CardTitle>Tema y colores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Tema predeterminado</Label>
                <div className="flex flex-wrap gap-4">
                  <div className="space-y-2 text-center">
                    <div className="w-20 h-20 bg-white border border-gray-200 rounded-lg flex items-center justify-center cursor-pointer">
                      <div className="w-12 h-12 flex flex-col">
                        <div className="h-3 w-full bg-blue-600 rounded-t-sm"></div>
                        <div className="flex-1 bg-gray-100"></div>
                      </div>
                    </div>
                    <div className="text-xs">Claro</div>
                  </div>
                  
                  <div className="space-y-2 text-center">
                    <div className="w-20 h-20 bg-gray-900 border border-gray-700 rounded-lg flex items-center justify-center cursor-pointer">
                      <div className="w-12 h-12 flex flex-col">
                        <div className="h-3 w-full bg-blue-600 rounded-t-sm"></div>
                        <div className="flex-1 bg-gray-800"></div>
                      </div>
                    </div>
                    <div className="text-xs">Oscuro</div>
                  </div>
                  
                  <div className="space-y-2 text-center">
                    <div className="w-20 h-20 bg-gradient-to-b from-white to-gray-900 border border-gray-300 rounded-lg flex items-center justify-center cursor-pointer">
                      <div className="w-12 h-12 flex flex-col">
                        <div className="h-3 w-full bg-blue-600 rounded-t-sm"></div>
                        <div className="flex-1 bg-transparent"></div>
                      </div>
                    </div>
                    <div className="text-xs">Sistema</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Label>Esquema de color</Label>
                <div className="flex flex-wrap gap-4">
                  <div className="space-y-2 text-center">
                    <div className="w-20 h-10 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg cursor-pointer border-2 border-blue-600"></div>
                    <div className="text-xs">Azul (predeterminado)</div>
                  </div>
                  
                  <div className="space-y-2 text-center">
                    <div className="w-20 h-10 bg-gradient-to-r from-purple-600 to-purple-400 rounded-lg cursor-pointer"></div>
                    <div className="text-xs">Púrpura</div>
                  </div>
                  
                  <div className="space-y-2 text-center">
                    <div className="w-20 h-10 bg-gradient-to-r from-green-600 to-green-400 rounded-lg cursor-pointer"></div>
                    <div className="text-xs">Verde</div>
                  </div>
                  
                  <div className="space-y-2 text-center">
                    <div className="w-20 h-10 bg-gradient-to-r from-amber-600 to-amber-400 rounded-lg cursor-pointer"></div>
                    <div className="text-xs">Ámbar</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="custom-css">CSS personalizado</Label>
                <Textarea 
                  id="custom-css" 
                  placeholder="/* Añade aquí tus estilos personalizados */" 
                  className="font-mono"
                  rows={5}
                />
                <p className="text-xs text-muted-foreground">
                  Solo para administradores avanzados. El CSS personalizado se aplicará a toda la plataforma.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Logotipos e imágenes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-8">
                <p className="text-muted-foreground">
                  Esta es una versión de demostración. La configuración de logotipos e imágenes estará disponible próximamente.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6 m-0">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de notificaciones</CardTitle>
              <CardDescription>
                Configura qué notificaciones se envían y cómo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Notificaciones por email</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-welcome">Bienvenida</Label>
                        <p className="text-sm text-muted-foreground">Email enviado cuando un usuario se registra</p>
                      </div>
                      <Switch id="email-welcome" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-course-complete">Curso completado</Label>
                        <p className="text-sm text-muted-foreground">Email enviado cuando un usuario completa un curso</p>
                      </div>
                      <Switch id="email-course-complete" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-quiz-results">Resultados de cuestionario</Label>
                        <p className="text-sm text-muted-foreground">Email con resultados después de completar un cuestionario</p>
                      </div>
                      <Switch id="email-quiz-results" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-certificate">Certificado emitido</Label>
                        <p className="text-sm text-muted-foreground">Email con certificado cuando se completa un curso certificable</p>
                      </div>
                      <Switch id="email-certificate" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-marketing">Emails de marketing</Label>
                        <p className="text-sm text-muted-foreground">Nuevos cursos, promociones y contenido similar</p>
                      </div>
                      <Switch id="email-marketing" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-4">Notificaciones en la plataforma</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="notif-course-update">Actualizaciones de curso</Label>
                        <p className="text-sm text-muted-foreground">Cuando se añade nuevo contenido a un curso inscrito</p>
                      </div>
                      <Switch id="notif-course-update" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="notif-comments">Comentarios y respuestas</Label>
                        <p className="text-sm text-muted-foreground">Cuando alguien responde a tus comentarios</p>
                      </div>
                      <Switch id="notif-comments" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="notif-reminders">Recordatorios de estudio</Label>
                        <p className="text-sm text-muted-foreground">Recordatorios para continuar cursos en progreso</p>
                      </div>
                      <Switch id="notif-reminders" defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Plantillas de email</CardTitle>
            </CardHeader>
            <CardContent className="text-center p-8">
              <p className="text-muted-foreground">
                Esta es una versión de demostración. El editor de plantillas de email estará disponible próximamente.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6 m-0">
          <div className="text-center p-8">
            <p className="text-muted-foreground">
              Esta es una versión de demostración. La configuración de seguridad estará disponible próximamente.
            </p>
          </div>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6 m-0">
          <div className="text-center p-8">
            <p className="text-muted-foreground">
              Esta es una versión de demostración. La configuración de integraciones estará disponible próximamente.
            </p>
          </div>
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance" className="space-y-6 m-0">
          <Card>
            <CardHeader>
              <CardTitle>Copias de seguridad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Copia de seguridad manual</p>
                  <p className="text-sm text-muted-foreground">Crear una copia de seguridad completa ahora</p>
                </div>
                <Button className="flex gap-2">
                  <Database size={16} /> Crear copia
                </Button>
              </div>
              
              <div className="border-t pt-4">
                <p className="font-medium mb-2">Copias de seguridad automáticas</p>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground">Programar copias de seguridad automáticas</p>
                  <Switch id="auto-backup" defaultChecked />
                </div>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="backup-frequency">Frecuencia</Label>
                      <select 
                        id="backup-frequency"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        defaultValue="daily"
                      >
                        <option value="hourly">Cada hora</option>
                        <option value="daily">Diaria</option>
                        <option value="weekly">Semanal</option>
                        <option value="monthly">Mensual</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="backup-retention">Retención</Label>
                      <select 
                        id="backup-retention"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        defaultValue="7"
                      >
                        <option value="3">3 días</option>
                        <option value="7">7 días</option>
                        <option value="14">14 días</option>
                        <option value="30">30 días</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <p className="font-medium mb-2">Últimas copias de seguridad</p>
                <div className="border rounded-md p-4 text-center text-sm text-muted-foreground">
                  No hay copias de seguridad disponibles
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Modo mantenimiento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Activar modo mantenimiento</p>
                  <p className="text-sm text-muted-foreground">
                    La plataforma mostrará una página de mantenimiento a todos los usuarios excepto administradores
                  </p>
                </div>
                <Switch id="maintenance-mode" />
              </div>
              
              <div>
                <Label htmlFor="maintenance-message">Mensaje de mantenimiento</Label>
                <Textarea 
                  id="maintenance-message" 
                  defaultValue="Estamos realizando tareas de mantenimiento para mejorar nuestra plataforma. Por favor, vuelva a intentarlo más tarde."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemSettings;
