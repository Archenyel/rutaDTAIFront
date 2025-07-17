import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  ProgressBar,
  Badge,
  ListGroup,
  Alert,
  Nav,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useParams, Link } from "react-router-dom";
import "./Proyecto.css";

const Proyecto = () => {
  const { id } = useParams();
  const [activePhase, setActivePhase] = useState("inicio");
  const [uploadingId, setUploadingId] = useState(null);
  const [uploadSuccessId, setUploadSuccessId] = useState(null);
  const [file, setFile] = useState(null);
  const [theme, setTheme] = useState("light");
  const [fileError, setFileError] = useState(null);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-bs-theme", savedTheme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
  }, [theme]);

  const proyecto = {
    id: id,
    nombre: `Proyecto ${id}`,
    descripcion: "Descripción detallada del proyecto",
    progreso: 63,
    estado: "En progreso",
    color: "primary",
    fechas: {
      inicio: "2025-01-15",
      fin: "2025-08-30",
    },
    fases: [
      { id: "inicio", nombre: "Inicio", completado: true },
      { id: "planeacion", nombre: "Planeación", completado: false },
      { id: "ejecucion", nombre: "Ejecución", completado: false },
      { id: "control", nombre: "Rendimiento y Control", completado: false },
      { id: "cierre", nombre: "Cierre", completado: false },
    ],
  };

  const [documentosFases, setDocumentosFases] = useState({
    inicio: [
      { id: 1, nombre: "Definición del Proyecto", subido: true, urgente: false },
      { id: 2, nombre: "Acta de Constitutiva", subido: true, urgente: false },
    ],
    planeacion: [
      { id: 4, nombre: "Requerimientos funcionales", subido: true, urgente: false },
      { id: 5, nombre: "Requerimientos no funcionales", subido: false, urgente: true },
      { id: 6, nombre: "Cronograma", subido: false, urgente: false },
    ],
    ejecucion: [
      { id: 7, nombre: "Informe de avance 1", subido: false, urgente: false },
      { id: 8, nombre: "Informe de avance 2", subido: false, urgente: false },
      { id: 9, nombre: "Informe de avance 3", subido: false, urgente: false },
    ],
    control: [
      { id: 10, nombre: "Informes de pruebas", subido: false, urgente: false },
      { id: 11, nombre: "Informes de desempeño", subido: false, urgente: false },
    ],
    cierre: [
      { id: 12, nombre: "Informe final", subido: false, urgente: false },
    ],
  });

  const handleFileChange = (e, docId) => {
    const selectedFile = e.target.files[0];
    setFileError(null);

    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setFileError("Solo se permiten archivos PDF");
        e.target.value = ''; 
        setFile(null);
        return;
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (selectedFile.size > maxSize) {
        setFileError("El archivo no debe exceder los 5MB");
        e.target.value = '';
        setFile(null);
        return;
      }

      setFile({ file: selectedFile, docId });
    }
  };

  const handleSubmit = (docId) => {
    if (!file || file.docId !== docId) return;
    if (fileError) return;

    setUploadingId(docId);
    
    setTimeout(() => {
      setUploadingId(null);
      setUploadSuccessId(docId);
      
      setDocumentosFases(prev => {
        const updated = {...prev};
        Object.keys(updated).forEach(fase => {
          updated[fase] = updated[fase].map(doc => 
            doc.id === docId ? {...doc, subido: true} : doc
          );
        });
        return updated;
      });

      setFile(null);
      document.getElementById(`file-input-${docId}`).value = '';
    }, 1500);
  };

  return (
    <>
      <button
        className="btn btn-outline-secondary position-fixed theme-toggle"
        onClick={toggleTheme}
        aria-label="Cambiar tema"
        title={theme === "light" ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
      >
        <i
          className={`bi ${
            theme === "light" ? "bi-moon-stars-fill" : "bi-sun-fill"
          } theme-icon`}
        ></i>
      </button>

      <Container fluid className="proyecto-container pb-5">
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="proyecto-title">
                  {proyecto.nombre}
                  <Badge bg={proyecto.color} className="ms-2 status-badge">
                    {proyecto.estado}
                  </Badge>
                </h1>
                <p className="proyecto-description">{proyecto.descripcion}</p>
              </div>
              <div className="proyecto-dates">
                <div>
                  <span className="date-label">Inicio:</span> {proyecto.fechas.inicio}
                </div>
                <div>
                  <span className="date-label">Fin:</span> {proyecto.fechas.fin}
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <div className="progress-container">
              <div className="d-flex justify-content-between mb-2">
                <span>Progreso general </span>
                <span> {proyecto.progreso}%</span>
              </div>
              <ProgressBar
                now={proyecto.progreso}
                variant={proyecto.color}
                className="custom-progress-bar"
              />
            </div>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <Card className="phases-card">
              <Card.Header className="bg-white border-0 p-0">
                <Nav
                  variant="tabs"
                  activeKey={activePhase}
                  onSelect={(key) => setActivePhase(key)}
                >
                  {proyecto.fases.map((fase) => (
                    <Nav.Item key={fase.id}>
                      <Nav.Link
                        eventKey={fase.id}
                        className={`text-capitalize ${fase.completado ? "text-success" : ""}`}
                      >
                        <i
                          className={`bi ${fase.completado ? "bi-check-circle-fill" : "bi-circle"} me-2`}
                        ></i>
                        {fase.nombre}
                      </Nav.Link>
                    </Nav.Item>
                  ))}
                </Nav>
              </Card.Header>
              <Card.Body>
                <h5 className="section-title">Documentación - Fase de {proyecto.fases.find(f => f.id === activePhase)?.nombre}</h5>
                
                <ListGroup variant="flush" className="documents-list">
                  {documentosFases[activePhase]?.map((doc) => (
                    <ListGroup.Item key={doc.id} className="document-item">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <div className={`status-indicator ${doc.subido ? 'subido' : doc.urgente ? 'urgente' : 'pendiente'}`}></div>
                          <div>
                            <div className="document-name">{doc.nombre}</div>
                            <div className="document-status">
                              {doc.subido ? (
                                <span className="text-success">
                                  <i className="bi bi-check-circle-fill me-1"></i>
                                  Subido
                                </span>
                              ) : (
                                <span className={doc.urgente ? "text-danger" : "text-warning"}>
                                  <i className="bi bi-exclamation-triangle-fill me-1"></i>
                                  {doc.urgente ? "Urgente" : "Pendiente"}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {!doc.subido && (
                          <div className="document-upload-container">
                            <Form.Group controlId={`formFile-${doc.id}`} className="mb-0">
                              <Form.Control
                                id={`file-input-${doc.id}`}
                                type="file"
                                onChange={(e) => handleFileChange(e, doc.id)}
                                className="file-input"
                                style={{ display: 'none' }}
                                accept=".pdf,application/pdf" // Solo acepta PDFs
                              />
                              <Button
                                variant={file?.docId === doc.id ? "success" : "outline-primary"}
                                size="sm"
                                className="upload-btn"
                                onClick={() => file?.docId === doc.id ? handleSubmit(doc.id) : document.getElementById(`file-input-${doc.id}`).click()}
                                disabled={uploadingId === doc.id || fileError}
                              >
                                {uploadingId === doc.id ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-1"></span>
                                    Subiendo...
                                  </>
                                ) : file?.docId === doc.id ? (
                                  <>
                                    <i className="bi bi-cloud-arrow-up me-1"></i>
                                    Confirmar
                                  </>
                                ) : (
                                  <>
                                    <i className="bi bi-cloud-arrow-up me-1"></i>
                                    Subir
                                  </>
                                )}
                              </Button>
                            </Form.Group>
                            {file?.docId === doc.id && (
                              <div className="file-selected mt-2">
                                <i className="bi bi-file-earmark-pdf me-2"></i>
                                {file.file.name}
                              </div>
                            )}
                            {fileError && file?.docId === doc.id && (
                              <Alert variant="danger" className="mt-2 upload-alert" dismissible onClose={() => setFileError(null)}>
                                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                {fileError}
                              </Alert>
                            )}
                            {uploadSuccessId === doc.id && (
                              <Alert variant="success" className="mt-2 upload-alert" dismissible onClose={() => setUploadSuccessId(null)}>
                                <i className="bi bi-check-circle-fill me-2"></i>
                                Documento subido correctamente!
                              </Alert>
                            )}
                          </div>
                        )}
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Proyecto;