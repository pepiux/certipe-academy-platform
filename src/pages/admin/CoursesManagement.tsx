
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
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
  ShieldCheck,
  ShieldX
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Type definitions
interface Course {
  id: string;
  title: string;
  category: string;
  instructor: string;
  status: string;
  level: string;
  created_at: string;
  image_url: string | null;
}

interface Filters {
  status: string;
  category: string;
  level: string;
}

const CoursesManagement = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    status: "",
    category: "",
    level: ""
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [courseToChangeStatus, setCourseToChangeStatus] = useState<Course | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 5;

  const fetchCourses = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('courses')
        .select('*', { count: 'exact' });

      // Apply search filter
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      
      if (filters.level) {
        query = query.eq('level', filters.level);
      }

      // Pagination
      const startIndex = (currentPage - 1) * itemsPerPage;
      query = query.range(startIndex, startIndex + itemsPerPage - 1);
      
      // Order by creation date
      query = query.order('created_at', { ascending: false });

      const { data, error, count } = await query;
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setCourses(data);
        
        if (count !== null) {
          setTotalItems(count);
          setTotalPages(Math.ceil(count / itemsPerPage));
        }
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Error al cargar los cursos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [currentPage, searchQuery, filters]);

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

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;
    
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseToDelete.id);
        
      if (error) throw error;
      
      toast.success("Curso eliminado con éxito");
      fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Error al eliminar el curso");
    } finally {
      setDeleteDialogOpen(false);
      setCourseToDelete(null);
    }
  };

  const handleStatusChange = async () => {
    if (!courseToChangeStatus) return;
    
    const newStatus = courseToChangeStatus.status === 'published' ? 'draft' : 'published';
    
    try {
      const { error } = await supabase
        .from('courses')
        .update({ status: newStatus })
        .eq('id', courseToChangeStatus.id);
        
      if (error) throw error;
      
      toast.success(`Curso ${newStatus === 'published' ? 'publicado' : 'despublicado'} con éxito`);
      fetchCourses();
    } catch (error) {
      console.error("Error updating course status:", error);
      toast.error("Error al cambiar el estado del curso");
    } finally {
      setStatusDialogOpen(false);
      setCourseToChangeStatus(null);
    }
  };

  const handleDuplicateCourse = async (course: Course) => {
    try {
      const { data: fullCourse, error: fetchError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', course.id)
        .single();
        
      if (fetchError) throw fetchError;
      
      const newCourse = {
        ...fullCourse,
        id: undefined, // Let Supabase generate a new ID
        title: `${fullCourse.title} (Copia)`,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('courses')
        .insert(newCourse);
        
      if (error) throw error;
      
      toast.success("Curso duplicado con éxito");
      fetchCourses();
    } catch (error) {
      console.error("Error duplicating course:", error);
      toast.error("Error al duplicar el curso");
    }
  };

  // Categories, levels for filters
  const categories = ["Project Management", "Agile", "Risk Management", "Certification", "Tools"];
  const levels = ["Principiante", "Intermedio", "Avanzado"];
  const statuses = ["published", "draft", "review"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Cursos</h1>
        
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                className="flex gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={16} /> Filtros
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Filtrar cursos
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="flex gap-2" asChild>
                <a href="/dashboard/admin/courses/create">
                  <Plus size={16} /> Crear curso
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Crear nuevo curso
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {showFilters && (
        <div className="bg-muted/40 p-4 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Estado</label>
            <Select
              value={filters.status}
              onValueChange={(value) => setFilters({...filters, status: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos los estados</SelectItem>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status === 'published' ? 'Publicado' : 
                     status === 'draft' ? 'Borrador' : 'En revisión'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Categoría</label>
            <Select
              value={filters.category}
              onValueChange={(value) => setFilters({...filters, category: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas las categorías" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas las categorías</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Nivel</label>
            <Select
              value={filters.level}
              onValueChange={(value) => setFilters({...filters, level: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos los niveles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos los niveles</SelectItem>
                {levels.map(level => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="md:col-span-3 flex justify-end gap-2">
            <Button 
              variant="outline"
              onClick={() => setFilters({status: "", category: "", level: ""})}
            >
              Limpiar
            </Button>
            <Button onClick={() => setShowFilters(false)}>
              Aplicar
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar cursos..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="text-sm text-muted-foreground">
          Mostrando {courses.length} de {totalItems} cursos
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="min-w-[250px] font-semibold">Título</TableHead>
              <TableHead className="font-semibold">Categoría</TableHead>
              <TableHead className="font-semibold">Instructor</TableHead>
              <TableHead className="font-semibold">Estado</TableHead>
              <TableHead className="font-semibold">Fecha creación</TableHead>
              <TableHead className="text-right font-semibold">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Cargando cursos...
                </TableCell>
              </TableRow>
            ) : courses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No se encontraron cursos
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>
                    <div className="font-medium">{course.title}</div>
                  </TableCell>
                  <TableCell>{course.category}</TableCell>
                  <TableCell>{course.instructor}</TableCell>
                  <TableCell>{getStatusBadge(course.status)}</TableCell>
                  <TableCell>{formatDate(course.created_at)}</TableCell>
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
                        <DropdownMenuItem className="flex gap-2 cursor-pointer" onClick={() => navigate(`/dashboard/courses/${course.id}`)}>
                          <Eye size={16} /> Previsualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex gap-2 cursor-pointer" onClick={() => navigate(`/dashboard/admin/courses/edit/${course.id}`)}>
                          <Edit size={16} /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex gap-2 cursor-pointer" onClick={() => handleDuplicateCourse(course)}>
                          <Copy size={16} /> Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex gap-2 cursor-pointer" onClick={() => navigate(`/dashboard/admin/courses/stats/${course.id}`)}>
                          <BarChart size={16} /> Estadísticas
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {course.status === 'published' ? (
                          <DropdownMenuItem 
                            className="flex gap-2 cursor-pointer text-amber-600"
                            onClick={() => {
                              setCourseToChangeStatus(course);
                              setStatusDialogOpen(true);
                            }}
                          >
                            <ShieldX size={16} /> Despublicar
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem 
                            className="flex gap-2 cursor-pointer text-green-600"
                            onClick={() => {
                              setCourseToChangeStatus(course);
                              setStatusDialogOpen(true);
                            }}
                          >
                            <ShieldCheck size={16} /> Publicar
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="flex gap-2 cursor-pointer text-red-600"
                          onClick={() => {
                            setCourseToDelete(course);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash size={16} /> Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2">
          <Pagination>
            <div className="flex items-center justify-between w-full px-2">
              <div className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                >
                  &lt;
                </Button>
                {Array.from({ length: totalPages }).map((_, index) => (
                  <Button
                    key={index}
                    variant={currentPage === index + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                  disabled={currentPage === totalPages}
                >
                  &gt;
                </Button>
              </div>
            </div>
          </Pagination>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar el curso "{courseToDelete?.title}"?
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteCourse}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Change Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {courseToChangeStatus?.status === 'published' 
                ? 'Despublicar curso' 
                : 'Publicar curso'}
            </DialogTitle>
            <DialogDescription>
              {courseToChangeStatus?.status === 'published'
                ? `¿Estás seguro de que deseas despublicar el curso "${courseToChangeStatus?.title}"?
                   Los usuarios no podrán acceder a este curso.`
                : `¿Estás seguro de que deseas publicar el curso "${courseToChangeStatus?.title}"?
                   Los usuarios podrán acceder a este curso.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              variant={courseToChangeStatus?.status === 'published' ? "destructive" : "default"}
              onClick={handleStatusChange}
            >
              {courseToChangeStatus?.status === 'published' ? 'Despublicar' : 'Publicar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoursesManagement;
