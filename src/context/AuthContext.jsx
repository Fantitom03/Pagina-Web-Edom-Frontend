import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/edomApi";
import Swal from "sweetalert2";
import { useCart } from "./CartContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authInitializing, setAuthInitializing] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("edomToken");
        const savedUser = localStorage.getItem("edomUser");

        if (token && savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                setUser(parsedUser);
            } catch (error) {
                console.error("Error parsing user:", error);
            }
        }
        setAuthInitializing(false);
    }, []);

    if (authInitializing) {
        return <div className="text-center py-20">Cargando sesión…</div>;
    }

    const login = async (email, password) => {
        try {
            const response = await api.post("/auth/login", { email, password });
            const { token, user: rawUser } = response.data;

            const { role } = rawUser;

            // Construyo el usuario "enriquecido" usando lo que ya viene:
            const enrichedUser = {
                ...rawUser,
                role: role.name,
                permissions: role.permissions.map(p => p.name)
            };

            // Persisto todo igual que antes
            localStorage.setItem("edomToken", token);
            localStorage.setItem("edomUser", JSON.stringify(enrichedUser));
            setUser(enrichedUser);

            return { token, user: enrichedUser };
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error de autenticación",
                text: "Credenciales incorrectas",
                confirmButtonColor: "#FF6B35"
            });
            return null;
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