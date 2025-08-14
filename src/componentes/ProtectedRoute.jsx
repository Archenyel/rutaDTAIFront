import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userRole = parseInt(localStorage.getItem("userRole"));

  // Verificar si el usuario tiene un rol asignado
  if (userRole === null || userRole === undefined || isNaN(userRole)) {
    return <Navigate to="/" replace />;
  }

  // Verificar si el rol del usuario está permitido para esta ruta
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Mostrar alerta de acceso denegado (opcional)
    const roleNames = { 0: 'Superadmin', 1: 'Admin', 2: 'Alumno' };
    console.warn(`Acceso denegado: El rol '${roleNames[userRole]}' no tiene permisos para esta ruta`);
    
    // Redirigir al dashboard correspondiente según su rol
    const getDefaultRoute = () => {
      switch (userRole) {
        case 0: // superadmin
          return '/dashboardSuperadmin';
        case 1: // admin
          return '/dashboardAdmin';
        case 2: // alumno
          return '/dashboardAlumno';
        default:
          return '/';
      }
    };
    
    return <Navigate to={getDefaultRoute()} replace />;
  }

  return children;
};

export default ProtectedRoute;
