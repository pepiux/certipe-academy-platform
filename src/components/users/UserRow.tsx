
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import UserStatusBadge from './UserStatusBadge';
import RoleBadge from './RoleBadge';
import UserActionsMenu from './UserActionsMenu';
import { User } from '@/types/user';

interface UserRowProps {
  user: User;
  formatDate: (date: string) => string;
  onUserAction: (action: string, userId: string, userName: string) => void;
}

const UserRow = ({ user, formatDate, onUserAction }: UserRowProps) => {
  return (
    <TableRow key={user.id}>
      <TableCell>
        <div>
          <div className="font-medium">{user.name || 'Sin nombre'}</div>
          <div className="text-sm text-muted-foreground">{user.email}</div>
        </div>
      </TableCell>
      <TableCell><RoleBadge role={user.role} /></TableCell>
      <TableCell><UserStatusBadge status={user.status} /></TableCell>
      <TableCell>
        {user.role === 'instructor' ? (
          <div>{user.courses || 0} impartidos</div>
        ) : (
          <div>
            {user.completedCourses || 0} / {user.courses || 0} completados
          </div>
        )}
      </TableCell>
      <TableCell>{formatDate(user.lastActive)}</TableCell>
      <TableCell className="text-right">
        <UserActionsMenu
          userName={user.name || user.email}
          userId={user.id}
          userStatus={user.status}
          onAction={onUserAction}
        />
      </TableCell>
    </TableRow>
  );
};

export default UserRow;
