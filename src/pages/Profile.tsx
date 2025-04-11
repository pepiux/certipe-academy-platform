
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Award,
  BookOpen,
  FileText,
  Clock,
  Lock,
  Settings
} from "lucide-react";

const Profile = () => {
  // Mock user profile data
  const user = {
    id: 1,
    name: "Juan Pérez",
    email: "juan.perez@example.com",
    phone: "+34 612 345 678",
    location: "Madrid, España",
    company: "Tech Innovations SL",
    position: "Project Manager",
    bio: "Project Manager con 8 años de experiencia en el sector tecnológico. Especialista en metodologías ágiles y certificado PMP.",
    avatar: "https://placehold.co/400x400?text=JP",
    joinedDate: "Enero 2023",
    social: {
      linkedin: "linkedin.com/in/juan-perez",
      twitter: "@juanperez",
      website: "juanperez.com"
    },
    skills: [
      "Project Management", 
      "Agile", 
      "Scrum", 
      "Team Leadership", 
      "Risk Management"
    ],
    certifications: [
      { 
        id: 1, 
        name: "Project Management Professional (PMP)", 
        issuer: "PMI", 
        date: "Julio 2021", 
        expires: "Julio 2024",
        verified: true
      },
      { 
        id: 2, 
        name: "Certified ScrumMaster (CSM)", 
        issuer: "Scrum Alliance", 
        date: "Marzo 2022", 
        expires: null,
        verified: true
      },
      { 
        id: 3, 
        name: "PRINCE2 Foundation", 
        issuer: "Axelos", 
        date: "Octubre 2020", 
        expires: null,
        verified: false
      }
    ],
    education: [
      {
        id: 1,
        institution: "Universidad Complutense de Madrid",
        degree: "Máster en Dirección de Proyectos",
        field: "Gestión de Proyectos",
        from: "2018",
        to: "2019"
      },
      {
        id: 2,
        institution: "Universidad Politécnica de Madrid",
        degree: "Grado en Ingeniería Informática",
        field: "Ingeniería de Software",
        from: "2014",
        to: "2018"
      }
    ],
    stats: {
      coursesCompleted: 8,
      coursesInProgress: 2,
      quizzesTaken: 24,
      averageScore: 82,
      studyHours: 64,
      certificatesEarned: 3
    },
    recentActivity: [
      {
        id: 1,
        type: "course_progress",
        title: "Completaste el módulo 'Gestión de Stakeholders'",
        course: "Avanzado en Gestión de Proyectos",
        date: "Hace 2 días"
      },
      {
        id: 2,
        type: "quiz_completed",
        title: "Finalizaste el cuestionario con 85%",
        course: "Metodologías Ágiles y Scrum",
        date: "Hace 5 días"
      },
      {
        id: 3,
        type: "certificate_earned",
        title: "Obtuviste el certificado del curso",
        course: "Introducción a PRINCE2",
        date: "Hace 2 semanas"
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-bold">Mi Perfil</h1>
        <Button variant="outline">
          <Settings size={16} className="mr-2" /> Configuración
        </Button>
      </div>
      
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="certificates">Certificados</TabsTrigger>
          <TabsTrigger value="progress">Progreso</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
        </TabsList>
        
        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar and basic info */}
                <div className="flex flex-col items-center md:items-start gap-4 md:w-1/3">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>JP</AvatarFallback>
                  </Avatar>
                  
                  <div className="text-center md:text-left">
                    <h2 className="text-xl font-bold">{user.name}</h2>
                    <p className="text-muted-foreground">{user.position}</p>
                    <p className="text-sm text-muted-foreground">Miembro desde {user.joinedDate}</p>
                  </div>
                  
                  <div className="w-full space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-muted-foreground" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-muted-foreground" />
                      <span>{user.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-muted-foreground" />
                      <span>{user.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building size={16} className="text-muted-foreground" />
                      <span>{user.company}</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">Editar perfil</Button>
                </div>
                
                {/* Bio and skills */}
                <div className="md:w-2/3 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Acerca de mí</h3>
                    <p className="text-muted-foreground">{user.bio}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Habilidades</h3>
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Educación</h3>
                    <div className="space-y-4">
                      {user.education.map((edu) => (
                        <div key={edu.id}>
                          <div className="font-medium">{edu.degree}</div>
                          <div className="text-muted-foreground">{edu.institution}</div>
                          <div className="text-sm text-muted-foreground">{edu.from} - {edu.to}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Actividad reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {user.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0">
                    <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                      {activity.type === 'course_progress' && <BookOpen size={20} className="text-primary" />}
                      {activity.type === 'quiz_completed' && <FileText size={20} className="text-primary" />}
                      {activity.type === 'certificate_earned' && <Award size={20} className="text-primary" />}
                    </div>
                    <div>
                      <div className="font-medium">{activity.title}</div>
                      <div className="text-sm text-muted-foreground">{activity.course}</div>
                      <div className="text-xs text-muted-foreground">{activity.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Certificates Tab */}
        <TabsContent value="certificates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mis certificados</CardTitle>
              <CardDescription>
                Certificados obtenidos y credenciales verificables
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {user.certifications.map((cert) => (
                  <div key={cert.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{cert.name}</h3>
                        {cert.verified && (
                          <Badge variant="outline" className="text-blue-500 bg-blue-50">
                            Verificado
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                      <p className="text-xs text-muted-foreground">
                        Expedido: {cert.date}
                        {cert.expires && ` • Expira: ${cert.expires}`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Ver</Button>
                      <Button variant="outline" size="sm">Descargar</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Añadir certificado externo</CardTitle>
              <CardDescription>
                Añade tus certificaciones de otras plataformas para mantener todo en un solo lugar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cert-name">Nombre del certificado</Label>
                    <Input id="cert-name" placeholder="ej. AWS Certified Solutions Architect" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cert-issuer">Entidad emisora</Label>
                    <Input id="cert-issuer" placeholder="ej. Amazon Web Services" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cert-date">Fecha de emisión</Label>
                    <Input id="cert-date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cert-expiry">Fecha de caducidad (opcional)</Label>
                    <Input id="cert-expiry" type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cert-file">Subir certificado (PDF)</Label>
                  <Input id="cert-file" type="file" />
                </div>
                <Button>Añadir certificado</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Cursos completados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-3xl font-bold">{user.stats.coursesCompleted}</div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <BookOpen size={14} className="mr-1" />
                    <span>{user.stats.coursesInProgress} en progreso</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Puntuación promedio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-3xl font-bold">{user.stats.averageScore}%</div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <FileText size={14} className="mr-1" />
                    <span>{user.stats.quizzesTaken} cuestionarios</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Horas de estudio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-3xl font-bold">{user.stats.studyHours}</div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock size={14} className="mr-1" />
                    <span>Total acumulado</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Mis cursos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8">
                <p className="text-muted-foreground">
                  Esta es una versión de demostración. La vista detallada de progreso estará disponible próximamente.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cambiar contraseña</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Contraseña actual</Label>
                  <div className="relative">
                    <Input id="current-password" type="password" />
                    <Lock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nueva contraseña</Label>
                  <div className="relative">
                    <Input id="new-password" type="password" />
                    <Lock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar nueva contraseña</Label>
                  <div className="relative">
                    <Input id="confirm-password" type="password" />
                    <Lock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <Button>Actualizar contraseña</Button>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Preferencias de contacto</CardTitle>
              <CardDescription>
                Gestiona cómo prefieres recibir notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center p-8">
              <p className="text-muted-foreground">
                Esta es una versión de demostración. La configuración de preferencias estará disponible próximamente.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
