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
        <div className="container mx-auto px-4 pt-20">
            {/* Botón de volver */}
            <button
                onClick={() => navigate(-1)}
                className="mb-6 text-emerald-600 hover:text-emerald-800 flex items-center gap-2 transition-colors"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver
            </button>
            <h1 className="text-3xl font-bold mb-6">Editar Usuario</h1>
            <UserForm defaultValues={data} onSubmit={onSubmit} />
        </div>
    );
}