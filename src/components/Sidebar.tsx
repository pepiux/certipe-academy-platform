
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  BookOpen, 
  FileQuestion, 
  Users, 
  Settings,
  LucideIcon
} from "lucide-react";
import Logo from "./Logo";
import LogoIcon from "./LogoIcon";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface SidebarProps {
  isOpen: boolean;
}

const SidebarNavLink = ({ 
  to, 
  icon: Icon, 
  label, 
  isOpen 
}: { 
  to: string, 
  icon: LucideIcon, 
  label: string, 
  isOpen: boolean 
}) => {
  const linkContent = (
    <>
      <Icon size={20} />
      {isOpen && <span className="ml-2">{label}</span>}
    </>
  );

  if (isOpen) {
    return (
      <NavLink 
        to={to} 
        className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
      >
        {linkContent}
      </NavLink>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <NavLink 
            to={to} 
            className={({ isActive }) => `sidebar-link justify-center ${isActive ? "active" : ""}`}
          >
            {linkContent}
          </NavLink>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  
  return (
    <aside 
      className={`${
        isOpen ? "w-64" : "w-16"
      } bg-sidebar transition-all duration-300 flex flex-col h-screen sticky top-0 overflow-y-auto md:relative`}
    >
      {/* Logo */}
      <div className="p-4 flex items-center justify-center md:justify-start">
        {isOpen ? (
          <Logo showText={true} />
        ) : (
          <LogoIcon />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {/* Main Menu */}
        <div className="mb-6">
          {isOpen && <div className="sidebar-category">Main Menu</div>}
          
          <SidebarNavLink 
            to="/dashboard" 
            icon={LayoutDashboard} 
            label="Panel de control" 
            isOpen={isOpen} 
          />
          
          <SidebarNavLink 
            to="/dashboard/courses" 
            icon={BookOpen} 
            label="Cursos" 
            isOpen={isOpen} 
          />
          
          <SidebarNavLink 
            to="/dashboard/quizzes" 
            icon={FileQuestion} 
            label="Cuestionarios" 
            isOpen={isOpen} 
          />
        </div>

        {/* Admin */}
        <div className="mb-6">
          {isOpen && <div className="sidebar-category">Admin</div>}
          
          <SidebarNavLink 
            to="/dashboard/admin/users" 
            icon={Users} 
            label="Gestión de usuarios" 
            isOpen={isOpen} 
          />
          
          <SidebarNavLink 
            to="/dashboard/admin/courses" 
            icon={BookOpen} 
            label="Gestión de cursos" 
            isOpen={isOpen} 
          />
          
          <SidebarNavLink 
            to="/dashboard/admin/quizzes" 
            icon={FileQuestion} 
            label="Gestión de cuestionarios" 
            isOpen={isOpen} 
          />
          
          <SidebarNavLink 
            to="/dashboard/admin/settings" 
            icon={Settings} 
            label="Configuración del sistema" 
            isOpen={isOpen} 
          />
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 text-xs text-sidebar-muted-foreground">
        {isOpen && <div>2025 Inflex. Todos los derechos reservados.</div>}
      </div>
    </aside>
  );
};

export default Sidebar;
