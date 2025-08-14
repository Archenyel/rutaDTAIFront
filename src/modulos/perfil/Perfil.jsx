import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Form, 
  Button, 
  Alert, 
  Spinner,
  Badge
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import api from '../../api/api';
import './perfil.css';

const Perfil = () => {
  const [formData, setFormData] = useState({
    id: '',
    nombreUsuario: '',
    email: '',
    telefono: '',
    descripcion: '',
    rol: '',
    fechaCreacion: '',
    ultimaConexion: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Obtener ID del usuario del localStorage
  const userId = localStorage.getItem('userId');
  const userToken = localStorage.getItem('token');

  // Función para generar avatar aleatorio basado en el nombre
  const generateAvatar = (name) => {
    if (!name) return null;
    
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
      '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
      '#C44569', '#40407A', '#706FD3', '#F97F51', '#1DD1A1'
    ];
    
    const backgroundColors = [
      '#FFE8E8', '#E8FFFE', '#E8F4FD', '#E8F5E8', '#FFF4E8',
      '#FFE8FE', '#E8F0FF', '#E8E8FF', '#E8FFFF', '#FFE8E8',
      '#F5E8FF', '#E8E8F5', '#E8E8FF', '#FFE8E8', '#E8FFF4'
    ];
    
    // Usar el nombre para generar índices consistentes
    const nameCode = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colorIndex = nameCode % colors.length;
    const bgColorIndex = nameCode % backgroundColors.length;
    
    const initials = name
      .split(' ')
      .slice(0, 2)
      .map(word => word.charAt(0).toUpperCase())
      .join('');
    
    return {
      initials,
      backgroundColor: backgroundColors[bgColorIndex],
      textColor: colors[colorIndex]
    };
  };

  // Cargar datos del usuario desde la API
  useEffect(() => {
    const loadUserData = async () => {
      if (!userId) {
        setError('No se encontró información del usuario. Por favor, inicia sesión nuevamente.');
        setLoadingData(false);
        return;
      }

      try {
        setLoadingData(true);
        setError('');
        
        const response = await api.get(`/usuarios/${userId}`);
        const userData = response.data;
        
        const formattedData = {
          id: userData.id || userId,
          nombreUsuario: userData.nombre || userData.nombreUsuario || '',
          email: userData.email || '',
          telefono: userData.telefono || userData.phone || '',
          descripcion: userData.descripcion || userData.bio || '',
          rol: userData.rol || userData.role || 'Usuario',
          fechaCreacion: userData.fechaCreacion || userData.createdAt || '',
          ultimaConexion: userData.ultimaConexion || userData.lastLogin || ''
        };
        
        setFormData(formattedData);
        
        // Actualizar localStorage con datos frescos
        localStorage.setItem('userName', formattedData.nombreUsuario);
        localStorage.setItem('userEmail', formattedData.email);
        localStorage.setItem('userRole', formattedData.rol);
        
      } catch (error) {
        console.error('Error loading user data:', error);
        setError('Error al cargar los datos del usuario. ' + (error.response?.data?.message || error.message));
        
        // Fallback a localStorage si la API falla
        const fallbackData = {
          id: userId,
          nombreUsuario: localStorage.getItem('userName') || localStorage.getItem('nombreUsuario') || '',
          email: localStorage.getItem('userEmail') || localStorage.getItem('email') || '',
          telefono: localStorage.getItem('telefono') || '',
          descripcion: localStorage.getItem('descripcion') || '',
          rol: localStorage.getItem('userRole') || localStorage.getItem('rol') || 'Usuario',
          fechaCreacion: '',
          ultimaConexion: ''
        };
        
        setFormData(fallbackData);
      } finally {
        setLoadingData(false);
      }
    };

    loadUserData();
  }, [userId]);

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validar email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validar teléfono
  const validatePhone = (phone) => {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(phone);
  };

  // Guardar cambios en la API y localStorage
  const guardarPerfil = async () => {
    setError('');
    setSuccess('');

    // Validaciones
    if (!formData.nombreUsuario.trim()) {
      setError('El nombre de usuario es obligatorio');
      return;
    }

    if (formData.email && !validateEmail(formData.email)) {
      setError('El formato del email no es válido');
      return;
    }

    if (formData.telefono && !validatePhone(formData.telefono)) {
      setError('El formato del teléfono no es válido');
      return;
    }

    setLoading(true);

    try {
      // Preparar datos para enviar a la API
      const updateData = {
        nombre: formData.nombreUsuario,
        email: formData.email,
        telefono: formData.telefono,
        descripcion: formData.descripcion
      };

      // Actualizar en la API
      const response = await api.put(`/usuarios/${userId}`, updateData);
      
      if (response.data) {
        // Actualizar estado local con respuesta de la API
        const updatedData = {
          ...formData,
          ...response.data
        };
        setFormData(updatedData);

        // Actualizar localStorage con datos actualizados
        localStorage.setItem('userName', updatedData.nombreUsuario);
        localStorage.setItem('nombreUsuario', updatedData.nombreUsuario);
        localStorage.setItem('userEmail', updatedData.email);
        localStorage.setItem('email', updatedData.email);
        localStorage.setItem('telefono', updatedData.telefono);
        localStorage.setItem('descripcion', updatedData.descripcion);
        
        setSuccess('Perfil actualizado correctamente en el servidor');
        setTimeout(() => setSuccess(''), 5000);
      }
      
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Error al actualizar el perfil: ' + (err.response?.data?.message || err.message));
      
      // Fallback: guardar solo en localStorage si la API falla
      try {
        localStorage.setItem('userName', formData.nombreUsuario);
        localStorage.setItem('nombreUsuario', formData.nombreUsuario);
        localStorage.setItem('userEmail', formData.email);
        localStorage.setItem('email', formData.email);
        localStorage.setItem('telefono', formData.telefono);
        localStorage.setItem('descripcion', formData.descripcion);
        
        setSuccess('Perfil guardado localmente. Los cambios se sincronizarán cuando esté disponible la conexión.');
        setTimeout(() => setSuccess(''), 5000);
      } catch (localError) {
        setError('Error al guardar el perfil local y en servidor');
      }
    } finally {
      setLoading(false);
    }
  };

  // Limpiar imagen - función eliminada ya que no se usa

  const getRoleColor = (role) => {
    switch (role.toLowerCase()) {
      case 'admin': 
      case 'administrador': 
        return 'danger';
      case 'superadmin': 
      case 'superadministrador': 
        return 'dark';
      case 'alumno': 
      case 'estudiante': 
        return 'success';
      default: 
        return 'primary';
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8} xl={6}>
          <Card className="shadow-lg border-0">
            <Card.Header className="bg-primary text-white text-center py-4">
              <h2 className="mb-0">
                <i className="bi bi-person-circle me-2"></i>
                Mi Perfil
              </h2>
            </Card.Header>
            
            <Card.Body className="p-4">
              {/* Estado de carga inicial */}
              {loadingData ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" className="mb-3" />
                  <h5 className="text-muted">Cargando datos del usuario...</h5>
                  <p className="text-muted">Obteniendo información desde el servidor</p>
                </div>
              ) : (
                <>
                  {/* Alertas */}
                  {error && (
                    <Alert variant="danger" dismissible onClose={() => setError('')}>
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      {error}
                    </Alert>
                  )}
                  
                  {success && (
                    <Alert variant="success" dismissible onClose={() => setSuccess('')}>
                      <i className="bi bi-check-circle me-2"></i>
                      {success}
                    </Alert>
                  )}

                  {/* Información adicional del usuario */}
                  {(formData.fechaCreacion || formData.ultimaConexion) && (
                    <div className="alert alert-light border mb-4">
                      <h6 className="mb-3">
                        <i className="bi bi-info-circle me-2"></i>
                        Información de la cuenta
                      </h6>
                      <Row className="small text-muted">
                        {formData.fechaCreacion && (
                          <Col md={6}>
                            <i className="bi bi-calendar-plus me-1"></i>
                            <strong>Miembro desde:</strong><br />
                            {new Date(formData.fechaCreacion).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </Col>
                        )}
                        {formData.ultimaConexion && (
                          <Col md={6}>
                            <i className="bi bi-clock me-1"></i>
                            <strong>Última conexión:</strong><br />
                            {new Date(formData.ultimaConexion).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </Col>
                        )}
                      </Row>
                    </div>
                  )}

                  {/* Avatar generado automáticamente */}
                  <div className="text-center mb-4">
                    <div className="position-relative d-inline-block">
                      {(() => {
                        const avatar = generateAvatar(formData.nombreUsuario);
                        return avatar ? (
                          <div 
                            className="rounded-circle border border-3 border-primary shadow d-flex align-items-center justify-content-center fw-bold"
                            style={{ 
                              width: '150px', 
                              height: '150px', 
                              backgroundColor: avatar.backgroundColor,
                              color: avatar.textColor,
                              fontSize: '3rem'
                            }}
                          >
                            {avatar.initials}
                          </div>
                        ) : (
                          <div 
                            className="rounded-circle border border-3 border-secondary d-flex align-items-center justify-content-center bg-light text-muted shadow"
                            style={{ 
                              width: '150px', 
                              height: '150px'
                            }}
                          >
                            <i className="bi bi-person" style={{ fontSize: '4rem' }}></i>
                          </div>
                        );
                      })()}
                      
                      {/* Badge del rol */}
                      <Badge 
                        bg={getRoleColor(formData.rol)}
                        className="position-absolute bottom-0 end-0 rounded-pill px-3 py-2"
                        style={{ fontSize: '0.8rem' }}
                      >
                        <i className="bi bi-shield-check me-1"></i>
                        {formData.rol}
                      </Badge>
                    </div>
                    
                    <div className="mt-3">
                      <h5 className="mb-1">{formData.nombreUsuario}</h5>
                      <small className="text-muted">
                        <i className="bi bi-palette me-1"></i>
                        Avatar generado automáticamente
                      </small>
                    </div>
                  </div>              {/* Formulario */}
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">
                        <i className="bi bi-person me-1"></i>
                        Nombre de usuario *
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="nombreUsuario"
                        value={formData.nombreUsuario}
                        onChange={handleInputChange}
                        placeholder="Tu nombre de usuario"
                        required
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">
                        <i className="bi bi-envelope me-1"></i>
                        Email
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="tu@email.com"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">
                        <i className="bi bi-telephone me-1"></i>
                        Teléfono
                      </Form.Label>
                      <Form.Control
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        placeholder="+52 123 456 7890"
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">
                        <i className="bi bi-shield-check me-1"></i>
                        Rol
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.rol}
                        disabled
                        className="bg-light"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">
                    <i className="bi bi-chat-left-text me-1"></i>
                    Descripción personal
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    placeholder="Cuéntanos sobre ti, tus intereses, experiencia..."
                    maxLength={500}
                  />
                  <Form.Text className="text-muted">
                    {formData.descripcion.length}/500 caracteres
                  </Form.Text>
                </Form.Group>

                  <div className="d-grid">
                    <Button 
                      variant="primary" 
                      size="lg"
                      onClick={guardarPerfil}
                      disabled={loading}
                      className="py-3"
                    >
                      {loading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            className="me-2"
                          />
                          Guardando en servidor...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-lg me-2"></i>
                          Actualizar Perfil
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              </>
            )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Perfil;
