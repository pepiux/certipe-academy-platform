
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { 
  ChevronLeft, 
  Plus, 
  Upload, 
  Loader2,
  Trash,
  GripVertical,
  File,
  Video,
  FileText,
  FileQuestion,
  Save,
  Eye
} from "lucide-react";

const CreateCourse = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <a href="/dashboard/admin/courses">
              <ChevronLeft className="h-4 w-4" />
            </a>
          </Button>
          <h1 className="text-2xl font-bold">Crear nuevo curso</h1>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="flex gap-2">
            <Eye size={16} /> Previsualizar
          </Button>
          <Button className="flex gap-2">
            <Save size={16} /> Guardar curso
          </Button>
        </div>
      </div>

      <Tabs defaultValue="details" className="space-y-6">
        <div className="sticky top-0 z-10 bg-background pb-2">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger 
              value="details" 
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-4 py-2"
            >
              Detalles
            </TabsTrigger>
            <TabsTrigger 
              value="content" 
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-4 py-2"
            >
              Contenido
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-4 py-2"
            >
              Configuración
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6 m-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información básica</CardTitle>
                  <CardDescription>
                    Introduce los detalles principales del curso
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título del curso *</Label>
                    <Input id="title" placeholder="ej. Fundamentos de la Gestión de Proyectos" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Categoría *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="project-management">Gestión de Proyectos</SelectItem>
                          <SelectItem value="agile">Metodologías Ágiles</SelectItem>
                          <SelectItem value="risk-management">Gestión de Riesgos</SelectItem>
                          <SelectItem value="certification">Certificaciones</SelectItem>
                          <SelectItem value="tools">Herramientas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="level">Nivel *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar nivel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Principiante</SelectItem>
                          <SelectItem value="intermediate">Intermedio</SelectItem>
                          <SelectItem value="advanced">Avanzado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción del curso *</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Describe el contenido y los objetivos del curso..."
                      rows={5}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Objetivos de aprendizaje</CardTitle>
                  <CardDescription>
                    ¿Qué aprenderán los estudiantes en este curso?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    {[1, 2, 3].map((index) => (
                      <div key={index} className="flex gap-2">
                        <Input placeholder={`Objetivo de aprendizaje ${index}`} />
                        {index > 1 ? (
                          <Button variant="ghost" size="icon">
                            <Trash size={16} />
                          </Button>
                        ) : null}
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="flex gap-2" size="sm">
                    <Plus size={16} /> Añadir objetivo
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Imagen de portada</CardTitle>
                  <CardDescription>
                    Imagen que aparecerá en la tarjeta del curso
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="flex flex-col items-center">
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Arrastra o haz clic para subir
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG (recomendado: 1280x720px)
                      </p>
                    </div>
                    <Input
                      id="cover-image"
                      type="file"
                      className="hidden"
                    />
                  </div>
                  
                  <Button className="w-full">Subir imagen</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6 m-0">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Estructura del curso</CardTitle>
                <CardDescription>
                  Organiza las secciones y lecciones del curso
                </CardDescription>
              </div>
              <Button className="flex gap-2">
                <Plus size={16} /> Añadir sección
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Section 1 */}
              <div className="space-y-2 border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                    <Input 
                      defaultValue="Sección 1: Introducción a la Gestión de Proyectos" 
                      className="max-w-md font-medium"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Trash size={16} />
                    </Button>
                  </div>
                </div>
                
                <div className="pl-7 space-y-2 mt-4">
                  {/* Lesson 1.1 */}
                  <div className="flex items-center gap-2 border p-3 rounded-md">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                    <Video size={16} className="text-blue-500" />
                    <Input 
                      defaultValue="Lección 1: ¿Qué es un proyecto?" 
                      className="max-w-md"
                    />
                    <div className="text-sm text-muted-foreground ml-auto">15:30</div>
                    <Button variant="ghost" size="icon">
                      <Trash size={16} />
                    </Button>
                  </div>
                  
                  {/* Lesson 1.2 */}
                  <div className="flex items-center gap-2 border p-3 rounded-md">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                    <FileText size={16} className="text-green-500" />
                    <Input 
                      defaultValue="Recurso: Plantilla de Acta de Constitución" 
                      className="max-w-md"
                    />
                    <div className="text-sm text-muted-foreground ml-auto">PDF</div>
                    <Button variant="ghost" size="icon">
                      <Trash size={16} />
                    </Button>
                  </div>
                  
                  <Button variant="outline" className="flex gap-2 ml-7" size="sm">
                    <Plus size={16} /> Añadir lección
                  </Button>
                </div>
              </div>
              
              {/* Section 2 */}
              <div className="space-y-2 border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                    <Input 
                      defaultValue="Sección 2: Planificación de Proyectos" 
                      className="max-w-md font-medium"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Trash size={16} />
                    </Button>
                  </div>
                </div>
                
                <div className="pl-7 space-y-2 mt-4">
                  {/* Lesson 2.1 */}
                  <div className="flex items-center gap-2 border p-3 rounded-md">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                    <Video size={16} className="text-blue-500" />
                    <Input 
                      defaultValue="Lección 1: Definición de objetivos y alcance" 
                      className="max-w-md"
                    />
                    <div className="text-sm text-muted-foreground ml-auto">25:10</div>
                    <Button variant="ghost" size="icon">
                      <Trash size={16} />
                    </Button>
                  </div>
                  
                  {/* Lesson 2.2 */}
                  <div className="flex items-center gap-2 border p-3 rounded-md">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                    <FileQuestion size={16} className="text-purple-500" />
                    <Input 
                      defaultValue="Quiz: Planificación inicial" 
                      className="max-w-md"
                    />
                    <div className="text-sm text-muted-foreground ml-auto">10 preguntas</div>
                    <Button variant="ghost" size="icon">
                      <Trash size={16} />
                    </Button>
                  </div>
                  
                  <Button variant="outline" className="flex gap-2 ml-7" size="sm">
                    <Plus size={16} /> Añadir lección
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6 m-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración del curso</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Precio (USD)</Label>
                      <Input id="price" type="number" placeholder="ej. 49.99" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duración estimada (horas)</Label>
                      <Input id="duration" type="number" placeholder="ej. 10" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="requirements">Requisitos previos</Label>
                    <Textarea 
                      id="requirements" 
                      placeholder="Conocimientos o habilidades necesarias para este curso..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="instructor">Instructor principal</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar instructor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maria-garcia">María García</SelectItem>
                        <SelectItem value="carlos-rodriguez">Carlos Rodríguez</SelectItem>
                        <SelectItem value="ana-martinez">Ana Martínez</SelectItem>
                        <SelectItem value="javier-lopez">Javier López</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Visibilidad y acceso</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Estado del curso</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Borrador</SelectItem>
                        <SelectItem value="review">En revisión</SelectItem>
                        <SelectItem value="published">Publicado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="enrollment">Tipo de inscripción</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Abierta (cualquiera puede inscribirse)</SelectItem>
                        <SelectItem value="invite">Solo por invitación</SelectItem>
                        <SelectItem value="paid">Pago requerido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Metadatos SEO</CardTitle>
                  <CardDescription>
                    Mejora la visibilidad del curso en los motores de búsqueda
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="meta-title">Título meta</Label>
                    <Input id="meta-title" placeholder="Título para SEO" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="meta-description">Descripción meta</Label>
                    <Textarea 
                      id="meta-description" 
                      placeholder="Breve descripción para SEO..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="keywords">Palabras clave</Label>
                    <Input id="keywords" placeholder="ej. gestión, proyectos, certificación" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Separa las palabras clave con comas
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Acciones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full flex gap-2">
                    <Save size={16} /> Guardar curso
                  </Button>
                  <Button variant="outline" className="w-full flex gap-2">
                    <Eye size={16} /> Previsualizar
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreateCourse;
