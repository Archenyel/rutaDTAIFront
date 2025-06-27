import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./Admin.css";

const initialProjects = [
  { id: 1, nombre: "Proyecto Alpha", inicio: "2024-06-01", entrega: "2024-07-01", encargado: "Ana García" },
  { id: 2, nombre: "Proyecto Beta", inicio: "2024-06-10", entrega: "2024-08-15", encargado: "Luis Hernández" },
];

const initialStudents = [
  { id: 1, nombre: "Ana García", email: "ana.garcia@example.com", proyecto: "" },
  { id: 2, nombre: "Luis Hernández", email: "luis.hernandez@example.com", proyecto: "" },
  { id: 3, nombre: "Sofía Martínez", email: "sofia.martinez@example.com", proyecto: "" },
];

const Modal = ({ children, onClose }) => {
  return ReactDOM.createPortal(
    <div className="modal show d-block" tabIndex="-1" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

const Admin = () => {
  const [students, setStudents] = useState(initialStudents);
  const [projects, setProjects] = useState(initialProjects);

  const [showStudentModal, setShowStudentModal] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [studentForm, setStudentForm] = useState({ nombre: "", email: "", proyecto: "" });

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [projectForm, setProjectForm] = useState({ nombre: "", inicio: "", entrega: "", encargado: "" });

  // --- Funciones comunes ---
  const closeModals = () => {
    setShowStudentModal(false);
    setShowProjectModal(false);
    setEditStudent(null);
    setEditProject(null);
    setStudentForm({ nombre: "", email: "", proyecto: "" });
    setProjectForm({ nombre: "", inicio: "", entrega: "", encargado: "" });
  };

  // --- CRUD Alumnos ---
  const handleAddStudent = () => {
    setEditStudent(null);
    setStudentForm({ nombre: "", email: "", proyecto: "" });
    setShowStudentModal(true);
  };

  const handleEditStudent = (student) => {
    setEditStudent(student);
    setStudentForm(student);
    setShowStudentModal(true);
  };

  const handleDeleteStudent = (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este alumno?")) {
      setStudents((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleStudentChange = (e) => {
    const { name, value } = e.target;
    setStudentForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleStudentSubmit = (e) => {
    e.preventDefault();
    if (editStudent) {
      setStudents((prev) =>
        prev.map((s) => (s.id === editStudent.id ? { ...s, ...studentForm } : s))
      );
    } else {
      const newStudent = { id: Date.now(), ...studentForm };
      setStudents((prev) => [...prev, newStudent]);
    }
    closeModals();
  };

  // --- CRUD Proyectos ---
  const handleAddProject = () => {
    setEditProject(null);
    setProjectForm({ nombre: "", inicio: "", entrega: "", encargado: "" });
    setShowProjectModal(true);
  };

  const handleEditProject = (project) => {
    setEditProject(project);
    setProjectForm(project);
    setShowProjectModal(true);
  };

  const handleDeleteProject = (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este proyecto?")) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setProjectForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProjectSubmit = (e) => {
    e.preventDefault();
    if (editProject) {
      setProjects((prev) =>
        prev.map((p) => (p.id === editProject.id ? { ...p, ...projectForm } : p))
      );
    } else {
      const newProject = { id: Date.now(), ...projectForm };
      setProjects((prev) => [...prev, newProject]);
    }
    closeModals();
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
        <h2>Panel de Administrador</h2>
        <p>CRUD de alumnos y proyectos</p>

        {/* Botones */}
        <button className="btn btn-primary mb-3 me-2" onClick={handleAddStudent}>
          Agregar Alumno
        </button>
        <button className="btn btn-primary mb-3" onClick={handleAddProject}>
          Agregar Proyecto
        </button>

        {/* Tabla de Alumnos */}
        <h4 className="mt-4">Alumnos</h4>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Proyecto Asignado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <td>{s.nombre}</td>
                <td>{s.email}</td>
                <td>{s.proyecto || "No asignado"}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditStudent(s)}>
                    Editar
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDeleteStudent(s.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Tabla de Proyectos */}
        <h4 className="mt-5">Proyectos</h4>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Fecha Inicio</th>
              <th>Fecha Entrega</th>
              <th>Encargado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td>{p.inicio}</td>
                <td>{p.entrega}</td>
                <td>{p.encargado}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditProject(p)}>
                    Editar
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDeleteProject(p.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Alumno */}
      {showStudentModal && (
        <Modal onClose={closeModals}>
          <form onSubmit={handleStudentSubmit} className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{editStudent ? "Editar Alumno" : "Agregar Alumno"}</h5>
              <button type="button" className="btn-close" onClick={closeModals}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  className="form-control"
                  value={studentForm.nombre}
                  onChange={handleStudentChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={studentForm.email}
                  onChange={handleStudentChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Proyecto asignado</label>
                <select
                  name="proyecto"
                  className="form-control"
                  value={studentForm.proyecto}
                  onChange={handleStudentChange}
                >
                  <option value="">-- Ninguno --</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.nombre}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={closeModals}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                {editStudent ? "Guardar cambios" : "Agregar"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Proyecto */}
      {showProjectModal && (
        <Modal onClose={closeModals}>
          <form onSubmit={handleProjectSubmit} className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{editProject ? "Editar Proyecto" : "Agregar Proyecto"}</h5>
              <button type="button" className="btn-close" onClick={closeModals}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Nombre del Proyecto</label>
                <input
                  type="text"
                  name="nombre"
                  className="form-control"
                  value={projectForm.nombre}
                  onChange={handleProjectChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Fecha de Inicio</label>
                <input
                  type="date"
                  name="inicio"
                  className="form-control"
                  value={projectForm.inicio}
                  onChange={handleProjectChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Fecha de Entrega</label>
                <input
                  type="date"
                  name="entrega"
                  className="form-control"
                  value={projectForm.entrega}
                  onChange={handleProjectChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Encargado</label>
                <input
                  type="text"
                  name="encargado"
                  className="form-control"
                  value={projectForm.encargado}
                  onChange={handleProjectChange}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={closeModals}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                {editProject ? "Guardar cambios" : "Agregar"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};

export default Admin;
