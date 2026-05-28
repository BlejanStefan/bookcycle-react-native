import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tu IP local detectada por Metro Bundler
const BASE_IP = '192.168.1.132';

// Como usas el puerto 80, no añadimos ":8000" ni ningún otro. La IP directa basta.
const getBaseUrl = () => {
  return `http://${BASE_IP}/api`;
};

const apiClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000, // 10 segundos de margen antes de dar error de conexión
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error al inyectar el token en el interceptor:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default apiClient;
