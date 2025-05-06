import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { can } from '../utils/auth';
import { useCart } from '../context/CartContext';
import ThemeToggle from './ThemeToggle';
import { Transition } from '@headlessui/react';

export default function NavBar() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { totalItems } = useCart();
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { label: 'Inicio', to: '/', show: true },
        { label: 'Productos', to: '/items', show: true },
        { label: 'Usuarios', to: '/users', show: can(user, 'read:users') },
        { label: 'Categorías', to: '/categories', show: can(user, 'edit:categories') },
    ];

    return (
        <nav className="bg-white dark:bg-gray-900 fixed w-full z-50 shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center">
                            <span className="text-2xl font-extrabold text-orange-600 dark:text-orange-400">
                                E-DOM
                            </span>
                        </Link>
                    </div>

                    {/* Desktop menu */}
                    <div className="hidden md:flex md:items-center md:space-x-6">
                        {navLinks.map(
                            ({ label, to, show }) =>
                                show && (
                                    <Link
                                        key={to}
                                        to={to}
                                        className="text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400 px-3 py-2 rounded-md font-medium transition"
                                    >
                                        {label}
                                    </Link>
                                )
                        )}

                        <ThemeToggle />

                        {user && (
                            <button
                                onClick={() => navigate('/cart')}
                                className="relative p-2 text-2xl hover:text-orange-600 dark:hover:text-orange-400 transition"
                                aria-label="Ver carrito"
                            >
                                🛒
                                {totalItems > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                                        {totalItems}
                                    </span>
                                )}
                            </button>
                        )}

                        {user ? (
                            <button
                                onClick={logout}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition cursor-pointer"
                            >
                                Cerrar Sesión
                            </button>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition cursor-pointer"
                                >
                                    Ingresar
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition cursor-pointer"
                                >
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile button */}
                    <div className="md:hidden flex items-center cursor-pointer">
                        <ThemeToggle />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="ml-2 p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
                        >
                            <svg
                                className="h-6 w-6"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                {isOpen ? (
                                    <path
                                        className="transition"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        className="transition"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <Transition
                show={isOpen}
                enter="transition duration-200 ease-out"
                enterFrom="transform -translate-y-2 opacity-0"
                enterTo="transform translate-y-0 opacity-100"
                leave="transition duration-150 ease-in"
                leaveFrom="transform translate-y-0 opacity-100"
                leaveTo="transform -translate-y-2 opacity-0"
            >
                <div className="md:hidden bg-white dark:bg-gray-900 px-2 pt-2 pb-3 space-y-1 shadow-lg cursor-pointer">
                    {navLinks.map(
                        ({ label, to, show }) =>
                            show && (
                                <Link
                                    key={to}
                                    to={to}
                                    onClick={() => setIsOpen(false)}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-orange-100 dark:hover:bg-gray-800 transition"
                                >
                                    {label}
                                </Link>
                            )
                    )}

                    {user && (
                        <Link
                            to="/cart"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-orange-100 dark:hover:bg-gray-800 transition"
                        >
                            🛒 Carrito
                            {totalItems > 0 && (
                                <span className="ml-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center cursor-pointer">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    )}

                    {user ? (
                        <button
                            onClick={() => {
                                logout();
                                setIsOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-red-500 hover:bg-red-600 transition cursor-pointer"
                        >
                            Cerrar Sesión
                        </button>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                onClick={() => setIsOpen(false)}
                                className="block px-3 py-2 rounded-md text-base font-medium bg-orange-500 hover:bg-orange-600 text-white transition cursor-pointer"
                            >
                                Ingresar
                            </Link>
                            <Link
                                to="/register"
                                onClick={() => setIsOpen(false)}
                                className="block px-3 py-2 rounded-md text-base font-medium bg-gray-200 hover:bg-gray-300 text-gray-800 transition cursor-pointer"
                            >
                                Registrarse
                            </Link>
                        </>
                    )}
                </div>
            </Transition>
        </nav>
    );
}