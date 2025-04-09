
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Menu,
  Sun,
  Moon,
  Search,
  Settings,
  User,
  LogOut,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";
import { getUserInitials } from "@/utils/userUtils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface HeaderProps {
  toggleSidebar: () => void;
}

type Notification = {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
};

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { setTheme, theme } = useTheme();
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Nuevo curso disponible",
      message: "Se ha añadido el curso 'Avanzado en Gestión de Riesgos'",
      time: "Hace 5 minutos",
      read: false
    },
    {
      id: 2,
      title: "Recordatorio de cuestionario",
      message: "Tienes un cuestionario programado para mañana",
      time: "Hace 2 horas",
      read: false
    },
    {
      id: 3,
      title: "Certificado listo",
      message: "Tu certificado de 'Fundamentos de Gestión de Proyectos' está listo",
      time: "Hace 1 día",
      read: true
    }
  ]);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const handleLogout = async () => {
    toast.info("Cerrando sesión...");
    try {
      await signOut();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };
  
  const markAsRead = (id: number) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(n => ({ ...n, read: true }))
    );
    toast.success("Todas las notificaciones marcadas como leídas");
  };

  const { data: searchResults } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: async () => {
      if (!searchQuery || searchQuery.length < 2) return { courses: [], quizzes: [] };
      
      // Search courses
      const { data: courses, error: coursesError } = await supabase
        .from('courses')
        .select('id, title, description, category')
        .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .limit(5);
        
      if (coursesError) throw coursesError;
      
      // Search quizzes
      const { data: quizzes, error: quizzesError } = await supabase
        .from('quizzes')
        .select('id, title, description, category')
        .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .limit(5);
        
      if (quizzesError) throw quizzesError;
      
      return { courses, quizzes };
    },
    enabled: searchQuery.length >= 2,
    staleTime: 10000
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.length >= 2) {
      navigate(`/dashboard/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-10 border-b bg-background flex items-center justify-between h-16 px-4">
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Toggle Sidebar
          </TooltipContent>
        </Tooltip>
        
        <form onSubmit={handleSearch} className="relative w-72 max-w-sm hidden md:flex">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            className="pl-8 bg-muted/30 border-muted focus-visible:ring-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {searchQuery.length >= 2 && searchResults && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50 max-h-80 overflow-auto">
              {searchResults.courses && searchResults.courses.length > 0 && (
                <div className="p-2">
                  <div className="text-sm font-medium px-2 py-1 text-muted-foreground">Cursos</div>
                  {searchResults.courses.map((course: any) => (
                    <Button 
                      key={course.id}
                      variant="ghost" 
                      className="w-full justify-start text-left"
                      onClick={() => navigate(`/dashboard/courses/${course.id}`)}
                    >
                      {course.title}
                    </Button>
                  ))}
                </div>
              )}

              {searchResults.quizzes && searchResults.quizzes.length > 0 && (
                <div className="p-2">
                  <div className="text-sm font-medium px-2 py-1 text-muted-foreground">Cuestionarios</div>
                  {searchResults.quizzes.map((quiz: any) => (
                    <Button 
                      key={quiz.id}
                      variant="ghost" 
                      className="w-full justify-start text-left"
                      onClick={() => navigate(`/dashboard/quizzes/${quiz.id}`)}
                    >
                      {quiz.title}
                    </Button>
                  ))}
                </div>
              )}

              {(!searchResults.courses || searchResults.courses.length === 0) && 
               (!searchResults.quizzes || searchResults.quizzes.length === 0) && (
                <div className="p-4 text-center text-muted-foreground">
                  No se encontraron resultados
                </div>
              )}
            </div>
          )}
        </form>
      </div>
      
      <div className="flex items-center justify-end space-x-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                  <span className="sr-only">Notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex justify-between items-center">
                  <span>Notificaciones</span>
                  {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-7">
                      Marcar todo como leído
                    </Button>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <DropdownMenuItem key={notification.id} className="cursor-pointer flex flex-col items-start p-3">
                        <div className="flex justify-between w-full">
                          <span className={`font-medium ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                            {notification.title}
                          </span>
                          {!notification.read && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 px-2 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                            >
                              Leído
                            </Button>
                          )}
                        </div>
                        <span className={`text-sm ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                          {notification.message}
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">{notification.time}</span>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      No hay notificaciones
                    </div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipTrigger>
          <TooltipContent>
            Notificaciones
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full" size="icon">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {profile ? getUserInitials(profile.first_name, profile.last_name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {profile ? `${profile.first_name} ${profile.last_name}` : 'Usuario'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {profile?.id ? profile.id : 'Sin perfil'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/dashboard/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Mi perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/dashboard/admin/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configuración</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Soporte</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipTrigger>
          <TooltipContent>
            Mi perfil
          </TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
};

export default Header;
