import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import logo from '../imagenes/segunda.png'; // mismo logo que en login
import '../Stylesheets/verification.css';

function VerificationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const status = searchParams.get('status');
  let message = "";
  let messageType = "info";

  switch (status) {
    case "success":
      message = "Tu correo ha sido verificado exitosamente, ahora puedes iniciar sesión.";
      messageType = "success";
      break;
    case "invalid-token":
      message = "El token de verificación es inválido.";
      messageType = "error";
      break;
    case "expired":
      message = "El token de verificación ha expirado. Por favor, solicita uno nuevo.";
      messageType = "error";
      break;
    case "error":
      message = "Ocurrió un error durante la verificación. Por favor, solicita uno nuevo.";
      messageType = "error";
      break;
    default:
      message = "Verificando...";
      messageType = "info";
  }

  return (
    <div className="verification-container">
      <div className="logo-container">
        <img src={logo} alt="Second Shop Logo" />
      </div>
      <div className={`message-box ${messageType}`}>
        <h1>Verificación Email</h1>
        <p>{message}</p>
        {messageType === "success" && (
          <button className="btn-submit" onClick={() => navigate("/login")}>
            Ir a iniciar sesión
          </button>
        )}
      </div>
    </div>
  );
}

export default VerificationPage;
