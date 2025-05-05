import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { can } from '../utils/auth';

const NavBar = () => {
    const { user, logout } = useAuth();
    const canManage = user?.permissions.includes('read:users') || user?.permissions.includes('manage:all');
    
    const navLinks = [
        { label: 'Inicio', path: '/', show: true },
        { label: 'Productos', path: '/items', show: true },
        { label: 'Admin Usuarios', path: '/users', show: can(user, 'manage:users') },
    ];

    return (
        <nav className="bg-white shadow-lg fixed w-full z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="text-2xl font-bold text-primary">
                        E-DOM
                    </Link>
                    
                    <div className="hidden md:flex gap-6 items-center">
                        {navLinks.map((link) => link.show && (
                            <Link key={link.path} to={link.path} className="hover:text-primary-dark">
                                {link.label}
                            </Link>
                        ))}
                        
                        {user ? (
                            <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">
                                Cerrar Sesión
                            </button>
                        ) : (
                            <div className="flex gap-4">
                                <Link to="/login" className="bg-primary text-white px-4 py-2 rounded">
                                    Ingresar
                                </Link>
                                <Link to="/register" className="bg-gray-200 px-4 py-2 rounded">
                                    Registrarse
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;