
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  BookOpen, 
  FileQuestion, 
  Users, 
  Settings 
} from "lucide-react";
import Logo from "./Logo";
import LogoIcon from "./LogoIcon";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  const { profile } = useAuth();
  const isAdmin = profile?.is_admin || false;
  
  const isActive = (path: string) => {
    // Para las rutas exactas
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    
    // Para verificar rutas que empiezan con un patrón específico
    if (path !== "/dashboard") {
      return location.pathname.startsWith(path);
    }
    
    return false;
  };

  const renderNavLink = (to: string, icon: JSX.Element, label: string) => {
    const active = isActive(to);
    
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <NavLink
            to={to}
            className={`sidebar-link ${active ? "active" : ""}`}
          >
            {icon}
            {isOpen && <span>{label}</span>}
          </NavLink>
        </TooltipTrigger>
        <TooltipContent side="right">
          {label}
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <aside 
      className={`${
        isOpen ? "w-64" : "w-16"
      } bg-gray-800 transition-all duration-300 flex flex-col h-screen sticky top-0 overflow-y-auto dark:bg-gray-900`}
    >
      {/* Logo */}
      <div className="p-4 flex items-center justify-center md:justify-start">
        {isOpen ? (
          <Logo />
        ) : (
          <LogoIcon />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {/* Main Menu */}
        <div className="mb-6">
          {isOpen && <div className="sidebar-category dark:text-gray-400">Menú Principal</div>}
          
          {renderNavLink(
            "/dashboard", 
            <LayoutDashboard size={20} />, 
            "Panel de control"
          )}
          
          {renderNavLink(
            "/dashboard/courses", 
            <BookOpen size={20} />, 
            "Cursos"
          )}
          
          {renderNavLink(
            "/dashboard/quizzes", 
            <FileQuestion size={20} />, 
            "Cuestionarios"
          )}
        </div>

        {/* Admin - Solo visible para usuarios admin */}
        {isAdmin && (
          <div className="mb-6">
            {isOpen && <div className="sidebar-category dark:text-gray-400">Administración</div>}
            
            {renderNavLink(
              "/dashboard/admin/users", 
              <Users size={20} />, 
              "Gestión de usuarios"
            )}
            
            {renderNavLink(
              "/dashboard/admin/courses", 
              <BookOpen size={20} />, 
              "Gestión de cursos"
            )}
            
            {renderNavLink(
              "/dashboard/admin/quizzes", 
              <FileQuestion size={20} />, 
              "Gestión de cuestionarios"
            )}
            
            {renderNavLink(
              "/dashboard/admin/settings", 
              <Settings size={20} />, 
              "Configuración del sistema"
            )}
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 text-xs text-gray-400 dark:text-gray-500">
        {isOpen && <div>Todos los derechos reservados. 2025 Inflex</div>}
      </div>
    </aside>
  );
};

export default Sidebar;
