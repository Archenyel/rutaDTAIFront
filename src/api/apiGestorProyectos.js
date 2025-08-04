// src/api/apiGestorProyectos.js

// ESTE ARCHIVO IGNORENLO, ESTABA HACIENDO UNA PRUEBA 


import api from "./api"; 

export const fetchProjects = async () => {
  const response = await api.get("/proyectos");
  return response.data;
};

export const fetchProjectDetails = async (projectId) => {
  const response = await api.get(`/proyectos/${projectId}`);
  return response.data;
};

export const createProject = async (projectData) => {
  const response = await api.post("/proyectos", projectData);
  return response.data;
};

export const updateProject = async (projectId, projectData) => {
  const response = await api.patch(`/proyectos/${projectId}`, projectData);
  return response.data;
};

export const deleteProject = async (projectId) => {
  await api.delete(`/proyectos/${projectId}`);
};

export const assignStudentToProject = async (projectId, studentId) => {
  await api.put("/proyectos/asignarAlumno", {
    idProyecto: projectId,
    idAlumno: studentId,
  });
};

export const removeStudentFromProject = async (projectId, studentId) => {
  await api.put("/proyectos/quitarAlumno", {
    idProyecto: projectId,
    idAlumno: studentId,
  });
};
