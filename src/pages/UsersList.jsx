import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/edomApi';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

export default function UsersList() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const canDelete = user?.permissions.includes('delete:users') || user?.permissions.includes('manage:all');

    useEffect(() => {
        api.get('/users')
            .then(res => setUsers(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar este usuario?')) return;
        try {
            await api.delete(`/users/${id}`);
            setUsers(prev => prev.filter(u => u._id !== id));
            Swal.fire('Eliminado', '', 'success');
        } catch {
            Swal.fire('Error al eliminar', '', 'error');
        }
    };

    if (loading) return <p>Cargando usuarios…</p>;

    return (
        <div className="container mx-auto px-4 pt-20">
            
            <h1 className="text-3xl font-bold mb-6">Gestión de Usuarios</h1>

            {/* Botón de volver */}
            <button
                onClick={() => navigate('/')}
                className="mb-6 text-emerald-600 hover:text-emerald-800 flex items-center gap-2 transition-colors"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver
            </button>
            <table className="w-full table-auto mb-8">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2">Username</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Rol</th>
                        <th className="p-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u._id} className="border-b">
                            <td className="p-2">{u.username}</td>
                            <td className="p-2">{u.email}</td>
                            <td className="p-2">{u.role?.name}</td>
                            <td className="p-2 space-x-2">
                                <button
                                    onClick={() => navigate(`/users/${u._id}`)}
                                    className="px-3 py-1 bg-blue-600 text-white rounded"
                                >
                                    Editar
                                </button>
                                {canDelete && (
                                    <button
                                        onClick={() => handleDelete(u._id)}
                                        className="px-3 py-1 bg-red-600 text-white rounded"
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
    );
}