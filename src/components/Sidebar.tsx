
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

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  
  return (
    <aside 
      className={`${
        isOpen ? "w-64" : "w-16"
      } bg-sidebar transition-all duration-300 flex flex-col h-screen sticky top-0`}
    >
      {/* Logo */}
      <div className="p-4 flex items-center justify-center md:justify-start">
        {isOpen ? (
          <Logo />
        ) : (
          <LogoIcon />
        )}
      </div>

      {/* Navigation - Using flex-1 and overflow-y-auto for proper scrolling behavior */}
      <nav className="flex-1 overflow-y-auto scrollbar-hide px-2 py-4 space-y-1">
        {/* Main Menu */}
        <div className="mb-6">
          {isOpen && <div className="sidebar-category">Main Menu</div>}
          
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            end
          >
            <LayoutDashboard size={20} className="min-w-5 min-h-5" />
            {isOpen && <span>Panel de control</span>}
          </NavLink>
          
          <NavLink 
            to="/dashboard/courses" 
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
          >
            <BookOpen size={20} className="min-w-5 min-h-5" />
            {isOpen && <span>Cursos</span>}
          </NavLink>
          
          <NavLink 
            to="/dashboard/quizzes" 
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
          >
            <FileQuestion size={20} className="min-w-5 min-h-5" />
            {isOpen && <span>Cuestionarios</span>}
          </NavLink>
        </div>

        {/* Admin */}
        <div className="mb-6">
          {isOpen && <div className="sidebar-category">Admin</div>}
          
          <NavLink 
            to="/dashboard/admin/users" 
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
          >
            <Users size={20} className="min-w-5 min-h-5" />
            {isOpen && <span>Gestión de usuarios</span>}
          </NavLink>
          
          <NavLink 
            to="/dashboard/admin/courses" 
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
          >
            <BookOpen size={20} className="min-w-5 min-h-5" />
            {isOpen && <span>Gestión de cursos</span>}
          </NavLink>
          
          <NavLink 
            to="/dashboard/admin/quizzes" 
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
          >
            <FileQuestion size={20} className="min-w-5 min-h-5" />
            {isOpen && <span>Gestión de cuestionarios</span>}
          </NavLink>
          
          <NavLink 
            to="/dashboard/admin/settings" 
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
          >
            <Settings size={20} className="min-w-5 min-h-5" />
            {isOpen && <span>Configuración del sistema</span>}
          </NavLink>
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
