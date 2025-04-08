
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
  Trash, 
  Mail,
  UserCog,
  ShieldCheck,
  ShieldAlert 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const UsersManagement = () => {
  // Mock users data
  const users = [
    {
      id: 1,
      name: "Juan Pérez",
      email: "juan.perez@example.com",
      role: "student",
      status: "active",
      courses: 5,
      completedCourses: 3,
      lastActive: "2023-05-12T10:45:00"
    },
    {
      id: 2,
      name: "María García",
      email: "maria.garcia@example.com",
      role: "instructor",
      status: "active",
      courses: 3,
      completedCourses: null,
      lastActive: "2023-05-15T14:20:00"
    },
    {
      id: 3,
      name: "Carlos Rodríguez",
      email: "carlos.rodriguez@example.com",
      role: "admin",
      status: "active",
      courses: 12,
      completedCourses: 12,
      lastActive: "2023-05-17T09:10:00"
    },
    {
      id: 4,
      name: "Ana Martínez",
      email: "ana.martinez@example.com",
      role: "student",
      status: "inactive",
      courses: 2,
      completedCourses: 0,
      lastActive: "2023-04-20T16:30:00"
    },
    {
      id: 5,
      name: "Javier López",
      email: "javier.lopez@example.com",
      role: "student",
      status: "suspended",
      courses: 7,
      completedCourses: 4,
      lastActive: "2023-05-01T11:15:00"
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Admin</Badge>;
      case 'instructor':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Instructor</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Estudiante</Badge>;
    }
  };

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span>Activo</span>
          </div>
        );
      case 'inactive':
        return (
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-gray-400"></div>
            <span>Inactivo</span>
          </div>
        );
      case 'suspended':
        return (
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-500"></div>
            <span>Suspendido</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Usuarios</h1>
        
        <div className="flex gap-2">
          <Button variant="outline" className="flex gap-2">
            <Filter size={16} /> Filtros
          </Button>
          <Button className="flex gap-2">
            <Plus size={16} /> Añadir usuario
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar usuarios..."
            className="pl-8"
          />
        </div>

        <div className="text-sm text-muted-foreground">
          Mostrando {users.length} de {users.length} usuarios
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Cursos</TableHead>
              <TableHead>Última actividad</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                </TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>{getStatusIndicator(user.status)}</TableCell>
                <TableCell>
                  {user.role === 'instructor' ? (
                    <div>{user.courses} impartidos</div>
                  ) : (
                    <div>
                      {user.completedCourses} / {user.courses} completados
                    </div>
                  )}
                </TableCell>
                <TableCell>{formatDate(user.lastActive)}</TableCell>
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
                        <Edit size={16} /> Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex gap-2 cursor-pointer">
                        <Mail size={16} /> Enviar mensaje
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex gap-2 cursor-pointer">
                        <UserCog size={16} /> Gestionar permisos
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {user.status === 'active' ? (
                        <DropdownMenuItem className="flex gap-2 cursor-pointer text-amber-600">
                          <ShieldAlert size={16} /> Suspender usuario
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem className="flex gap-2 cursor-pointer text-green-600">
                          <ShieldCheck size={16} /> Activar usuario
                        </DropdownMenuItem>
                      )}
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

export default UsersManagement;
