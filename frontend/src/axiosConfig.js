import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: 'http://localhost:5001',  //local development  
  baseURL: 'http://3.25.193.25/', // live
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Don't force JSON for FormData — Axios sets multipart boundary automatically
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
});

export default axiosInstance;
