import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('runcode_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.data?.code === 'CONCURRENT_LOGIN') {
      window.dispatchEvent(
        new CustomEvent('runcode:concurrent_login', {
          detail: {
            message: error.response.data.message || 'Ushbu hisobga boshqa qurilmadan kirildi.'
          }
        })
      );
    }
    const message = error.response?.data?.message || 'Kutilmagan xatolik yuz berdi';
    const customError = new Error(message);
    customError.code = error.response?.data?.code;
    customError.status = error.response?.status;
    return Promise.reject(customError);
  }
);

export default api;
