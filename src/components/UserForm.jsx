import { useForm } from 'react-hook-form';
import { useRoles } from '../hooks/useRoles';

export default function UserForm({ defaultValues, onSubmit }) {
    const { roles, loading } = useRoles();
    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg mx-auto space-y-4">
            <div>
                <label className="block">Username</label>
                <input {...register('username', { required: true })} className="w-full p-2 border rounded" />
                {errors.username && <p className="text-red-500">Requerido</p>}
            </div>
            <div>
                <label className="block">Email</label>
                <input type="email" {...register('email', { required: true })} className="w-full p-2 border rounded" />
                {errors.email && <p className="text-red-500">Requerido</p>}
            </div>
            <div>
                <label className="block">Rol</label>
                <select {...register('role', { required: true })} disabled={loading} className="w-full p-2 border rounded">
                    <option value="">Seleccionar rol</option>
                    {roles.map(r => (
                        <option key={r._id} value={r._id}>{r.name}</option>
                    ))}
                </select>
                {errors.role && <p className="text-red-500">Requerido</p>}
            </div>
            <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded">
                Guardar
            </button>
        </form>
    );
}