import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function Home() {
    const { user } = useAuth();
    const canManageUsers =
        user?.permissions.includes('read:users') ||
        user?.permissions.includes('manage:all');
    const canManageCategories =
        user?.permissions.includes('edit:categories') ||
        user?.permissions.includes('manage:all');

    // Variants para stagger de botones
    const container = {
        hidden: {},
        show: { transition: { staggerChildren: 0.15 } },
    };
    const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/fondo-home.jpg')" }}>
            <div className="bg-black/60 p-10 rounded-2xl text-center space-y-8 max-w-sm mx-auto shadow-2xl">
                {/* Logo animado */}
                <motion.img
                src="/EDOM.png"
                className="text-6xl font-logo text-orange-400 drop-shadow-lg"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }} />

                {/* Botones */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-4"
                >
                    {!user ? (
                        <>
                            {['Iniciar Sesión', 'Registrarse'].map((label, i) => (
                                <motion.div key={label} variants={item}>
                                    <Link
                                        to={label === 'Iniciar Sesión' ? '/login' : '/register'}
                                        className="block py-3 px-8 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg shadow-md transition"
                                    >
                                        {label}
                                    </Link>
                                </motion.div>
                            ))}
                        </>
                    ) : (
                        <>
                            <motion.div variants={item}>
                                <Link
                                    to="/items"
                                    className="block py-3 px-8 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg shadow-md transition"
                                >
                                    Ver Productos
                                </Link>
                            </motion.div>

                            {canManageUsers && (
                                <motion.div variants={item}>
                                    <Link
                                        to="/users"
                                        className="block py-3 px-8 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg shadow-md transition"
                                    >
                                        Gestión de Usuarios
                                    </Link>
                                </motion.div>
                            )}

                            {canManageCategories && (
                                <motion.div variants={item}>
                                    <Link
                                        to="/categories"
                                        className="block py-3 px-8 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-semibold text-lg shadow-md transition"
                                    >
                                        Gestión de Categorías
                                    </Link>
                                </motion.div>
                            )}
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    );
}