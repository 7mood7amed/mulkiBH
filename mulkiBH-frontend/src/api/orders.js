import API from './axios';
export const createOrder = (data) => API.post('/orders/create/', data);
export const getOrders = () => API.get('/orders/');
export const getMyOrders = () => API.get('/orders/my-orders/');
export const getOrder = (id) => API.get(`/orders/${id}/`);
export const respondToOrder = (id, data) => API.post(`/orders/${id}/respond/`, data);
export const closeOrder = (id) => API.post(`/orders/${id}/close/`);
