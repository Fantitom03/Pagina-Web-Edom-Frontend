import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Home() {
    const { user } = useAuth();

    if (!user) {
        // Usuario no logueado
        return (
            <div className="container mx-auto px-4 pt-20">
                <h1 className="text-4xl mb-8">Bienvenido</h1>
                <div className="space-x-4">
                    <Link to="/login" className="px-4 py-2 bg-emerald-600 text-white rounded">
                        Iniciar Sesión
                    </Link>
                    <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded">
                        Registrarse
                    </Link>
                </div>
            </div>
        );
    }

    // Si está logueado:
    const canManage = user.permissions.includes('read:users') || user.permissions.includes('manage:all');
    return (
        <div className="container mx-auto px-4 pt-20">
            <h1 className="text-4xl mb-8">Bienvenido, {user.username}</h1>
            <div className="space-x-4">
                <Link to="/items" className="px-4 py-2 bg-emerald-600 text-white rounded">
                    Ver Productos
                </Link>
                {canManage && (
                    <Link to="/users" className="px-4 py-2 bg-blue-600 text-white rounded">
                        Gestión de Usuarios
                    </Link>
                )}
            </div>
        </div>
    );
}