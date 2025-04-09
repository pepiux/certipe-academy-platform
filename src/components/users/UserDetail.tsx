
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { User } from '@/types/user';
import RoleBadge from './RoleBadge';
import UserStatusBadge from './UserStatusBadge';
import { Separator } from "@/components/ui/separator";
import { Calendar, Mail, User as UserIcon } from 'lucide-react';

interface UserDetailProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  formatDate: (date: string) => string;
}

const UserDetail = ({ user, isOpen, onClose, formatDate }: UserDetailProps) => {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Detalles del Usuario</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* User Header Info */}
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
              <UserIcon size={32} />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-medium">{user.name || 'Sin nombre'}</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail size={14} />
                <span>{user.email}</span>
              </div>
            </div>
          </div>

          <Separator />
          
          {/* User Status and Role */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="text-sm text-muted-foreground mb-1">Estado</div>
                <UserStatusBadge status={user.status} />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4">
                <div className="text-sm text-muted-foreground mb-1">Rol</div>
                <RoleBadge role={user.role} />
              </CardContent>
            </Card>
          </div>
          
          {/* Course Progress */}
          <Card>
            <CardContent className="pt-4">
              <h3 className="font-medium mb-1">Progreso de Cursos</h3>
              {user.role === 'instructor' ? (
                <div>{user.courses || 0} cursos impartidos</div>
              ) : (
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">{user.completedCourses || 0}</span> de <span className="font-medium">{user.courses || 0}</span> cursos completados
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ 
                        width: user.courses && user.courses > 0 ? 
                          `${(user.completedCourses || 0) / user.courses * 100}%` : '0%' 
                      }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Last Active */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar size={14} />
            <span>Última actividad: {formatDate(user.lastActive)}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetail;
