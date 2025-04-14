
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
  ShieldX,
  Clock,
  FileQuestion,
  SquareDashed
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const QuizzesManagement = () => {
  // Mock quizzes data
  const quizzes = [
    {
      id: 1,
      title: "Fundamentos de la Gestión de Proyectos",
      category: "Project Management",
      questions: 50,
      timeLimit: 60,
      status: "active",
      attempts: 245,
      averageScore: 78,
      createdAt: "2023-02-15T10:30:00"
    },
    {
      id: 2,
      title: "Metodologías Ágiles y Scrum",
      category: "Agile",
      questions: 30,
      timeLimit: 45,
      status: "active",
      attempts: 189,
      averageScore: 82,
      createdAt: "2023-01-20T09:15:00"
    },
    {
      id: 3,
      title: "Gestión de Riesgos en Proyectos",
      category: "Risk Management",
      questions: 25,
      timeLimit: 30,
      status: "draft",
      attempts: 0,
      averageScore: null,
      createdAt: "2023-04-05T16:45:00"
    },
    {
      id: 4,
      title: "Certificación PMP: Práctica Oficial",
      category: "Certification",
      questions: 100,
      timeLimit: 120,
      status: "active",
      attempts: 321,
      averageScore: 74,
      createdAt: "2023-03-12T14:50:00"
    },
    {
      id: 5,
      title: "PRINCE2 Foundation: Cuestionario",
      category: "Certification",
      questions: 60,
      timeLimit: 70,
      status: "inactive",
      attempts: 86,
      averageScore: 68,
      createdAt: "2023-02-28T11:25:00"
    },
    {
      id: 6,
      title: "Liderazgo y Gestión de Equipos",
      category: "Leadership",
      questions: 40,
      timeLimit: 50,
      status: "active",
      attempts: 178,
      averageScore: 76,
      createdAt: "2023-05-10T13:40:00",
      hasCompletePhrases: true
    },
    {
      id: 7,
      title: "Comunicación Efectiva en Proyectos",
      category: "Communication",
      questions: 35,
      timeLimit: 45,
      status: "active",
      attempts: 145,
      averageScore: 81,
      createdAt: "2023-05-18T09:30:00",
      hasCompletePhrases: true
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

  const getQuizTypeBadge = (hasCompletePhrases: boolean | undefined) => {
    if (hasCompletePhrases) {
      return <div className="flex items-center gap-1">
        <SquareDashed size={14} className="text-blue-600" />
        <span className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">Completar frase</span>
      </div>;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Cuestionarios</h1>
        
        <div className="flex gap-2">
          <Button variant="outline" className="flex gap-2">
            <Filter size={16} /> Filtros
          </Button>
          <Button className="flex gap-2">
            <Plus size={16} /> Crear cuestionario
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar cuestionarios..."
            className="pl-8"
          />
        </div>

        <div className="text-sm text-muted-foreground">
          Mostrando {quizzes.length} de {quizzes.length} cuestionarios
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[250px]">Título</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Preguntas</TableHead>
              <TableHead>Tiempo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Intentos</TableHead>
              <TableHead>Puntuación</TableHead>
              <TableHead>Fecha creación</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quizzes.map((quiz) => (
              <TableRow key={quiz.id}>
                <TableCell>
                  <div className="font-medium">{quiz.title}</div>
                </TableCell>
                <TableCell>{quiz.category}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <FileQuestion size={14} className="text-muted-foreground" />
                    <span>{quiz.questions}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Clock size={14} className="text-muted-foreground" />
                    <span>{quiz.timeLimit} min</span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(quiz.status)}</TableCell>
                <TableCell>{getQuizTypeBadge(quiz.hasCompletePhrases)}</TableCell>
                <TableCell>{quiz.attempts}</TableCell>
                <TableCell>
                  {quiz.averageScore !== null ? (
                    <span className={`${
                      quiz.averageScore >= 80 ? "text-green-600" : 
                      quiz.averageScore >= 70 ? "text-amber-600" : "text-red-600"
                    }`}>
                      {quiz.averageScore}%
                    </span>
                  ) : (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </TableCell>
                <TableCell>{formatDate(quiz.createdAt)}</TableCell>
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
                      {quiz.status === 'active' ? (
                        <DropdownMenuItem className="flex gap-2 cursor-pointer text-amber-600">
                          <ShieldX size={16} /> Desactivar
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem className="flex gap-2 cursor-pointer text-green-600">
                          <ShieldCheck size={16} /> Activar
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

export default QuizzesManagement;
