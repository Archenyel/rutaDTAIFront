// src/modulos/auth/roles.jsx
import React from "react";

const Roles = ({ rol }) => {
  const renderPermisos = () => {
    switch (rol) {
      case "superadmin":
        return (
          <>
            <h3>Superadministrador</h3>
            <ul>
              <li>Acceso total al sistema</li>
              <li>Gestionar todos los usuarios</li>
              <li>Visualizar y modificar todos los proyectos y tareas</li>
            </ul>
          </>
        );
      case "admin":
        return (
          <>
            <h3>Administrador</h3>
            <ul>
              <li>Acceso solo a proyectos asignados</li>
              <li>No puede modificar información de otros módulos</li>
            </ul>
          </>
        );
      case "alumno":
        return (
          <>
            <h3>Alumno</h3>
            <ul>
              <li>Accede solo a sus proyectos y tareas</li>
              <li>No puede modificar información administrativa</li>
            </ul>
          </>
        );
      default:
        return <p>Rol no identificado</p>;
    }
  };

  return <div className="rol-info">{renderPermisos()}</div>;
};

export default Roles;
