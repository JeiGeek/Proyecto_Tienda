import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isloading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser && storedUser !== "undefined") {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error al parsear el usuario desde localStorage:", error);
        localStorage.removeItem("user"); // Limpia el dato corrupto
      }
    }

    setIsLoading(false);
  }, []);

  const login = (userData) => {
    if (userData) {
      setUser(userData);
      try {
        localStorage.setItem("user", JSON.stringify(userData));
      } catch (error) {
        console.error("Error al guardar el usuario en localStorage:", error);
      }
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isloading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

