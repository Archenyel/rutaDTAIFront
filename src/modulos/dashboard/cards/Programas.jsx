import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import Layout from "../../../componentes/Layout/Layout";
import "./Programas.css";

const Programas = () => {
  const [programas, setProgramas] = useState([]);
  const [newPrograma, setNewPrograma] = useState({ nombre: "", descripcion: "", proyectosAsignados: [] });
  const [showForm, setShowForm] = useState(false);
  const [editPrograma, setEditPrograma] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const availableProjects = [
    { id: 1, nombre: "Sistema de Gestión Escolar", tipo: "Proyecto Estratégico" },
    { id: 2, nombre: "Portal de Recursos", tipo: "Proyecto Operativo" },
    { id: 3, nombre: "Plataforma de Aprendizaje", tipo: "PMO" },
    { id: 4, nombre: "Automatización de Procesos", tipo: "PMO" },
    { id: 5, nombre: "Sistema de Reportes", tipo: "Proyecto Estratégico" },
    { id: 6, nombre: "App Móvil Educativa", tipo: "PMO" },
  ];

  const handleCreatePrograma = (e) => {
    e.preventDefault();
    const validProjects = newPrograma.proyectosAsignados
      .filter(id => availableProjects.some(p => p.id === id))
      .map(id => availableProjects.find(p => p.id === id));
    const newId = Date.now();
    setProgramas([...programas, { ...newPrograma, id: newId, proyectosAsignados: validProjects }]);
    setNewPrograma({ nombre: "", descripcion: "", proyectosAsignados: [] });
    setShowForm(false);
  };

  const handleEditPrograma = (programa) => {
    const projectIds = programa.proyectosAsignados.map(p => p.id);
    setEditPrograma({ ...programa, proyectosAsignados: projectIds });
    setShowEditModal(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    const validProjects = editPrograma.proyectosAsignados
      .filter(id => availableProjects.some(p => p.id === id))
      .map(id => availableProjects.find(p => p.id === id));
    setProgramas(programas.map(p => 
      p.id === editPrograma.id ? { ...editPrograma, proyectosAsignados: validProjects } : p
    ));
    setShowEditModal(false);
    setEditPrograma(null);
  };

  const handleDeletePrograma = (programaToDelete) => {
    setProgramas(programas.filter(p => p.id !== programaToDelete.id));
  };

  const handleCheckboxChange = (id) => {
    setNewPrograma(prev => {
      const newSelected = prev.proyectosAsignados.includes(id)
        ? prev.proyectosAsignados.filter(pId => pId !== id)
        : [...prev.proyectosAsignados, id];
      return { ...prev, proyectosAsignados: newSelected };
    });
  };

  const handleEditCheckboxChange = (id) => {
    setEditPrograma(prev => {
      const newSelected = prev.proyectosAsignados.includes(id)
        ? prev.proyectosAsignados.filter(pId => pId !== id)
        : [...prev.proyectosAsignados, id];
      return { ...prev, proyectosAsignados: newSelected };
    });
  };

  return (
    <Layout>
      <div className="programas-container">
        <h1>Programas</h1>
        <button className="btn btn-primary mb-3" onClick={() => setShowForm(true)}>
          Crear Nuevo Programa
        </button>

        {showForm && (
          <div className="card p-4 mb-4">
            <h3>Crear Programa</h3>
            <form onSubmit={handleCreatePrograma}>
              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  value={newPrograma.nombre}
                  onChange={(e) => setNewPrograma({ ...newPrograma, nombre: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Descripción</label>
                <input
                  type="text"
                  className="form-control"
                  value={newPrograma.descripcion}
                  onChange={(e) => setNewPrograma({ ...newPrograma, descripcion: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Asignar Proyectos</label>
                <div>
                  {availableProjects.map(project => (
                    <div key={project.id} className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`project-${project.id}`}
                        value={project.id}
                        checked={newPrograma.proyectosAsignados.includes(project.id)}
                        onChange={() => handleCheckboxChange(project.id)}
                      />
                      <label className="form-check-label" htmlFor={`project-${project.id}`}>
                        {project.nombre} ({project.tipo})
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <button type="submit" className="btn btn-success">Guardar Programa</button>
              <button type="button" className="btn btn-secondary ms-2" onClick={() => setShowForm(false)}>Cancelar</button>
            </form>
          </div>
        )}

        <div className="card p-4">
          <h3>Lista de Programas</h3>
          {programas.length === 0 ? (
            <p>No hay programas creados.</p>
          ) : (
            <ul className="list-group">
              {programas.map((programa) => (
                <li key={programa.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{programa.nombre}</strong>
                    <p><em>{programa.descripcion || "Sin descripción"}</em></p>
                    <ul>
                      {programa.proyectosAsignados.map(p => (
                        <li key={p.id}>{p.nombre}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditPrograma(programa)}>
                      <i className="bi bi-pencil"></i> Editar
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeletePrograma(programa)}>
                      <i className="bi bi-trash"></i> Eliminar
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Modal show={showEditModal} onHide={() => { setShowEditModal(false); setEditPrograma(null); }} centered>
          <Modal.Header closeButton>
            <Modal.Title>Editar Programa</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <form onSubmit={handleSaveEdit}>
              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  value={editPrograma?.nombre || ""}
                  onChange={(e) => setEditPrograma({ ...editPrograma, nombre: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Descripción</label>
                <input
                  type="text"
                  className="form-control"
                  value={editPrograma?.descripcion || ""}
                  onChange={(e) => setEditPrograma({ ...editPrograma, descripcion: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Asignar Proyectos</label>
                <div>
                  {availableProjects.map(project => (
                    <div key={project.id} className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`edit-project-${project.id}`}
                        value={project.id}
                        checked={editPrograma?.proyectosAsignados.includes(project.id)}
                        onChange={() => handleEditCheckboxChange(project.id)}
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

export default Programas;
