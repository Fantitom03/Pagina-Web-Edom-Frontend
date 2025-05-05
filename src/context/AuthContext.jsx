import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/edomApi";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("edomToken");
        const savedUser = localStorage.getItem("edomUser");

        if (token && savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                setUser(parsedUser);
                api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            } catch (error) {
                console.error("Error parsing user:", error);
            }
        }
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post("/auth/login", { email, password });
            const { token, user: userData } = response.data;

            const decoded = jwtDecode(token);
            const userWithRole = {
                ...userData,
                role: decoded.role || "user"
            };

            localStorage.setItem("edomToken", token);
            localStorage.setItem("edomUser", JSON.stringify(userWithRole));
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            setUser(userWithRole);

            return true;
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error de autenticación",
                text: "Credenciales incorrectas",
                confirmButtonColor: "#FF6B35"
            });
            return false;
        }
    };

    const register = async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);

            Swal.fire({
                icon: 'success',
                title: 'Registro exitoso',
                html: `<p>Ahora puedes <a href="/login" class="text-primary underline">iniciar sesión</a></p>`,
                confirmButtonColor: '#FF6B35'
            });
            return true;
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Error desconocido';

            Swal.fire({
                icon: 'error',
                title: 'Error al registrar',
                html: `<div class="text-left">
                     <p>${errorMsg}</p>
                     <p class="mt-2">
                       ¿Ya tienes cuenta? 
                       <a href="/login" class="text-primary underline">Inicia sesión aquí</a>
                     </p>
                   </div>`,
                confirmButtonColor: '#FF6B35'
            });
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem("edomToken");
        localStorage.removeItem("edomUser");
        delete api.defaults.headers.common["Authorization"];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);