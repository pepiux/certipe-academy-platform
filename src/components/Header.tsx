
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Menu, Bell, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { setTheme, theme } = useTheme();
  const navigate = useNavigate();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
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
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleTheme}
            className="rounded-full w-9 h-9 p-0"
          >
            {theme === "dark" ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="rounded-full w-9 h-9 p-0"
          >
            <Bell className="h-[1.2rem] w-[1.2rem]" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/dashboard/profile")}
            className="rounded-full p-0 w-9 h-9 avatar-initials"
          >
            JR
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
