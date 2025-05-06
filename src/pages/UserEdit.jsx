import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/edomApi';
import UserForm from '../components/UserForm';
import Swal from 'sweetalert2';

export default function UserEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);

    useEffect(() => {
        api.get(`/users/${id}`)
            .then(res => {
                const user = res.data;
                setData({
                    ...user,
                    role: user.role?._id || ''
                });
            })
            .catch((error) => Swal.fire('Error', 'No se pudo cargar usuario', error.message || ''));
    }, [id]);

    const onSubmit = async vals => {
        try {
            await api.put(`/users/${id}`, vals);
            Swal.fire('Guardado', '', 'success');
            navigate('/users');
        } catch {
            Swal.fire('Error', 'No se pudo actualizar', 'error');
        }
    };

    if (!data) return <p>Cargando…</p>;
    return (
        <div className="container mx-auto px-4 pt-20 text-gray-700 dark:text-white ">
            {/* Botón de volver */}
            <h1 className="text-3xl font-bold mb-6">Editar Usuario</h1>
            <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center text-2xl hover:shadow-2xl hover:underline transition-all text-black hover:text-amber-500 dark:text-gray-200 dark:hover:text-orange-400 cursor-pointer"
            >
                ← Volver
            </button>
            <UserForm defaultValues={data} onSubmit={onSubmit} />
        </div>
    );
}