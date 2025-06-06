import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const AdminRoute = () => {
  const { user, isloading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(null);
  const [loadingAdmin, setLoadingAdmin] = useState(true);

  useEffect(() => {
    if (isloading) return; // Espera que termine la carga del usuario

    if (!user) {
      setIsAdmin(false);
      setLoadingAdmin(false);
      return;
    }

    const token = localStorage.getItem("token");
    console.log("Token enviado:", token);

    fetch("http://localhost:8080/api/usuario/admin/status", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        console.log("Status de respuesta:", res.status);
        if (!res.ok) throw new Error("No autorizado");
        return res.json();
      })
      .then((data) => {
        console.log("Respuesta del backend:", data);
        setIsAdmin(data === true);
      })
      .catch((err) => {
        console.error("Error al verificar admin:", err);
        setIsAdmin(false);
      })
      .finally(() => {
        setLoadingAdmin(false);
      });
  }, [user, isloading]);

  if (isloading || loadingAdmin) return <div>Cargando permiso de admin...</div>;

  if (isAdmin) return <Outlet />;

  return <Navigate to="/no-autorizado" replace />;
};

export default AdminRoute;



