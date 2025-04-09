
import { useState, useMemo } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User } from '@/types/user';

export const useUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  
  const usersPerPage = 5;

  // Fetch users from Supabase
  const fetchUsers = async (): Promise<User[]> => {
    // Get all users with their profiles from Supabase
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error("Error fetching users:", authError);
      throw authError;
    }

    // Get profiles to get additional information
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      throw profilesError;
    }

    // Combine user data with their profiles
    const users = authUsers.users.map((authUser) => {
      const profile = profiles?.find(p => p.id === authUser.id);
      const fullName = profile ? `${profile.first_name} ${profile.last_name}` : 'Usuario sin nombre';
      const isBanned = authUser.user_metadata?.banned === true;
      
      return {
        id: authUser.id,
        email: authUser.email || 'No email',
        name: fullName,
        // Determine role based on profile or default to "student"
        role: profile?.is_admin ? 'admin' : 'student',
        status: isBanned ? 'suspended' : (authUser.email_confirmed_at ? 'active' : 'inactive'),
        courses: 0, // Default value
        completedCourses: 0, // Default value
        lastActive: authUser.last_sign_in_at || authUser.created_at || new Date().toISOString()
      };
    });

    return users;
  };

  // Use React Query to fetch and cache users
  const { data: allUsers = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  // Sorting logic
  const sortedUsers = useMemo(() => {
    let tempUsers = [...allUsers];
    if (sortConfig) {
      tempUsers.sort((a, b) => {
        if (a[sortConfig.key as keyof User] < b[sortConfig.key as keyof User]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key as keyof User] > b[sortConfig.key as keyof User]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return tempUsers;
  }, [allUsers, sortConfig]);

  // Filter logic
  const filteredUsers = useMemo(() => {
    return sortedUsers.filter(user => {
      return (
        (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [sortedUsers, searchTerm]);

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return {
    users: currentUsers,
    isLoading,
    isError,
    error,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    totalUsers: filteredUsers.length,
    displayedUsers: currentUsers.length,
    sortConfig,
    handleSort,
    formatDate,
    refetchUsers: refetch
  };
};
