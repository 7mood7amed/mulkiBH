import API from './axios';
export const getPlans = () => API.get('/subscriptions/plans/');
export const getCurrentSubscription = () => API.get('/subscriptions/current/');
export const upgradePlan = (data) => API.post('/subscriptions/upgrade/', data);
