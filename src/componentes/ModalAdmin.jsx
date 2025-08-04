import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModalAdmin = ({ show, onHide, onSubmit, formData, onChange, editing }) => {
  return (
    <Modal show={show} onHide={onHide} centered size="md" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{editing ? "Editar Administrador" : "Agregar Administrador"}</Modal.Title>
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

          <Form.Group className="mb-3" controlId="proyectos">
            <Form.Label>Proyectos Asignados</Form.Label>
            <Form.Control
              type="number"
              name="proyectos"
              min="0"
              value={formData.proyectos || ""}
              onChange={onChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="estado">
            <Form.Label>Estado</Form.Label>
            <Form.Select
              name="estado"
              value={formData.estado || "Activo"}
              onChange={onChange}
              required
            >
              <option>Activo</option>
              <option>Inactivo</option>
            </Form.Select>
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

export default ModalAdmin;
