import React, { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

// Definimos la interfaz para el tipo de usuario
interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  status: string;
  courses?: number;
  completedCourses?: number | null;
  lastActive: string;
}

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

  // Obtener usuarios de Supabase
  const fetchUsers = async (): Promise<User[]> => {
    // Obtenemos todos los usuarios con sus perfiles desde Supabase
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error("Error fetching users:", authError);
      throw authError;
    }

    // Obtener los perfiles para obtener información adicional
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      throw profilesError;
    }

    // Combinar los datos de usuarios con sus perfiles
    const users = authUsers.users.map((authUser) => {
      const profile = profiles?.find(p => p.id === authUser.id);
      const fullName = profile ? `${profile.first_name} ${profile.last_name}` : 'Usuario sin nombre';
      
      return {
        id: authUser.id,
        email: authUser.email || 'No email',
        name: fullName,
        // Determinar el rol basado en el perfil o por defecto "student"
        role: profile?.is_admin ? 'admin' : 'student',
        status: authUser.banned ? 'suspended' : (authUser.email_confirmed_at ? 'active' : 'inactive'),
        courses: 0, // Valor por defecto, podríamos obtenerlo de una consulta adicional
        completedCourses: 0, // Valor por defecto
        lastActive: authUser.last_sign_in_at || authUser.created_at || new Date().toISOString()
      };
    });

    return users;
  };

  // Usar React Query para obtener y cachear los usuarios
  const { data: allUsers = [], isLoading, isError, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

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
        (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
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

  const handleAddUser = async () => {
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

    try {
      // Generar una contraseña aleatoria
      const randomPassword = Math.random().toString(36).slice(-8);
      
      // Crear el usuario en Supabase Auth
      const { data, error } = await supabase.auth.admin.createUser({
        email: newUser.email,
        password: randomPassword,
        email_confirm: true, // Auto-confirmar el email
        user_metadata: {
          full_name: newUser.name,
          is_admin: newUser.role === 'admin'
        }
      });

      if (error) {
        throw error;
      }

      toast.success(`Usuario ${newUser.name} añadido exitosamente`);
      setIsAddUserOpen(false);
      setNewUser({ name: "", email: "", role: "student" });
    } catch (error: any) {
      toast.error(`Error al crear usuario: ${error.message}`);
    }
  };

  const handleUserAction = async (action: string, userId: string, userName: string) => {
    try {
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
          await supabase.auth.admin.updateUserById(userId, {
            user_metadata: { banned: false }
          });
          toast.success(`Usuario ${userName} activado`);
          break;
        case 'suspend':
          await supabase.auth.admin.updateUserById(userId, {
            user_metadata: { banned: true }
          });
          toast.warning(`Usuario ${userName} suspendido`);
          break;
        case 'delete':
          await supabase.auth.admin.deleteUser(userId);
          toast.error(`Usuario ${userName} eliminado`);
          break;
        default:
          break;
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
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

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Cargando usuarios...</div>;
  }

  if (isError) {
    return <div className="text-red-500">Error al cargar usuarios: {error instanceof Error ? error.message : 'Error desconocido'}</div>;
  }

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
                    <div className="font-medium">{user.name || 'Sin nombre'}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                </TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>{getStatusIndicator(user.status)}</TableCell>
                <TableCell>
                  {user.role === 'instructor' ? (
                    <div>{user.courses || 0} impartidos</div>
                  ) : (
                    <div>
                      {user.completedCourses || 0} / {user.courses || 0} completados
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
                        onClick={() => handleUserAction('edit', user.id, user.name || user.email)}
                      >
                        <Edit size={16} /> Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="flex gap-2 cursor-pointer"
                        onClick={() => handleUserAction('message', user.id, user.name || user.email)}
                      >
                        <Mail size={16} /> Enviar mensaje
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="flex gap-2 cursor-pointer"
                        onClick={() => handleUserAction('permissions', user.id, user.name || user.email)}
                      >
                        <UserCog size={16} /> Gestionar permisos
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {user.status === 'active' ? (
                        <DropdownMenuItem 
                          className="flex gap-2 cursor-pointer text-amber-600"
                          onClick={() => handleUserAction('suspend', user.id, user.name || user.email)}
                        >
                          <ShieldAlert size={16} /> Suspender usuario
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem 
                          className="flex gap-2 cursor-pointer text-green-600"
                          onClick={() => handleUserAction('activate', user.id, user.name || user.email)}
                        >
                          <ShieldCheck size={16} /> Activar usuario
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        className="flex gap-2 cursor-pointer text-red-600"
                        onClick={() => handleUserAction('delete', user.id, user.name || user.email)}
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
