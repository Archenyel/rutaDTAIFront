import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    
    if (token && role) {
      setIsAuthenticated(true);
      setUserRole(role);
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
    }
    
    setLoading(false);
  }, []);

  const login = (token, role, userId, userName) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userRole", role);
    localStorage.setItem("userId", userId);
    localStorage.setItem("userName", userName);
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    setIsAuthenticated(false);
    setUserRole(null);
  };

  const hasRole = (allowedRoles) => {
    if (!userRole || !allowedRoles) return false;
    return allowedRoles.includes(userRole);
  };

  const getDefaultRoute = () => {
    switch (userRole) {
      case 'alumno':
        return '/dashboardAlumno';
      case 'admin':
        return '/dashboardAdmin';
      case 'superadmin':
        return '/dashboardSuperadmin';
      default:
        return '/';
    }
  };

  return {
    isAuthenticated,
    userRole,
    loading,
    login,
    logout,
    hasRole,
    getDefaultRoute
  };
};

export default useAuth;
