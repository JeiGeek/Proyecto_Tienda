import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import '../Stylesheets/registro.css'; // mismo CSS que login
import axios from "axios";
import logo from '../imagenes/segunda.png';

function Registro() {
  const [username, setUsername] = useState("");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  async function save(event) {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/auth/registrar", {
        nombre,
        username,
        email,
        password
      });

      if (response.data.authStatus === 'USER_CREATED_SUCCESSFULLY') {
        setSuccessMessage(response.data.message);
        setTimeout(() => { navigate('/login'); }, 4000);
      } else {
        setError(response.data.message || "No se pudo completar el registro");
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.authStatus === 'USER_NOT_CREATED') {
        setError("No se pudo crear el usuario. Intente nuevamente.");
      } else {
        setError("Error en el registro. Por favor intente más tarde");
      }
      console.error("Error detallado: ", err);
    }
  }

  return (
    <div className="login-container">
      <div className="logo-container">
        <img src={logo} alt="Second Shop Logo" />
      </div>

      <div className="form-container">
        <form onSubmit={save}>
          <h2>Crear cuenta</h2>

          {error && (
            <div className="alert alert-danger">{error}</div>
          )}

          {successMessage && (
            <div className="alert alert-success">{successMessage}</div>
          )}

          <label htmlFor="nombre">Nombre completo</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
          />

          <label htmlFor="username">Nombre de usuario</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <label htmlFor="confirmPassword">Confirmar contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit" className="btn-submit">Registrar</button>

          <p>
            ¿Ya tienes cuenta? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Registro;
