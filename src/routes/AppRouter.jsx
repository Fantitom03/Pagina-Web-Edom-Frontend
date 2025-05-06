import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ItemList from '../pages/ItemList';
import ItemCreate from '../pages/ItemCreate';
import ItemEdit from '../pages/ItemEdit';
import PrivateRoute from './PrivateRoute';
import ItemDetail from '../pages/ItemDetail';
import UsersList from '../pages/UsersList';
import UserEdit from '../pages/UserEdit';
import CartPage from '../pages/CartPage';
import CategoryList from '../pages/CategoryList';
import CategoryCreate from '../pages/CategoryCreate';
import CategoryEdit from '../pages/CategoryEdit';


export default function AppRouter() {
    return (
        <Routes>
            {/* Rutas de Autenticación */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/items" element={
                <PrivateRoute>
                    <ItemList />
                </PrivateRoute>
            } />

            {/* Rutas para Items */}
            <Route path="/items/:id" element={
                <PrivateRoute>
                    <ItemDetail />
                </PrivateRoute>
            } />

            <Route path="/items/new" element={
                <PrivateRoute requiredPermission="create:items">
                    <ItemCreate />
                </PrivateRoute>
            } />

            <Route path="/items/edit/:id" element={
                <PrivateRoute requiredPermission="update:items">
                    <ItemEdit />
                </PrivateRoute>
            } />

            <Route path="*" element={<div>404 Not Found</div>} />

            {/* Rutas para Usuarios */}
            <Route path="/users" element={
                <PrivateRoute requiredPermission="read:users">
                    <UsersList />
                </PrivateRoute>
            } />
            
            <Route path="/users/:id" element={
                <PrivateRoute requiredPermission="update:users">
                    <UserEdit />
                </PrivateRoute>
            } />

            {/* Ruta para el carrito*/}
            <Route path="/cart" element={
                <PrivateRoute>
                    <CartPage />
                </PrivateRoute>
            } />

            {/*Rutas para categorias*/}
            <Route path="/categories" element={
                <PrivateRoute requiredPermission="read:categories">
                    <CategoryList />
                </PrivateRoute>
            } />
            <Route path="/categories/new" element={
                <PrivateRoute requiredPermission="create:categories">
                    <CategoryCreate />
                </PrivateRoute>
            } />
            <Route path="/categories/edit/:id" element={
                <PrivateRoute requiredPermission="update:categories">
                    <CategoryEdit />
                </PrivateRoute>
            } />
            
            {/* Rutas para redirigir a inicio si no se encuentra la página */}
            <Route path='*' element={<Home />} />

        </Routes>
    );
}