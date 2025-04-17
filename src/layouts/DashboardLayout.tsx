
import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  
  // Detectar si estamos en móvil y configurar el estado inicial del menú
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Solo mostramos el sidebar expandido por defecto en desktop
      setSidebarOpen(!mobile);
    };

    // Comprobar al cargar y en cada cambio de tamaño
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Check if we're on a lesson page
  const isLessonPage = location.pathname.includes('/lesson/');

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar con nuevos props */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        isMobile={isMobile}
      />
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <Header toggleSidebar={toggleSidebar} />
        <main className={isLessonPage ? "p-0 md:p-0" : "p-4 md:p-6"}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
