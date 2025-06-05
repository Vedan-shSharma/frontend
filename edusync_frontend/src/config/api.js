import axios from 'axios';

// Use environment variable with fallback to the hardcoded URL
const API_URL = import.meta.env.VITE_API_URL || "https://edusyncvirendraback-hbcaavg5d2afaxg0.centralindia-01.azurewebsites.net/api";

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export { API_URL, api }; 