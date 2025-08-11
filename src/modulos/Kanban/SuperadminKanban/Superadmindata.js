export const projectsData = [
  {
    id: 1,
    name: "Sistema de Gestión Escolar",
    description: "Desarrollo del sistema integral para gestión escolar",
    startDate: "2025-01-15",
    endDate: "2025-06-30"
  },
  {
    id: 2,
    name: "Portal de Estudiantes",
    description: "Portal web para interacción de estudiantes",
    startDate: "2025-02-01",
    endDate: "2025-07-15"
  },
  {
    id: 3,
    name: "App Móvil",
    description: "Aplicación móvil para acceso en dispositivos",
    startDate: "2025-03-10",
    endDate: "2025-08-20"
  }
];

export const tasksData = [
  {
    id: "1",  // Cambiar a string
    projectId: 1,
    title: "Diseñar login",
    description: "Crear diseño limpio para pantalla de login.",
    status: "Por hacer",
    assignedTo: "Juan Pérez",
    progress: 0,
    startDate: "2025-08-01",
    endDate: "2025-08-10",
    documents: ["diseño-login.pdf", "requisitos.docx"],
    comments: []
  },
  {
    id: "2",  // Cambiar a string
    projectId: 1,
    title: "Backend usuarios",
    description: "Crear endpoints para gestión de usuarios.",
    status: "En progreso",
    assignedTo: "Ana López",
    progress: 45,
    startDate: "2025-08-05",
    endDate: "2025-08-20",
    documents: ["api-specs.json", "diagrama-flujo.png"],
    comments: [
      { user: "Admin", text: "Falta validación de roles.", date: "2025-07-15" }
    ]
  },
  {
    id: "3",
    projectId: 2,
    title: "Test de login",
    description: "Verificar flujo de inicio de sesión.",
    status: "En revisión",
    assignedTo: "Carlos Ruiz",
    progress: 80,
    startDate: "2025-08-15",
    endDate: "2025-08-25",
    documents: ["test-cases.xlsx"],
    comments: []
  },
  {
    id: "4",
    projectId: 3,
    title: "Deploy a producción",
    description: "Subir la versión estable.",
    status: "Hecho",
    assignedTo: "María Torres",
    progress: 100,
    startDate: "2025-08-20",
    endDate: "2025-08-30",
    documents: ["deploy-checklist.txt", "release-notes.pdf"],
    comments: [
      { user: "Líder", text: "¡Buen trabajo!", date: "2025-07-14" }
    ]
  }
];