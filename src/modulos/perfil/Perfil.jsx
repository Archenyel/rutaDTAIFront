import React, { useState, useEffect } from 'react';
import './perfil.css';

const Perfil = () => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState('');

  // Cargar datos desde localStorage al montar
  useEffect(() => {
    const storedNombre = localStorage.getItem('nombreUsuario');
    const storedDescripcion = localStorage.getItem('descripcion');
    const storedImagen = localStorage.getItem('imagenPerfil');

    if (storedNombre) setNombreUsuario(storedNombre);
    if (storedDescripcion) setDescripcion(storedDescripcion);
    if (storedImagen) setImagen(storedImagen);
  }, []);

  // Guardar cambios en localStorage
  const guardarPerfil = () => {
    localStorage.setItem('nombreUsuario', nombreUsuario);
    localStorage.setItem('descripcion', descripcion);
    localStorage.setItem('imagenPerfil', imagen);
    alert('Perfil guardado correctamente.');
  };

  // Manejar cambio de imagen
  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagen(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Solo se permiten archivos PNG o JPG');
    }
  };

  return (
    <div className="perfil-container">
      <h2>Mi Perfil</h2>

      <div className="perfil-foto">
        {imagen ? (
          <img src={imagen} alt="Foto de perfil" />
        ) : (
          <div className="placeholder">Sin imagen</div>
        )}
        <input type="file" accept=".png,.jpg,.jpeg" onChange={handleImagenChange} />
      </div>

      <div className="perfil-form">
        <label>Nombre de usuario</label>
        <input
          type="text"
          value={nombreUsuario}
          onChange={(e) => setNombreUsuario(e.target.value)}
          placeholder="Escribe tu nombre"
        />

        <label>Descripción</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Cuéntanos sobre ti"
        ></textarea>

        <button onClick={guardarPerfil}>Guardar</button>
      </div>
    </div>
  );
};

export default Perfil;
