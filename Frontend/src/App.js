import "./App.css";
import "./Stylesheets/Home.css";
import "./Stylesheets/logo.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./Componentes/AuthContext";
import Login from "./Componentes/Login";
import Registro from "./Componentes/Registro";
import VerificationPage from "./Componentes/VerificationPage";
import Layaout from "./views/Layout";
import Home from "./views/Home";
import ProductDetail from "./views/ProductDetail";
import Perfil from "./views/Perfil";
import ProtectedRoute from "./Componentes/ProtectedRoute";
import Checkout from "./Componentes/Checkout";
import Gracias from "./Componentes/Gracias";
import AdminPanel from "./Componentes/AdminPanel";
import AdminRoute from "./Componentes/AdminRoute";
import NoAutorizado from "./Componentes/NoAutorizado";
import TodosLosProductos from "./Componentes/TodosLosProductos"; // <-- IMPORTADO AQUÍ

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Rutas dentro del layout */}
            <Route path="/" element={<Layaout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/productos" element={<TodosLosProductos />} />{" "}
              {/* <-- RUTA AGREGADA */}
              <Route path="/producto/:id" element={<ProductDetail />} />
              {/* Rutas protegidas (usuario logueado) */}
              <Route element={<ProtectedRoute />}>
                <Route path="/perfil" element={<Perfil />} />
              </Route>
              {/* Ruta protegida para admins */}
              <Route element={<AdminRoute />}>
                <Route path="/panel" element={<AdminPanel />} />
              </Route>
              {/* Ruta para acceso no autorizado */}
              <Route path="/no-autorizado" element={<NoAutorizado />} />
            </Route>

            {/* Rutas fuera del layout */}
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/verification" element={<VerificationPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/gracias" element={<Gracias />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
