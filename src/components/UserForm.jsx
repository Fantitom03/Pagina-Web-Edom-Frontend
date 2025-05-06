import { useForm } from 'react-hook-form';
import { useRoles } from '../hooks/useRoles';
import { useEffect } from 'react';

export default function UserForm({ defaultValues = {}, onSubmit }) {
    const { roles, loading } = useRoles();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({ defaultValues });

    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg space-y-6 transition-colors"
        >
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 border-b pb-2 mb-4">
                {defaultValues._id ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h2>

            <div className="space-y-1">
                <label className="block text-gray-700 dark:text-gray-200">Username</label>
                <input
                    {...register('username', { required: 'Requerido' })}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                {errors.username && (
                    <p className="text-sm text-red-500">{errors.username.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <label className="block text-gray-700 dark:text-gray-200">Email</label>
                <input
                    type="email"
                    {...register('email', { required: 'Requerido' })}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <label className="block text-gray-700 dark:text-gray-200">Rol</label>
                <select
                    {...register('role', { required: 'Requerido' })}
                    disabled={loading}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                    <option value="">-- Seleccionar rol --</option>
                    {roles.map(r => (
                        <option key={r._id} value={r._id}>
                            {r.name}
                        </option>
                    ))}
                </select>
                {errors.role && (
                    <p className="text-sm text-red-500">{errors.role.message}</p>
                )}
            </div>

            <button
                type="submit"
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors cursor-pointer"
            >
                Guardar Usuario
            </button>
        </form>
    );
}
