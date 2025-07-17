import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import Layout from "../../../componentes/Layout/Layout";
import "./Portafolios.css";

const Portafolios = () => {
  const [portafolios, setPortafolios] = useState([]);
  const [newPortafolio, setNewPortafolio] = useState({ nombre: "", descripcion: "", tipoProyecto: "", proyectosAsignados: [] });
  const [showForm, setShowForm] = useState(false);
  const [editPortafolio, setEditPortafolio] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const availableProjects = [
    { id: 1, nombre: "Sistema de Gestión Escolar", tipo: "Proyecto Estratégico" },
    { id: 2, nombre: "Portal de Recursos", tipo: "Proyecto Operativo" },
    { id: 3, nombre: "Plataforma de Aprendizaje", tipo: "Proyecto Estratégico" },
    { id: 4, nombre: "Automatización de Procesos", tipo: "Proyecto Operativo" },
    { id: 5, nombre: "Sistema de Reportes", tipo: "Proyecto Estratégico" },
    { id: 6, nombre: "App Móvil Educativa", tipo: "Proyecto de Innovacion" },
  ];

  const handleCreatePortafolio = (e) => {
    e.preventDefault();
    const filteredProjects = newPortafolio.tipoProyecto
      ? availableProjects.filter(p => p.tipo === newPortafolio.tipoProyecto)
      : [];
    const validProjects = newPortafolio.proyectosAsignados
      .filter(id => filteredProjects.some(p => p.id === id))
      .map(id => availableProjects.find(p => p.id === id));

    const newId = Date.now();

    setPortafolios([...portafolios, { ...newPortafolio, id: newId, proyectosAsignados: validProjects }]);
    setNewPortafolio({ nombre: "", descripcion: "", tipoProyecto: "", proyectosAsignados: [] });
    setShowForm(false);
  };

  const handleEditPortafolio = (portafolio) => {
    const projectIds = portafolio.proyectosAsignados.map(p => p.id);
    setEditPortafolio({ ...portafolio, proyectosAsignados: projectIds });
    setShowEditModal(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    const filteredProjects = editPortafolio.tipoProyecto
      ? availableProjects.filter(p => p.tipo === editPortafolio.tipoProyecto)
      : [];
    const validProjects = editPortafolio.proyectosAsignados
      .filter(id => filteredProjects.some(p => p.id === id))
      .map(id => availableProjects.find(p => p.id === id));

    setPortafolios(portafolios.map(p =>
      p.id === editPortafolio.id ? { ...editPortafolio, proyectosAsignados: validProjects } : p
    ));
    setShowEditModal(false);
    setEditPortafolio(null);
  };

  const handleDeletePortafolio = (portafolioToDelete) => {
    setPortafolios(portafolios.filter(p => p.id !== portafolioToDelete.id));
  };

  const handleCheckboxChange = (id) => {
    setNewPortafolio(prev => {
      const newSelected = prev.proyectosAsignados.includes(id)
        ? prev.proyectosAsignados.filter(pId => pId !== id)
        : [...prev.proyectosAsignados, id];
      return { ...prev, proyectosAsignados: newSelected };
    });
  };

  const handleEditCheckboxChange = (id) => {
    setEditPortafolio(prev => {
      const newSelected = prev.proyectosAsignados.includes(id)
        ? prev.proyectosAsignados.filter(pId => pId !== id)
        : [...prev.proyectosAsignados, id];
      return { ...prev, proyectosAsignados: newSelected };
    });
  };

  return (
    <Layout>
      <div className="portafolios-container">
        <h1>Portafolios</h1>
        <button className="btn btn-primary mb-3" onClick={() => setShowForm(true)}>
          Crear Nuevo Portafolio
        </button>

        {showForm && (
          <div className="card p-4 mb-4">
            <h3>Crear Portafolio</h3>
            <form onSubmit={handleCreatePortafolio}>
              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  value={newPortafolio.nombre}
                  onChange={(e) => setNewPortafolio({ ...newPortafolio, nombre: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Descripción</label>
                <input
                  type="text"
                  className="form-control"
                  value={newPortafolio.descripcion}
                  onChange={(e) => setNewPortafolio({ ...newPortafolio, descripcion: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Tipo de Proyecto</label>
                <select
                  className="form-select"
                  value={newPortafolio.tipoProyecto}
                  onChange={(e) => setNewPortafolio({ ...newPortafolio, tipoProyecto: e.target.value, proyectosAsignados: [] })}
                  required
                >
                  <option value="">Seleccione un tipo</option>
                  <option value="Proyecto Estratégico">Proyecto Estratégico</option>
                  <option value="Proyecto Operativo">Proyecto Operativo</option>
                  <option value="Proyecto de Cumplimiento">Proyecto de Cumplimiento</option>
                  <option value="Proyecto de Innovacion">Proyecto de Innovacion</option>
                  <option value="Proyecto de Mantenimiento">Proyecto de Mantenimiento</option>
                  <option value="Proyecto de Cliente">Proyecto de Cliente</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Asignar Proyectos</label>
                <div>
                  {availableProjects
                    .filter(p => p.tipo === newPortafolio.tipoProyecto)
                    .map(project => (
                      <div key={project.id} className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`project-${project.id}`}
                          value={project.id}
                          checked={newPortafolio.proyectosAsignados.includes(project.id)}
                          onChange={() => handleCheckboxChange(project.id)}
                          disabled={!newPortafolio.tipoProyecto}
                        />
                        <label className="form-check-label" htmlFor={`project-${project.id}`}>
                          {project.nombre} ({project.tipo})
                        </label>
                      </div>
                    ))}
                </div>
              </div>
              <button type="submit" className="btn btn-success">Guardar Portafolio</button>
              <button type="button" className="btn btn-secondary ms-2" onClick={() => setShowForm(false)}>Cancelar</button>
            </form>
          </div>
        )}

        <div className="card p-4">
          <h3>Lista de Portafolios</h3>
          {portafolios.length === 0 ? (
            <p>No hay portafolios creados.</p>
          ) : (
            <ul className="list-group">
              {portafolios.map((portafolio) => (
                <li key={portafolio.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{portafolio.nombre}</strong> (Tipo: {portafolio.tipoProyecto})
                    <p><em>{portafolio.descripcion || "Sin descripción"}</em></p>
                    <ul>
                      {portafolio.proyectosAsignados.map(p => (
                        <li key={p.id}>{p.nombre}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditPortafolio(portafolio)}>
                      <i className="bi bi-pencil"></i> Editar
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeletePortafolio(portafolio)}>
                      <i className="bi bi-trash"></i> Eliminar
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Modal show={showEditModal} onHide={() => { setShowEditModal(false); setEditPortafolio(null); }} centered>
          <Modal.Header closeButton>
            <Modal.Title>Editar Portafolio</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <form onSubmit={handleSaveEdit}>
              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  value={editPortafolio?.nombre || ""}
                  onChange={(e) => setEditPortafolio({ ...editPortafolio, nombre: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Descripción</label>
                <input
                  type="text"
                  className="form-control"
                  value={editPortafolio?.descripcion || ""}
                  onChange={(e) => setEditPortafolio({ ...editPortafolio, descripcion: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Tipo de Proyecto</label>
                <select
                  className="form-select"
                  value={editPortafolio?.tipoProyecto || ""}
                  onChange={(e) => setEditPortafolio({ ...editPortafolio, tipoProyecto: e.target.value, proyectosAsignados: [] })}
                  required
                >
                  <option value="">Seleccione un tipo</option>
                  <option value="Proyecto Estratégico">Proyecto Estratégico</option>
                  <option value="Proyecto Operativo">Proyecto Operativo</option>
                  <option value="Proyecto de Cumplimiento">Proyecto de Cumplimiento</option>
                  <option value="Proyecto de Innovacion">Proyecto de Innovacion</option>
                  <option value="Proyecto de Mantenimiento">Proyecto de Mantenimiento</option>
                  <option value="Proyecto de Cliente">Proyecto de Cliente</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Asignar Proyectos</label>
                <div>
                  {availableProjects
                    .filter(p => p.tipo === editPortafolio?.tipoProyecto)
                    .map(project => (
                      <div key={project.id} className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`edit-project-${project.id}`}
                          value={project.id}
                          checked={editPortafolio?.proyectosAsignados.includes(project.id)}
                          onChange={() => handleEditCheckboxChange(project.id)}
                          disabled={!editPortafolio?.tipoProyecto}
                        />
                        <label className="form-check-label" htmlFor={`edit-project-${project.id}`}>
                          {project.nombre} ({project.tipo})
                        </label>
                      </div>
                    ))}
                </div>
              </div>
              <Button variant="primary" type="submit">Guardar Cambios</Button>
            </form>
          </Modal.Body>
        </Modal>
      </div>
    </Layout>
  );
};

export default Portafolios;
