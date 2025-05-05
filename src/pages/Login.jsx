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
        if (ok) nav('/items');
        else Swal.fire('Error', 'Credenciales inválidas', 'error');
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
            <h2 className="text-2xl mb-4">Iniciar sesión</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <input type="email" placeholder="Email" {...register('email', { required: true })}
                    className="w-full border p-2 rounded" />
                {errors.email && <p className="text-red-500">Email requerido</p>}
                <input type="password" placeholder="Contraseña" {...register('password', { required: true })}
                    className="w-full border p-2 rounded" />
                {errors.password && <p className="text-red-500">Contraseña requerida</p>}
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Entrar</button>
            </form>
        </div>
    );
}