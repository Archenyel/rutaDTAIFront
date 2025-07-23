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
      const duration = 4000;
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

      localStorage.setItem("userRole", rol);
      localStorage.setItem("userId", response.data.id);
      localStorage.setItem("userName", response.data.usuario);

      if (rol === "0") navigate("/dashboardSuperadmin");
      else if (rol === "1") navigate("/dashboardAdmin");
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
      <div className="gradient-bg"></div>
      <div className="main-content">
        <header className="header-custom">
          <div className="container-fluid py-3">
            <div className="row">
              <div className="col">
                <h1 className="brand-title">RutaDTAI</h1>
              </div>
            </div>
          </div>
        </header>

        <div className="login-container">
          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-sm-10 col-md-8 col-lg-5 col-xl-4">
                <div className="login-card">
                  <div className="card-body-custom">
                    <h2 className="login-title">
                      Bienvenido a tu gestor de proyectos
                    </h2>

                    <form onSubmit={handleSubmit}>
                      <div className="form-group-custom">
                        <label htmlFor="usuario" className="form-label-custom">
                          Usuario
                        </label>
                        <input
                          id="usuario"
                          type="text"
                          name="usuario"
                          value={formData.usuario}
                          onChange={handleInputChange}
                          className="form-input-custom"
                          required
                          placeholder="Ingresa tu usuario"
                        />
                      </div>

                      <div className="form-group-custom">
                        <label htmlFor="password" className="form-label-custom">
                          Contraseña
                        </label>
                        <input
                          id="password"
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="form-input-custom"
                          required
                          placeholder="Ingresa tu contraseña"
                        />
                      </div>

                      {error && (
                        <div className="error-alert">
                          <small>{error}</small>
                        </div>
                      )}

                      <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="loading-spinner"></span>
                            Ingresando...
                          </>
                        ) : (
                          "Ingresar"
                        )}
                      </button>
                    </form>

                    <div className="register-link">
                      <p>
                        ¿No tienes cuenta?{" "}
                        <a href="/Registro" className="link-custom">
                          Regístrate aquí
                        </a>
                      </p>
                    </div>

                    <div className="test-credentials">
  <p className="credentials-title">
    Credenciales de prueba:
  </p>
  <div className="credentials-group">
    <p className="credential-role">SuperAdmin:</p>
    <p className="credential-item">Usuario: superadmin | Contraseña: 1234</p>
  </div>
  <div className="credentials-group">
    <p className="credential-role">Admin:</p>
    <p className="credential-item">Usuario: admin | Contraseña: 1234</p>
  </div>
  <div className="credentials-group">
    <p className="credential-role">Alumno:</p>
    <p className="credential-item">Usuario: usuario | Contraseña: 1234</p>
  </div>
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
          <div className="success-modal">
            <div className="progress-bar-container">
              <div
                className="progress-bar"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="modal-body-custom">
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