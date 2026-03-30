import axios from 'axios';

const axiosInstance = axios.create({
  //baseURL: 'http://localhost:5000',  local development
  baseURL: 'http://13.211.74.4:5001/', // live
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
