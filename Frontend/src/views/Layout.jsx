import React from "react";
import MyNavbar from "./MyNavbar";
import { Outlet } from "react-router-dom";

function Layout() {
    return (
        <>
        <MyNavbar /> {/* Mostramos la navbar */}
        <div className="container mt-4">
            <Outlet /> {/* Aquí se cargan las rutas hijas */}
        </div>
        </>
    );
}

export default Layout;
