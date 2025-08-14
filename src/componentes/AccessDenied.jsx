import React from 'react';
import { useNavigate } from 'react-router-dom';

const AccessDenied = () => {
  const navigate = useNavigate();
  const userRole = parseInt(localStorage.getItem("userRole"));

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

  const getRoleName = () => {
    switch (userRole) {
      case 0:
        return 'Superadmin';
      case 1:
        return 'Admin';
      case 2:
        return 'Alumno';
      default:
        return 'Desconocido';
    }
  };

  const handleGoBack = () => {
    navigate(getDefaultRoute());
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="text-center">
        <div className="mb-4">
          <i className="bi bi-shield-exclamation text-danger" style={{ fontSize: '4rem' }}></i>
        </div>
        
        <h1 className="display-6 fw-bold text-danger mb-3">
          Acceso Denegado
        </h1>
        
        <p className="lead text-muted mb-4">
          No tienes permisos para acceder a esta página.
        </p>
        
        <div className="alert alert-info mb-4">
          <i className="bi bi-info-circle me-2"></i>
          Tu rol actual es: <strong>{getRoleName()}</strong>
        </div>
        
        <div className="d-flex gap-3 justify-content-center">
          <button 
            className="btn btn-primary"
            onClick={handleGoBack}
          >
            <i className="bi bi-house me-2"></i>
            Ir a mi Dashboard
          </button>
          
          <button 
            className="btn btn-outline-secondary"
            onClick={() => navigate(-1)}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Volver
          </button>
        </div>
        
        <div className="mt-4">
          <small className="text-muted">
            Si crees que esto es un error, contacta al administrador del sistema.
          </small>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
