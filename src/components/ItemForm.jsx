import { useForm } from 'react-hook-form';
import { useCategories } from '../hooks/useCategories';

const ItemForm = ({ onSubmit, defaultValues }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ defaultValues });

    const { categories, loadingCats } = useCategories();

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-4"
        >
            {/* Nombre */}
            <div>
                <label className="block text-gray-700 mb-1">Nombre</label>
                <input
                    {...register('name', { required: 'Requerido' })}
                    className="w-full p-2 border rounded"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            {/* Cantidad */}
            <div>
                <label className="block text-gray-700 mb-1">Cantidad</label>
                <input
                    type="number"
                    {...register('quantity', {
                        required: 'Requerido',
                        min: { value: 0, message: 'No puede ser negativo' },
                    })}
                    className="w-full p-2 border rounded"
                />
                {errors.quantity && (
                    <p className="text-red-500 text-sm">{errors.quantity.message}</p>
                )}
            </div>

            {/* Descripción */}
            <div>
                <label className="block text-gray-700 mb-1">Descripción</label>
                <textarea
                    {...register('description', { required: 'Requerido' })}
                    className="w-full p-2 border rounded"
                    rows={4}
                />
                {errors.description && (
                    <p className="text-red-500 text-sm">{errors.description.message}</p>
                )}
            </div>

            {/* Precio */}
            <div>
                <label className="block text-gray-700 mb-1">Precio</label>
                <input
                    type="number"
                    step="0.01"
                    {...register('price', {
                        required: 'Requerido',
                        min: { value: 0, message: 'No puede ser negativo' },
                    })}
                    className="w-full p-2 border rounded"
                />
                {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
            </div>

            {/* Descuento */}
            <div>
                <label className="block text-gray-700 mb-1">% Descuento</label>
                <input
                    type="number"
                    {...register('discount', {
                        min: { value: 0, message: 'Mínimo 0' },
                        max: { value: 100, message: 'Máximo 100' },
                    })}
                    className="w-full p-2 border rounded"
                />
                {errors.discount && (
                    <p className="text-red-500 text-sm">{errors.discount.message}</p>
                )}
            </div>

            {/* Categoría */}
            <div>
                <label className="block text-gray-700 mb-1">Categoría</label>
                <select
                    {...register('category', { required: 'Requerido' })}
                    disabled={loadingCats}
                    className="w-full p-2 border rounded bg-white"
                >
                    <option value="">-- Selecciona una categoría --</option>
                    {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
                {errors.category && (
                    <p className="text-red-500 text-sm">{errors.category.message}</p>
                )}
            </div>

            {/* URL de Imagen */}
            <div>
                <label className="block text-gray-700 mb-1">URL de Imagen</label>
                <input
                    {...register('image', {
                        pattern: {
                            value:
                                /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))$/i,
                            message: 'Debes ingresar una URL válida de imagen',
                        },
                    })}
                    className="w-full p-2 border rounded"
                />
                {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
            </div>

            <button
                type="submit"
                className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 transition-colors"
            >
                Guardar Producto
            </button>
        </form>
    );
};

export default ItemForm;