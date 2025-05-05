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

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/items" element={
                <PrivateRoute>
                    <ItemList />
                </PrivateRoute>
            } />

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

            <Route path="/cart" element={
                <PrivateRoute>
                    <CartPage />
                </PrivateRoute>
            } />
        </Routes>
    );
}