import React, { useState, useEffect } from "react";
import api from "../../api/api";
import "./SuperAdmin.css";

const SuperAdmin = () => {
  const [admins, setAdmins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editAdmin, setEditAdmin] = useState(null);
  const [formData, setFormData] = useState({ usuario: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [loadingTable, setLoadingTable] = useState(true);

  // Cargar administradores al montar el componente
  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoadingTable(true);
    try {
      const response = await api.get('/usuarios/?rol=1');
      setAdmins(response.data);
    } catch (error) {
      console.error("Error al cargar administradores:", error);
      setApiError("Error al cargar los administradores");
    } finally {
      setLoadingTable(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditAdmin(null);
    setFormData({ usuario: "", email: "", password: "" });
    setApiError("");
  };

  const handleAddClick = () => {
    setFormData({ usuario: "", email: "", password: "" });
    setEditAdmin(null);
    setApiError("");
    setShowModal(true);
  };

  const handleEditClick = (admin) => {
    setFormData({ usuario: admin.usuario, email: admin.email, password: "" });
    setEditAdmin(admin);
    setApiError("");
    setShowModal(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este administrador?")) {
      setIsLoading(true);
      try {
        await api.delete(`auth/eliminar/${id}`);
        setAdmins(admins.filter((a) => a.id !== id));
      } catch (error) {
        console.error("Error al eliminar administrador:", error);
        setApiError("Error al eliminar el administrador");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar errores cuando el usuario empiece a escribir
    if (apiError) setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setApiError("");

    try {
      if (editAdmin) {
        // Editar administrador existente
        const updateData = {
          usuario: formData.usuario,
          email: formData.email
        };
        
        // Solo incluir password si se proporcionó uno nuevo
        if (formData.password.trim()) {
          updateData.password = formData.password;
        }

        const response = await api.patch(`usuarios/editadmin/${editAdmin.id}`, updateData);
        
        setAdmins((prev) =>
          prev.map((a) => (a.id === editAdmin.id ? response.data : a))
        );
      } else {
        // Crear nuevo administrador
        const newAdminData = {
          usuario: formData.usuario,
          email: formData.email,
          password: formData.password
        };

        const response = await api.post('auth/registro/admins', newAdminData);
        setAdmins((prev) => [...prev, response.data]);
      }
      
      closeModal();
    } catch (error) {
      console.error("Error al guardar administrador:", error);
      
      // Manejar diferentes tipos de errores
      if (error.response) {
        const errorMessage = error.response.data?.message || 
                            error.response.data?.error || 
                            "Error en el servidor";
        setApiError(errorMessage);
      } else if (error.request) {
        setApiError("Error de conexión. Verifica tu conexión a internet.");
      } else {
        setApiError("Error inesperado. Inténtalo de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <header className="header-custom text-white">
        <div className="container-fluid py-4">
          <div className="row">
            <div className="col">
              <h1 className="h4 fw-bold mb-0">RutaDTAI</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mt-5">
        <h2>Panel de SuperAdministrador</h2>
        <p>CRUD de administradores</p>

        {apiError && !showModal && (
          <div className="alert alert-danger" role="alert">
            {apiError}
            <button 
              type="button" 
              className="btn-close float-end" 
              onClick={() => setApiError("")}
            ></button>
          </div>
        )}

        <button 
          className="btn btn-primary mb-3" 
          onClick={handleAddClick}
          disabled={isLoading || loadingTable}
        >
          Agregar Administrador
        </button>

        {loadingTable ? (
          <div className="text-center py-4">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-2">Cargando administradores...</p>
          </div>
        ) : (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>usuario</th>
                <th>Email</th>
                <th style={{ width: "150px" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td>{admin.usuario}</td>
                  <td>{admin.email}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleEditClick(admin)}
                      disabled={isLoading}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteClick(admin.id)}
                      disabled={isLoading}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {admins.length === 0 && !loadingTable && (
                <tr>
                  <td colSpan="3" className="text-center">
                    No hay administradores registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {showModal && (
          <div
            className="modal-overlay"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1050,
              backdropFilter: "blur(7px)",
            }}
          >
            <div className="modal-dialog">
              <form onSubmit={handleSubmit} className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editAdmin ? "Editar Administrador" : "Agregar Administrador"}
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={closeModal}
                    disabled={isLoading}
                  />
                </div>
                <div className="modal-body">
                  {apiError && (
                    <div className="alert alert-danger" role="alert">
                      {apiError}
                    </div>
                  )}
                  
                  <div className="mb-3">
                    <label htmlFor="usuario" className="form-label">
                      usuario *
                    </label>
                    <input
                      type="text"
                      id="usuario"
                      name="usuario"
                      className="form-control"
                      value={formData.usuario}
                      onChange={handleChange}
                      required
                      autoFocus
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Contraseña {editAdmin ? "(dejar vacío para mantener actual)" : "*"}
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="form-control"
                      value={formData.password}
                      onChange={handleChange}
                      required={!editAdmin}
                      disabled={isLoading}
                      minLength="6"
                      placeholder={editAdmin ? "Nueva contraseña (opcional)" : "Mínimo 6 caracteres"}
                    />
                    <div className="form-text">
                      {editAdmin 
                        ? "Solo completa si deseas cambiar la contraseña" 
                        : "La contraseña debe tener al menos 6 caracteres"
                      }
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                    disabled={isLoading}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Cargando...</span>
                        </span>
                        {editAdmin ? "Guardando..." : "Agregando..."}
                      </>
                    ) : (
                      editAdmin ? "Guardar cambios" : "Agregar"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SuperAdmin;
