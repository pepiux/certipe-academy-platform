
import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Log the current route for debugging purposes
  React.useEffect(() => {
    console.log("Current route:", location.pathname);
  }, [location.pathname]);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="h-screen flex bg-gray-100">
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header toggleSidebar={toggleSidebar} />
          
          {/* Content area */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar - absolute on mobile, relative on desktop */}
            <div className="md:relative">
              <Sidebar isOpen={sidebarOpen} />
            </div>
            
            {/* Main content area */}
            <main className="flex-1 overflow-auto p-4 md:p-6">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
