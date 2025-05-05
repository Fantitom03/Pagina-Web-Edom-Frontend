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
    return user?.permissions?.includes(permission);
};