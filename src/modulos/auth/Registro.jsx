import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Registro.css";
import api from "../../api/api";

const Registro = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showTerms, setShowTerms] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // Estados para mostrar/ocultar contraseña
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    usuario: "",
    password: "",
    confirmPassword: "",
    matricula: "",
    carrera: "Ingeniería en Desarrollo y Gestión de Software",
    cuatrimestre: "",
    aceptaTerminos: false,
  });

  const [errors, setErrors] = useState({});

  const validatePassword = (pwd) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(pwd);

  const validateUsername = (usr) => /^[a-zA-Z0-9_]{1,20}$/.test(usr);

  useEffect(() => {
    if (showSuccessModal) {
      const duration = 4000;
      const interval = 50;
      const stepProgress = (interval / duration) * 100;

      const timer = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + stepProgress;
          if (newProgress >= 100) {
            clearInterval(timer);
            setShowSuccessModal(false);
            setProgress(0);
            navigate("/");
            return 100;
          }
          return newProgress;
        });
      }, interval);

      return () => clearInterval(timer);
    }
  }, [showSuccessModal, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "nombre" || name === "apellidos") {
      const upperValue = value.toUpperCase();
      setFormData((prev) => ({ ...prev, [name]: upperValue }));
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
      return;
    }

    if (name === "matricula") {
      const onlyNumbers = value.replace(/\D/g, "");
      if (onlyNumbers.length > 10) return;
      setFormData((prev) => ({ ...prev, matricula: onlyNumbers }));
      if (errors.matricula) setErrors((prev) => ({ ...prev, matricula: undefined }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateStep = () => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.nombre.trim()) newErrors.nombre = "Campo obligatorio.";
      if (!formData.apellidos.trim()) newErrors.apellidos = "Campo obligatorio.";

      const emailTrimmed = formData.email.trim();

      if (!emailTrimmed) {
        newErrors.email = "Campo obligatorio.";
      } else {
        const emailPattern = /^[^\s@]+@uteq\.edu\.mx$/;
        if (!emailPattern.test(emailTrimmed)) {
          newErrors.email = "Error, comprueba que tu correo este bien escrito.";
        }
      }
    } else if (step === 2) {
      if (!formData.usuario.trim()) {
        newErrors.usuario = "Campo obligatorio.";
      } else if (!validateUsername(formData.usuario)) {
        newErrors.usuario =
          "Máx. 20 caracteres, solo letras, números o guión bajo.";
      }

      if (!formData.password.trim()) {
        newErrors.password = "Campo obligatorio.";
      } else if (!validatePassword(formData.password)) {
        newErrors.password =
          "Min. 8 caracteres, 1 mayúscula, 1 minúscula y 1 número.";
      }

      if (!formData.confirmPassword.trim()) {
        newErrors.confirmPassword = "Campo obligatorio.";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Las contraseñas no coinciden.";
      }
    } else if (step === 3) {
      if (!formData.matricula.trim()) newErrors.matricula = "Campo obligatorio.";
      if (!formData.cuatrimestre.trim()) newErrors.cuatrimestre = "Campo obligatorio.";
      if (!formData.aceptaTerminos) {
        newErrors.aceptaTerminos = "Debes aceptar los términos.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setIsLoading(true);
    setApiError("");

    try {
      const registroData = {
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        email: formData.email,
        usuario: formData.usuario,
        password: formData.password,
        matricula: formData.matricula,
        carrera: formData.carrera,
        cuatrimestre: formData.cuatrimestre,
      };

      const response = await api.post("auth/registro/alumnos", registroData);

      if (response.status === 200 || response.status === 201) {
        setShowSuccessModal(true);
      } else {
        setApiError("Error en el registro. Por favor, inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Error en el registro:", error);

      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          "Error en el servidor. Por favor, inténtalo de nuevo.";
        setApiError(errorMessage);
      } else if (error.request) {
        setApiError(
          "No se pudo conectar con el servidor. Verifica tu conexión a internet."
        );
      } else {
        setApiError("Error inesperado. Por favor, inténtalo de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const openTerms = (e) => {
    e.preventDefault();
    setShowTerms(true);
  };

  const closeTerms = () => setShowTerms(false);

  const opcionesCarrera = [
    "Ingeniería en Desarrollo y Gestión de Software",
    "TSU en Tecnologías de la Información Área Desarrollo de Software Multiplataforma",
  ];

  const opcionesCuatrimestre = [
    "1er cuatrimestre",
    "2do cuatrimestre",
    "3er cuatrimestre",
    "4to cuatrimestre",
    "5to cuatrimestre",
    "6to cuatrimestre",
    "7mo cuatrimestre",
    "8vo cuatrimestre",
    "9no cuatrimestre",
    "10mo cuatrimestre",
    "11vo cuatrimestre",
  ];

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

        <div className="registro-container">
          <h2 className="registro-title">Registro UTEQ – RutaDTAI</h2>

          <div className="registro-step-indicator">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className={`registro-step-circle ${step === n ? "active" : ""}`}
              >
                {n}
              </div>
            ))}
          </div>

          <form className="registro-form" onSubmit={handleSubmit}>
            {/* Paso 1 */}
            {step === 1 && (
              <>
                <label>Nombre:</label>
                <input
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                />
                {errors.nombre && (
                  <div className="error-message">{errors.nombre}</div>
                )}

                <label>Apellidos:</label>
                <input
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                />
                {errors.apellidos && (
                  <div className="error-message">{errors.apellidos}</div>
                )}

                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <div className="error-message">{errors.email}</div>
                )}
              </>
            )}

            {/* Paso 2 */}
            {step === 2 && (
              <>
                <label>Usuario:</label>
                <input
                  name="usuario"
                  value={formData.usuario}
                  onChange={handleChange}
                />
                {errors.usuario && (
                  <div className="error-message">{errors.usuario}</div>
                )}

                <label>Contraseña:</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    maxLength={25}
                    value={formData.password}
                    onChange={handleChange}
                    style={{ paddingRight: "30px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: 5,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      fontSize: "14px",
                      color: "#0a47a1",
                    }}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
                {errors.password && (
                  <div className="error-message">{errors.password}</div>
                )}

                <label>Confirmar contraseña:</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    style={{ paddingRight: "30px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: "absolute",
                      right: 5,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      fontSize: "14px",
                      color: "#0a47a1",
                    }}
                    aria-label={
                      showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                  >
                    {showConfirmPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="error-message">{errors.confirmPassword}</div>
                )}
              </>
            )}

            {/* Paso 3 */}
            {step === 3 && (
              <>
                <label>Matrícula:</label>
                <input
                  name="matricula"
                  value={formData.matricula}
                  onChange={handleChange}
                  maxLength={10}
                />
                {errors.matricula && (
                  <div className="error-message">{errors.matricula}</div>
                )}

                <label>Carrera:</label>
                <select
                  name="carrera"
                  value={formData.carrera}
                  onChange={handleChange}
                >
                  {opcionesCarrera.map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>

                <label>Cuatrimestre:</label>
                <select
                  name="cuatrimestre"
                  value={formData.cuatrimestre}
                  onChange={handleChange}
                  className="mb-3"
                >
                  <option value="">Selecciona un cuatrimestre</option>
                  {opcionesCuatrimestre.map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
                {errors.cuatrimestre && (
                  <div className="error-message">{errors.cuatrimestre}</div>
                )}

                <label>
                  <input
                    type="checkbox"
                    name="aceptaTerminos"
                    checked={formData.aceptaTerminos}
                    onChange={handleChange}
                  />
                  Acepto los{" "}
                  <a href="#" onClick={openTerms}>
                    términos y condiciones
                  </a>
                </label>
                {errors.aceptaTerminos && (
                  <div className="error-message">{errors.aceptaTerminos}</div>
                )}

                {apiError && (
                  <div
                    className="error-message"
                    style={{ marginTop: "10px", textAlign: "center" }}
                  >
                    {apiError}
                  </div>
                )}
              </>
            )}

            <div
              className="registro-navigation"
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "25px",
              }}
            >
              <div>
                {step > 1 && (
                  <button type="button" onClick={prevStep}>
                    Anterior
                  </button>
                )}
              </div>

              <div style={{ flexGrow: 1, marginLeft: "10px" }}>
                {step < 3 && (
                  <button type="button" onClick={nextStep}>
                    Siguiente
                  </button>
                )}
                {step === 3 && (
                  <button type="submit" disabled={isLoading}>
                    {isLoading ? "Registrando..." : "Registrarse"}
                  </button>
                )}
              </div>

              {step === 1 && (
                <div style={{ marginLeft: "auto" }}>
                  <a
                    href="/"
                    style={{
                      color: "#0a47a1",
                      fontWeight: "600",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                    aria-label="Volver al inicio de sesión"
                    title="Volver al inicio de sesión"
                  >
                    Volver al login
                  </a>
                </div>
              )}
            </div>
          </form>

          {showTerms && (
            <div className="modal-overlay" onClick={closeTerms}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Términos y Condiciones de Uso</h3>
                <p>
                  Al registrarte en esta plataforma, aceptas que la información proporcionada es
                  veraz y que será utilizada para fines académicos y administrativos relacionados
                  con la Universidad Tecnológica de Querétaro.
                </p>
                <p>
                  Te comprometes a utilizar esta aplicación de manera responsable, respetando los
                  reglamentos y normativas institucionales vigentes.
                </p>
                <p>
                  La Universidad Tecnológica de Querétaro y RutaDTAI no se hacen responsables por
                  el uso indebido de la información o por daños derivados del mal uso de la
                  plataforma.
                </p>
                <p>
                  Esta plataforma puede recopilar y almacenar datos personales para mejorar el
                  servicio, de acuerdo con la legislación vigente en materia de protección de datos.
                </p>
                <p>
                  Al aceptar estos términos, declaras estar informado y conforme con las condiciones
                  aquí descritas.
                </p>
                <button onClick={closeTerms}>Cerrar</button>
              </div>
            </div>
          )}

          {showSuccessModal && (
            <div className="modal-overlay">
              <div className="success-modal">
                <div className="progress-bar-container">
                  <div className="progress-bar" style={{ width: `${progress}%` }}></div>
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
                  <h3 className="modal-title">¡Registro exitoso!</h3>
                  <p className="modal-text">
                    Gracias por registrarte en RutaDTAI. Serás redirigido al login en unos momentos.
                  </p>
                  <p className="countdown-text">
                    Redirigiendo en {Math.ceil((100 - progress) / 20)} segundos...
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Registro;
