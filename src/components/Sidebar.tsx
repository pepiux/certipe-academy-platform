
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
        isOpen ? "translate-x-0" : "-translate-x-full"
      } fixed md:sticky top-0 left-0 z-40 h-screen transition-transform duration-300 ease-in-out
      md:translate-x-0 ${isOpen ? "w-64" : "w-16"} bg-sidebar`}
    >
      {/* Add a backdrop on mobile when sidebar is open */}
      <div 
        className={`${
          isOpen ? "opacity-50 pointer-events-auto" : "opacity-0 pointer-events-none"
        } fixed inset-0 bg-black md:hidden transition-opacity duration-300 ease-in-out -z-10`} 
      />

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
          {isOpen && <div className="sidebar-category">Main Menu</div>}
          
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            end
          >
            <LayoutDashboard size={20} />
            {isOpen && <span>Panel de control</span>}
          </NavLink>
          
          <NavLink 
            to="/dashboard/courses" 
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
          >
            <BookOpen size={20} />
            {isOpen && <span>Cursos</span>}
          </NavLink>
          
          <NavLink 
            to="/dashboard/quizzes" 
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
          >
            <FileQuestion size={20} />
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
            <Users size={20} />
            {isOpen && <span>Gestión de usuarios</span>}
          </NavLink>
          
          <NavLink 
            to="/dashboard/admin/courses" 
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
          >
            <BookOpen size={20} />
            {isOpen && <span>Gestión de cursos</span>}
          </NavLink>
          
          <NavLink 
            to="/dashboard/admin/quizzes" 
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
          >
            <FileQuestion size={20} />
            {isOpen && <span>Gestión de cuestionarios</span>}
          </NavLink>
          
          <NavLink 
            to="/dashboard/admin/settings" 
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
          >
            <Settings size={20} />
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
