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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
    
    // Show loading toast with a shorter duration
    const loadingToast = toast.loading("Cerrando sesión...", {
      duration: 3000 // Reduce to 3 seconds maximum
    });
    
    try {
      // Call the logout service
      await authService.logout();
      
      // Clear loading toast
      toast.dismiss(loadingToast);
      
      // Show success message
      toast.success("Sesión cerrada correctamente", {
        duration: 2000
      });
      
      // Redirect to login immediately
      navigate("/");
    } catch (error) {
      // Clear loading toast
      toast.dismiss(loadingToast);
      
      // Show error message
      toast.error("Error al cerrar sesión", {
        duration: 2000
      });
    }
  };

  return (
    <header className="border-b px-4 py-3 bg-background">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSidebar}
                  className="hover:bg-transparent hover:text-primary"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Alternar menú lateral</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex items-center gap-4">
          <NotificationsDropdown />

          <DropdownMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="rounded-full p-0 w-9 h-9 bg-primary text-white hover:bg-primary/90"
                    >
                      JR
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Menú de usuario</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

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
