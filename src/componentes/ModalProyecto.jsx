import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModalProyecto = ({ show, onHide, onSubmit, formData, onChange, editing }) => {
  return (
    <Modal show={show} onHide={onHide} centered size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{editing ? "Editar Proyecto" : "Agregar Proyecto"}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body className="py-4 px-5">
          <Form.Group className="mb-3" controlId="nombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={formData.nombre || ""}
              onChange={onChange}
              required
              autoFocus
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="tipo">
            <Form.Label>Tipo</Form.Label>
            <Form.Select
              name="tipo"
              value={formData.tipo || ""}
              onChange={onChange}
              required
            >
              <option value="">Seleccione tipo</option>
              <option>Proyecto Estratégico</option>
              <option>Proyecto Operativo</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="participantes">
            <Form.Label>Participantes</Form.Label>
            <Form.Control
              type="number"
              name="participantes"
              min="0"
              value={formData.participantes || ""}
              onChange={onChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="estado">
            <Form.Label>Estado</Form.Label>
            <Form.Select
              name="estado"
              value={formData.estado || "En progreso"}
              onChange={onChange}
              required
            >
              <option>En progreso</option>
              <option>Finalizado</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="prioridad">
            <Form.Label>Prioridad</Form.Label>
            <Form.Select
              name="prioridad"
              value={formData.prioridad || "Media"}
              onChange={onChange}
              required
            >
              <option>Alta</option>
              <option>Media</option>
              <option>Baja</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="inicio">
            <Form.Label>Fecha de Inicio</Form.Label>
            <Form.Control
              type="date"
              name="inicio"
              value={formData.inicio || ""}
              onChange={onChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="fin">
            <Form.Label>Fecha de Fin</Form.Label>
            <Form.Control
              type="date"
              name="fin"
              value={formData.fin || ""}
              onChange={onChange}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="py-3 px-5">
          <Button variant="secondary" onClick={onHide}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            {editing ? "Guardar cambios" : "Agregar"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalProyecto;
