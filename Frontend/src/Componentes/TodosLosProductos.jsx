import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../Stylesheets/TodosLosProductos.css";

const TodosLosProductos = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/productos")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error al obtener productos:", error));
  }, []);

  return (
    <Container className="mt-5 pt-5">
      <h2 className="titulo-ola">
        {"Todos los Productos".split("").map((letra, i) =>
          letra === " " ? (
            <span key={i} style={{ width: "0.5rem", display: "inline-block" }}>
              {" "}
            </span>
          ) : (
            <span key={i} style={{ animationDelay: `${i * 0.1}s` }}>
              {letra}
            </span>
          )
        )}
      </h2>

      <Row>
        {products.map((product) => (
          <Col key={product.id} md={4} className="mb-4">
            <Card className="shadow">
              <Card.Img
                variant="top"
                src={`http://localhost:8080${product.imagenUrl}`}
                className="product-img"
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
                  className="custom-green-button w-100"
                  onClick={() => navigate(`/producto/${product.id}`)}
                >
                  Ver Producto
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default TodosLosProductos;
