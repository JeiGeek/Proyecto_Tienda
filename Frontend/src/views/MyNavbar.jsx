import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useAuth } from "../Componentes/AuthContext";
import { FaShoppingBag } from "react-icons/fa";
import { useCart } from "../Componentes/CartContext";
import Badge from "react-bootstrap/Badge";
import "../Stylesheets/MyNavbar.css";

function MyNavbar() {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    showCartMenu,
    setShowCartMenu,
    clearCart,
  } = useCart();

  const { user, logout } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const searchRef = useRef(null);

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

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      setFilteredProducts([]);
      setShowCartMenu(false);
    } else {
      const filtered = products.filter((product) =>
        product.nombre.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredProducts(filtered);
      setShowSuggestions(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim() === "") return;
    if (filteredProducts.length > 0) {
      window.location.href = `/producto/${filteredProducts[0].id}`;
    }
    setShowSuggestions(true);
  };

  const handleCartClick = () => {
    setShowCartMenu(!showCartMenu);
  };

  const handleIncreaseQuantity = (productId, stock) => {
    const productInCart = cart.find((item) => item.id === productId);
    if (productInCart.quantity + 1 > stock) {
      setErrorMessage("No hay suficiente stock disponible");
    } else {
      increaseQuantity(productId);
      setErrorMessage("");
    }
  };

  const totalItemsInCart = cart.length;

  const totalPrice = cart.reduce(
    (total, product) => total + product.precio * product.quantity,
    0
  );

  const handleLogout = () => {
    logout();
    clearCart();
  };

  const handleCheckout = () => {
    if (user) {
      window.location.href = "/checkout";
    } else {
      window.location.href = "/login";
    }
  };

  const handleDecreaseQuantity = (productId) => {
    decreaseQuantity(productId);
    setErrorMessage("");
  };

  return (
    <Navbar expand="lg" className="color-navbar fixed-top" sticky="top">
      <Container>
        <Nav className="d-flex align-items-center">
          <img
            className="imagen_logo"
            src={require("../imagenes/logo.png")}
            alt="Logo tienda"
          />
          <Navbar.Brand className="ms-3 custom-font" href="/home">
            Second Shop
          </Navbar.Brand>

          <div
            className="search-container d-flex align-items-center"
            ref={searchRef}
          >
            <Form
              className="d-flex"
              onSubmit={handleSubmit}
              style={{ flexGrow: 1 }}
            >
              <Form.Control
                type="search"
                placeholder="Buscar productos"
                className="me-2"
                value={searchTerm}
                onChange={handleSearch}
                onFocus={() => {
                  if (searchTerm.trim() !== "") {
                    setShowSuggestions(true);
                  }
                }}
              />
              {showSuggestions && (
                <div className="search-suggestions">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <a
                        key={product.id}
                        href={`/producto/${product.id}`}
                        className="suggestion-item"
                        onClick={() => {
                          setShowSuggestions(false);
                          setSearchTerm("");
                        }}
                      >
                        <img
                          alt={product.nombre}
                          src={`http://localhost:8080${product.imagenUrl}`}
                          className="suggestion-image"
                        />
                        <div className="suggestion-details">
                          <div className="suggestion-name">
                            {product.nombre}
                          </div>
                          <div className="suggestion-price">
                            {new Intl.NumberFormat("es-CO", {
                              style: "currency",
                              currency: "COP",
                              minimumFractionDigits: 0,
                            }).format(product.precio)}
                          </div>
                        </div>
                      </a>
                    ))
                  ) : (
                    <div className="no-results">
                      No se encontraron productos =c
                    </div>
                  )}
                </div>
              )}
            </Form>

            <Button
              className="btn-search-right custom-font"
              href="/productos"
              type="button"
            >
              Productos
            </Button>
          </div>
        </Nav>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="#" className="cart-icon" onClick={handleCartClick}>
              <FaShoppingBag size={24} />
              {totalItemsInCart > 0 && (
                <Badge pill bg="danger" className="cart-badge">
                  {totalItemsInCart}
                </Badge>
              )}
            </Nav.Link>

            {user ? (
              <NavDropdown title={user.name} id="basic-nav-dropdown">
                <NavDropdown.Item href="/perfil">Perfil</NavDropdown.Item>
                <NavDropdown.Item href="/ayuda">Ayuda</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Cerrar Sesión
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link href="/login">Iniciar Sesión</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>

      <Offcanvas
        show={showCartMenu}
        onHide={() => setShowCartMenu(false)}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Carrito de compras</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}

          <div className="cart-items-container">
            {cart.map((product) => (
              <div key={product.id} className="cart-item">
                <img
                  src={`http://localhost:8080${product.imagenUrl}`}
                  alt="imagen-url"
                  className="cart-item-img"
                />

                <div className="cart-items-details">
                  <p>{product.nombre}</p>
                  <p>
                    Precio Unitario :{" "}
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 0,
                    }).format(product.precio)}
                  </p>
                  <div className="quantity-container">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDecreaseQuantity(product.id)}
                    >
                      -
                    </Button>
                    <span className="quantity">{product.quantity}</span>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        handleIncreaseQuantity(product.id, product.stock)
                      }
                    >
                      +
                    </Button>
                  </div>
                  <p>
                    Precio Total :{" "}
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 0,
                    }).format(product.precio * product.quantity)}
                  </p>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeFromCart(product.id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-total">
            <hr />
            <p className="total-text">
              <strong>Total :</strong>{" "}
              {new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
                minimumFractionDigits: 0,
              }).format(totalPrice)}
            </p>

            {totalItemsInCart > 0 && (
              <Button
                className="bg-gr text-white w-100 mt-3"
                onClick={handleCheckout}
              >
                {user ? "Ir a Pagar" : "Inicia Sesión para Continuar"}
              </Button>
            )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </Navbar>
  );
}

export default MyNavbar;
