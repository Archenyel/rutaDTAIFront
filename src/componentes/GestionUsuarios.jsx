import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Badge, Button, Alert, Spinner, Modal, Form, InputGroup } from "react-bootstrap";
import api from "../api/api";

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Estados para búsqueda simple
  const [busqueda, setBusqueda] = useState("");
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  
  // Estados para formularios
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editUsuario, setEditUsuario] = useState(null);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [selectedProject, setSelectedProject] = useState("");

  useEffect(() => {
    loadUsuarios();
    loadProyectos();
  }, []);

  // Aplicar búsqueda simple
  useEffect(() => {
    if (!busqueda) {
      setUsuariosFiltrados(usuarios);
    } else {
      const searchTerm = busqueda.toLowerCase();
      const filtrados = usuarios.filter(usuario => 
        usuario.usuario?.toLowerCase().includes(searchTerm) ||
        usuario.email?.toLowerCase().includes(searchTerm) ||
        (usuario.nombre && usuario.nombre.toLowerCase().includes(searchTerm))
      );
      setUsuariosFiltrados(filtrados);
    }
  }, [usuarios, busqueda]);

  // Cargar usuarios desde el backend
  const loadUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      // Usar el endpoint del backend que filtra por rol (alumnos tienen userid = 2)
      const response = await api.get(`/usuarios?rol=2`);
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error loading usuarios:', error);
      setError(`Error al cargar alumnos: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Cargar proyectos
  const loadProyectos = async () => {
    try {
      const response = await api.get('/proyectos');
      setProyectos(response.data);
    } catch (error) {
      console.error('Error loading proyectos:', error);
    }
  };

  // Editar usuario
  const handleEditUsuario = (usuario) => {
    setEditUsuario({ ...usuario });
    setShowEditModal(true);
  };

  // Guardar cambios usando el endpoint del backend
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const updateData = {
        usuario: editUsuario.usuario,
        email: editUsuario.email,
      };

      // Si se proporciona password, incluirlo
      if (editUsuario.password && editUsuario.password.trim()) {
        updateData.password = editUsuario.password;
      }

      await api.patch(`/usuarios/editadmin/${editUsuario.id}`, updateData);

      // Actualizar la lista local
      setUsuarios(usuarios.map(u =>
        u.id === editUsuario.id 
          ? { ...u, usuario: editUsuario.usuario, email: editUsuario.email }
          : u
      ));
      
      setShowEditModal(false);
      setEditUsuario(null);
      setSuccess('Alumno actualizado correctamente');
      
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (error) {
      console.error('Error updating usuario:', error);
      setError(`Error al actualizar alumno: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Ver detalles del usuario
  const handleViewDetails = (usuario) => {
    setSelectedUsuario(usuario);
    setShowDetailModal(true);
  };

  // Asignar alumno a proyecto
  const handleAssignToProject = (usuario) => {
    setSelectedUsuario(usuario);
    setSelectedProject("");
    setShowProjectModal(true);
  };

  // Confirmar asignación a proyecto
  const handleConfirmAssignProject = async () => {
    if (!selectedProject) {
      setError('Por favor seleccione un proyecto');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Aquí puedes implementar la lógica para asignar el alumno al proyecto
      // Por ejemplo, actualizar una tabla de asignaciones o agregar el alumno al proyecto
      await api.put('/proyectos/asignarAlumno/asignar', {
        idAlumno: selectedUsuario.id,
        idProyecto: selectedProject
      });

      setShowProjectModal(false);
      setSelectedUsuario(null);
      setSelectedProject("");
      setSuccess(`Alumno ${selectedUsuario.usuario} asignado al proyecto correctamente`);
      
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (error) {
      console.error('Error assigning to project:', error);
      setError(`Error al asignar alumno al proyecto: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="usuarios-container py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="display-6 fw-bold mb-2">
                <i className="bi bi-people me-3 text-primary"></i>
                Gestión de Alumnos
              </h1>
              <p className="text-muted lead">Administra todos los alumnos de la plataforma</p>
            </div>
            <Button 
              variant="outline-primary"
              onClick={loadUsuarios}
              disabled={loading}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              Actualizar
            </Button>
          </div>
        </Col>
      </Row>

      {/* Búsqueda simple */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Body className="py-3">
              <Row className="align-items-center">
                <Col lg={6}>
                  <div className="mb-3 mb-lg-0">
                    <label className="form-label mb-1 fw-semibold small">
                      <i className="bi bi-search me-1"></i>
                      Buscar Alumno
                    </label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder="Buscar por nombre de usuario o email"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        size="sm"
                      />
                      {busqueda && (
                        <Button 
                          variant="outline-secondary" 
                          size="sm"
                          onClick={() => setBusqueda("")}
                        >
                          <i className="bi bi-x"></i>
                        </Button>
                      )}
                    </InputGroup>
                  </div>
                </Col>
                <Col lg={6}>
                  <div className="d-flex gap-2 justify-content-end">
                    <Badge bg="primary" className="fs-6 py-2">
                      {usuariosFiltrados.length} de {usuarios.length} alumnos
                    </Badge>
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

      {/* Lista de usuarios */}
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-white border-0 p-4">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-people me-2 text-primary"></i>
                  Alumnos Registrados
                </h5>
                <Badge bg="primary" className="fs-6">
                  {usuariosFiltrados.length} alumno{usuariosFiltrados.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-3 text-muted">Cargando alumnos...</p>
                </div>
              ) : usuariosFiltrados.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-people display-1 text-muted"></i>
                  <h5 className="mt-3 text-muted">No hay alumnos</h5>
                  <p className="text-muted">
                    {busqueda 
                      ? 'No se encontraron alumnos con la búsqueda realizada'
                      : 'No hay alumnos registrados en el sistema'
                    }
                  </p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {usuariosFiltrados.map((usuario) => (
                    <div key={usuario.id} className="list-group-item">
                      <Row className="align-items-center">
                        <Col md={7}>
                          <div className="d-flex align-items-start">
                            <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                              <i className="bi bi-person text-primary fs-5"></i>
                            </div>
                            <div>
                              <h6 className="mb-1 fw-bold">{usuario.usuario || 'Usuario sin nombre'}</h6>
                              <p className="mb-1 text-muted small">
                                <i className="bi bi-envelope me-1"></i>
                                {usuario.email}
                              </p>
                              <div className="d-flex gap-2 flex-wrap">
                                <Badge bg="primary">
                                  <i className="bi bi-person-check me-1"></i>
                                  Alumno
                                </Badge>
                                {usuario.nombre && (
                                  <Badge bg="info">
                                    <i className="bi bi-card-text me-1"></i>
                                    {usuario.nombre}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </Col>
                        <Col md={5} className="text-end">
                          <div className="d-flex gap-2 justify-content-end flex-wrap">
                            <Button 
                              variant="outline-success" 
                              size="sm"
                              onClick={() => handleAssignToProject(usuario)}
                              disabled={loading}
                              title="Asignar a proyecto"
                            >
                              <i className="bi bi-folder-plus me-1"></i>
                              Asignar
                            </Button>
                            
                            <Button 
                              variant="outline-info" 
                              size="sm"
                              onClick={() => handleViewDetails(usuario)}
                              title="Ver detalles"
                            >
                              <i className="bi bi-eye me-1"></i>
                              Detalles
                            </Button>
                            
                            <Button 
                              variant="outline-warning" 
                              size="sm" 
                              onClick={() => handleEditUsuario(usuario)}
                              disabled={loading}
                              title="Editar alumno"
                            >
                              <i className="bi bi-pencil"></i>
                            </Button>
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
          setEditUsuario(null); 
        }} 
        centered
        size="md"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-pencil-square me-2"></i>
            Editar Alumno
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveEdit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                <i className="bi bi-person me-1"></i>
                Nombre de Usuario *
              </Form.Label>
              <Form.Control
                type="text"
                value={editUsuario?.usuario || ""}
                onChange={(e) => setEditUsuario({ ...editUsuario, usuario: e.target.value })}
                placeholder="Nombre de usuario"
                required
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                <i className="bi bi-envelope me-1"></i>
                Email *
              </Form.Label>
              <Form.Control
                type="email"
                value={editUsuario?.email || ""}
                onChange={(e) => setEditUsuario({ ...editUsuario, email: e.target.value })}
                placeholder="correo@ejemplo.com"
                required
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                <i className="bi bi-lock me-1"></i>
                Nueva Contraseña
              </Form.Label>
              <Form.Control
                type="password"
                value={editUsuario?.password || ""}
                onChange={(e) => setEditUsuario({ ...editUsuario, password: e.target.value })}
                placeholder="Dejar vacío para mantener la actual"
                disabled={loading}
              />
              <Form.Text className="text-muted">
                Solo ingrese una contraseña si desea cambiarla
              </Form.Text>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button 
                variant="outline-secondary" 
                onClick={() => { 
                  setShowEditModal(false); 
                  setEditUsuario(null); 
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
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal de detalles */}
      <Modal 
        show={showDetailModal} 
        onHide={() => { 
          setShowDetailModal(false); 
          setSelectedUsuario(null); 
        }} 
        centered
        size="md"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-person-circle me-2"></i>
            Detalles del Alumno
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUsuario && (
            <div>
              <div className="mb-3">
                <label className="fw-bold text-muted small">INFORMACIÓN DEL USUARIO</label>
                <div className="border rounded p-3 bg-light">
                  <p className="mb-2">
                    <strong>ID:</strong> {selectedUsuario.id}
                  </p>
                  <p className="mb-2">
                    <strong>Usuario:</strong> {selectedUsuario.usuario || 'No especificado'}
                  </p>
                  <p className="mb-2">
                    <strong>Email:</strong> {selectedUsuario.email}
                  </p>
                  <p className="mb-2">
                    <strong>Rol:</strong>
                    <Badge bg="primary" className="ms-2">
                      Alumno
                    </Badge>
                  </p>
                  {selectedUsuario.nombre && (
                    <p className="mb-0">
                      <strong>Nombre adicional:</strong> {selectedUsuario.nombre}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => { 
              setShowDetailModal(false); 
              setSelectedUsuario(null); 
            }}
          >
            <i className="bi bi-x-lg me-2"></i>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de asignación a proyecto */}
      <Modal 
        show={showProjectModal} 
        onHide={() => { 
          setShowProjectModal(false); 
          setSelectedUsuario(null);
          setSelectedProject("");
        }} 
        centered
        size="md"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-folder-plus me-2"></i>
            Asignar Alumno a Proyecto
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUsuario && (
            <div>
              <div className="mb-3">
                <label className="fw-bold text-muted small">ALUMNO SELECCIONADO</label>
                <div className="border rounded p-3 bg-light">
                  <div className="d-flex align-items-center">
                    <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                      <i className="bi bi-person text-primary"></i>
                    </div>
                    <div>
                      <h6 className="mb-1 fw-bold">{selectedUsuario.usuario}</h6>
                      <small className="text-muted">{selectedUsuario.email}</small>
                    </div>
                  </div>
                </div>
              </div>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  <i className="bi bi-folder me-1"></i>
                  Seleccionar Proyecto *
                </Form.Label>
                <Form.Select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  required
                  disabled={loading}
                >
                  <option value="">Seleccione un proyecto</option>
                  {proyectos.map(proyecto => (
                    <option key={proyecto.id} value={proyecto.id}>
                      {proyecto.nombre} - {proyecto.tipo || 'Sin tipo'}
                    </option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">
                  El alumno será asignado al proyecto seleccionado
                </Form.Text>
              </Form.Group>

              {proyectos.length === 0 && (
                <Alert variant="warning">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  No hay proyectos disponibles. Debe crear al menos un proyecto antes de asignar alumnos.
                </Alert>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="outline-secondary" 
            onClick={() => { 
              setShowProjectModal(false); 
              setSelectedUsuario(null);
              setSelectedProject("");
            }}
            disabled={loading}
          >
            <i className="bi bi-x-lg me-2"></i>
            Cancelar
          </Button>
          <Button 
            variant="success"
            onClick={handleConfirmAssignProject}
            disabled={loading || !selectedProject || proyectos.length === 0}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Asignando...
              </>
            ) : (
              <>
                <i className="bi bi-check-lg me-2"></i>
                Asignar al Proyecto
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default GestionUsuarios;
