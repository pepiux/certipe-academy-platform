
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, 
  Edit, 
  Trash, 
  Mail,
  UserCog,
  ShieldCheck,
  ShieldAlert
} from "lucide-react";

interface UserActionsMenuProps {
  userName: string;
  userId: string;
  userStatus: string;
  onAction: (action: string, userId: string, userName: string) => void;
}

const UserActionsMenu = ({ 
  userName, 
  userId, 
  userStatus, 
  onAction 
}: UserActionsMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Abrir menú</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuItem 
          className="flex gap-2 cursor-pointer"
          onClick={() => onAction('edit', userId, userName)}
        >
          <Edit size={16} /> Editar
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="flex gap-2 cursor-pointer"
          onClick={() => onAction('message', userId, userName)}
        >
          <Mail size={16} /> Enviar mensaje
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="flex gap-2 cursor-pointer"
          onClick={() => onAction('permissions', userId, userName)}
        >
          <UserCog size={16} /> Gestionar permisos
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {userStatus === 'active' ? (
          <DropdownMenuItem 
            className="flex gap-2 cursor-pointer text-amber-600"
            onClick={() => onAction('suspend', userId, userName)}
          >
            <ShieldAlert size={16} /> Suspender usuario
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem 
            className="flex gap-2 cursor-pointer text-green-600"
            onClick={() => onAction('activate', userId, userName)}
          >
            <ShieldCheck size={16} /> Activar usuario
          </DropdownMenuItem>
        )}
        <DropdownMenuItem 
          className="flex gap-2 cursor-pointer text-red-600"
          onClick={() => onAction('delete', userId, userName)}
        >
          <Trash size={16} /> Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserActionsMenu;
