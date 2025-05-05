import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItem, updateItem } from '../api/edomApi';
import ItemForm from '../components/ItemForm';

export default function ItemEdit() {
    const { id } = useParams();
    const nav = useNavigate();
    const [data, setData] = useState(null);

    useEffect(() => {
        getItem(id).then(res => setData(res.data));
    }, [id]);

    if (!data) return <p>Cargando...</p>;

    const onSubmit = async vals => {
        await updateItem(id, vals);
        nav('/items');
    };

    return <ItemForm onSubmit={onSubmit} defaultValues={data} />;
}