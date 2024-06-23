import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://hc-backend-b5hp.onrender.com' 
    : 'http://localhost:8080',
});

export default axiosInstance;
