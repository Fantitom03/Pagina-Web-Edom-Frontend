import { useForm } from 'react-hook-form';
import { useCategories } from '../hooks/useCategories';
import { useEffect } from 'react';

const ItemForm = ({ onSubmit, defaultValues }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({ defaultValues });

    const { categories, loadingCats } = useCategories();

    // Cuando cambien defaultValues, reseteamos el form
    useEffect(() => {
        if (defaultValues) reset(defaultValues)
    }, [defaultValues, reset])

    // Calcular el nombre de la categoría seleccionada
    const selectedCat = defaultValues?.category
        ? (categories.find(c => c._id === defaultValues.category) || '')
        : ''

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg space-y-6 transition-colors"
        >
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 border-b pb-2 mb-6">
                {defaultValues._id ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>

            {[
                { name: 'name', label: 'Nombre', type: 'text', rules: { required: 'Requerido' } },
                { name: 'quantity', label: 'Cantidad', type: 'number', rules: { required: 'Requerido', min: { value: 0, message: 'No puede ser negativo' } } },
                { name: 'price', label: 'Precio', type: 'number', step: '0.01', rules: { required: 'Requerido', min: { value: 0, message: 'No puede ser negativo' } } },
                { name: 'discount', label: '% Descuento', type: 'number', rules: { min: { value: 0, message: 'Mínimo 0' }, max: { value: 100, message: 'Máximo 100' } } }
            ].map(field => (
                <div key={field.name} className="space-y-1">
                    <label className="block text-gray-700 dark:text-gray-200">{field.label}</label>
                    <input
                        type={field.type}
                        step={field.step}
                        {...register(field.name, field.rules)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    {errors[field.name] && (
                        <p className="text-sm text-red-500">{errors[field.name].message}</p>
                    )}
                </div>
            ))}

            {/* Descripción */}
            <div className="space-y-1">
                <label className="block text-gray-700 dark:text-gray-200">Descripción</label>
                <textarea
                    {...register('description', { required: 'Requerido' })}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    rows={4}
                />
                {errors.description && (
                    <p className="text-sm text-red-500">{errors.description.message}</p>
                )}
            </div>

            {/* Categoría */}
            <div className="space-y-1">
                <label className="block text-gray-700 dark:text-gray-200">Categoría</label>
                <select
                    {...register('category', { required: 'Requerido' })}
                    disabled={loadingCats}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                    <option value="">
                        {defaultValues.category ? 'Mantener actual' : '-- Selecciona categoría --'}
                    </option>
                    {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
                {errors.category && (
                    <p className="text-sm text-red-500">{errors.category.message}</p>
                )}
            </div>

            {/* Imagen */}
            <div className="space-y-1">
                <label className="block text-gray-700 dark:text-gray-200">URL de Imagen</label>
                <input
                    {...register('image', {
                        pattern: {
                            value: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))$/i,
                            message: 'URL inválida'
                        }
                    })}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                {errors.image && (
                    <p className="text-sm text-red-500">{errors.image.message}</p>
                )}
            </div>

            <button
                type="submit"
                className="cursor-pointer w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
            >
                Guardar Producto
            </button>
        </form>
    );

};

export default ItemForm;