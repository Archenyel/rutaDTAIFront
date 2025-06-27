import React, { useState } from "react";
import "./SuperAdmin.css";

const initialAdmins = [
  { id: 1, nombre: "Juan Pérez", email: "juan.perez@example.com" },
  { id: 2, nombre: "María López", email: "maria.lopez@example.com" },
  { id: 3, nombre: "Carlos Martínez", email: "carlos.martinez@example.com" },
];

const SuperAdmin = () => {
  const [admins, setAdmins] = useState(initialAdmins);
  const [showModal, setShowModal] = useState(false);
  const [editAdmin, setEditAdmin] = useState(null);
  const [formData, setFormData] = useState({ nombre: "", email: "" });

  const closeModal = () => {
    setShowModal(false);
    setEditAdmin(null);
    setFormData({ nombre: "", email: "" });
  };

  const handleAddClick = () => {
    setFormData({ nombre: "", email: "" });
    setEditAdmin(null);
    setShowModal(true);
  };

  const handleEditClick = (admin) => {
    setFormData({ nombre: admin.nombre, email: admin.email });
    setEditAdmin(admin);
    setShowModal(true);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este administrador?")) {
      setAdmins(admins.filter((a) => a.id !== id));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editAdmin) {
      setAdmins((prev) =>
        prev.map((a) => (a.id === editAdmin.id ? { ...a, ...formData } : a))
      );
    } else {
      const newAdmin = {
        id: Date.now(),
        ...formData,
      };
      setAdmins((prev) => [...prev, newAdmin]);
    }
    closeModal();
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
        <p>CRUD básico de administradores</p>

        <button className="btn btn-primary mb-3" onClick={handleAddClick}>
          Agregar Administrador
        </button>

        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th style={{ width: "150px" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td>{admin.nombre}</td>
                <td>{admin.email}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEditClick(admin)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteClick(admin.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {admins.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center">
                  No hay administradores
                </td>
              </tr>
            )}
          </tbody>
        </table>

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
                  <button type="button" className="btn-close" onClick={closeModal} />
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      className="form-control"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      autoFocus
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editAdmin ? "Guardar cambios" : "Agregar"}
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
