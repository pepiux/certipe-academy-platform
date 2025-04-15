
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const notifications: Notification[] = [
  {
    id: 1,
    title: "Nuevo curso disponible",
    description: "Se ha añadido el curso 'Gestión Avanzada de Proyectos'",
    time: "Hace 2 horas",
    read: false,
  },
  {
    id: 2,
    title: "Recordatorio de cuestionario",
    description: "Tienes un cuestionario pendiente para mañana",
    time: "Hace 5 horas",
    read: false,
  },
  {
    id: 3,
    title: "Certificado disponible",
    description: "Tu certificado de 'Scrum Master' está listo",
    time: "Hace 1 día",
    read: true,
  },
];

const NotificationsDropdown = () => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <TooltipProvider>
      <Tooltip>
        <DropdownMenu>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-full w-9 h-9 p-0 relative"
              >
                <Bell className="h-[1.2rem] w-[1.2rem]" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Notificaciones</p>
          </TooltipContent>

          <DropdownMenuContent align="end" className="w-80">
            <div className="py-2 px-4 border-b">
              <h4 className="font-medium">Notificaciones</h4>
            </div>
            <div className="max-h-[400px] overflow-auto">
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="p-4 cursor-pointer">
                  <div className={`${notification.read ? 'opacity-60' : ''}`}>
                    <div className="font-medium mb-1">{notification.title}</div>
                    <p className="text-sm text-muted-foreground">{notification.description}</p>
                    <span className="text-xs text-muted-foreground mt-2 block">
                      {notification.time}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </Tooltip>
    </TooltipProvider>
  );
};

export default NotificationsDropdown;
