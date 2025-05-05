import { useForm } from "react-hook-form";

const ItemForm = ({ onSubmit, defaultValues }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ defaultValues });

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-4"
        >
            <div>
                <label className="block text-gray-700 mb-2">Nombre del Producto</label>
                <input
                    {...register("name", { required: "Campo obligatorio" })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-primary-light"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            {/* Repetir para price, description, category, etc */}

            <button
                type="submit"
                className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark transition-colors"
            >
                Guardar Producto
            </button>
        </form>
    );
};

export default ItemForm;