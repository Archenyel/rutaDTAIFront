// src/components/UploadToGCS.js
import React, { useState } from 'react';

function UploadToGCS() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Por favor, selecciona un archivo primero.');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // Envía el archivo a tu propio endpoint de backend.
      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        alert(`¡Archivo subido con éxito! URL: ${result.publicUrl}`);
        setSelectedFile(null);
      } else {
        alert(`Error del servidor: ${result.error}`);
      }
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      alert('Hubo un error de conexión al servidor.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h1>Subir archivo a Google Cloud Storage</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!selectedFile || uploading}>
        {uploading ? 'Subiendo...' : 'Subir a GCS'}
      </button>
    </div>
  );
}

export default UploadToGCS;