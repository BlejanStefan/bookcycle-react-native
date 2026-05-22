import apiClient from './apiClient';

export const authService = {
  /**
   * Envía los datos de registro al backend de Laravel
   * @param {Object} userData - Contiene username, email, password, password_confirmation y municipality_id
   */
  register: async (userData) => {
    try {
      const response = await apiClient.post('/register', userData);
      return response.data; // Devuelve { user, token } directos si todo va bien
    } catch (error) {
      // Extraemos el mensaje de error estructurado que manda Laravel (ej. errores de validación)
      if (error.response && error.response.data) {
        throw error.response.data;
      }
      throw new Error('Error de conexión con el servidor');
    }
  },
};