
import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  // Initialize sidebar state based on screen size
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };

    // Set initial state
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Log the current route for debugging purposes
  React.useEffect(() => {
    console.log("Current route:", location.pathname);
  }, [location.pathname]);

  // Check if we're on a lesson page
  const isLessonPage = location.pathname.includes('/lesson/');

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} />
      
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
