import { api, API_URL } from '../config/api';

const res = await api.get(`/Assessment/history/${user.userId}`); 