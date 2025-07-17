import { useState, useEffect } from 'react';

const Dashboard = ({ userInfo, onLogout, onModuleSelect }) => {
  const [estadisticas, setEstadisticas] = useState({
    proyectos: 0,
    tareas: 0,
    usuarios: 0,
    documentos: 0,
    notificaciones: 0
  });

  // Configuración de módulos según el rol del usuario
  const todosLosModulos = [
    {
      id: 'auth',
      titulo: 'Autenticación y Roles',
      descripcion: 'Gestión de usuarios, permisos y roles del sistema',
      icono: '🔐',
      color: 'color-blue',
      rolesPermitidos: ['superadministrador']
    },
    {
      id: 'org',
      titulo: 'Organización Jerárquica',
      descripcion: 'Estructura organizacional y jerarquías',
      icono: '🏢',
      color: 'color-purple',
      rolesPermitidos: ['superadministrador', 'administrador']
    },
    {
      id: 'projects',
      titulo: 'Gestión de Proyectos',
      descripcion: 'Administración completa de proyectos',
      icono: '📋',
      color: 'color-green',
      rolesPermitidos: ['superadministrador', 'administrador', 'alumno']
    },
    {
      id: 'kanban',
      titulo: 'Tareas y Tablero Kanban',
      descripcion: 'Gestión visual de tareas y flujos de trabajo',
      icono: '📊',
      color: 'color-orange',
      rolesPermitidos: ['superadministrador', 'administrador', 'alumno']
    },
    {
      id: 'docs',
      titulo: 'Documentación',
      descripcion: 'Centro de documentos y recursos',
      icono: '📚',
      color: 'color-indigo',
      rolesPermitidos: ['superadministrador', 'administrador', 'alumno']
    },
    {
      id: 'notifications',
      titulo: 'Notificaciones y Alertas',
      descripcion: 'Sistema de comunicaciones y alertas',
      icono: '🔔',
      color: 'color-red',
      rolesPermitidos: ['superadministrador', 'administrador', 'alumno']
    },
    {
      id: 'dashboard',
      titulo: 'Panel de Control',
      descripcion: 'Gestión de usuarios y configuración del sistema',
      icono: '📈',
      color: 'color-teal',
      rolesPermitidos: ['superadministrador', 'administrador']
    }
  ];

  // Filtrar módulos según el rol del usuario
  const modulosDisponibles = todosLosModulos.filter(modulo => 
    modulo.rolesPermitidos.includes(userInfo?.rol || 'alumno')
  );

  // Cargar estadísticas según el rol del usuario
  useEffect(() => {
    const cargarEstadisticas = () => {
      switch (userInfo?.rol) {
        case 'superadministrador':
          setEstadisticas({
            proyectos: 15,
            tareas: 248,
            usuarios: 45,
            documentos: 128,
            notificaciones: 12
          });
          break;
        case 'administrador':
          setEstadisticas({
            proyectos: 3,
            tareas: 67,
            usuarios: 12,
            documentos: 34,
            notificaciones: 5
          });
          break;
        case 'alumno':
          setEstadisticas({
            proyectos: 1,
            tareas: 8,
            usuarios: 0,
            documentos: 15,
            notificaciones: 3
          });
          break;
        default:
          setEstadisticas({
            proyectos: 0,
            tareas: 0,
            usuarios: 0,
            documentos: 0,
            notificaciones: 0
          });
      }
    };

    cargarEstadisticas();
  }, [userInfo?.rol]);

  const handleModuleClick = (moduleId) => {
    if (onModuleSelect) {
      onModuleSelect(moduleId);
    } else {
      console.log(`Navegando al módulo: ${moduleId}`);
      alert(`Abriendo módulo: ${modulosDisponibles.find(m => m.id === moduleId)?.titulo}`);
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const getRolBadge = (rol) => {
    const badges = {
      'superadministrador': { class: 'bg-danger', text: 'Super Admin' },
      'administrador': { class: 'bg-warning', text: 'Administrador' },
      'alumno': { class: 'bg-primary', text: 'Alumno' }
    };
    return badges[rol] || { class: 'bg-secondary', text: 'Usuario' };
  };

  const rolBadge = getRolBadge(userInfo?.rol);

  return (
    <>
      {/* Bootstrap CSS */}
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
      
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
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          
          #root {
            height: 100vh;
            width: 100vw;
            margin: 0;
            padding: 0;
          }
          
          .dashboard-bg {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            min-height: 100vh;
          }
          
          
          .welcome-section {
            background: white;
            padding: 2.5rem 2rem;
            border-radius: 16px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            margin-bottom: 2rem;
          }
          
          .user-avatar {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #293259 0%, #537092 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            color: white;
            margin-right: 1.5rem;
          }
          
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
          }
          
          .stat-card {
            background: white;
            padding: 1.5rem;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
            text-align: center;
          }
          
          .stat-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
          }
          
          .stat-icon {
            width: 50px;
            height: 50px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1rem;
            font-size: 1.5rem;
          }
          
          .stat-value {
            font-size: 2rem;
            font-weight: 700;
            color: #293259;
            margin-bottom: 0.5rem;
          }
          
          .stat-label {
            color: #64748b;
            font-size: 0.9rem;
            font-weight: 500;
          }
          
          .modules-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
          }
          
          .module-card {
            background: white;
            border-radius: 16px;
            padding: 1.5rem;
            border: 1px solid #e2e8f0;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }
          
          .module-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 25px rgba(41, 50, 89, 0.15);
            border-color: #6196BB;
          }
          
          .module-card:hover .module-arrow {
            transform: translateX(4px);
          }
          
          .module-icon {
            width: 60px;
            height: 60px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1rem;
            position: relative;
            overflow: hidden;
            background: linear-gradient(135deg, var(--color-from), var(--color-to));
          }
          
          .module-emoji {
            font-size: 1.8rem;
            filter: brightness(0) invert(1);
          }
          
          .module-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 0.5rem;
          }
          
          .module-description {
            color: #64748b;
            font-size: 0.9rem;
            line-height: 1.4;
            margin-bottom: 0;
          }
          
          .module-arrow {
            position: absolute;
            top: 1rem;
            right: 1rem;
            color: #94a3b8;
            transition: all 0.3s ease;
          }
          
          /* Colores para los módulos */
          .color-blue { --color-from: #3b82f6; --color-to: #2563eb; }
          .color-purple { --color-from: #8b5cf6; --color-to: #7c3aed; }
          .color-green { --color-from: #10b981; --color-to: #059669; }
          .color-orange { --color-from: #f97316; --color-to: #ea580c; }
          .color-indigo { --color-from: #6366f1; --color-to: #4f46e5; }
          .color-red { --color-from: #ef4444; --color-to: #dc2626; }
          .color-teal { --color-from: #14b8a6; --color-to: #0d9488; }
          
          /* Colores para estadísticas */
          .stat-proyectos { background: linear-gradient(135deg, #10b981, #059669); }
          .stat-tareas { background: linear-gradient(135deg, #f97316, #ea580c); }
          .stat-usuarios { background: linear-gradient(135deg, #3b82f6, #2563eb); }
          .stat-documentos { background: linear-gradient(135deg, #6366f1, #4f46e5); }
          .stat-notificaciones { background: linear-gradient(135deg, #ef4444, #dc2626); }
          
          .dropdown-toggle:after {
            display: inline-block;
            margin-left: 0.255em;
            vertical-align: 0.255em;
            content: "";
            border-top: 0.3em solid;
            border-right: 0.3em solid transparent;
            border-bottom: 0;
            border-left: 0.3em solid transparent;
          }
          
          .btn-outline-light {
            color: #fff;
            border-color: rgba(255, 255, 255, 0.3);
          }
          
          .btn-outline-light:hover {
            color: #293259;
            background-color: #fff;
            border-color: #fff;
          }
          
          .dropdown-menu {
            border: none;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            border-radius: 8px;
          }
          
          .dropdown-item {
            padding: 0.5rem 1rem;
            transition: all 0.2s ease;
          }
          
          .dropdown-item:hover {
            background-color: #f8fafc;
            color: #293259;
          }
          
          .role-badge {
            font-size: 0.75rem;
            padding: 0.3rem 0.8rem;
            border-radius: 12px;
            font-weight: 500;
          }
          
          .fade-in {
            animation: fadeIn 0.6s ease-out;
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @media (max-width: 768px) {
            .welcome-section {
              padding: 1.5rem;
            }
            
            .user-avatar {
              width: 60px;
              height: 60px;
              font-size: 1.5rem;
              margin-right: 1rem;
            }
            
            .stats-grid {
              grid-template-columns: repeat(2, 1fr);
            }
            
            .modules-grid {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>

      <div className="dashboard-bg">
        {/* Header del Dashboard */}
      
          <div className="container-fluid py-3">
            <div className="row align-items-center">
              <div className="col">
                <h1 className="h4 fw-bold mb-0 text-white">RutaDTAI - Dashboard</h1>
              </div>
              <div className="col-auto">
                <div className="dropdown">
                  <button className="btn btn-outline-light dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                    <span className="me-2">👤</span>
                    {userInfo?.usuario || 'Usuario'}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                    <li><a className="dropdown-item" href="#"><i className="me-2">👤</i>Perfil</a></li>
                    <li><a className="dropdown-item" href="#"><i className="me-2">⚙️</i>Configuración</a></li>
                    <li><hr className="dropdown-divider"/></li>
                    <li><button className="dropdown-item" onClick={handleLogout}><i className="me-2">🚪</i>Cerrar Sesión</button></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        

        {/* Contenido Principal */}
        <main className="container-fluid py-4">
          {/* Sección de Bienvenida */}
          <div className="welcome-section fade-in">
            <div className="d-flex align-items-center">
              <div className="user-avatar">
                {(userInfo?.usuario || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="flex-grow-1">
                <h2 className="h3 mb-2">
                  ¡Bienvenido, {userInfo?.usuario || 'Usuario'}!
                  <span className={`role-badge ms-3 ${rolBadge.class} text-white`}>
                    {rolBadge.text}
                  </span>
                </h2>
                <p className="text-muted mb-0">
                  {userInfo?.rol === 'superadministrador' && 'Tienes acceso completo a todos los módulos del sistema.'}
                  {userInfo?.rol === 'administrador' && 'Puedes gestionar proyectos y usuarios asignados.'}
                  {userInfo?.rol === 'alumno' && 'Accede a tus proyectos, tareas y documentación.'}
                </p>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="stats-grid">
            {estadisticas.proyectos > 0 && (
              <div className="stat-card fade-in">
                <div className="stat-icon stat-proyectos">
                  <span style={{ filter: 'brightness(0) invert(1)' }}>📋</span>
                </div>
                <div className="stat-value">{estadisticas.proyectos}</div>
                <div className="stat-label">
                  {userInfo?.rol === 'alumno' ? 'Mi Proyecto' : 'Proyectos'}
                </div>
              </div>
            )}
            
            {estadisticas.tareas > 0 && (
              <div className="stat-card fade-in">
                <div className="stat-icon stat-tareas">
                  <span style={{ filter: 'brightness(0) invert(1)' }}>📊</span>
                </div>
                <div className="stat-value">{estadisticas.tareas}</div>
                <div className="stat-label">
                  {userInfo?.rol === 'alumno' ? 'Mis Tareas' : 'Tareas'}
                </div>
              </div>
            )}
            
            {estadisticas.usuarios > 0 && (
              <div className="stat-card fade-in">
                <div className="stat-icon stat-usuarios">
                  <span style={{ filter: 'brightness(0) invert(1)' }}>👥</span>
                </div>
                <div className="stat-value">{estadisticas.usuarios}</div>
                <div className="stat-label">Usuarios</div>
              </div>
            )}
            
            {estadisticas.documentos > 0 && (
              <div className="stat-card fade-in">
                <div className="stat-icon stat-documentos">
                  <span style={{ filter: 'brightness(0) invert(1)' }}>📚</span>
                </div>
                <div className="stat-value">{estadisticas.documentos}</div>
                <div className="stat-label">Documentos</div>
              </div>
            )}
            
            {estadisticas.notificaciones > 0 && (
              <div className="stat-card fade-in">
                <div className="stat-icon stat-notificaciones">
                  <span style={{ filter: 'brightness(0) invert(1)' }}>🔔</span>
                </div>
                <div className="stat-value">{estadisticas.notificaciones}</div>
                <div className="stat-label">Notificaciones</div>
              </div>
            )}
          </div>

          {/* Módulos Disponibles */}
          <div className="mb-4">
            <h3 className="h5 mb-3 text-dark">Módulos Disponibles</h3>
            <div className="modules-grid">
              {modulosDisponibles.map((modulo, index) => (
                <div 
                  key={modulo.id}
                  className="module-card fade-in"
                  onClick={() => handleModuleClick(modulo.id)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`module-icon ${modulo.color}`}>
                    <span className="module-emoji">{modulo.icono}</span>
                  </div>
                  <div className="module-content">
                    <h4 className="module-title">{modulo.titulo}</h4>
                    <p className="module-description">{modulo.descripcion}</p>
                  </div>
                  <div className="module-arrow">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
        </main>
      </div>
    </>
  );
};

export default Dashboard;