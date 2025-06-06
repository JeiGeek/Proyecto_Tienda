// src/Componentes/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../Componentes/CartContext";
import "../Stylesheets/ProductDetails.css";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart, setShowCartMenu, errorMessage } = useCart();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/productos/${id}`
        );
        setProduct(response.data);
      } catch (err) {
        console.error("Error al cargar producto:", err);
        setError("Error al cargar producto");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="loading-spinner">Cargando...</div>;
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const totalPrice = product.precio * quantity;

  return (
    <div className="product-detail-container">
      <div className="product-detail-wrapper">
        {/* Imagen del producto */}
        <div className="product-image-section">
          <img
            src={`http://localhost:8080${product.imagenUrl}`}
            alt={product.nombre}
            className="product-detail-img"
          />
        </div>

        {/* Información y acciones */}
        <div className="product-info-section">
          <h2 className="product-name">{product.nombre}</h2>
          <p className="product-description">{product.descripcion}</p>

          <p className="product-price">
            Precio Unitario:{" "}
            {new Intl.NumberFormat("es-CO", {
              style: "currency",
              currency: "COP",
              minimumFractionDigits: 0,
            }).format(product.precio)}
          </p>
          <p className="product-stock">Stock disponible: {product.stock}</p>

          <div className="quantity-container">
            <button className="quantity-btn" onClick={decreaseQuantity}>
              -
            </button>
            <span className="quantity">{quantity}</span>
            <button className="quantity-btn" onClick={increaseQuantity}>
              +
            </button>
          </div>

          <p className="product-total-price">
            Precio Total:{" "}
            {new Intl.NumberFormat("es-CO", {
              style: "currency",
              currency: "COP",
              minimumFractionDigits: 0,
            }).format(totalPrice)}
          </p>

          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}

          <button
            className="add-to-cart-btn"
            onClick={() => {
              addToCart(product, quantity);
              setShowCartMenu(true);
            }}
          >
            Agregar al Carrito
          </button>

          <Link to="/home" className="return-to-store-btn">
            ⬅ Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
