import { useState, useEffect } from 'react';

const Login = () => {
  const [formData, setFormData] = useState({
    usuario: '',
    contraseña: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [progress, setProgress] = useState(0);

  // Credenciales estáticas para pruebas
  const credencialesValidas = {
    usuario: 'admin',
    contraseña: '123456'
  };

  // Efecto para la barra de progreso
  useEffect(() => {
    if (showSuccessModal) {
      const duration = 5000; // 5 segundos
      const interval = 50; // Actualizar cada 50ms
      const step = (interval / duration) * 100;
      
      const timer = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + step;
          if (newProgress >= 100) {
            clearInterval(timer);
            // Aquí puedes agregar la lógica de redirección
            console.log('Redirigiendo al dashboard...');
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
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simular delay de autenticación
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (formData.usuario === credencialesValidas.usuario && 
        formData.contraseña === credencialesValidas.contraseña) {
      setShowSuccessModal(true);
      // Aquí puedes agregar la lógica de redirección o manejo de sesión
    } else {
      setError('Credenciales incorrectas. Inténtalo de nuevo.');
    }
    setLoading(false);
  };

  return (
    <>
      {/* Bootstrap CSS */}
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      
      <style>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body, html {
            height: 100%;
            width: 100%;
            margin: 0;
            padding: 0;
            overflow-x: hidden;
          }
          
          #root {
            height: 100vh;
            width: 100vw;
            margin: 0;
            padding: 0;
          }
          
          .gradient-bg {
            background: linear-gradient(135deg, #293259 0%, #537092 50%, #6196BB 100%);
            min-height: 100vh;
            height: 100vh;
            width: 100vw;
            margin: 0;
            padding: 0;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
          }
          
          .header-custom {
            background: linear-gradient(90deg, #293259 0%, #537092 100%);
            box-shadow: 0 4px 20px rgba(41, 50, 89, 0.3);
            position: relative;
            z-index: 10;
          }
          
          .card-custom {
            border: none;
            border-radius: 20px;
            backdrop-filter: blur(10px);
            background: rgba(255, 255, 255, 0.95);
            box-shadow: 0 20px 40px rgba(41, 50, 89, 0.2);
          }
          
          .form-control-custom {
            border: 2px solid #e9ecef;
            border-radius: 12px;
            transition: all 0.3s ease;
          }
          
          .form-control-custom:focus {
            border-color: #6196BB;
            box-shadow: 0 0 0 0.2rem rgba(97, 150, 187, 0.25);
          }
          
          .btn-custom {
            background: linear-gradient(45deg, #293259 0%, #537092 100%);
            border: none;
            border-radius: 12px;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(41, 50, 89, 0.3);
          }
          
          .btn-custom:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(41, 50, 89, 0.4);
            background: linear-gradient(45deg, #537092 0%, #6196BB 100%);
          }
          
          .btn-custom:disabled {
            transform: none;
            opacity: 0.7;
          }
          
          .text-primary-custom {
            color: #293259 !important;
          }
          
          .text-secondary-custom {
            color: #537092 !important;
          }
          
          .alert-custom {
            background: linear-gradient(45deg, rgba(220, 53, 69, 0.1), rgba(220, 53, 69, 0.05));
            border: 1px solid rgba(220, 53, 69, 0.2);
            border-radius: 12px;
          }
          
          .alert-info-custom {
            background: linear-gradient(45deg, rgba(97, 150, 187, 0.1), rgba(83, 112, 146, 0.05));
            border: 1px solid rgba(97, 150, 187, 0.2);
            border-radius: 12px;
          }
          
          .link-custom {
            color: #6196BB !important;
            text-decoration: none;
            transition: color 0.3s ease;
          }
          
          .link-custom:hover {
            color: #293259 !important;
          }
          
          .main-content {
            position: relative;
            z-index: 5;
            height: 100vh;
            width: 100%;
          }
          
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            backdrop-filter: blur(5px);
            animation: fadeIn 0.3s ease-out;
          }
          
          .modal-content {
            background: white;
            border-radius: 20px;
            padding: 0;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 25px 50px rgba(41, 50, 89, 0.3);
            animation: slideIn 0.3s ease-out;
            position: relative;
            overflow: hidden;
          }
          
          .progress-bar-container {
            height: 6px;
            background: #f0f0f0;
            border-radius: 20px 20px 0 0;
            overflow: hidden;
            position: relative;
          }
          
          .progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #293259 0%, #537092 50%, #6196BB 100%);
            border-radius: 20px 20px 0 0;
            transition: width 0.05s linear;
            position: relative;
          }
          
          .progress-bar::after {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            width: 20px;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3));
            animation: shimmer 1s ease-in-out infinite;
          }
          
          .modal-body {
            padding: 2rem;
          }
          
          .success-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(45deg, #28a745, #20c997);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1rem;
            animation: bounceIn 0.6s ease-out;
          }
          
          .success-icon svg {
            width: 30px;
            height: 30px;
            color: white;
          }
          
          .modal-title {
            color: #293259;
            font-weight: 700;
            font-size: 1.5rem;
            text-align: center;
            margin-bottom: 0.5rem;
          }
          
          .modal-text {
            color: #537092;
            text-align: center;
            margin-bottom: 1.5rem;
            font-size: 1rem;
          }
          
          .countdown-text {
            color: #6196BB;
            text-align: center;
            font-size: 0.9rem;
            font-weight: 600;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideIn {
            from { 
              opacity: 0;
              transform: translateY(-50px) scale(0.9);
            }
            to { 
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          @keyframes bounceIn {
            0% { 
              transform: scale(0);
              opacity: 0;
            }
            50% { 
              transform: scale(1.1);
              opacity: 1;
            }
            100% { 
              transform: scale(1);
            }
          }
          
          @keyframes shimmer {
            0% { transform: translateX(-20px); }
            100% { transform: translateX(20px); }
          }
        `}
      </style>
      
      <div className="gradient-bg"></div>
      <div className="main-content">
        {/* Header personalizado */}
        <header className="header-custom text-white">
          <div className="container-fluid py-4">
            <div className="row">
              <div className="col">
                <h1 className="h4 fw-bold mb-0">RutaDTAI</h1>
              </div>
            </div>
          </div>
        </header>

        {/* Contenedor del formulario */}
        <div className="d-flex align-items-center justify-content-center" style={{minHeight: 'calc(100vh - 120px)', padding: '2rem 1rem'}}>
          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-sm-10 col-md-8 col-lg-4 col-xl-4">
                <div className="card card-custom shadow-lg">
                  <div className="card-body p-4">
                    <h3 className="card-title text-center text-primary-custom mb-4 fw-bold">
                      Bienvenido a tu gestor de proyectos
                    </h3>

                    <div>
                      {/* Campo Usuario */}
                      <div className="mb-3">
                        <label htmlFor="usuario" className="form-label fw-medium text-primary-custom">
                          Usuario
                        </label>
                        <input
                          id="usuario"
                          type="text"
                          name="usuario"
                          value={formData.usuario}
                          onChange={handleInputChange}
                          required
                          className="form-control form-control-lg form-control-custom"
                          placeholder="Ingresa tu usuario"
                        />
                      </div>

                      {/* Campo Contraseña */}
                      <div className="mb-3">
                        <label htmlFor="contraseña" className="form-label fw-medium text-primary-custom">
                          Contraseña
                        </label>
                        <input
                          id="contraseña"
                          type="password"
                          name="contraseña"
                          value={formData.contraseña}
                          onChange={handleInputChange}
                          required
                          className="form-control form-control-lg form-control-custom"
                          placeholder="Ingresa tu contraseña"
                        />
                      </div>

                      {/* Mensaje de error */}
                      {error && (
                        <div className="alert alert-danger alert-custom py-2 mb-3" role="alert">
                          <small>{error}</small>
                        </div>
                      )}

                      {/* Botón de envío */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-custom text-white btn-lg w-100 d-flex align-items-center justify-content-center"
                        onClick={handleSubmit}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Ingresando...
                          </>
                        ) : (
                          'Ingresar'
                        )}
                      </button>
                    </div>

                    {/* Enlaces adicionales */}
                    <div className="text-center mt-4">
                      <p className="text-secondary-custom mb-0">
                        ¿No tienes cuenta?{' '}
                        <a href="#" className="link-custom fw-medium">
                          Regístrate aquí
                        </a>
                      </p>
                    </div>

                    {/* Información de prueba */}
                    <div className="alert alert-info-custom mt-4 mb-0">
                      <p className="fw-medium mb-2 text-secondary-custom">Credenciales de prueba:</p>
                      <small className="text-secondary-custom d-block">Usuario: admin</small>
                      <small className="text-secondary-custom d-block">Contraseña: 123456</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal de éxito con barra de progreso */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            {/* Barra de progreso */}
            <div className="progress-bar-container">
              <div 
                className="progress-bar" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            <div className="modal-body">
              <div className="success-icon">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="modal-title">¡Inicio de sesión exitoso!</h3>
              <p className="modal-text">
                Bienvenido a RutaDTAI. Serás redirigido al panel principal en unos momentos.
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