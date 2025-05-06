import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Register() {
    const { register: regUser } = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const nav = useNavigate();

    const onSubmit = async data => {
        try {
            const success = await regUser({
                username: data.username,
                email: data.email,
                password: data.password
            });

            if (success) {
                Swal.fire('¡Listo!', 'Usuario registrado', 'success');
                nav('/login');
            }
        } catch (error) {
            Swal.fire('Error', error.message || 'Falló el registro', 'error');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-15 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white text-center">Registrarse</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                    <input
                        placeholder="Usuario"
                        {...register('username', { required: true })}
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />
                    {errors.username && <p className="text-red-500 text-sm mt-1">Usuario requerido</p>}
                </div>

                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        {...register('email', { required: true })}
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">Email requerido</p>}
                </div>

                <div>
                    <input
                        type="password"
                        placeholder="Contraseña"
                        {...register('password', { required: true })}
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">Contraseña requerida</p>}
                </div>

                <button
                    type="submit"
                    className="cursor-pointer w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg transition-colors"
                >
                    Crear cuenta
                </button>

                <div className="text-center mt-4">
                    <span className="text-gray-700 dark:text-gray-300">¿Ya tienes cuenta? </span>
                    <Link to="/login" className="text-orange-500 hover:underline cursor-pointer">
                        Inicia sesión aquí
                    </Link>
                </div>
            </form>
        </div>
    );
}