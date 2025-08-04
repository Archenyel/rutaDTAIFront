import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Alert,
  Spinner,
  Container,
  Row,
  Col,
  Card,
  Badge,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../componentes/Layout/Layout";
import "./Portafolios.css";
import api from "../../../api/api";

const Portafolios = () => {
  const [portafolios, setPortafolios] = useState([]);
  const [newPortafolio, setNewPortafolio] = useState({
    nombre: "",
    descripcion: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [editPortafolio, setEditPortafolio] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Cargar datos iniciales
  useEffect(() => {
    loadPortafolios();
  }, []);

  // Función para cargar portafolios
  const loadPortafolios = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/portafolios");
      setPortafolios(response.data);
    } catch (error) {
      console.error("Error loading portafolios:", error);
      setError(
        `Error al cargar portafolios: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  // Crear nuevo portafolio
  const handleCreatePortafolio = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const portafolioData = {
        nombre: newPortafolio.nombre,
        descripcion: newPortafolio.descripcion,
      };

      const response = await api.post("/portafolios", portafolioData);

      // Agregar el nuevo portafolio a la lista
      setPortafolios([...portafolios, response.data]);

      // Limpiar formulario
      setNewPortafolio({ nombre: "", descripcion: "" });
      setShowForm(false);
      setSuccess("Portafolio creado exitosamente");

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Error creating portafolio:", error);
      setError(
        `Error al crear portafolio: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  // Editar portafolio
  const handleEditPortafolio = (portafolio) => {
    setEditPortafolio({ ...portafolio });
    setShowEditModal(true);
  };

  // Guardar cambios en portafolio
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const updatedData = {
        nombre: editPortafolio.nombre,
        descripcion: editPortafolio.descripcion,
      };

      const response = await api.put(
        `/portafolios/${editPortafolio.id}`,
        updatedData
      );

      // Actualizar la lista de portafolios
      setPortafolios(
        portafolios.map((p) => (p.id === editPortafolio.id ? response.data : p))
      );

      setShowEditModal(false);
      setEditPortafolio(null);
      setSuccess("Portafolio actualizado exitosamente");

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Error updating portafolio:", error);
      setError(
        `Error al actualizar portafolio: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  // Eliminar portafolio
  const handleDeletePortafolio = async (portafolioToDelete) => {
    if (
      !window.confirm(
        `¿Está seguro de que desea eliminar el portafolio "${portafolioToDelete.nombre}"?`
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await api.delete(`/portafolios/${portafolioToDelete.id}`);

      // Remover de la lista
      setPortafolios(portafolios.filter((p) => p.id !== portafolioToDelete.id));
      setSuccess("Portafolio eliminado exitosamente");

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Error deleting portafolio:", error);
      setError(
        `Error al eliminar portafolio: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Container fluid className="portafolios-container py-4">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="display-6 fw-bold mb-2">
                  <i className="bi bi-briefcase-fill me-3 text-primary"></i>
                  Gestión de Portafolios
                </h1>
                <p className="text-muted lead">
                  Administra los portafolios digitales del sistema
                </p>
              </div>
              <Button
                variant="primary"
                size="lg"
                onClick={() => setShowForm(true)}
                disabled={loading}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Crear Portafolio
              </Button>
            </div>
          </Col>
        </Row>

        {/* Alertas */}
        {error && (
          <Row className="mb-3">
            <Col>
              <Alert
                variant="danger"
                dismissible
                onClose={() => setError(null)}
              >
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
              </Alert>
            </Col>
          </Row>
        )}

        {success && (
          <Row className="mb-3">
            <Col>
              <Alert
                variant="success"
                dismissible
                onClose={() => setSuccess(null)}
              >
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
                    Crear Nuevo Portafolio
                  </h5>
                </Card.Header>
                <Card.Body>
                  <form onSubmit={handleCreatePortafolio}>
                    <Row>
                      <Col md={12}>
                        <div className="mb-3">
                          <label className="form-label fw-semibold">
                            <i className="bi bi-card-text me-1"></i>
                            Nombre del Portafolio *
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={newPortafolio.nombre}
                            onChange={(e) =>
                              setNewPortafolio({
                                ...newPortafolio,
                                nombre: e.target.value,
                              })
                            }
                            placeholder="Ingrese el nombre del portafolio"
                            required
                            disabled={loading}
                          />
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
                        value={newPortafolio.descripcion}
                        onChange={(e) =>
                          setNewPortafolio({
                            ...newPortafolio,
                            descripcion: e.target.value,
                          })
                        }
                        placeholder="Descripción del portafolio"
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
                            <Spinner
                              animation="border"
                              size="sm"
                              className="me-2"
                            />
                            Guardando...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-lg me-2"></i>
                            Guardar Portafolio
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

        {/* Lista de portafolios */}
        <Row>
          <Col>
            <Card className="shadow-sm">
              <Card.Header className="bg-white border-0 p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-bold">
                    <i className="bi bi-folder2-open me-2 text-primary"></i>
                    Portafolios Registrados
                  </h5>
                  <Badge bg="primary" className="fs-6">
                    {portafolios.length} total
                    {portafolios.length !== 1 ? "es" : ""}
                  </Badge>
                </div>
              </Card.Header>
              <Card.Body className="p-0">
                {loading && portafolios.length === 0 ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3 text-muted">Cargando portafolios...</p>
                  </div>
                ) : portafolios.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-folder-x display-1 text-muted"></i>
                    <h5 className="mt-3 text-muted">No hay portafolios</h5>
                    <p className="text-muted">
                      Comience creando su primer portafolio
                    </p>
                  </div>
                ) : (
                  <div className="list-group list-group-flush">
                    {portafolios.map((portafolio, index) => (
                      <div key={portafolio.id} className="list-group-item">
                        <Row className="align-items-center">
                          <Col md={7}>
                            <div className="d-flex align-items-start">
                              <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                                <i className="bi bi-briefcase-fill text-primary fs-5"></i>
                              </div>
                              <div>
                                <h6 className="mb-1 fw-bold">
                                  {portafolio.nombre}
                                </h6>
                                <p className="mb-1 text-muted small">
                                  {portafolio.descripcion || "Sin descripción"}
                                </p>
                                <small className="text-muted">
                                  <i className="bi bi-calendar3 me-1"></i>
                                  {portafolio.fechaCreacion
                                    ? new Date(
                                        portafolio.fechaCreacion
                                      ).toLocaleDateString("es-ES")
                                    : "Fecha no disponible"}
                                </small>
                              </div>
                            </div>
                          </Col>
                          <Col md={5} className="text-end">
                            <div className="d-flex gap-2 justify-content-end">
                              {/* Botón para ir al portafolio */}
                              <Button
                                as={Link}
                                to={`/programas`}
                                variant="outline-primary"
                                size="sm"
                                title="Ver portafolio"
                              >
                                <i className="bi bi-eye me-1"></i>
                                Ver
                              </Button>

                              {/* Botones de acciones */}
                              <div className="btn-group">
                                <Button
                                  variant="outline-warning"
                                  size="sm"
                                  onClick={() =>
                                    handleEditPortafolio(portafolio)
                                  }
                                  disabled={loading}
                                  title="Editar portafolio"
                                >
                                  <i className="bi bi-pencil"></i>
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() =>
                                    handleDeletePortafolio(portafolio)
                                  }
                                  disabled={loading}
                                  title="Eliminar portafolio"
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
            setEditPortafolio(null);
          }}
          centered
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="bi bi-pencil-square me-2"></i>
              Editar Portafolio
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSaveEdit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  <i className="bi bi-card-text me-1"></i>
                  Nombre del Portafolio *
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={editPortafolio?.nombre || ""}
                  onChange={(e) =>
                    setEditPortafolio({
                      ...editPortafolio,
                      nombre: e.target.value,
                    })
                  }
                  required
                  disabled={loading}
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  <i className="bi bi-file-text me-1"></i>
                  Descripción
                </label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={editPortafolio?.descripcion || ""}
                  onChange={(e) =>
                    setEditPortafolio({
                      ...editPortafolio,
                      descripcion: e.target.value,
                    })
                  }
                  disabled={loading}
                />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditPortafolio(null);
                  }}
                  disabled={loading}
                >
                  <i className="bi bi-x-lg me-2"></i>
                  Cancelar
                </Button>
                <Button variant="primary" type="submit" disabled={loading}>
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

export default Portafolios;
