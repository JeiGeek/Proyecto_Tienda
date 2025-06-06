import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button } from "react-bootstrap";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import "../Stylesheets/ProductoSlider.css";

const ProductSlider = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/productos")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener productos: ", error);
      });
  }, []);

  const slideLeft = () => {
    const slider = document.getElementById("product-slider");
    slider.scrollBy({ left: -300, behavior: "smooth" });
  };

  const slideRight = () => {
    const slider = document.getElementById("product-slider");
    slider.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="product-slider-container">
      <MdChevronLeft
        size={40}
        className="slider-icon left"
        onClick={slideLeft}
      />

      <div id="product-slider" className="product-slider">
        {products.length === 0 ? (
          <p>Cargando productos...</p>
        ) : (
          products.map((product) => (
            <div className="product-card" key={product.id}>
              <Card style={{ width: "18rem" }}>
                <Card.Img
                  variant="top"
                  src={`http://localhost:8080${product.imagenUrl}`}
                />

                <Card.Body>
                  <Card.Title>{product.nombre}</Card.Title>
                  <Card.Text>
                    <strong>Precio:</strong>{" "}
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 0,
                    }).format(product.precio)}
                  </Card.Text>

                  <Button
                    className="custom-green-button"
                    onClick={() => navigate(`/producto/${product.id}`)}
                  >
                    Ver Producto
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ))
        )}
      </div>

      <MdChevronRight
        size={40}
        className="slider-icon right"
        onClick={slideRight}
      />
    </div>
  );
};

export default ProductSlider;
