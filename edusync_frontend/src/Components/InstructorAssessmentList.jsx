import { api, API_URL } from '../config/api';

// Remove the API_URL constant since it's imported from config

// Update axios calls to use api
await api.delete(`/Assessment/${deleteConfirmation.assessmentId}`); 