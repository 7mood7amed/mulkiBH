import API from './axios';
export const getNotifications = () => API.get('/notifications/');
export const getUnreadCount = () => API.get('/notifications/unread-count/');
export const markRead = (id) => API.post(`/notifications/${id}/read/`);
export const markAllRead = () => API.post('/notifications/mark-all-read/');
