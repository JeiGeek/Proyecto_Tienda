// src/views/Gracias.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/Gracias.css";
import tiendaLogo from "../imagenes/logo.png";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

const Gracias = () => {
  const [showConfetti, setShowConfetti] = useState(true);
  const { width, height } = useWindowSize();

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="gracias-container">
      {showConfetti && <Confetti width={width} height={height} />}
      <img src={tiendaLogo} alt="Logo Tienda" className="logo-tienda" />
      <h1 className="gracias-title"> ¡GRACIAS POR TU COMPRA! </h1>
      <a href="/home" className="return-to-store-btn">
        Volver a la tienda
      </a>
    </div>
  );
};

export default Gracias;
