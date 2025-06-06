import React, { useState } from "react";
import '../Stylesheets/login.css';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Componentes/AuthContext";
import logo from '../imagenes/segunda.png'; // importa el logo

function Login() {
  // DECLARACIÓN DE ESTADOS Y VARIABLES
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  // FUNCIÓN PARA MANEJAR EL LOGIN
  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        username: username,
        password: password,
      });

      if (response.data.authStatus === 'LOGIN_SUCCESS') {
        setSuccessMessage("Inicio de sesión exitoso");
        localStorage.setItem('token', response.data.token);

        login({
          username: username,
          name: username,
        });

        setTimeout(() => { navigate('/home'); }, 2000);
      }

    } catch (err) {
      setSuccessMessage("");
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Error al iniciar sesion. Por favor intente mas tarde");
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
        <form onSubmit={handleLogin}>
          <h2>Iniciar Sesión</h2>
          {error && !successMessage && (
            <div className="alert alert-danger">{error}</div>
          )}
          {successMessage && !error && (
            <div className="alert alert-success">{successMessage}</div>
          )}

          <label htmlFor="username">Nombre de usuario</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="checkbox-container">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Recordar contraseña</label>
          </div>

          <button type="submit" className="btn-submit">Entrar</button>

          <p>
            ¿No tienes cuenta? <Link to="/registro">Registro</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
