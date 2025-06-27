import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    usuario: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [progress, setProgress] = useState(0);

  // Efecto para barra de progreso
  useEffect(() => {
    if (showSuccessModal) {
      const duration = 5000;
      const interval = 50;
      const step = (interval / duration) * 100;

      const timer = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + step;
          if (newProgress >= 100) {
            clearInterval(timer);
            setShowSuccessModal(false);
            setProgress(0);
            return 100;
          }
          return newProgress;
        });
      }, interval);

      return () => clearInterval(timer);
    }
  }, [showSuccessModal]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", formData);
      setShowSuccessModal(true);

      await new Promise((resolve) => setTimeout(resolve, 5000));
      const rol = response.data.rol;

      if (rol === "0") navigate("/superadmin");
      else if (rol === "1") navigate("/admin");
      else if (rol === "2") navigate("/alumno");
      else navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError("Credenciales incorrectas. Por favor intenta de nuevo.");
      } else {
        setError("Ocurrió un error inesperado. Intenta más tarde.");
      }
      console.error("Error en login:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
        rel="stylesheet"
      />

      <div className="gradient-bg"></div>
      <div className="main-content">
        <header className="header-custom text-white">
          <div className="container-fluid py-4">
            <div className="row">
              <div className="col">
                <h1 className="h4 fw-bold mb-0">RutaDTAI</h1>
              </div>
            </div>
          </div>
        </header>

        <div
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: "calc(100vh - 120px)", padding: "2rem 1rem" }}
        >
          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-sm-10 col-md-8 col-lg-4 col-xl-4">
                <div className="card card-custom shadow-lg">
                  <div className="card-body p-4">
                    <h3 className="card-title text-center text-primary-custom mb-4 fw-bold">
                      Bienvenido a tu gestor de proyectos
                    </h3>

                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label htmlFor="usuario" className="form-label">
                          Usuario
                        </label>
                        <input
                          id="usuario"
                          type="text"
                          name="usuario"
                          value={formData.usuario}
                          onChange={handleInputChange}
                          className="form-control"
                          required
                          placeholder="Ingresa tu usuario"
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                          Contraseña
                        </label>
                        <input
                          id="password"
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="form-control"
                          required
                          placeholder="Ingresa tu contraseña"
                        />
                      </div>

                      {error && (
                        <div className="alert alert-danger py-2 mb-3">
                          <small>{error}</small>
                        </div>
                      )}

                      <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Ingresando...
                          </>
                        ) : (
                          "Ingresar"
                        )}
                      </button>
                    </form>

                    <div className="text-center mt-4">
                      <p className="text-secondary">
                        ¿No tienes cuenta?{" "}
                        <a href="#" className="fw-medium">
                          Regístrate aquí
                        </a>
                      </p>
                    </div>

                    <div className="alert alert-info mt-4 mb-0">
                      <p className="fw-medium mb-2 text-secondary">
                        Credenciales de prueba:
                      </p>
                      <small className="d-block">Usuario: admin</small>
                      <small className="d-block">Contraseña: 123456</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="progress-bar-container">
              <div
                className="progress-bar"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="modal-body">
              <div className="success-icon">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="modal-title">¡Inicio de sesión exitoso!</h3>
              <p className="modal-text">
                Bienvenido a RutaDTAI. Serás redirigido al panel principal en
                unos momentos.
              </p>
              <p className="countdown-text">
                Redirigiendo en {Math.ceil((100 - progress) / 20)} segundos...
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
