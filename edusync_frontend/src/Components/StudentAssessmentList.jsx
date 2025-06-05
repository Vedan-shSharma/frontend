import { api, API_URL } from '../config/api';

const res = await api.get('/Course');
const res = await api.get('/Assessment');
const res = await api.get(`/Assessment/${assessment.assessmentId}`);
const res = await api.post('/Result/attempt', payload); 