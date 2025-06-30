import React from "react";
import "./Alumno.css";

const Alumno = () => {
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

      <div className="container alumno-container mt-5">
        <h2>Panel de Alumno</h2>
        <p>Accede solo a sus proyectos y tareas.</p>
      </div>
    </>
  );
};

export default Alumno;
