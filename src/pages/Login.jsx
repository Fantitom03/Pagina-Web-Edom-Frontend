import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Login() {
    const { user, login } = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const nav = useNavigate();
    if (user) return <Navigate to="/items" />;

    const onSubmit = async data => {
        const ok = await login(data.email, data.password);
        if (ok) nav('/');
        else Swal.fire('Error', 'Credenciales inválidas', 'error');
    };

    return (
        <div className="max-w-md mx-auto mt-15 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white text-center">Iniciar sesión</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                    Entrar
                </button>
            </form>
        </div>
    );
}