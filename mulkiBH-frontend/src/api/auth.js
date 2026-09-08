import API from './axios';
export const register = (data) => API.post('/auth/register/', data);
export const login = (data) => API.post('/auth/login/', data);
export const logout = () => API.post('/auth/logout/');
export const getProfile = () => API.get('/auth/profile/');
export const updateProfile = (data) => API.put('/auth/profile/', data);
export const changePassword = (data) => API.post('/auth/change-password/', data);
export const forgotPassword = (data) => API.post('/auth/forgot-password/', data);
export const resetPassword = (data) => API.post('/auth/reset-password/', data);
