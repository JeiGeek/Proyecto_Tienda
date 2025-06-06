import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Stylesheets/AdminPanel.css";

const AdminPanel = () => {
  // Estado para controlar la pestaña activa: "producto" o "usuario"
  const [activeTab, setActiveTab] = useState("producto");

  // ----- Estados para Productos -----
  // Lista de productos
  const [products, setProducts] = useState([]);
  // Controla la visibilidad del modal para crear producto
  const [showCreateModal, setShowCreateModal] = useState(false);
  // Datos para crear un nuevo producto
  const [newProduct, setNewProduct] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    imagen: null,
  });
  // Controla la visibilidad del modal para editar producto
  const [showEditModal, setShowEditModal] = useState(false);
  // Datos del producto que se está editando
  const [editProduct, setEditProduct] = useState({
    id: null,
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    imagen: null,
  });
  // Estado para indicar si se están cargando los productos
  const [loadingProducts, setLoadingProducts] = useState(false);
  // Estado para indicar si se está creando un producto
  const [creating, setCreating] = useState(false);
  // Estado para indicar si se está actualizando un producto
  const [updating, setUpdating] = useState(false);

  // ----- Estados para Usuarios -----
  // Lista de usuarios
  const [users, setUsers] = useState([]);
  // Estado para indicar si se están cargando los usuarios
  const [loadingUsers, setLoadingUsers] = useState(false);
  // Controla la visibilidad del modal para editar usuario
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  // Datos del usuario que se está editando
  const [editUser, setEditUser] = useState({
    id: null,
    username: "",
    email: "",
    nombre: "",
    pais: "",
    telefono: "",
    estado: false,
    admin: false,
  });
  // Estado para indicar si se está actualizando un usuario
  const [updatingUser, setUpdatingUser] = useState(false);

  // Función para obtener la lista de productos desde la API
  const fetchProducts = () => {
    setLoadingProducts(true);
    axios
      .get("http://localhost:8080/api/productos")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error cargando productos", err))
      .finally(() => setLoadingProducts(false));
  };

  // Función para obtener la lista de usuarios desde la API
  const fetchUsers = () => {
    setLoadingUsers(true);
    axios
      .get("http://localhost:8080/api/usuario")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error cargando usuarios", err))
      .finally(() => setLoadingUsers(false));
  };

  // useEffect para cargar datos cuando cambia la pestaña activa
  useEffect(() => {
    if (activeTab === "producto") {
      fetchProducts();
    } else if (activeTab === "usuario") {
      fetchUsers();
    }
  }, [activeTab]);

  /**
   * Maneja el cambio en inputs para productos y usuarios.
   * 
   * @param {Event} e Evento del input
   * @param {boolean} isEdit Indica si es para editar (true) o crear (false)
   * @param {boolean} isUser Indica si es un campo de usuario (true) o producto (false)
   */
  const handleInputChange = (e, isEdit = false, isUser = false) => {
    const { name, value, files, type, checked } = e.target;

    if (isUser) {
      if (isEdit) {
        // Para editar usuario, maneja checkbox y text inputs
        setEditUser((prev) => ({
          ...prev,
          [name]: type === "checkbox" ? checked : value,
        }));
      } else {
        // Aquí se podría manejar creación de usuario si se implementa
      }
    } else {
      if (isEdit) {
        // Para editar producto, si es imagen guarda archivo, sino texto
        if (name === "imagen") {
          setEditProduct((prev) => ({ ...prev, imagen: files[0] }));
        } else {
          setEditProduct((prev) => ({ ...prev, [name]: value }));
        }
      } else {
        // Para crear producto, mismo manejo que editar
        if (name === "imagen") {
          setNewProduct((prev) => ({ ...prev, imagen: files[0] }));
        } else {
          setNewProduct((prev) => ({ ...prev, [name]: value }));
        }
      }
    }
  };

  // Maneja la creación de un nuevo producto
  const handleCreateProduct = async (e) => {
    e.preventDefault();

    // Validación básica de campos obligatorios
    if (
      !newProduct.nombre ||
      !newProduct.descripcion ||
      !newProduct.precio ||
      !newProduct.stock ||
      !newProduct.imagen
    ) {
      alert("Por favor completa todos los campos");
      return;
    }

    setCreating(true);
    try {
      const formData = new FormData();
      formData.append("nombre", newProduct.nombre);
      formData.append("descripcion", newProduct.descripcion);
      formData.append("precio", newProduct.precio);
      formData.append("stock", newProduct.stock);
      formData.append("imagen", newProduct.imagen);

      // Llamada POST para crear producto
      await axios.post("http://localhost:8080/api/productos/crear", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Cerrar modal y limpiar formulario
      setShowCreateModal(false);
      setNewProduct({
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        imagen: null,
      });
      fetchProducts(); // Refrescar lista
    } catch (error) {
      console.error("Error creando producto:", error);
      alert("Error creando producto");
    } finally {
      setCreating(false);
    }
  };

  // Abre el modal para editar un producto y carga sus datos
  const openEditModal = (product) => {
    setEditProduct({
      id: product.id,
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      stock: product.stock,
      imagen: null, // No cargar imagen en preview
    });
    setShowEditModal(true);
  };

  // Maneja la actualización del producto editado
  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    // Validación básica
    if (
      !editProduct.nombre ||
      !editProduct.descripcion ||
      !editProduct.precio ||
      !editProduct.stock
    ) {
      alert("Por favor completa todos los campos (excepto imagen)");
      return;
    }

    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append("nombre", editProduct.nombre);
      formData.append("descripcion", editProduct.descripcion);
      formData.append("precio", editProduct.precio);
      formData.append("stock", editProduct.stock);
      if (editProduct.imagen) {
        formData.append("imagen", editProduct.imagen);
      }

      // Llamada PUT para actualizar producto
      await axios.put(
        `http://localhost:8080/api/productos/actualizar/${editProduct.id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Cerrar modal y limpiar formulario
      setShowEditModal(false);
      setEditProduct({
        id: null,
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        imagen: null,
      });
      fetchProducts(); // Refrescar lista
    } catch (error) {
      console.error("Error actualizando producto:", error);
      alert("Error actualizando producto");
    } finally {
      setUpdating(false);
    }
  };

  // Maneja la eliminación de un producto
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/productos/${id}`);
      fetchProducts(); // Refrescar lista
    } catch (error) {
      console.error("Error eliminando producto:", error);
      alert("Error eliminando producto");
    }
  };

  // Abre modal para editar usuario y carga sus datos
  const openEditUserModal = (user) => {
    setEditUser({
      id: user.id,
      username: user.username,
      email: user.email,
      nombre: user.nombre || "",
      pais: user.pais || "",
      telefono: user.telefono || "",
      estado: user.estado || false,
      admin: user.admin || false,
    });
    setShowEditUserModal(true);
  };

  // Maneja la actualización de usuario
  const handleUpdateUser = async (e) => {
    e.preventDefault();

    // Validación básica
    if (!editUser.username || !editUser.email) {
      alert("Username y Email son obligatorios");
      return;
    }

    setUpdatingUser(true);
    try {
      await axios.put(
        `http://localhost:8080/api/usuario/actualizar_user/${editUser.id}`,
        editUser
      );
      setShowEditUserModal(false);
      fetchUsers(); // Refrescar lista
    } catch (error) {
      console.error("Error actualizando usuario:", error);
      alert("Error actualizando usuario");
    } finally {
      setUpdatingUser(false);
    }
  };

  // Maneja la eliminación de un usuario
  const handleDeleteUser = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/usuario/eliminar/${id}`);
      fetchUsers(); // Refrescar lista
    } catch (error) {
      console.error("Error eliminando usuario:", error);
      alert("Error eliminando usuario");
    }
  };
/* ------------------------------------------------------------------------------------------------------------------*/
/* ------------------------------------------------------------------------------------------------------------------*/
/* ------------------------------------------------------------------------------------------------------------------*/
  return (
    
    <div className="admin-panel-wrapper">
      <h1>Panel de Administración</h1>

      {/* Botones para cambiar entre pestañas */}
      <div className="admin-header">
        <button
          className={`tab-btn ${activeTab === "producto" ? "active" : ""}`}
          onClick={() => setActiveTab("producto")}
        >
          Producto
        </button>
        <button
          className={`tab-btn ${activeTab === "usuario" ? "active" : ""}`}
          onClick={() => setActiveTab("usuario")}
        >
          Usuario
        </button>
      </div>

      <div className="admin-content">
        {/* Sección Productos */}
        {activeTab === "producto" && (
          <div className="producto-section">
            <button
              className="btn-agregar"
              onClick={() => setShowCreateModal(true)}
            >
              Agregar Producto
            </button>

            {/* Encabezado tabla productos */}
            <div className="producto-header usuario-header">
              <div className="col imagen">Imagen</div>
              <div className="col id">ID</div>
              <div className="col nombre">Nombre</div>
              <div className="col precio">Precio</div>
              <div className="col stock">Stock</div>
              <div className="col acciones">Acciones</div>
            </div>

            {/* Contenido productos: loading, vacío o lista */}
            {loadingProducts ? (
              <p>Cargando productos...</p>
            ) : products.length === 0 ? (
              <p>No hay productos disponibles</p>
            ) : (
              products.map((product) => (
                <div className="producto-row" key={product.id}>
                  <div className="col imagen">
                    <img
                      src={`http://localhost:8080${
                        product.imagenUrl.startsWith("/")
                          ? product.imagenUrl
                          : `/${product.imagenUrl}`
                      }`}
                      alt={product.nombre}
                      className="product-image"
                    />
                  </div>
                  <div className="col id">{product.id}</div>
                  <div className="col nombre">{product.nombre}</div>
                  <div className="col precio">${product.precio}</div>
                  <div className="col stock">{product.stock}</div>
                  <div className="col acciones">
                    <button
                      className="btn-editar"
                      onClick={() => openEditModal(product)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-eliminar"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* Modal Crear Producto */}
            {showCreateModal && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h2>Crear Producto</h2>
                  <form onSubmit={handleCreateProduct} className="create-form">
                    <label>
                      Nombre:
                      <input
                        type="text"
                        name="nombre"
                        value={newProduct.nombre}
                        onChange={handleInputChange}
                      />
                    </label>

                    <label>
                      Descripción:
                      <textarea
                        name="descripcion"
                        value={newProduct.descripcion}
                        onChange={handleInputChange}
                      />
                    </label>

                    <label>
                      Precio:
                      <input
                        type="number"
                        name="precio"
                        value={newProduct.precio}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                      />
                    </label>

                    <label>
                      Stock:
                      <input
                        type="number"
                        name="stock"
                        value={newProduct.stock}
                        onChange={handleInputChange}
                        min="0"
                        step="1"
                      />
                    </label>

                    <label>
                      Imagen:
                      <input
                        type="file"
                        name="imagen"
                        accept="image/jpeg"
                        onChange={handleInputChange}
                      />
                    </label>

                    <div className="modal-buttons">
                      <button type="submit" disabled={creating}>
                        {creating ? "Creando..." : "Crear"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCreateModal(false)}
                        disabled={creating}
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Modal Editar Producto */}
            {showEditModal && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h2>Editar Producto</h2>
                  <form onSubmit={handleUpdateProduct} className="create-form">
                    <label>
                      Nombre:
                      <input
                        type="text"
                        name="nombre"
                        value={editProduct.nombre}
                        onChange={(e) => handleInputChange(e, true)}
                      />
                    </label>

                    <label>
                      Descripción:
                      <textarea
                        name="descripcion"
                        value={editProduct.descripcion}
                        onChange={(e) => handleInputChange(e, true)}
                      />
                    </label>

                    <label>
                      Precio:
                      <input
                        type="number"
                        name="precio"
                        value={editProduct.precio}
                        onChange={(e) => handleInputChange(e, true)}
                        min="0"
                        step="0.01"
                      />
                    </label>

                    <label>
                      Stock:
                      <input
                        type="number"
                        name="stock"
                        value={editProduct.stock}
                        onChange={(e) => handleInputChange(e, true)}
                        min="0"
                        step="1"
                      />
                    </label>

                    <label>
                      Imagen: (Dejar vacío para no cambiar)
                      <input
                        type="file"
                        name="imagen"
                        accept="image/jpeg"
                        onChange={(e) => handleInputChange(e, true)}
                      />
                    </label>

                    <div className="modal-buttons">
                      <button type="submit" disabled={updating}>
                        {updating ? "Actualizando..." : "Actualizar"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowEditModal(false)}
                        disabled={updating}
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sección Usuarios */}
        {activeTab === "usuario" && (
          <div className="producto-section">
            {/*<div className="admin-buttons">
              <button
                className="btn-agregar"
                onClick={() => alert("Funcionalidad crear usuario no implementada aún")}
              >
                Registrar Usuario
              </button>
            </div>*/}

            {/* Encabezado tabla usuarios, usando mismas clases para consistencia */}
            <div className="producto-header usuario-header">
              <div className="col id">ID</div>
              <div className="col nombre">Nombre</div>
              <div className="col username">Usuario</div>
              <div className="col telefono">Teléfono</div>
              <div className="col pais">País</div>
              <div className="col acciones">Acciones</div>
            </div>

            {/* Contenido usuarios: loading, vacío o lista */}
            {loadingUsers ? (
              <p>Cargando usuarios...</p>
            ) : users.length === 0 ? (
              <p>No hay usuarios disponibles</p>
            ) : (
              users.map((user) => (
                <div className="producto-row usuario-row" key={user.id}>
                  <div className="col id">{user.id}</div>
                  <div className="col nombre">{user.nombre || "-"}</div>
                  <div className="col username">{user.username}</div>
                  <div className="col telefono">{user.telefono || "-"}</div>
                  <div className="col pais">{user.pais || "-"}</div>
                  <div className="col acciones">
                    <button className="btn-editar" onClick={() => openEditUserModal(user)}>
                      Editar
                    </button>
                    <button className="btn-eliminar" onClick={() => handleDeleteUser(user.id)}>
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* Modal Editar Usuario */}
            {showEditUserModal && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h2>Editar Usuario</h2>
                  <form onSubmit={handleUpdateUser} className="create-form">
                    <label>
                      Username:
                      <input
                        type="text"
                        name="username"
                        value={editUser.username}
                        onChange={(e) => handleInputChange(e, true, true)}
                      />
                    </label>

                    <label>
                      Email:
                      <input
                        type="email"
                        name="email"
                        value={editUser.email}
                        onChange={(e) => handleInputChange(e, true, true)}
                      />
                    </label>

                    <label>
                      Nombre:
                      <input
                        type="text"
                        name="nombre"
                        value={editUser.nombre}
                        onChange={(e) => handleInputChange(e, true, true)}
                      />
                    </label>

                    <label>
                      País:
                      <input
                        type="text"
                        name="pais"
                        value={editUser.pais}
                        onChange={(e) => handleInputChange(e, true, true)}
                      />
                    </label>

                    {/* Nuevo campo teléfono */}
                    <label>
                      Teléfono:
                      <input
                        type="text"
                        name="telefono"
                        value={editUser.telefono}
                        onChange={(e) => handleInputChange(e, true, true)}
                      />
                    </label>

                    {/* Nuevo checkbox para rol admin */}
                    <label>
                      Admin:
                      <input
                        type="checkbox"
                        name="admin"
                        checked={editUser.admin}
                        onChange={(e) => handleInputChange(e, true, true)}
                      />
                    </label>

                    <div className="modal-buttons">
                      <button type="submit" disabled={updatingUser}>
                        {updatingUser ? "Actualizando..." : "Actualizar"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowEditUserModal(false)}
                        disabled={updatingUser}
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;

