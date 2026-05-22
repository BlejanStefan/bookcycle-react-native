import apiClient from './apiClient';

export const geoService = {
  /**
   * Obtiene la lista de todas las Comunidades Autónomas
   */
  getCommunities: async () => {
    try {
      const response = await apiClient.get('/communities');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al cargar las comunidades');
    }
  },

  /**
   * Obtiene las provincias filtradas por el ID de la comunidad
   * @param {number|string} communityId
   */
  getProvinces: async (communityId) => {
    try {
      const response = await apiClient.get(`/provinces/${communityId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al cargar las provincias');
    }
  },

  /**
   * Obtiene los municipios filtrados por el ID de la provincia
   * @param {number|string} provinceId
   */
  getMunicipalities: async (provinceId) => {
    try {
      const response = await apiClient.get(`/municipalities/${provinceId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al cargar los municipios');
    }
  },
};