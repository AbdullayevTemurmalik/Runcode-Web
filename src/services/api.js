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
    if (error.response?.data?.code === 'INACTIVITY_TIMEOUT') {
      window.dispatchEvent(
        new CustomEvent('runcode:inactivity_timeout', {
          detail: {
            message: error.response.data.message || '5 kun davomida kirmaganingiz sababli login va parol orqali qayta kiring.'
          }
        })
      );
    }
    const serverMessage = error.response?.data?.message;
    let message = serverMessage;
    if (!message) {
      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        message = "Server bilan aloqa o'rnatib bo'lmadi. Iltimos, internet yoki serverni tekshiring.";
      } else if (error.response?.status === 401) {
        message = "Login yoki parol noto'g'ri.";
      } else if (error.response?.status === 404) {
        message = "So'ralgan ma'lumot topilmadi.";
      } else if (error.response?.status >= 500) {
        message = "Serverda vaqtinchalik xatolik. Birozdan so'ng qayta urinib ko'ring.";
      } else {
        message = error.message || 'Kutilmagan xatolik yuz berdi';
      }
    }
    const customError = new Error(message);
    customError.code = error.response?.data?.code;
    customError.status = error.response?.status;
    return Promise.reject(customError);
  }
);

export default api;
