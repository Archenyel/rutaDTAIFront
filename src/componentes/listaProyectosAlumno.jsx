import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Badge, Button, Alert, Spinner, Modal, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../api/api";

const ListaProyectosAlumno = () => {

  const id = localStorage.getItem("userId");

  const [proyectos, setProyectos] = useState([]);
  const [proyectosFiltrados, setProyectosFiltrados] = useState([]);
  const [programas, setProgramas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Estados para filtros
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroPrograma, setFiltroPrograma] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  
  // Estados para formulario
  const [showForm, setShowForm] = useState(false);
  const [editProyecto, setEditProyecto] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Tipos de proyecto disponibles
  const tiposProyecto = [
    { value: "Social", label: "Social", icon: "bi-people-fill", color: "success" },
    { value: "I+D", label: "I+D (Investigación + Desarrollo)", icon: "bi-lightbulb-fill", color: "primary" },
    { value: "Investigacion", label: "Investigación", icon: "bi-search", color: "info" },
    { value: "Innovacion", label: "Innovación", icon: "bi-gear-fill", color: "warning" },
    { value: "Tecnologico", label: "Tecnológico", icon: "bi-cpu-fill", color: "dark" },
    { value: "Educativo", label: "Educativo", icon: "bi-book-fill", color: "purple" },
    { value: "Empresarial", label: "Empresarial", icon: "bi-building-fill", color: "secondary" }
  ];

  // Cargar datos iniciales
  useEffect(() => {
    loadProyectos();
    loadProgramas();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let filtrados = [...proyectos];

    // Filtro por estado
    if (filtroEstado) {
      filtrados = filtrados.filter(proyecto => proyecto.estado === filtroEstado);
    }

    // Filtro por programa
    if (filtroPrograma) {
      if (filtroPrograma === "sin-programa") {
        filtrados = filtrados.filter(proyecto => !proyecto.programaId);
      } else {
        filtrados = filtrados.filter(proyecto => proyecto.programaId === filtroPrograma);
      }
    }

    // Filtro por tipo
    if (filtroTipo) {
      filtrados = filtrados.filter(proyecto => proyecto.tipo === filtroTipo);
    }

    setProyectosFiltrados(filtrados);
  }, [proyectos, filtroEstado, filtroPrograma, filtroTipo]);

  // Función para cargar proyectos
  const loadProyectos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/proyectos/alumno/${id}`);
      setProyectos(response.data);
    } catch (error) {
      console.error('Error loading proyectos:', error);
      setError(`Error al cargar proyectos: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar programas
  const loadProgramas = async () => {
    try {
      const response = await api.get('/programas');
      setProgramas(response.data);
    } catch (error) {
      console.error('Error loading programas:', error);
    }
  };

  // Obtener el tipo de proyecto permitido para un programa
  const getProgramaTipoPermitido = (programaId) => {
    if (!programaId) return null;
    
    const proyectosDelPrograma = proyectos.filter(p => p.programaId === programaId);
    if (proyectosDelPrograma.length === 0) return null;
    
    // Retorna el tipo del primer proyecto del programa
    return proyectosDelPrograma[0].tipo;
  };

  // Obtener tipos de proyecto disponibles según el programa seleccionado
  const getTiposDisponibles = (programaId, isEditing = false, currentProyecto = null) => {
    // Si no hay programa seleccionado, todos los tipos están disponibles
    if (!programaId) return tiposProyecto;
    
    const tipoPermitido = getProgramaTipoPermitido(programaId);
    
    // Si es edición y es el mismo proyecto, permitir el tipo actual
    if (isEditing && currentProyecto && currentProyecto.programaId === programaId) {
      return tiposProyecto.filter(tipo => tipo.value === currentProyecto.tipo || !tipoPermitido);
    }
    
    // Si no hay tipo permitido aún, todos están disponibles (primer proyecto)
    if (!tipoPermitido) return tiposProyecto;
    
    // Si ya hay un tipo permitido, solo ese tipo está disponible
    return tiposProyecto.filter(tipo => tipo.value === tipoPermitido);
  };

  // Validar si se puede cambiar el tipo de proyecto
  const puedeChangiarTipo = (programaId, nuevoTipo, proyectoActual = null) => {
    if (!programaId) return true;
    
    const tipoPermitido = getProgramaTipoPermitido(programaId);
    if (!tipoPermitido) return true;
    
    // Si es el mismo proyecto que estableció el tipo, puede mantenerlo
    if (proyectoActual && proyectoActual.programaId === programaId && proyectoActual.tipo === tipoPermitido) {
      return nuevoTipo === tipoPermitido;
    }
    
    return nuevoTipo === tipoPermitido;
  };

  // Manejar cambio de programa en formulario de creación
  const handleProgramaChange = (programaId, isEditing = false) => {
    const tiposDisponibles = getTiposDisponibles(programaId, isEditing);
    
    if (!isEditing) {
      // Para crear nuevo proyecto
      const tipoPermitido = getProgramaTipoPermitido(programaId);
      const nuevoTipo = tipoPermitido || tiposDisponibles[0]?.value || "";
      
      setNewProyecto(prev => ({
        ...prev,
        programaId: programaId || null,
        tipo: nuevoTipo
      }));

      // Mostrar alerta si el programa tiene restricción de tipo
      if (tipoPermitido && programaId) {
        const programa = programas.find(p => p.id === programaId);
        const tipoInfo = getTipoInfo(tipoPermitido);
        const proyectosCount = proyectos.filter(p => p.programaId === programaId).length;
        
        setError(null);
        setSuccess(`ℹ️ IMPORTANTE: El programa "${programa?.nombre}" está configurado para proyectos de tipo "${tipoInfo.label}". Actualmente tiene ${proyectosCount} proyecto(s) de este tipo. Se mantendrá la consistencia del programa.`);
        setTimeout(() => setSuccess(null), 8000);
      }
    }
  };

  // Manejar cambio de programa en edición
  const handleEditProgramaChange = (programaId) => {
    const tiposDisponibles = getTiposDisponibles(programaId, true, editProyecto);
    const tipoPermitido = getProgramaTipoPermitido(programaId);
    
    let nuevoTipo = editProyecto.tipo;
    
    // Si el tipo actual no está permitido en el nuevo programa, cambiar al permitido
    if (programaId && tipoPermitido && editProyecto.tipo !== tipoPermitido) {
      nuevoTipo = tipoPermitido;
      
      // Mostrar alerta de cambio automático
      const programa = programas.find(p => p.id === programaId);
      const tipoInfo = getTipoInfo(tipoPermitido);
      const proyectosCount = proyectos.filter(p => p.programaId === programaId).length;
      
      setError(null);
      setSuccess(`⚠️ CAMBIO AUTOMÁTICO: El programa "${programa?.nombre}" solo acepta proyectos de tipo "${tipoInfo.label}". El tipo se ha cambiado automáticamente para mantener la consistencia. El programa tiene ${proyectosCount} proyecto(s) relacionado(s).`);
      setTimeout(() => setSuccess(null), 10000);
    } else if (!programaId) {
      // Si se quita el programa, mantener el tipo actual
      nuevoTipo = editProyecto.tipo;
    }
    
    setEditProyecto(prev => ({
      ...prev,
      programaId: programaId || null,
      tipo: nuevoTipo
    }));
  };

  // Obtener información del tipo de proyecto
  const getTipoInfo = (tipo) => {
    return tiposProyecto.find(t => t.value === tipo) || tiposProyecto[0];
  };

  // Limpiar filtros
  const handleClearFilters = () => {
    setFiltroEstado("");
    setFiltroPrograma("");
    setFiltroTipo("");
  };

  // Obtener badge de estado
  const getEstadoBadge = (estado) => {
    const badges = {
      'Pendiente': 'secondary',
      'En Progreso': 'primary',
      'Completado': 'success',
      'Pausado': 'warning',
      'Cancelado': 'danger'
    };
    return badges[estado] || 'secondary';
  };


  // Editar proyecto
  const handleEditProyecto = (proyecto) => {
    setEditProyecto({ ...proyecto });
    setShowEditModal(true);
  };

  // Guardar cambios en proyecto
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    
    // Validar restricción de tipo por programa
    if (editProyecto.programaId && !puedeChangiarTipo(editProyecto.programaId, editProyecto.tipo, editProyecto)) {
      const tipoPermitido = getProgramaTipoPermitido(editProyecto.programaId);
      const tipoInfo = getTipoInfo(tipoPermitido);
      const programa = programas.find(p => p.id === editProyecto.programaId);
      setError(`❌ RESTRICCIÓN DE PROGRAMA: "${programa?.nombre}" solo acepta proyectos de tipo "${tipoInfo.label}". Por favor, reconsidere para mantener los proyectos relacionados o cambie de programa.`);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);

      const updatedData = {
        nombre: editProyecto.nombre,
        descripcion: editProyecto.descripcion,
        estado: editProyecto.estado,
        tipo: editProyecto.tipo,
        fechaInicio: editProyecto.fechaInicio,
        fechaFin: editProyecto.fechaFin,
        programaId: editProyecto.programaId
      };

      const response = await api.put(`/proyectos/${editProyecto.id}`, updatedData);

      setProyectos(proyectos.map(p =>
        p.id === editProyecto.id ? response.data : p
      ));
      
      setShowEditModal(false);
      setEditProyecto(null);
      setSuccess('Proyecto actualizado exitosamente');
      
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (error) {
      console.error('Error updating proyecto:', error);
      setError(`Error al actualizar proyecto: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar proyecto
  const handleDeleteProyecto = async (proyectoToDelete) => {
    if (!window.confirm(`¿Está seguro de que desea eliminar el proyecto "${proyectoToDelete.nombre}"?`)) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await api.delete(`/proyectos/${proyectoToDelete.id}`);

      setProyectos(proyectos.filter(p => p.id !== proyectoToDelete.id));
      setSuccess('Proyecto eliminado exitosamente');
      
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (error) {
      console.error('Error deleting proyecto:', error);
      setError(`Error al eliminar proyecto: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Obtener nombre del programa por ID
  const getProgramaNombre = (programaId) => {
    if (!programaId) return "Proyecto independiente";
    const programa = programas.find(p => p.id === programaId);
    return programa ? programa.nombre : 'Programa no encontrado';
  };

  return (
    <Container fluid className="proyectos-container py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="display-6 fw-bold mb-2">
                <i className="bi bi-folder me-3 text-success"></i>
                Gestión de Proyectos
              </h1>
              <p className="text-muted lead">Administra todos los proyectos del sistema</p>
            </div>
          </div>
        </Col>
      </Row>

      {/* Filtros */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Body className="py-3">
              <Row className="align-items-center">
                <Col lg={3}>
                  <div className="mb-3 mb-lg-0">
                    <label className="form-label mb-1 fw-semibold small">
                      <i className="bi bi-flag me-1"></i>
                      Estado
                    </label>
                    <select
                      className="form-select form-select-sm"
                      value={filtroEstado}
                      onChange={(e) => setFiltroEstado(e.target.value)}
                    >
                      <option value="">Todos</option>
                      <option value="Pendiente">Pendiente</option>
                      <option value="En Progreso">En Progreso</option>
                      <option value="Completado">Completado</option>
                      <option value="Pausado">Pausado</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  </div>
                </Col>
                <Col lg={3}>
                  <div className="mb-3 mb-lg-0">
                    <label className="form-label mb-1 fw-semibold small">
                      <i className="bi bi-tag me-1"></i>
                      Tipo de Proyecto
                    </label>
                    <select
                      className="form-select form-select-sm"
                      value={filtroTipo}
                      onChange={(e) => setFiltroTipo(e.target.value)}
                    >
                      <option value="">Todos los tipos</option>
                      {tiposProyecto.map(tipo => (
                        <option key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </Col>
                <Col lg={3}>
                  <div className="mb-3 mb-lg-0">
                    <label className="form-label mb-1 fw-semibold small">
                      <i className="bi bi-briefcase me-1"></i>
                      Programa
                    </label>
                    <select
                      className="form-select form-select-sm"
                      value={filtroPrograma}
                      onChange={(e) => setFiltroPrograma(e.target.value)}
                    >
                      <option value="">Todos</option>
                      <option value="sin-programa">Proyectos independientes</option>
                      {programas.map(programa => (
                        <option key={programa.id} value={programa.id}>
                          {programa.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </Col>
                <Col lg={3}>
                  <div className="d-flex gap-2 justify-content-end">
                    {(filtroEstado || filtroPrograma || filtroTipo) && (
                      <Button 
                        variant="outline-secondary"
                        size="sm"
                        onClick={handleClearFilters}
                        title="Limpiar filtros"
                      >
                        <i className="bi bi-x-lg me-1"></i>
                        Limpiar
                      </Button>
                    )}
                    <Badge bg="info" className="fs-6 py-2">
                      {proyectosFiltrados.length} de {proyectos.length}
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

      {/* Formulario de creación */}
      {showForm && (
        <Row className="mb-4">
          <Col>
            <Card className="shadow-sm">
              <Card.Header className="bg-success text-white">
                <h5 className="mb-0">
                  <i className="bi bi-plus-circle me-2"></i>
                  Crear Nuevo Proyecto
                </h5>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleCreateProyecto}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          <i className="bi bi-card-text me-1"></i>
                          Nombre del Proyecto *
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={newProyecto.nombre}
                          onChange={(e) => setNewProyecto({ ...newProyecto, nombre: e.target.value })}
                          placeholder="Ingrese el nombre del proyecto"
                          required
                          disabled={loading}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          <i className="bi bi-tag me-1"></i>
                          Tipo de Proyecto *
                          {newProyecto.programaId && getProgramaTipoPermitido(newProyecto.programaId) && (
                            <small className="text-warning d-block fw-bold">
                              <i className="bi bi-exclamation-triangle me-1"></i>
                              Restringido por programa
                            </small>
                          )}
                        </Form.Label>
                        <Form.Select
                          value={newProyecto.tipo}
                          onChange={(e) => setNewProyecto({ ...newProyecto, tipo: e.target.value })}
                          disabled={loading}
                          required
                        >
                          <option value="">Seleccione un tipo</option>
                          {getTiposDisponibles(newProyecto.programaId).map(tipo => (
                            <option key={tipo.value} value={tipo.value}>
                              {tipo.label}
                            </option>
                          ))}
                        </Form.Select>
                        {newProyecto.programaId && getProgramaTipoPermitido(newProyecto.programaId) && (
                          <Form.Text className="text-warning fw-bold">
                            <i className="bi bi-shield-exclamation me-1"></i>
                            Este programa solo acepta proyectos de tipo: "{getTipoInfo(getProgramaTipoPermitido(newProyecto.programaId)).label}"
                          </Form.Text>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          <i className="bi bi-flag me-1"></i>
                          Estado
                        </Form.Label>
                        <Form.Select
                          value={newProyecto.estado}
                          onChange={(e) => setNewProyecto({ ...newProyecto, estado: e.target.value })}
                          disabled={loading}
                        >
                          <option value="">Seleccione estado</option>
                          <option value="Pendiente">Pendiente</option>
                          <option value="En Progreso">En Progreso</option>
                          <option value="Completado">Completado</option>
                          <option value="Pausado">Pausado</option>
                          <option value="Cancelado">Cancelado</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          <i className="bi bi-calendar me-1"></i>
                          Fecha de Inicio
                        </Form.Label>
                        <Form.Control
                          type="date"
                          value={newProyecto.fechaInicio}
                          onChange={(e) => setNewProyecto({ ...newProyecto, fechaInicio: e.target.value })}
                          disabled={loading}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          <i className="bi bi-calendar-check me-1"></i>
                          Fecha de Fin
                        </Form.Label>
                        <Form.Control
                          type="date"
                          value={newProyecto.fechaFin}
                          onChange={(e) => setNewProyecto({ ...newProyecto, fechaFin: e.target.value })}
                          disabled={loading}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          <i className="bi bi-briefcase me-1"></i>
                          Programa
                        </Form.Label>
                        <Form.Select
                          value={newProyecto.programaId || ""}
                          onChange={(e) => handleProgramaChange(e.target.value)}
                          disabled={loading}
                        >
                          <option value="">Proyecto independiente</option>
                          {programas.map(programa => {
                            const tipoPermitido = getProgramaTipoPermitido(programa.id);
                            const proyectosCount = proyectos.filter(p => p.programaId === programa.id).length;
                            return (
                              <option key={programa.id} value={programa.id}>
                                {programa.nombre}
                                {tipoPermitido && ` (${getTipoInfo(tipoPermitido).label} - ${proyectosCount} proyectos)`}
                              </option>
                            );
                          })}
                        </Form.Select>
                        {newProyecto.programaId && getProgramaTipoPermitido(newProyecto.programaId) && (
                          <Form.Text className="text-info">
                            <i className="bi bi-info-circle me-1"></i>
                            Programa con {proyectos.filter(p => p.programaId === newProyecto.programaId).length} proyecto(s) relacionado(s)
                          </Form.Text>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                      <i className="bi bi-file-text me-1"></i>
                      Descripción
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={newProyecto.descripcion}
                      onChange={(e) => setNewProyecto({ ...newProyecto, descripcion: e.target.value })}
                      placeholder="Descripción del proyecto"
                      disabled={loading}
                    />
                  </Form.Group>

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
                          Guardar Proyecto
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
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Lista de proyectos */}
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-white border-0 p-4">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-folder2-open me-2 text-success"></i>
                  Proyectos Registrados
                </h5>
                <Badge bg="success" className="fs-6">
                  {proyectosFiltrados.length} proyecto{proyectosFiltrados.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              {loading && proyectosFiltrados.length === 0 ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="success" />
                  <p className="mt-3 text-muted">Cargando proyectos...</p>
                </div>
              ) : proyectosFiltrados.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-folder-x display-1 text-muted"></i>
                  <h5 className="mt-3 text-muted">No hay proyectos</h5>
                  <p className="text-muted">
                    {(filtroEstado || filtroPrograma || filtroTipo) 
                      ? 'No se encontraron proyectos con los filtros aplicados'
                      : 'Comience creando su primer proyecto'
                    }
                  </p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {proyectosFiltrados.map((proyecto) => {
                    const tipoInfo = getTipoInfo(proyecto.tipo);
                    return (
                      <div key={proyecto.id} className="list-group-item">
                        <Row className="align-items-center">
                          <Col md={7}>
                            <div className="d-flex align-items-start">
                              <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3">
                                <i className="bi bi-folder text-success fs-5"></i>
                              </div>
                              <div>
                                <h6 className="mb-1 fw-bold">{proyecto.nombre}</h6>
                                <p className="mb-1 text-muted small">
                                  {proyecto.descripcion || "Sin descripción"}
                                </p>
                                <div className="d-flex gap-2 flex-wrap">
                                  <Badge bg={getEstadoBadge(proyecto.estado)}>
                                    <i className="bi bi-flag me-1"></i>
                                    {proyecto.estado}
                                  </Badge>
                                  <Badge bg={tipoInfo.color}>
                                    <i className={`${tipoInfo.icon} me-1`}></i>
                                    {tipoInfo.label}
                                  </Badge>
                                  <Badge bg={proyecto.programaId ? "primary" : "secondary"}>
                                    <i className="bi bi-briefcase me-1"></i>
                                    {getProgramaNombre(proyecto.programaId)}
                                  </Badge>
                                  {proyecto.fechaInicio && (
                                    <small className="text-muted">
                                      <i className="bi bi-calendar me-1"></i>
                                      {new Date(proyecto.fechaInicio).toLocaleDateString('es-ES')}
                                    </small>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Col>
                          <Col md={5} className="text-end">
                            <div className="d-flex gap-2 justify-content-end">
                              <Button 
                                as={Link}
                                to={`/adminKanban/${proyecto.id}`}
                                variant="outline-success" 
                                size="sm"
                                title="Ver proyecto"
                              >
                                <i className="bi bi-eye me-1"></i>
                                Ver
                              </Button>
                              
                              <div className="btn-group">
                                <Button 
                                  variant="outline-warning" 
                                  size="sm" 
                                  onClick={() => handleEditProyecto(proyecto)}
                                  disabled={loading}
                                  title="Editar proyecto"
                                >
                                  <i className="bi bi-pencil"></i>
                                </Button>
                                <Button 
                                  variant="outline-danger" 
                                  size="sm" 
                                  onClick={() => handleDeleteProyecto(proyecto)}
                                  disabled={loading}
                                  title="Eliminar proyecto"
                                >
                                  <i className="bi bi-trash"></i>
                                </Button>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    );
                  })}
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
          setEditProyecto(null); 
        }} 
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-pencil-square me-2"></i>
            Editar Proyecto
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveEdit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Nombre del Proyecto *</Form.Label>
                  <Form.Control
                    type="text"
                    value={editProyecto?.nombre || ""}
                    onChange={(e) => setEditProyecto({ ...editProyecto, nombre: e.target.value })}
                    required
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    Tipo de Proyecto
                    {editProyecto?.programaId && getProgramaTipoPermitido(editProyecto.programaId) && (
                      <small className="text-warning d-block fw-bold">
                        <i className="bi bi-exclamation-triangle me-1"></i>
                        Restringido por programa
                      </small>
                    )}
                  </Form.Label>
                  <Form.Select
                    value={editProyecto?.tipo || ""}
                    onChange={(e) => setEditProyecto({ ...editProyecto, tipo: e.target.value })}
                    disabled={loading}
                  >
                    {getTiposDisponibles(editProyecto?.programaId, true, editProyecto).map(tipo => (
                      <option key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </option>
                    ))}
                  </Form.Select>
                  {editProyecto?.programaId && getProgramaTipoPermitido(editProyecto.programaId) && (
                    <Form.Text className="text-warning fw-bold">
                      <i className="bi bi-shield-exclamation me-1"></i>
                      Este programa solo acepta proyectos de tipo: "{getTipoInfo(getProgramaTipoPermitido(editProyecto.programaId)).label}"
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Estado</Form.Label>
                  <Form.Select
                    value={editProyecto?.estado || ""}
                    onChange={(e) => setEditProyecto({ ...editProyecto, estado: e.target.value })}
                    disabled={loading}
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="En Progreso">En Progreso</option>
                    <option value="Completado">Completado</option>
                    <option value="Pausado">Pausado</option>
                    <option value="Cancelado">Cancelado</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Fecha de Inicio</Form.Label>
                  <Form.Control
                    type="date"
                    value={editProyecto?.fechaInicio || ""}
                    onChange={(e) => setEditProyecto({ ...editProyecto, fechaInicio: e.target.value })}
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Fecha de Fin</Form.Label>
                  <Form.Control
                    type="date"
                    value={editProyecto?.fechaFin || ""}
                    onChange={(e) => setEditProyecto({ ...editProyecto, fechaFin: e.target.value })}
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Programa</Form.Label>
                  <Form.Select
                    value={editProyecto?.programaId || ""}
                    onChange={(e) => handleEditProgramaChange(e.target.value)}
                    disabled={loading}
                  >
                    <option value="">Proyecto independiente</option>
                    {programas.map(programa => {
                      const tipoPermitido = getProgramaTipoPermitido(programa.id);
                      const proyectosCount = proyectos.filter(p => p.programaId === programa.id).length;
                      return (
                        <option key={programa.id} value={programa.id}>
                          {programa.nombre}
                          {tipoPermitido && ` (${getTipoInfo(tipoPermitido).label} - ${proyectosCount} proyectos)`}
                        </option>
                      );
                    })}
                  </Form.Select>
                  {editProyecto?.programaId && getProgramaTipoPermitido(editProyecto.programaId) && (
                    <Form.Text className="text-info">
                      <i className="bi bi-info-circle me-1"></i>
                      Programa con {proyectos.filter(p => p.programaId === editProyecto.programaId).length} proyecto(s) relacionado(s)
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editProyecto?.descripcion || ""}
                onChange={(e) => setEditProyecto({ ...editProyecto, descripcion: e.target.value })}
                disabled={loading}
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button 
                variant="outline-secondary" 
                onClick={() => { 
                  setShowEditModal(false); 
                  setEditProyecto(null); 
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
    </Container>
  );
};

export default ListaProyectosAlumno;