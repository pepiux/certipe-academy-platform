
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Edit,
  Copy,
  Trash,
  Eye,
  BarChart,
  FileEdit,
  ShieldCheck,
  ShieldX
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CoursesManagement = () => {
  // Mock courses data
  const courses = [
    {
      id: 1,
      title: "Fundamentos de la Gestión de Proyectos",
      category: "Project Management",
      instructor: "María García",
      status: "published",
      students: 245,
      createdAt: "2023-02-15T10:30:00",
      updatedAt: "2023-04-10T14:20:00"
    },
    {
      id: 2,
      title: "Metodologías Ágiles y Scrum",
      category: "Agile",
      instructor: "Carlos Rodríguez",
      status: "published",
      students: 189,
      createdAt: "2023-01-20T09:15:00",
      updatedAt: "2023-03-25T11:10:00"
    },
    {
      id: 3,
      title: "Gestión de Riesgos en Proyectos",
      category: "Risk Management",
      instructor: "Ana Martínez",
      status: "draft",
      students: 0,
      createdAt: "2023-04-05T16:45:00",
      updatedAt: "2023-05-02T15:30:00"
    },
    {
      id: 4,
      title: "Certificación PMP: Guía Completa",
      category: "Certification",
      instructor: "Javier López",
      status: "review",
      students: 0,
      createdAt: "2023-03-12T14:50:00",
      updatedAt: "2023-05-08T17:20:00"
    },
    {
      id: 5,
      title: "Herramientas para la Gestión de Proyectos",
      category: "Tools",
      instructor: "Laura Sánchez",
      status: "published",
      students: 132,
      createdAt: "2023-02-28T11:25:00",
      updatedAt: "2023-04-15T09:40:00"
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Publicado</Badge>;
      case 'draft':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Borrador</Badge>;
      case 'review':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">En revisión</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Cursos</h1>
        
        <div className="flex gap-2">
          <Button variant="outline" className="flex gap-2">
            <Filter size={16} /> Filtros
          </Button>
          <Button className="flex gap-2" asChild>
            <a href="/dashboard/admin/courses/create">
              <Plus size={16} /> Crear curso
            </a>
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar cursos..."
            className="pl-8"
          />
        </div>

        <div className="text-sm text-muted-foreground">
          Mostrando {courses.length} de {courses.length} cursos
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[250px]">Título</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Estudiantes</TableHead>
              <TableHead>Fecha creación</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>
                  <div className="font-medium">{course.title}</div>
                </TableCell>
                <TableCell>{course.category}</TableCell>
                <TableCell>{course.instructor}</TableCell>
                <TableCell>{getStatusBadge(course.status)}</TableCell>
                <TableCell>{course.students}</TableCell>
                <TableCell>{formatDate(course.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Abrir menú</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuItem className="flex gap-2 cursor-pointer">
                        <Eye size={16} /> Previsualizar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex gap-2 cursor-pointer">
                        <Edit size={16} /> Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex gap-2 cursor-pointer">
                        <Copy size={16} /> Duplicar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex gap-2 cursor-pointer">
                        <BarChart size={16} /> Estadísticas
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {course.status === 'published' ? (
                        <DropdownMenuItem className="flex gap-2 cursor-pointer text-amber-600">
                          <ShieldX size={16} /> Despublicar
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem className="flex gap-2 cursor-pointer text-green-600">
                          <ShieldCheck size={16} /> Publicar
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="flex gap-2 cursor-pointer text-red-600">
                        <Trash size={16} /> Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination would go here */}
    </div>
  );
};

export default CoursesManagement;
