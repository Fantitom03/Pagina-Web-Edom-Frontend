import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/edomApi';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import { can } from '../utils/auth';

export default function UsersList() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const canDelete = can(user, 'delete:users');
    const canCreate = can(user, 'create:users');

    useEffect(() => {
        api.get('/users')
            .then(res => setUsers(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async id => {
        if (!window.confirm('¿Eliminar este usuario?')) return;
        try {
            await api.delete(`/users/${id}`);
            setUsers(prev => prev.filter(u => u._id !== id));
            Swal.fire('Eliminado', '', 'success');
        } catch {
            Swal.fire('Error al eliminar', '', 'error');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-xl text-orange-500 dark:text-orange-400">Cargando usuarios…</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 pt-20 pb-8 text-gray-700 dark:text-white">
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => navigate('/')}
                    className="inline-flex items-center text-2xl hover:shadow-2xl hover:underline transition-all text-black hover:text-amber-500 dark:text-gray-200 dark:hover:text-orange-400 cursor-pointer"
                >
                    ← Volver
                </button>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                    Gestión de Usuarios
                </h1>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                            <th className="p-3 text-left text-gray-700 dark:text-gray-200">Username</th>
                            <th className="p-3 text-left text-gray-700 dark:text-gray-200">Email</th>
                            <th className="p-3 text-left text-gray-700 dark:text-gray-200">Rol</th>
                            <th className="p-3 text-center text-gray-700 dark:text-gray-200">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u._id} className="border-b dark:border-gray-600">
                                <td className="p-3 text-gray-800 dark:text-gray-100">{u.username}</td>
                                <td className="p-3 text-gray-800 dark:text-gray-100">{u.email}</td>
                                <td className="p-3 text-gray-800 dark:text-gray-100">{u.role?.name}</td>
                                <td className="p-3 text-center space-x-2">
                                    <Link
                                        to={`/users/${u._id}`}
                                        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded transition cursor-pointer"
                                    >
                                        Editar
                                    </Link>
                                    {canDelete && (
                                        <button
                                            onClick={() => handleDelete(u._id)}
                                            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition cursor-pointer"
                                        >
                                            Eliminar
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}