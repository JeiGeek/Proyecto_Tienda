# Second Shop: Tienda Online de Productos de Segunda Mano y Sustentables (Proyecto de Web)

![Second Shop Logo/Banner Placeholder](https://github.com/JeiGeek/Proyecto_tienda/blob/master/Frontend/src/imagenes/20.jpg)

## ♻️ Contexto del Proyecto

En la actualidad, la preocupación por el consumo responsable y el impacto ambiental de los productos nuevos es más relevante que nunca. Existe una creciente demanda de artículos de segunda mano y productos renovados, que buscan prolongar su ciclo de vida útil y fomentar una **economía circular**. Sin embargo, los consumidores a menudo se enfrentan a la falta de plataformas confiables, funcionales y amigables que satisfagan esta necesidad.

## 🎯 Problema a Resolver

Consumidores interesados en el **cuidado del medio ambiente** y en la **economía circular** se encuentran con dificultades al intentar adquirir productos reutilizables o sustentables. Las plataformas existentes a menudo no garantizan una experiencia de usuario adecuada, seguridad en el proceso de compra o una gestión eficiente de los productos.

## 💡 Solución Propuesta: Second Shop

Proponemos el desarrollo de **Second Shop**, una innovadora tienda virtual especializada en la venta de productos de segunda mano y sustentables. Nuestra misión es facilitar el acceso a **productos renovables** a través de una plataforma moderna, rápida y segura, que permite tanto a usuarios finales como a administradores gestionar compras, publicaciones y el control de inventario de manera eficiente.

## ✨ Características Destacadas

Second Shop ofrece una experiencia de compra intuitiva y segura, con funcionalidades clave para una gestión eficiente:

* **Autenticación Robusta:** Registro y login de usuarios con verificación por token (JWT).
* **Gestión Integral:** Panel de administración para gestionar productos, usuarios y roles.
* **Exploración de Productos:** Visualización clara y detallada de productos disponibles.
* **Experiencia de Compra:** Funcionalidad para agregar productos al carrito y realizar compras con confirmación.
* **Historial de Pedidos:** Seguimiento de todas las transacciones realizadas por el usuario.
* **Carga de Imágenes:** Facilidad para cargar imágenes de productos.
* **Seguridad:** Protección de rutas mediante Spring Security y JWT en el backend, y rutas seguras en el frontend.
* **Roles de Usuario:** Diferenciación entre usuarios comunes y administradores.

## 🛠️ Tecnologías Empleadas

El proyecto Second Shop está construido con un stack tecnológico robusto y moderno:

### Backend
* **Lenguaje:** Java 17
* **Framework:** Spring Boot 3.4.4
* **Gestor de Dependencias:** Maven
* **Seguridad:** Spring Security y JWT (JSON Web Tokens) para autenticación y autorización.
* **Persistencia de Datos:** JPA (Java Persistence API)
* **Base de Datos:** MySQL
* **Cliente API REST:** Postman (para pruebas y desarrollo)
* **Servidor de Pruebas:** Localhost

### Frontend
* **Librería:** React.js
* **Router:** React Router para navegación SPA (Single Page Application).
* **Manejo de Estado:** Context API de React.
* **Estilos:** CSS Modular.
* **Entorno de Desarrollo:** Visual Studio Code

### Arquitectura
* **Modelo de Arquitectura:** Basado en capas (Presentación, Servicio, Persistencia).
* **Comunicación:** Modelo Cliente-Servidor a través de servicios RESTful.

## 🏗️ Estructura del Proyecto
```
.
├── Backend/                            # Lógica de negocio y API REST (Java, Spring Boot)
│   ├── src/                            # Directorio principal de código fuente
│   │   ├── main/                       # Código fuente de la aplicación principal
│   │   │   ├── java/                   # Clases Java
│   │   │   │   └── com/jeigeek/tienda/ # Paquete raíz de la aplicación
│   │   │   │       ├── controller/     # Clases para manejar peticiones HTTP (API REST)
│   │   │   │       ├── service/        # Lógica de negocio principal
│   │   │   │       ├── repository/     # Interfaces para acceso a datos (JPA)
│   │   │   │       ├── model/          # Clases de modelo (entidades de base de datos)
│   │   │   │       ├── config/         # Configuraciones de seguridad, etc.
│   │   │   │       └── TiendaApplication.java # Clase principal de Spring Boot
│   │   │   └── resources/              # Archivos de configuración, estáticos, plantillas
│   │   │       ├── application.properties # Configuración de la aplicación (BD, puertos)
│   │   │       └── static/             # Archivos estáticos si los hubiera (ej. para imágenes locales)
│   │   └── test/                       # Código fuente para pruebas unitarias e integración
│   │       └── java/                   # Clases de prueba Java
│   └── pom.xml                         # Dependencias Maven y configuración del proyecto
├── Frontend/                           # Interfaz de usuario (React.js)
│   ├── public/                         # Archivos estáticos accesibles directamente (index.html, favicon, etc.)
│   ├── src/                            # Código fuente principal de React
│   │   ├── Componentes/                # Componentes reutilizables de React
│   │   ├── Stylesheets/                # Archivos CSS para estilos
│   │   ├── imagenes/                   # Imágenes usadas en el frontend
│   │   ├── services/                   # Servicios para consumir el API del backend
│   │   └── views/                      # Vistas o páginas principales de la aplicación
│   ├── package.json                    # Dependencias de Node.js y scripts del proyecto
│   └── README.md                       # README específico del frontend (si lo hay)
├── Diapositivas.pdf                    # Presentación general del proyecto
├── Proyecto de Web.pdf                 # Documentación detallada del proyecto
└── README.md                           # Este archivo (el README principal del repositorio)
```

Este proyecto fue desarrollado como parte de un trabajo de clase de Programación en la Web por:

* **Diego Alejandro Rodriguez**
* **Jeison Fernando Guarguati Anaya**

## Repositorio de referencia
* https://github.com/nicoriver123/frontend_tienda
* https://github.com/nicoriver123/Tienda
