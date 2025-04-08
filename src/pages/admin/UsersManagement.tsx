
import React, { useState } from "react";
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
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  UserPlus
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UsersManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "student"
  });
  
  const usersPerPage = 5;
  const roles = ["student", "instructor", "admin"];
  const statuses = ["active", "inactive", "suspended"];

  // Mock users data
  const allUsers = [
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
    },
    {
      id: 6,
      name: "Laura Fernández",
      email: "laura.fernandez@example.com",
      role: "instructor",
      status: "active",
      courses: 5,
      completedCourses: null,
      lastActive: "2023-05-16T13:45:00"
    },
    {
      id: 7,
      name: "Miguel Sánchez",
      email: "miguel.sanchez@example.com",
      role: "student",
      status: "active",
      courses: 4,
      completedCourses: 1,
      lastActive: "2023-05-14T17:30:00"
    },
    {
      id: 8,
      name: "Carmen Díaz",
      email: "carmen.diaz@example.com",
      role: "student",
      status: "inactive",
      courses: 3,
      completedCourses: 0,
      lastActive: "2023-04-12T09:20:00"
    },
    {
      id: 9,
      name: "Pablo González",
      email: "pablo.gonzalez@example.com",
      role: "instructor",
      status: "active",
      courses: 2,
      completedCourses: null,
      lastActive: "2023-05-10T11:05:00"
    },
    {
      id: 10,
      name: "Elena Torres",
      email: "elena.torres@example.com",
      role: "student",
      status: "suspended",
      courses: 6,
      completedCourses: 3,
      lastActive: "2023-04-28T15:40:00"
    },
    {
      id: 11,
      name: "Jorge Ramírez",
      email: "jorge.ramirez@example.com",
      role: "student",
      status: "active",
      courses: 8,
      completedCourses: 6,
      lastActive: "2023-05-17T12:15:00"
    },
    {
      id: 12,
      name: "Marta Ortiz",
      email: "marta.ortiz@example.com",
      role: "admin",
      status: "active",
      courses: 10,
      completedCourses: 10,
      lastActive: "2023-05-18T10:30:00"
    }
  ];

  // Sorting logic
  const sortedUsers = React.useMemo(() => {
    let tempUsers = [...allUsers];
    if (sortConfig) {
      tempUsers.sort((a, b) => {
        if (a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return tempUsers;
  }, [allUsers, sortConfig]);

  // Filter logic
  const filteredUsers = React.useMemo(() => {
    return sortedUsers.filter(user => {
      return (
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [sortedUsers, searchTerm]);

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

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

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleAddUser = () => {
    // Basic validation
    if (!newUser.name || !newUser.email) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      toast.error("Por favor ingresa un email válido");
      return;
    }

    // Add user logic (in a real app, this would be an API call)
    toast.success(`Usuario ${newUser.name} añadido exitosamente`);
    setIsAddUserOpen(false);
    setNewUser({ name: "", email: "", role: "student" });
  };

  const handleUserAction = (action: string, userId: number, userName: string) => {
    switch (action) {
      case 'edit':
        toast.info(`Editando usuario: ${userName}`);
        break;
      case 'message':
        toast.info(`Enviando mensaje a: ${userName}`);
        break;
      case 'permissions':
        toast.info(`Gestionando permisos de: ${userName}`);
        break;
      case 'activate':
        toast.success(`Usuario ${userName} activado`);
        break;
      case 'suspend':
        toast.warning(`Usuario ${userName} suspendido`);
        break;
      case 'delete':
        toast.error(`Usuario ${userName} eliminado`);
        break;
      default:
        break;
    }
  };

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="h-4 w-4 inline ml-1" /> : 
      <ChevronDown className="h-4 w-4 inline ml-1" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Usuarios</h1>
        
        <div className="flex gap-2">
          <Button variant="outline" className="flex gap-2">
            <Filter size={16} /> Filtros
          </Button>
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button className="flex gap-2">
                <UserPlus size={16} /> Añadir usuario
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Añadir nuevo usuario</DialogTitle>
                <DialogDescription>
                  Completa el formulario para crear un nuevo usuario en el sistema.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Nombre</Label>
                  <Input 
                    id="name" 
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    placeholder="Nombre completo"
                    className="col-span-3" 
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    placeholder="correo@ejemplo.com"
                    className="col-span-3" 
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">Rol</Label>
                  <Select 
                    value={newUser.role} 
                    onValueChange={(value) => setNewUser({...newUser, role: value})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccionar rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Estudiante</SelectItem>
                      <SelectItem value="instructor">Instructor</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>Cancelar</Button>
                <Button onClick={handleAddUser}>Guardar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar usuarios..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="text-sm text-muted-foreground">
          Mostrando {currentUsers.length} de {filteredUsers.length} usuarios
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                Nombre {getSortIcon('name')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('role')}>
                Rol {getSortIcon('role')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                Estado {getSortIcon('status')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('courses')}>
                Cursos {getSortIcon('courses')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('lastActive')}>
                Última actividad {getSortIcon('lastActive')}
              </TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentUsers.map((user) => (
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
                      <DropdownMenuItem 
                        className="flex gap-2 cursor-pointer"
                        onClick={() => handleUserAction('edit', user.id, user.name)}
                      >
                        <Edit size={16} /> Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="flex gap-2 cursor-pointer"
                        onClick={() => handleUserAction('message', user.id, user.name)}
                      >
                        <Mail size={16} /> Enviar mensaje
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="flex gap-2 cursor-pointer"
                        onClick={() => handleUserAction('permissions', user.id, user.name)}
                      >
                        <UserCog size={16} /> Gestionar permisos
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {user.status === 'active' ? (
                        <DropdownMenuItem 
                          className="flex gap-2 cursor-pointer text-amber-600"
                          onClick={() => handleUserAction('suspend', user.id, user.name)}
                        >
                          <ShieldAlert size={16} /> Suspender usuario
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem 
                          className="flex gap-2 cursor-pointer text-green-600"
                          onClick={() => handleUserAction('activate', user.id, user.name)}
                        >
                          <ShieldCheck size={16} /> Activar usuario
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        className="flex gap-2 cursor-pointer text-red-600"
                        onClick={() => handleUserAction('delete', user.id, user.name)}
                      >
                        <Trash size={16} /> Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {currentUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No se encontraron usuarios
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(number => 
                number === 1 || 
                number === totalPages || 
                (number >= currentPage - 1 && number <= currentPage + 1)
              )
              .map((number, index, array) => (
                <React.Fragment key={number}>
                  {index > 0 && array[index - 1] !== number - 1 && (
                    <span className="mx-1">...</span>
                  )}
                  <Button
                    variant={number === currentPage ? "default" : "outline"}
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => paginate(number)}
                  >
                    {number}
                  </Button>
                </React.Fragment>
              ))}
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
