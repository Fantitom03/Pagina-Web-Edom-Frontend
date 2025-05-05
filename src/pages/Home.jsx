import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="text-center mt-20">
            <h1 className="text-4xl font-bold mb-4">Bienvenido a edom</h1>
            <p className="mb-6">Tu tienda de electrodomésticos en línea.</p>
            <Link to="/items" className="bg-blue-500 text-white px-6 py-3 rounded">Ver productos</Link>
        </div>
    );
}