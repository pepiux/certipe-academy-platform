
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  BookOpen, 
  FileQuestion, 
  Users, 
  Settings,
  X
} from "lucide-react";
import Logo from "./Logo";
import LogoIcon from "./LogoIcon";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isMobile }) => {
  const location = useLocation();
  
  // Consistent styling for both mobile and desktop
  const sidebarClasses = `
    bg-[#1A1F2C] transition-all duration-300 flex flex-col h-screen 
    ${isMobile 
      ? `fixed z-20 ${isOpen ? 'translate-x-0' : '-translate-x-full'} w-64`
      : `sticky top-0 ${isOpen ? 'w-64' : 'w-16'}`
    }
  `;

  return (
    <aside className={sidebarClasses}>
      {/* Logo y botón cerrar */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex justify-start">
          {isOpen ? (
            <Logo />
          ) : (
            <LogoIcon />
          )}
        </div>
        
        {/* Botón cerrar solo visible en móvil cuando el menú está abierto */}
        {isMobile && isOpen && (
          <button 
            onClick={onClose} 
            className="text-white hover:text-primary transition-colors"
            aria-label="Cerrar menú"
          >
            <X size={24} />
          </button>
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
      
      {/* Overlay para cerrar el menú en móvil cuando se hace clic fuera */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-10" 
          onClick={onClose}
          aria-hidden="true"
        />
      )}
    </aside>
  );
};

export default Sidebar;
