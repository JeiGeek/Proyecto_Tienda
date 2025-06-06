import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UsuarioService from "../services/UsuarioService";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../Stylesheets/Perfil.css";
import "../Stylesheets/ButtonAdmin.css"; // <-- Importa aquí el CSS del botón admin

const Perfil = () => {
  const [perfilData, setPerfilData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    pais: "",
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const notifySuccess = (message) =>
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pause: true,
      draggable: true,
    });

  const notifyError = (message) =>
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pause: true,
      draggable: true,
    });

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const datos = await UsuarioService.getPerfil();

        setPerfilData(datos);

        setFormData({
          nombre: datos.nombre || "",
          email: datos.email || "",
          telefono: datos.telefono || "",
          pais: datos.pais || "",
        });

        setLoading(false);
      } catch (err) {
        const errorMsg =
          err.response?.data?.message || "Error al cargar los datos del perfil";
        setError(errorMsg);
        notifyError(errorMsg);
        setLoading(false);
      }
    };
    cargarPerfil();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const datosActualizados = await UsuarioService.actualizarPerfil(formData);

      setPerfilData(datosActualizados);

      handleClose();
      notifySuccess("Perfil Actualizado Exitosamente!");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Error al actualizar el perfil";
      setError(errorMsg);
      notifyError(errorMsg);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formDataImagen = new FormData();
    formDataImagen.append("imagen", file);

    try {
      const datosActualizados = await UsuarioService.actualizarImagenPerfil(
        formDataImagen
      );
      setPerfilData(datosActualizados);
      notifySuccess("Imagen Actualizada!");
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Error al actualizar imagen";
      setError(errorMsg);
      notifyError(errorMsg);
    }
  };

  if (loading) {
    return <div className="loading-text">Cargando Perfil...</div>;
  }

  if (error && loading) {
    return (
      <div className="error-text">
        <ToastContainer />
        {error}
      </div>
    );
  }

  return (
    <div>
      <section className="perfil-section">
        <ToastContainer />
        <h1 className="perfil-title">Usuario de plataforma</h1>
        <div className="perfil-container">
          <div className="perfil-imagen-container">
            <img
              src={
                perfilData?.imagenUrl
                  ? `http://localhost:8080${perfilData.imagenUrl}`
                  : `https://images.pexels.com/photos/14375833/pexels-photo-14375833.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`
              }
              alt="avatar"
              className="perfil-avatar"
            />
            <label htmlFor="file-upload" className="perfil-camera-icon">
              <i className="fas fa-camera"></i>
            </label>
            <input
              id="file-upload"
              type="file"
              className="perfil-file-input"
              onChange={handleImageUpload}
              accept="image/*"
            />
          </div>

          <div className="perfil-info">
            <p className="perfil-username">@{perfilData?.username}</p>

            <div className="perfil-datos">
              <div>
                <span className="perfil-label">NOMBRE</span>
                <span className="perfil-text">
                  {perfilData?.nombre || "No especificado"}
                </span>
              </div>
              <div>
                <span className="perfil-label">EMAIL</span>
                <span className="perfil-text">{perfilData?.email}</span>
              </div>
              <div>
                <span className="perfil-label">TELEFONO</span>
                <span className="perfil-text">
                  {perfilData?.telefono || "No especificado"}
                </span>
              </div>
              <div>
                <span className="perfil-label">PAIS</span>
                <span className="perfil-text">
                  {perfilData?.pais || "No especificado"}
                </span>
              </div>
            </div>

            <Button className="perfil-edit-button" onClick={handleShow}>
              Editar perfil
            </Button>

            {/* Aquí el botón sólo si es admin */}
            {perfilData?.admin && (
              <button
                className="admin-button mt-3"
                onClick={() => (window.location.href = "/panel")}
              >
                Ir al Panel de Administración
              </button>
            )}
          </div>
        </div>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Editar Perfil</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="form-label-custom">Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="form-label-custom">Email</Form.Label>
                <Form.Control
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="form-label-custom">Telefono</Form.Label>
                <Form.Control
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="form-label-custom">Pais</Form.Label>
                <Form.Control
                  type="text"
                  name="pais"
                  value={formData.pais}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Guardar Cambios
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      </section>

      <section className="seccion-regresar">
        <Link to="/home" className="btn-regresar">
          Regresar a página principal
        </Link>
      </section>
    </div>
  );
};

export default Perfil;
