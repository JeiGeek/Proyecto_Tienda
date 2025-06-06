// src/Componentes/Checkout.jsx
import React from "react";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";
import "../Stylesheets/Checkout.css";
import mirar from "../imagenes/mirar.png";

const Checkout = () => {
  const { cart, clearCart, removeFromCart } = useCart();
  const navigate = useNavigate();

  const totalPrice = cart.reduce(
    (total, product) => total + product.precio * product.quantity,
    0
  );

  const handlePayment = (e) => {
    e.preventDefault();
    clearCart();
    navigate("/gracias");
  };

  return (
    <div className="checkout-container">
      <div className="checkout-wrapper">
        <div className="checkout-munequito">
          <img src={mirar} alt="Logo Muñequito" />
        </div>

        {/* Columna de Productos */}
        <div className="checkout-products-section">
          <h2>Resumen de Compra</h2>
          <div className="checkout-products">
            {cart.map((product) => (
              <div key={product.id} className="checkout-product">
                <button
                  className="remove-product-btn"
                  onClick={() => removeFromCart(product.id)}
                  title="Eliminar producto"
                >
                  ×
                </button>
                <img
                  src={`http://localhost:8080${product.imagenUrl}`}
                  alt={product.nombre}
                  className="checkout-product-img"
                />
                <div className="checkout-product-details">
                  <p className="product-name">{product.nombre}</p>
                  <p className="product-price">
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 0,
                    }).format(product.precio)}
                  </p>
                  <p className="product-quantity">
                    Cantidad: {product.quantity}
                  </p>
                  <p className="product-total">
                    Total:{" "}
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 0,
                    }).format(product.precio * product.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Total a pagar */}
          <div className="checkout-total">
            <h3>
              Total a pagar:{" "}
              {new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
                minimumFractionDigits: 0,
              }).format(totalPrice)}
            </h3>
          </div>
        </div>

        {/* Columna de Pago */}
        <div className="checkout-payment-section">
          <form className="payment-form" onSubmit={handlePayment}>
            <h3>Detalles de Pago</h3>
            <label>
              Nombre en la tarjeta:
              <input type="text" required />
            </label>
            <label>
              Número de tarjeta:
              <input type="text" maxLength="16" required />
            </label>
            <label>
              Fecha de expiración:
              <input type="text" placeholder="MM/YY" maxLength="5" required />
            </label>
            <label>
              CVV:
              <input type="text" maxLength="3" required />
            </label>
            <button type="submit">Pagar</button>
            <a href="/home" className="return-to-store-btn">
              ⬅ Volver a la tienda
            </a>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
