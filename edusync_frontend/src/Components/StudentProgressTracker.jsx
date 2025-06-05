import { api, API_URL } from '../config/api';

const resultsRes = await api.get('/Result');
const assessmentsRes = await api.get('/Assessment');
const coursesRes = await api.get('/Course'); 