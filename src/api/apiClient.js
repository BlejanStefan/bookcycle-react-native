import axios from 'axios';
import { Platform } from 'react-native';

// Tu IP local detectada por Metro Bundler
const BASE_IP = '192.168.1.132';

// Ajustamos la URL base automáticamente según la plataforma
const getBaseUrl = () => {
  return `http://${BASE_IP}/api`;
};

const apiClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000, // 10 segundos de margen antes de dar error de conexión
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Nota: Más adelante añadiremos aquí un interceptor para adjuntar el Token de Sanctum automáticamente

export default apiClient;