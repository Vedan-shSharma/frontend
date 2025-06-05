import { api, API_URL } from '../config/api';

const res = await api.get('/Course');
await api.delete(`/Course/${deleteConfirmation.courseId}`); 