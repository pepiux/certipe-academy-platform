
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Menu, User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NotificationsDropdown from "./notifications/NotificationsDropdown";
import { toast } from "sonner";
import authService from "@/services/authService";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Clear any existing toasts
    toast.dismiss();
    
    // Show loading toast with a short duration
    toast.loading("Cerrando sesión...", {
      duration: 2000, // Shorter duration for loading state
    });
    
    try {
      // Call the logout service
      await authService.logout();
      
      // Clear all toasts and show success
      toast.dismiss();
      toast.success("Sesión cerrada correctamente", {
        duration: 3000
      });
      
      // Redirect to login immediately
      setTimeout(() => navigate("/"), 300);
    } catch (error) {
      // Clear loading toast and show error
      toast.dismiss();
      toast.error("Error al cerrar sesión", {
        duration: 3000
      });
    }
  };

  return (
    <header className="border-b px-4 py-3 bg-background">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="hover:bg-transparent hover:text-primary"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <NotificationsDropdown />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="rounded-full p-0 w-9 h-9 bg-primary text-white hover:bg-primary/90"
              >
                JR
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate("/dashboard/profile")}>
                <User className="mr-2 h-4 w-4" />
                Mi Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
