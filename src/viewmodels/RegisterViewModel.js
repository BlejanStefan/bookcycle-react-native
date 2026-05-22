import { useState, useEffect } from 'react';
import { authService } from '../api/authService';
import { geoService } from '../api/geoService'; // 👈 Importamos el nuevo servicio

export const useRegisterViewModel = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
    municipality_id: '',
  });

  // --- NUEVOS ESTADOS GEOGRÁFICOS ---
  const [geoData, setGeoData] = useState({
    communities: [],
    provinces: [],
    municipalities: [],
  });

  const [selectedIds, setSelectedIds] = useState({
    community_id: '',
    province_id: '',
  });
  // ----------------------------------

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [success, setSuccess] = useState(false);

  // Cargar las comunidades autónomas nada más arrancar la pantalla
  useEffect(() => {
    const loadInitialGeo = async () => {
      try {
        const communities = await geoService.getCommunities();
        setGeoData(prev => ({ ...prev, communities }));
      } catch (err) {
        console.error(err.message);
      }
    };
    loadInitialGeo();
  }, []);

  // Escuchar cuando cambia la Comunidad para cargar Provincias
  useEffect(() => {
    if (!selectedIds.community_id) return;

    const loadProvinces = async () => {
      try {
        const provinces = await geoService.getProvinces(selectedIds.community_id);
        setGeoData(prev => ({ ...prev, provinces, municipalities: [] })); // Limpiamos municipios antiguos
        setSelectedIds(prev => ({ ...prev, province_id: '' })); // Reseteamos provincia seleccionada
        setForm(prev => ({ ...prev, municipality_id: '' })); // Reseteamos el municipio final en el form
      } catch (err) {
        console.error(err.message);
      }
    };
    loadProvinces();
  }, [selectedIds.community_id]);

  // Escuchar cuando cambia la Provincia para cargar Municipios
  useEffect(() => {
    if (!selectedIds.province_id) return;

    const loadMunicipalities = async () => {
      try {
        const municipalities = await geoService.getMunicipalities(selectedIds.province_id);
        setGeoData(prev => ({ ...prev, municipalities }));
        setForm(prev => ({ ...prev, municipality_id: '' })); // Reseteamos el municipio final en el form
      } catch (err) {
        console.error(err.message);
      }
    };
    loadMunicipalities();
  }, [selectedIds.province_id]);

  const handleChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors && errors[name]) {
      setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
    }
  };

  const handleRegister = async (onSuccessCallback) => {
    setIsLoading(true);
    setErrors(null);
    try {
      const data = await authService.register(form);
      setSuccess(true);
      if (onSuccessCallback) onSuccessCallback(data);
    } catch (err) {
      if (err.errors) setErrors(err.errors);
      else setErrors({ general: [err.message || 'Error inesperado'] });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    geoData,         // 👈 Mandamos los arrays de comunidades, provincias y municipios a la vista
    selectedIds,     // 👈 Mandamos los IDs intermedios seleccionados
    setSelectedIds,  // 👈 Función para que la vista cambie la comunidad o provincia seleccionada
    isLoading,
    errors,
    success,
    handleChange,
    handleRegister,
  };
};