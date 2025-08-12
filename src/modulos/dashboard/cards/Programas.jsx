import React, { useState, useEffect } from "react";
import { Modal, Button, Alert, Spinner, Container, Row, Col, Card, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../componentes/Layout/Layout";
import "./Programas.css";
import api from "../../../api/api";

const Programas = () => {
  const rol = localStorage.getItem("userRole");
  const [programas, setProgramas] = useState([]);
  const [programasFiltrados, setProgramasFiltrados] = useState([]);
  const [portafolios, setPortafolios] = useState([]);
  const [portafolioSeleccionado, setPortafolioSeleccionado] = useState(""); // Para el filtro
  const [newPrograma, setNewPrograma] = useState({ 
    nombre: "", 
    descripcion: "", 
    portafolioId: "",
    fecha: ""
  });
  const [showForm, setShowForm] = useState(false);
  const [editPrograma, setEditPrograma] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Cargar datos iniciales
  useEffect(() => {
    loadProgramas();
    loadPortafolios();
  }, []);

  // Filtrar programas cuando cambie el portafolio seleccionado
  useEffect(() => {
    if (portafolioSeleccionado === "") {
      setProgramasFiltrados(programas);
    } else {
      setProgramasFiltrados(programas.filter(programa => programa.portafolioId === portafolioSeleccionado));
    }
  }, [programas, portafolioSeleccionado]);

  // Función para cargar programas
  const loadProgramas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/programas');
      setProgramas(response.data);
    } catch (error) {
      console.error('Error loading programas:', error);
      setError(`Error al cargar programas: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar portafolios
  const loadPortafolios = async () => {
    try {
      const response = await api.get('/portafolios');
      setPortafolios(response.data);
    } catch (error) {
      console.error('Error loading portafolios:', error);
    }
  };

  // Crear nuevo programa
  const handleCreatePrograma = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      const programaData = {
        nombre: newPrograma.nombre,
        descripcion: newPrograma.descripcion,
        portafolioId: newPrograma.portafolioId,
        fecha: newPrograma.fecha
      };

      const response = await api.post('/programas', programaData);
      
      setProgramas([...programas, response.data]);
      setNewPrograma({ nombre: "", descripcion: "", portafolioId: "", fecha: "" });
      setShowForm(false);
      setSuccess('Programa creado exitosamente');
      
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (error) {
      console.error('Error creating programa:', error);
      setError(`Error al crear programa: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Editar programa
  const handleEditPrograma = (programa) => {
    setEditPrograma({ ...programa });
    setShowEditModal(true);
  };

  // Guardar cambios en programa
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const updatedData = {
        nombre: editPrograma.nombre,
        descripcion: editPrograma.descripcion,
        portafolioId: editPrograma.portafolioId,
        fecha: editPrograma.fecha
      };

      const response = await api.put(`/programas/${editPrograma.id}`, updatedData);

      setProgramas(programas.map(p =>
        p.id === editPrograma.id ? response.data : p
      ));
      
      setShowEditModal(false);
      setEditPrograma(null);
      setSuccess('Programa actualizado exitosamente');
      
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (error) {
      console.error('Error updating programa:', error);
      setError(`Error al actualizar programa: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar programa
  const handleDeletePrograma = async (programaToDelete) => {
    if (!window.confirm(`¿Está seguro de que desea eliminar el programa "${programaToDelete.nombre}"?`)) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await api.delete(`/programas/${programaToDelete.id}`);

      setProgramas(programas.filter(p => p.id !== programaToDelete.id));
      setSuccess('Programa eliminado exitosamente');
      
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (error) {
      console.error('Error deleting programa:', error);
      setError(`Error al eliminar programa: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Obtener nombre del portafolio por ID
  const getPortafolioNombre = (portafolioId) => {
    const portafolio = portafolios.find(p => p.id === portafolioId);
    return portafolio ? portafolio.nombre : 'Sin portafolio';
  };

  // Limpiar filtro
  const handleClearFilter = () => {
    setPortafolioSeleccionado("");
  };

  return (
    <Layout>
      <Container fluid className="programas-container py-4">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="display-6 fw-bold mb-2">
                  <i className="bi bi-briefcase-fill me-3 text-primary"></i>
                  Gestión de Programas
                </h1>
                <p className="text-muted lead">Administra los programas académicos del sistema</p>
              </div>
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => setShowForm(true)}
                disabled={loading}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Crear Programa
              </Button>
            </div>
          </Col>
        </Row>

        {/* Filtro por Portafolio */}
        <Row className="mb-4">
          <Col>
            <Card className="shadow-sm border-0">
              <Card.Body className="py-3">
                <Row className="align-items-center">
                  <Col md={8}>
                    <div className="d-flex align-items-center gap-3">
                      <label className="form-label mb-0 fw-semibold">
                        <i className="bi bi-funnel me-2 text-primary"></i>
                        Filtrar por Portafolio:
                      </label>
                      <select
                        className="form-select"
                        style={{ maxWidth: '300px' }}
                        value={portafolioSeleccionado}
                        onChange={(e) => setPortafolioSeleccionado(e.target.value)}
                        disabled={loading}
                      >
                        <option value="">Todos los portafolios</option>
                        {portafolios.map(portafolio => (
                          <option key={portafolio.id} value={portafolio.id}>
                            {portafolio.nombre}
                          </option>
                        ))}
                      </select>
                      
                      {portafolioSeleccionado && (
                        <Button 
                          variant="outline-secondary"
                          size="sm"
                          onClick={handleClearFilter}
                          title="Limpiar filtro"
                        >
                          <i className="bi bi-x-lg"></i>
                        </Button>
                      )}
                    </div>
                  </Col>
                  <Col md={4} className="text-end">
                    <div className="d-flex align-items-center justify-content-end gap-2">
                      <Badge bg="info" className="fs-6">
                        {programasFiltrados.length} de {programas.length} programa{programas.length !== 1 ? 's' : ''}
                      </Badge>
                      {portafolioSeleccionado && (
                        <Badge bg="primary" className="fs-6">
                          <i className="bi bi-briefcase me-1"></i>
                          {getPortafolioNombre(portafolioSeleccionado)}
                        </Badge>
                      )}
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Alertas */}
        {error && (
          <Row className="mb-3">
            <Col>
              <Alert variant="danger" dismissible onClose={() => setError(null)}>
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
              </Alert>
            </Col>
          </Row>
        )}

        {success && (
          <Row className="mb-3">
            <Col>
              <Alert variant="success" dismissible onClose={() => setSuccess(null)}>
                <i className="bi bi-check-circle me-2"></i>
                {success}
              </Alert>
            </Col>
          </Row>
        )}

        {/* Formulario de creación */}
        {showForm && (
          <Row className="mb-4">
            <Col>
              <Card className="shadow-sm">
                <Card.Header className="bg-primary text-white">
                  <h5 className="mb-0">
                    <i className="bi bi-plus-circle me-2"></i>
                    Crear Nuevo Programa
                  </h5>
                </Card.Header>
                <Card.Body>
                  <form onSubmit={handleCreatePrograma}>
                    <Row>
                      <Col md={6}>
                        <div className="mb-3">
                          <label className="form-label fw-semibold">
                            <i className="bi bi-card-text me-1"></i>
                            Nombre del Programa *
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={newPrograma.nombre}
                            onChange={(e) => setNewPrograma({ ...newPrograma, nombre: e.target.value })}
                            placeholder="Ingrese el nombre del programa"
                            required
                            disabled={loading}
                          />
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <label className="form-label fw-semibold">
                            <i className="bi bi-calendar3 me-1"></i>
                            Fecha *
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            value={newPrograma.fecha}
                            onChange={(e) => setNewPrograma({ ...newPrograma, fecha: e.target.value })}
                            required
                            disabled={loading}
                          />
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12}>
                        <div className="mb-3">
                          <label className="form-label fw-semibold">
                            <i className="bi bi-briefcase me-1"></i>
                            Portafolio *
                          </label>
                          <select
                            className="form-select"
                            value={newPrograma.portafolioId}
                            onChange={(e) => setNewPrograma({ ...newPrograma, portafolioId: e.target.value })}
                            required
                            disabled={loading}
                          >
                            <option value="">Seleccionar portafolio</option>
                            {portafolios.map(portafolio => (
                              <option key={portafolio.id} value={portafolio.id}>
                                {portafolio.nombre}
                              </option>
                            ))}
                          </select>
                        </div>
                      </Col>
                    </Row>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        <i className="bi bi-file-text me-1"></i>
                        Descripción
                      </label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={newPrograma.descripcion}
                        onChange={(e) => setNewPrograma({ ...newPrograma, descripcion: e.target.value })}
                        placeholder="Descripción del programa"
                        disabled={loading}
                      />
                    </div>

                    <div className="d-flex gap-2">
                      <Button 
                        type="submit" 
                        variant="success"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Guardando...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-lg me-2"></i>
                            Guardar Programa
                          </>
                        )}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline-secondary" 
                        onClick={() => setShowForm(false)}
                        disabled={loading}
                      >
                        <i className="bi bi-x-lg me-2"></i>
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Lista de programas */}
        <Row>
          <Col>
            <Card className="shadow-sm">
              <Card.Header className="bg-white border-0 p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-bold">
                    <i className="bi bi-folder2-open me-2 text-primary"></i>
                    {portafolioSeleccionado 
                      ? `Programas de ${getPortafolioNombre(portafolioSeleccionado)}`
                      : 'Programas Registrados'
                    }
                  </h5>
                  <Badge bg="primary" className="fs-6">
                    {programasFiltrados.length} programa{programasFiltrados.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </Card.Header>
              <Card.Body className="p-0">
                {loading && programasFiltrados.length === 0 ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3 text-muted">Cargando programas...</p>
                  </div>
                ) : programasFiltrados.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-folder-x display-1 text-muted"></i>
                    <h5 className="mt-3 text-muted">
                      {portafolioSeleccionado 
                        ? `No hay programas en ${getPortafolioNombre(portafolioSeleccionado)}`
                        : 'No hay programas'
                      }
                    </h5>
                    <p className="text-muted">
                      {portafolioSeleccionado 
                        ? 'Este portafolio no tiene programas asociados'
                        : 'Comience creando su primer programa'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="list-group list-group-flush">
                    {programasFiltrados.map((programa) => (
                      <div key={programa.id} className="list-group-item">
                        <Row className="align-items-center">
                          <Col md={7}>
                            <div className="d-flex align-items-start">
                              <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                                <i className="bi bi-briefcase-fill text-primary fs-5"></i>
                              </div>
                              <div>
                                <h6 className="mb-1 fw-bold">{programa.nombre}</h6>
                                <p className="mb-1 text-muted small">
                                  {programa.descripcion || "Sin descripción"}
                                </p>
                                <div className="d-flex gap-2 flex-wrap">
                                  <Badge bg="info">
                                    <i className="bi bi-briefcase me-1"></i>
                                    {getPortafolioNombre(programa.portafolioId)}
                                  </Badge>
                                  {programa.fecha && (
                                    <Badge bg="success">
                                      <i className="bi bi-calendar3 me-1"></i>
                                      {new Date(programa.fecha).toLocaleDateString('es-ES')}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Col>
                          <Col md={5} className="text-end">
                            <div className="d-flex gap-2 justify-content-end">
                              <Button 
                                as={Link}
                                to={`/listaProyectos`}
                                variant="outline-primary" 
                                size="sm"
                                title="Ver programa"
                              >
                                <i className="bi bi-eye me-1"></i>
                                Ver
                              </Button>
                              
                              <div className="btn-group">
                                <Button 
                                  variant="outline-warning" 
                                  size="sm" 
                                  onClick={() => handleEditPrograma(programa)}
                                  disabled={loading}
                                  title="Editar programa"
                                >
                                  <i className="bi bi-pencil"></i>
                                </Button>
                                <Button 
                                  variant="outline-danger" 
                                  size="sm" 
                                  onClick={() => handleDeletePrograma(programa)}
                                  disabled={loading}
                                  title="Eliminar programa"
                                >
                                  <i className="bi bi-trash"></i>
                                </Button>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Modal de edición */}
        <Modal 
          show={showEditModal} 
          onHide={() => { 
            setShowEditModal(false); 
            setEditPrograma(null); 
          }} 
          centered
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="bi bi-pencil-square me-2"></i>
              Editar Programa
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSaveEdit}>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-card-text me-1"></i>
                      Nombre del Programa *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={editPrograma?.nombre || ""}
                      onChange={(e) => setEditPrograma({ ...editPrograma, nombre: e.target.value })}
                      required
                      disabled={loading}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-calendar3 me-1"></i>
                      Fecha *
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={editPrograma?.fecha || ""}
                      onChange={(e) => setEditPrograma({ ...editPrograma, fecha: e.target.value })}
                      required
                      disabled={loading}
                    />
                  </div>
                </Col>
              </Row>
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  <i className="bi bi-briefcase me-1"></i>
                  Portafolio *
                </label>
                <select
                  className="form-select"
                  value={editPrograma?.portafolioId || ""}
                  onChange={(e) => setEditPrograma({ ...editPrograma, portafolioId: e.target.value })}
                  required
                  disabled={loading}
                >
                  <option value="">Seleccionar portafolio</option>
                  {portafolios.map(portafolio => (
                    <option key={portafolio.id} value={portafolio.id}>
                      {portafolio.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  <i className="bi bi-file-text me-1"></i>
                  Descripción
                </label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={editPrograma?.descripcion || ""}
                  onChange={(e) => setEditPrograma({ ...editPrograma, descripcion: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <Button 
                  variant="outline-secondary" 
                  onClick={() => { 
                    setShowEditModal(false); 
                    setEditPrograma(null); 
                  }}
                  disabled={loading}
                >
                  <i className="bi bi-x-lg me-2"></i>
                  Cancelar
                </Button>
                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-lg me-2"></i>
                      Guardar Cambios
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </Container>
    </Layout>
  );
};

export default Programas;
