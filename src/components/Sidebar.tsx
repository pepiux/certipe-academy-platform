
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  BookOpen, 
  FileQuestion, 
  Users, 
  Settings 
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Logo from "./Logo";
import LogoIcon from "./LogoIcon";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  
  const renderNavLink = (to: string, icon: React.ReactNode, label: string) => {
    const content = (
      <NavLink 
        to={to} 
        className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
        end={to === "/dashboard"}
      >
        {icon}
        {isOpen && <span>{label}</span>}
      </NavLink>
    );

    return isOpen ? (
      content
    ) : (
      <Tooltip>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    );
  };
  
  return (
    <aside 
      className={`${
        isOpen ? "w-64" : "w-16"
      } bg-sidebar transition-all duration-300 flex flex-col h-screen sticky top-0 overflow-y-auto`}
    >
      <div className="p-4 flex items-center justify-center md:justify-start">
        {isOpen ? <Logo /> : <LogoIcon />}
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1">
        <div className="mb-6">
          {isOpen && <div className="sidebar-category">Main Menu</div>}
          
          {renderNavLink("/dashboard", <LayoutDashboard size={20} />, "Panel de control")}
          {renderNavLink("/dashboard/courses", <BookOpen size={20} />, "Cursos")}
          {renderNavLink("/dashboard/quizzes", <FileQuestion size={20} />, "Cuestionarios")}
        </div>

        <div className="mb-6">
          {isOpen && <div className="sidebar-category">Admin</div>}
          
          {renderNavLink("/dashboard/admin/users", <Users size={20} />, "Gestión de usuarios")}
          {renderNavLink("/dashboard/admin/courses", <BookOpen size={20} />, "Gestión de cursos")}
          {renderNavLink("/dashboard/admin/quizzes", <FileQuestion size={20} />, "Gestión de cuestionarios")}
          {renderNavLink("/dashboard/admin/settings", <Settings size={20} />, "Configuración del sistema")}
        </div>
      </nav>

      <div className="p-4 text-xs text-sidebar-muted-foreground">
        {isOpen && <div>2025 Inflex. Todos los derechos reservados.</div>}
      </div>
    </aside>
  );
};

export default Sidebar;
