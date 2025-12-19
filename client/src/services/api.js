import axios from 'axios';

const api = axios.create({
    baseURL: 'https://cargoflow-858j.onrender.com/api',
});

api.interceptors.request.use((config) => {
    try {
        const userStr = localStorage.getItem('user');
        console.log('API Request - localStorage user:', userStr ? 'exists' : 'missing');

        if (userStr) {
            const user = JSON.parse(userStr);
            console.log('API Request - Parsed user:', { email: user.email, hasToken: !!user.token });

            if (user && user.token) {
                config.headers.Authorization = `Bearer ${user.token}`;
                console.log('API Request - Authorization header set');
            } else {
                console.warn('API Request - User exists but no token!');
            }
        } else {
            console.warn('API Request - No user in localStorage');
        }
    } catch (error) {
        console.error('Error reading user from localStorage:', error);
    }

    console.log('API Request:', config.method.toUpperCase(), config.url);
    return config;
});

// Add response interceptor to log errors
api.interceptors.response.use(
    (response) => {
        console.log('API Response:', response.status, response.config.url);
        return response;
    },
    (error) => {
        console.error('API Error:', error.response?.status, error.response?.data || error.message);

        // If we get 401 and the error is "User not found", clear localStorage
        if (error.response?.status === 401) {
            const errorMsg = error.response?.data?.message;
            if (errorMsg === 'User not found' || errorMsg === 'Not authorized, token failed') {
                console.warn('Invalid token detected, clearing localStorage');
                localStorage.removeItem('user');
                // Optionally redirect to login
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
        }

        return Promise.reject(error);
    }
);

export default api;
