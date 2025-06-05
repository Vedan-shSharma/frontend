import { api, API_URL } from '../config/api';

// Remove the API_URL constant since it's imported from config

// Update axios calls to use api
await api.put(`/Course/${course.courseId}`, payload);
const response = await api.post('/Course', payload);
const response = await api.post(`/CourseMaterial/${courseId}`, formData, {
await api.delete(`/CourseMaterial/${materialId}`); 