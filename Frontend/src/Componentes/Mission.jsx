import React, { useState, useEffect } from "react";
import "../Stylesheets/Mission.css";
import logo from "../imagenes/segunda.png"; // importa tu logo aquí

function Mission() {
  const [showMission, setShowMission] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const openMission = () => {
    setShowMission(true);
    setFadeOut(false);
  };

  const closeMission = () => {
    setFadeOut(true);
    setTimeout(() => {
      setShowMission(false);
    }, 300); // duración del fade en ms, igual que CSS
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && showMission) {
        closeMission();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [showMission]);

  return (
    <>
      <div className="mission-tab" onClick={openMission}>
        <div className="star">★</div>
        <div className="text">¿Quiénes somos?</div>
      </div>

      {showMission && (
        <div
          className={`mission-overlay ${fadeOut ? "fade-out" : "fade-in"}`}
          onClick={closeMission}
        >
          <div
            className="mission-popup"
            onClick={(e) => e.stopPropagation()} // evita cerrar al click dentro del cuadro
          >
            <div className="mission-text">
              <h3>Second Shop</h3>
              <p>
                Somos una empresa enfocada en el consumo responsable y la
                sostenibilidad. Ofrecemos productos de distintas categorías que
                son reutilizables, renovables o de segunda mano en excelente
                estado. Creemos en dar una segunda vida a los objetos,
                reduciendo el desperdicio y cuidando el planeta. Nuestro
                compromiso es acercar opciones accesibles, útiles y conscientes
                para quienes buscan comprar de forma más responsable.
              </p>
            </div>
            <div className="mission-logo">
              <img src={logo} alt="Logo de la empresa" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Mission;
