export const tasksData = [
  {
    id: 1,
    title: "Diseñar login",
    description: "Crear diseño limpio para pantalla de login.",
    status: "Por hacer",
    assignedTo: "Juan Pérez",
    progress: 0,
    comments: []
  },
  {
    id: 2,
    title: "Backend usuarios",
    description: "Crear endpoints para gestión de usuarios.",
    status: "En progreso",
    assignedTo: "Ana López",
    progress: 45,
    comments: [
      { user: "Admin", text: "Falta validación de roles.", date: "2025-07-15" }
    ]
  },
  {
    id: 3,
    title: "Test de login",
    description: "Verificar flujo de inicio de sesión.",
    status: "En revisión",
    assignedTo: "Carlos Ruiz",
    progress: 80,
    comments: []
  },
  {
    id: 4,
    title: "Deploy a producción",
    description: "Subir la versión estable.",
    status: "Hecho",
    assignedTo: "María Torres",
    progress: 100,
    comments: [
      { user: "Líder", text: "¡Buen trabajo!", date: "2025-07-14" }
    ]
  }
];
