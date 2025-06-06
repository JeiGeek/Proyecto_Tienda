import React, { useState, useEffect } from "react";
import "../Stylesheets/Tipos.css";
import { FaShoppingBag } from "react-icons/fa";
import sos from "../imagenes/sostenible.png";

function Tipos() {
  const [showTipos, setShowTipos] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const openTipos = () => {
    setShowTipos(true);
    setFadeOut(false);
  };

  const closeTipos = () => {
    setFadeOut(true);
    setTimeout(() => {
      setShowTipos(false);
    }, 300);
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && showTipos) {
        closeTipos();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [showTipos]);

  return (
    <>
      <div className="tipos-tab" onClick={openTipos}>
        <div className="icon">
          <FaShoppingBag />
        </div>
        <div className="text">Tipo de producto</div>
      </div>

      {showTipos && (
        <div
          className={`tipos-overlay ${fadeOut ? "fade-out" : "fade-in"}`}
          onClick={closeTipos}
        >
          <div className="tipos-popup" onClick={(e) => e.stopPropagation()}>
            <div className="tipos-text">
              <h3>Tipos de Producto</h3>
              <p>
                En <strong>Second Shop</strong> encontrarás una gran variedad de
                productos diseñados para brindar utilidad o entretenimiento a
                ti, tus amigos, tu familia o tus mascotas, todo bajo un enfoque
                sostenible y ecológico. Ofrecemos desde juguetes y juegos, ropa
                de segunda mano en excelente estado, artículos personales y
                decorativos, hasta muchas otras categorías. Todo a un excelente
                precio, con buena calidad y comprometido con el cuidado del
                medio ambiente.
              </p>
            </div>
            <div className="tipos-logo">
              <img src={sos} alt="Logo de la empresa" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Tipos;
