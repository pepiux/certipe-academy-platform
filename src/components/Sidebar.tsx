
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

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <aside 
      className={`${
        isOpen ? "w-64" : "w-16"
      } bg-sidebar transition-all duration-300 flex flex-col h-screen sticky top-0 overflow-y-auto`}
    >
      {/* Logo */}
      <div className="p-4 flex items-center justify-center md:justify-start">
        {isOpen ? (
          <Logo />
        ) : (
          <span className="text-brand-blue font-bold text-xl">PE</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {/* Main Menu */}
        <div className="mb-6">
          {isOpen && <div className="sidebar-category">Main Menu</div>}
          
          <NavLink to="/dashboard" className={`sidebar-link ${isActive("/dashboard") && !isOpen ? "bg-sidebar-accent" : ""}`}>
            <LayoutDashboard size={20} />
            {isOpen && <span>Panel de control</span>}
          </NavLink>
          
          <NavLink to="/dashboard/courses" className={`sidebar-link ${isActive("/dashboard/courses") && !isOpen ? "bg-sidebar-accent" : ""}`}>
            <BookOpen size={20} />
            {isOpen && <span>Cursos</span>}
          </NavLink>
          
          <NavLink to="/dashboard/quizzes" className={`sidebar-link ${isActive("/dashboard/quizzes") && !isOpen ? "bg-sidebar-accent" : ""}`}>
            <FileQuestion size={20} />
            {isOpen && <span>Cuestionarios</span>}
          </NavLink>
        </div>

        {/* Admin */}
        <div className="mb-6">
          {isOpen && <div className="sidebar-category">Admin</div>}
          
          <NavLink to="/dashboard/admin/users" className={`sidebar-link ${isActive("/dashboard/admin/users") && !isOpen ? "bg-sidebar-accent" : ""}`}>
            <Users size={20} />
            {isOpen && <span>Gestión de usuarios</span>}
          </NavLink>
          
          <NavLink to="/dashboard/admin/courses" className={`sidebar-link ${isActive("/dashboard/admin/courses") && !isOpen ? "bg-sidebar-accent" : ""}`}>
            <BookOpen size={20} />
            {isOpen && <span>Gestión de cursos</span>}
          </NavLink>
          
          <NavLink to="/dashboard/admin/quizzes" className={`sidebar-link ${isActive("/dashboard/admin/quizzes") && !isOpen ? "bg-sidebar-accent" : ""}`}>
            <FileQuestion size={20} />
            {isOpen && <span>Gestión de cuestionarios</span>}
          </NavLink>
          
          <NavLink to="/dashboard/admin/settings" className={`sidebar-link ${isActive("/dashboard/admin/settings") && !isOpen ? "bg-sidebar-accent" : ""}`}>
            <Settings size={20} />
            {isOpen && <span>Configuración del sistema</span>}
          </NavLink>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 text-xs text-sidebar-foreground/60">
        {isOpen && <div>© 2025 Inflex. Todos los derechos reservados.</div>}
      </div>
    </aside>
  );
};

export default Sidebar;
