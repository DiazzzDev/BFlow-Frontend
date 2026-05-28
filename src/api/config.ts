export const config = { 
    API_BASE_URL: import.meta.env.MODE === 'development' ? '' : import.meta.env.VITE_API_URL 
};