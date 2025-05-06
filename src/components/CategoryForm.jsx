import React from 'react';
import { useForm } from 'react-hook-form';

export default function CategoryForm({ defaultValues = {}, onSubmit }) {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({ defaultValues });

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg space-y-6 transition-colors"
        >
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 border-b pb-2 mb-4">
                {defaultValues._id ? 'Editar Categoría' : 'Nueva Categoría'}
            </h2>

            <div className="space-y-1">
                <label className="block text-gray-700 dark:text-gray-200">Nombre</label>
                <input
                    {...register('name', { required: 'El nombre es obligatorio' })}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <label className="block text-gray-700 dark:text-gray-200">Descripción</label>
                <textarea
                    {...register('description')}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    rows={3}
                />
            </div>

            <button
                type="submit"
                className="cursor-pointer w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
            >
                Guardar Categoría
            </button>
        </form>
    );
}