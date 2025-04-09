
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  ShieldCheck,
  ShieldX,
  Clock,
  FileQuestion,
  Image
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Pagination } from "@/components/ui/pagination";

// Type definitions
interface Quiz {
  id: string;
  title: string;
  category: string;
  description: string | null;
  image_url: string | null;
  time_limit: number;
  difficulty: string;
  questions_count: number;
  status: string;
  created_at: string;
}

interface Filters {
  status: string;
  category: string;
  difficulty: string;
}

const QuizzesManagement = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    status: "",
    category: "",
    difficulty: ""
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<Quiz | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [quizToChangeStatus, setQuizToChangeStatus] = useState<Quiz | null>(null);
  const [viewType, setViewType] = useState<'list' | 'grid'>('grid');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = viewType === 'list' ? 10 : 6;

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('quizzes')
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
      
      if (filters.difficulty) {
        query = query.eq('difficulty', filters.difficulty);
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
        setQuizzes(data);
        
        if (count !== null) {
          setTotalItems(count);
          setTotalPages(Math.ceil(count / itemsPerPage));
        }
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      toast.error("Error al cargar los cuestionarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [currentPage, searchQuery, filters, viewType]);

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
      case 'active':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Activo</Badge>;
      case 'draft':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Borrador</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Inactivo</Badge>;
      default:
        return null;
    }
  };

  const handleDeleteQuiz = async () => {
    if (!quizToDelete) return;
    
    try {
      const { error } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', quizToDelete.id);
        
      if (error) throw error;
      
      toast.success("Cuestionario eliminado con éxito");
      fetchQuizzes();
    } catch (error) {
      console.error("Error deleting quiz:", error);
      toast.error("Error al eliminar el cuestionario");
    } finally {
      setDeleteDialogOpen(false);
      setQuizToDelete(null);
    }
  };

  const handleStatusChange = async () => {
    if (!quizToChangeStatus) return;
    
    const newStatus = quizToChangeStatus.status === 'active' ? 'inactive' : 'active';
    
    try {
      const { error } = await supabase
        .from('quizzes')
        .update({ status: newStatus })
        .eq('id', quizToChangeStatus.id);
        
      if (error) throw error;
      
      toast.success(`Cuestionario ${newStatus === 'active' ? 'activado' : 'desactivado'} con éxito`);
      fetchQuizzes();
    } catch (error) {
      console.error("Error updating quiz status:", error);
      toast.error("Error al cambiar el estado del cuestionario");
    } finally {
      setStatusDialogOpen(false);
      setQuizToChangeStatus(null);
    }
  };

  const handleDuplicateQuiz = async (quiz: Quiz) => {
    try {
      const { data: fullQuiz, error: fetchError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', quiz.id)
        .single();
        
      if (fetchError) throw fetchError;
      
      const newQuiz = {
        ...fullQuiz,
        id: undefined, // Let Supabase generate a new ID
        title: `${fullQuiz.title} (Copia)`,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('quizzes')
        .insert(newQuiz);
        
      if (error) throw error;
      
      toast.success("Cuestionario duplicado con éxito");
      fetchQuizzes();
    } catch (error) {
      console.error("Error duplicating quiz:", error);
      toast.error("Error al duplicar el cuestionario");
    }
  };

  // Categories, difficulty levels for filters
  const categories = ["Project Management", "Agile", "Risk Management", "Certification"];
  const difficulties = ["Principiante", "Intermedio", "Avanzado"];
  const statuses = ["active", "draft", "inactive"];

  // Render quiz actions menu
  const renderActionsMenu = (quiz: Quiz) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Abrir menú</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuItem className="flex gap-2 cursor-pointer" onClick={() => navigate(`/dashboard/quizzes/${quiz.id}`)}>
          <Eye size={16} /> Previsualizar
        </DropdownMenuItem>
        <DropdownMenuItem className="flex gap-2 cursor-pointer" onClick={() => navigate(`/dashboard/admin/quizzes/edit/${quiz.id}`)}>
          <Edit size={16} /> Editar
        </DropdownMenuItem>
        <DropdownMenuItem className="flex gap-2 cursor-pointer" onClick={() => handleDuplicateQuiz(quiz)}>
          <Copy size={16} /> Duplicar
        </DropdownMenuItem>
        <DropdownMenuItem className="flex gap-2 cursor-pointer" onClick={() => navigate(`/dashboard/admin/quizzes/stats/${quiz.id}`)}>
          <BarChart size={16} /> Estadísticas
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {quiz.status === 'active' ? (
          <DropdownMenuItem 
            className="flex gap-2 cursor-pointer text-amber-600"
            onClick={() => {
              setQuizToChangeStatus(quiz);
              setStatusDialogOpen(true);
            }}
          >
            <ShieldX size={16} /> Desactivar
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem 
            className="flex gap-2 cursor-pointer text-green-600"
            onClick={() => {
              setQuizToChangeStatus(quiz);
              setStatusDialogOpen(true);
            }}
          >
            <ShieldCheck size={16} /> Activar
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="flex gap-2 cursor-pointer text-red-600"
          onClick={() => {
            setQuizToDelete(quiz);
            setDeleteDialogOpen(true);
          }}
        >
          <Trash size={16} /> Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Render grid view
  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {loading ? (
        <div className="col-span-full text-center py-12">
          Cargando cuestionarios...
        </div>
      ) : quizzes.length === 0 ? (
        <div className="col-span-full text-center py-12">
          No se encontraron cuestionarios
        </div>
      ) : (
        quizzes.map(quiz => (
          <Card key={quiz.id} className="flex flex-col">
            <CardHeader className="pb-2">
              <div className="h-48 -mt-6 -mx-6 mb-2 bg-muted flex items-center justify-center rounded-t-lg overflow-hidden">
                {quiz.image_url ? (
                  <img 
                    src={quiz.image_url} 
                    alt={quiz.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Image size={48} strokeWidth={1} />
                    <span className="text-sm mt-2">No image</span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg line-clamp-1">{quiz.title}</CardTitle>
                <div>{getStatusBadge(quiz.status)}</div>
              </div>
              <CardDescription className="flex items-center text-xs">
                {quiz.category}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pb-2 flex-grow">
              <div className="flex flex-col space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1">
                    <FileQuestion size={14} className="text-muted-foreground" />
                    <span>{quiz.questions_count} preguntas</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} className="text-muted-foreground" />
                    <span>{quiz.time_limit} min</span>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground line-clamp-2">
                  {quiz.description || "Sin descripción"}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="pt-2 flex items-center justify-between border-t">
              <div className="text-xs text-muted-foreground">
                {formatDate(quiz.created_at)}
              </div>
              {renderActionsMenu(quiz)}
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );

  // Render list view
  const renderListView = () => (
    <div className="border rounded-lg">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="min-w-[250px] font-semibold">Título</TableHead>
            <TableHead className="font-semibold">Categoría</TableHead>
            <TableHead className="font-semibold">Preguntas</TableHead>
            <TableHead className="font-semibold">Tiempo</TableHead>
            <TableHead className="font-semibold">Estado</TableHead>
            <TableHead className="font-semibold">Fecha creación</TableHead>
            <TableHead className="text-right font-semibold">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                Cargando cuestionarios...
              </TableCell>
            </TableRow>
          ) : quizzes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                No se encontraron cuestionarios
              </TableCell>
            </TableRow>
          ) : (
            quizzes.map((quiz) => (
              <TableRow key={quiz.id}>
                <TableCell>
                  <div className="font-medium">{quiz.title}</div>
                </TableCell>
                <TableCell>{quiz.category}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <FileQuestion size={14} className="text-muted-foreground" />
                    <span>{quiz.questions_count}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Clock size={14} className="text-muted-foreground" />
                    <span>{quiz.time_limit} min</span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(quiz.status)}</TableCell>
                <TableCell>{formatDate(quiz.created_at)}</TableCell>
                <TableCell className="text-right">
                  {renderActionsMenu(quiz)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Cuestionarios</h1>
        
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
              Filtrar cuestionarios
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline"
                className="px-2"
                onClick={() => setViewType(viewType === 'list' ? 'grid' : 'list')}
              >
                {viewType === 'list' ? 'Ver tarjetas' : 'Ver lista'}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Cambiar vista
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="flex gap-2" asChild>
                <a href="/dashboard/admin/quizzes/create">
                  <Plus size={16} /> Crear cuestionario
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Crear nuevo cuestionario
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
                    {status === 'active' ? 'Activo' : 
                     status === 'draft' ? 'Borrador' : 'Inactivo'}
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
            <label className="text-sm font-medium mb-1 block">Dificultad</label>
            <Select
              value={filters.difficulty}
              onValueChange={(value) => setFilters({...filters, difficulty: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas las dificultades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas las dificultades</SelectItem>
                {difficulties.map(difficulty => (
                  <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="md:col-span-3 flex justify-end gap-2">
            <Button 
              variant="outline"
              onClick={() => setFilters({status: "", category: "", difficulty: ""})}
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
            placeholder="Buscar cuestionarios..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="text-sm text-muted-foreground">
          Mostrando {quizzes.length} de {totalItems} cuestionarios
        </div>
      </div>

      {viewType === 'grid' ? renderGridView() : renderListView()}

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
              ¿Estás seguro de que deseas eliminar el cuestionario "{quizToDelete?.title}"?
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteQuiz}>
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
              {quizToChangeStatus?.status === 'active' 
                ? 'Desactivar cuestionario' 
                : 'Activar cuestionario'}
            </DialogTitle>
            <DialogDescription>
              {quizToChangeStatus?.status === 'active'
                ? `¿Estás seguro de que deseas desactivar el cuestionario "${quizToChangeStatus?.title}"?
                   Los usuarios no podrán acceder a este cuestionario.`
                : `¿Estás seguro de que deseas activar el cuestionario "${quizToChangeStatus?.title}"?
                   Los usuarios podrán acceder a este cuestionario.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              variant={quizToChangeStatus?.status === 'active' ? "destructive" : "default"}
              onClick={handleStatusChange}
            >
              {quizToChangeStatus?.status === 'active' ? 'Desactivar' : 'Activar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuizzesManagement;
