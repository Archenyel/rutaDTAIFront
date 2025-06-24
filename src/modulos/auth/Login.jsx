import { useState } from 'react';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    usuario: '',
    contraseña: ''
  });

  // Credenciales estáticas para pruebas
  const credencialesValidas = {
    usuario: 'admin',
    contraseña: '123456'
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.usuario === credencialesValidas.usuario && 
        formData.contraseña === credencialesValidas.contraseña) {
      alert('Inicio de sesión exitoso!');
      // Aquí puedes agregar la lógica de redirección o manejo de sesión
    } else {
      alert('Credenciales incorrectas');
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h1>Ruta</h1>
        <h2>DTAI</h2>
      </div>
      <div className="login-form-container">
        <h3>Bienvenido a tu gestor de proyectos</h3>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Usuario:</label>
            <input
              type="text"
              name="usuario"
              value={formData.usuario}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Contraseña:</label>
            <input
              type="password"
              name="contraseña"
              value={formData.contraseña}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="login-button">Ingresar</button>
        </form>
        <p className="register-link">
          No tienes cuenta?
          <a href="#">Registrate aqui</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
import React, { useState } from "react";
import "./auth.css";

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Usuario:", usuario, "Contraseña:", password);
  };

  return (
    <div className="login-page">
      <header className="login-header">
        <h1>Ruta DTAI</h1>
      </header>

      <div className="login-form-container">
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Inicio de Sesión</h2>
          <label>Usuario</label>
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />

          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Iniciar Sesión</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
