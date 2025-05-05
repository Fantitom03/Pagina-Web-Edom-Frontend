export const decodeToken = (token) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
            permissions: payload.permissions || [],
            role: payload.role
        };
    } catch (error) {
        return { permissions: [], role: 'guest' };
    }
};

export const can = (user, permission) => {
    if (!user || !Array.isArray(user.permissions)) return false;
    // si es súper-admin
    if (user.permissions.includes('manage:all')) return true;
    // permiso puntual
    return user.permissions.includes(permission);
};