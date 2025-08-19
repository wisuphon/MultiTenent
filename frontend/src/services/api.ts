import axios from 'axios';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { LoginCredentials, LoginResponse, Tenant } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token and host header to requests
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (config.headers) {
            // Add authorization token if available
            const token = localStorage.getItem('access_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            
            // Add custom header for subdomain detection (browsers block Host header)
            // Use the current browser host (e.g., company-a.localhost:5173)
            // But send it as the backend port (e.g., company-a.localhost:3000)
            const currentHost = window.location.host;
            const hostWithoutPort = currentHost.split(':')[0];
            const backendHost = hostWithoutPort.includes('localhost') 
                ? `${hostWithoutPort}:3000`
                : currentHost;
            console.log(`Setting X-Tenant-Host header: ${backendHost}`);
            config.headers['X-Tenant-Host'] = backendHost;
        }
        return config;
    },
    (error: unknown) => {
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (credentials: LoginCredentials): Promise<AxiosResponse<LoginResponse>> => 
        api.post('/auth/login', credentials),
    getTenant: (): Promise<AxiosResponse<Tenant>> => 
        api.get('/auth/tenant'),
    getProfile: (): Promise<AxiosResponse<unknown>> => 
        api.get('/auth/profile'),
    logout: () => {
        // Clear local storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        
        // Return promise for consistency
        return Promise.resolve();
    },
};

export default api;