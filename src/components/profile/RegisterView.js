import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import apiClient from '../../api/apiClient';

export default function RegisterView({ onBackToLogin }) {
  // --- ESTADOS DE DATOS BÁSICOS ---
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // --- ESTADOS DE UBICACIÓN ---
  const [communities, setCommunities] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);

  const [selectedCommunity, setSelectedCommunity] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedMunicipality, setSelectedMunicipality] = useState('');

  // --- ESTADOS DE IMAGEN Y CARGA ---
  const [avatarUri, setAvatarUri] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1️⃣ Cargar Comunidades Autónomas al montar el componente
  useEffect(() => {
    apiClient
      .get('/communities')
      .then((response) => {
        // Como tu Laravel devuelve directamente el array (sin .success ni .data), lo guardamos directo
        if (Array.isArray(response.data)) {
          setCommunities(response.data);
        } else if (response.data && response.data.data) {
          setCommunities(response.data.data);
        }
      })
      .catch((error) => {
        console.error('Error cargando comunidades:', error);
        Alert.alert(
          'Error',
          'No se pudieron cargar las comunidades autónomas.',
        );
      });
  }, []);

  // 2️⃣ Cargar Provincias cuando cambie la Comunidad Autónoma
  useEffect(() => {
    if (!selectedCommunity) {
      setProvinces([]);
      setMunicipalities([]);
      setSelectedProvince('');
      setSelectedMunicipality('');
      return;
    }

    // Adaptado a tu ruta real de Laravel: /provinces/{community_id}
    apiClient
      .get(`/provinces/${selectedCommunity}`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setProvinces(response.data);
        } else if (response.data && response.data.data) {
          setProvinces(response.data.data);
        }
        setMunicipalities([]);
        setSelectedProvince('');
        setSelectedMunicipality('');
      })
      .catch((error) => {
        console.error(
          'Error cargando provincias:',
          error.response?.data || error.message,
        );
      });
  }, [selectedCommunity]);

  // 3️⃣ Cargar Municipios cuando cambie la Provincia
  useEffect(() => {
    if (!selectedProvince) {
      setMunicipalities([]);
      setSelectedMunicipality('');
      return;
    }

    // Adaptado a tu ruta real de Laravel: /municipalities/{province_id}
    apiClient
      .get(`/municipalities/${selectedProvince}`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setMunicipalities(response.data);
        } else if (response.data && response.data.data) {
          setMunicipalities(response.data.data);
        }
        setSelectedMunicipality('');
      })
      .catch((error) => {
        console.error(
          'Error cargando municipios:',
          error.response?.data || error.message,
        );
      });
  }, [selectedProvince]);
  // 📸 Seleccionar foto de la galería
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        'Permiso denegado',
        'Es necesario el acceso a tus fotos para subir un avatar.',
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  // 🚀 Función del envío del formulario preparada
  const handleRegisterSubmit = async () => {
    if (!username || !email || !password || !selectedMunicipality) {
      Alert.alert(
        'Campos incompletos',
        'Por favor, rellena todos los datos del formulario.',
      );
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('municipality_id', selectedMunicipality);

    if (avatarUri) {
      const filename = avatarUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      formData.append('avatar', {
        uri: avatarUri,
        name: filename,
        type: type,
      });
    }

    try {
      const response = await apiClient.post('/register', formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.success) {
        Alert.alert(
          '¡¡Registro Completo!!',
          'Tu cuenta ha sido creada con éxito.',
        );
        // Importante: pasamos los datos del usuario retornado y el token de autenticación
        onBackToLogin(response.data.user, response.data.token);
      }
    } catch (error) {
      console.log(
        'Error registrando usuario:',
        error.response?.data || error.message,
      );
      const serverErrors = error.response?.data?.errors;
      let msg = 'No se pudo completar el registro.';

      if (serverErrors) {
        msg = Object.values(serverErrors).flat().join('\n');
      }
      Alert.alert('Error en el formulario', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Crear Cuenta</Text>

      {/* 👤 SECCIÓN AVATAR */}
      <View style={styles.avatarSection}>
        <TouchableOpacity
          style={styles.avatarBubble}
          onPress={pickImage}
          disabled={loading}
        >
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarPlaceholder}>📸{'\n'}Subir foto</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.avatarLabel}>Foto de perfil (Opcional)</Text>
      </View>

      {/* --- CAMPOS DE TEXTO --- */}
      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario"
        value={username}
        onChangeText={setUsername}
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña (Mín. 6 caracteres)"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!loading}
      />

      {/* 🗺️ SELECTOR DE COMUNIDADES */}
      <Text style={styles.pickerLabel}>Comunidad Autónoma *</Text>
      <View style={styles.pickerBox}>
        <Picker
          selectedValue={selectedCommunity}
          onValueChange={(itemValue) => setSelectedCommunity(itemValue)}
          enabled={!loading}
        >
          <Picker.Item label="Selecciona una comunidad..." value="" />
          {communities &&
            communities.map((item) => (
              <Picker.Item key={item.id} label={item.name} value={item.id} />
            ))}
        </Picker>
      </View>

      {/* 🗺️ SELECTOR DE PROVINCIAS */}
      <Text style={styles.pickerLabel}>Provincia *</Text>
      <View style={styles.pickerBox}>
        <Picker
          selectedValue={selectedProvince}
          onValueChange={(itemValue) => setSelectedProvince(itemValue)}
          enabled={!loading && provinces.length > 0}
        >
          <Picker.Item label="Selecciona una provincia..." value="" />
          {provinces &&
            provinces.map((item) => (
              <Picker.Item key={item.id} label={item.name} value={item.id} />
            ))}
        </Picker>
      </View>

      {/* 🗺️ SELECTOR DE MUNICIPIOS */}
      <Text style={styles.pickerLabel}>Municipio *</Text>
      <View style={styles.pickerBox}>
        <Picker
          selectedValue={selectedMunicipality}
          onValueChange={(itemValue) => setSelectedMunicipality(itemValue)}
          enabled={!loading && municipalities.length > 0}
        >
          <Picker.Item label="Selecciona un municipio..." value="" />
          {municipalities &&
            municipalities.map((item) => (
              <Picker.Item key={item.id} label={item.name} value={item.id} />
            ))}
        </Picker>
      </View>

      {/* --- BOTÓN REGISTRAR --- */}
      <TouchableOpacity
        style={[styles.submitButton, loading && styles.buttonDisabled]}
        onPress={handleRegisterSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Registrarme e Iniciar Sesión</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelLink}
        onPress={() => onBackToLogin(null, null)}
        disabled={loading}
      >
        <Text style={styles.cancelText}>
          ¿Ya tienes cuenta?{' '}
          <Text style={styles.accentText}>Inicia sesión</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { padding: 24, backgroundColor: '#fff', paddingBottom: 50 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#222',
    textAlign: 'center',
  },
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatarBubble: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  avatarImage: { width: '100%', height: '100%' },
  avatarPlaceholder: {
    textAlign: 'center',
    color: '#777',
    fontSize: 12,
    fontWeight: '500',
  },
  avatarLabel: { marginTop: 8, fontSize: 13, color: '#666' },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 16,
    marginBottom: 14,
    color: '#333',
  },
  pickerLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginBottom: 4,
    marginLeft: 2,
  },
  pickerBox: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    marginBottom: 14,
  },
  submitButton: {
    backgroundColor: '#2e7d32',
    height: 52,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: { backgroundColor: '#a5d6a7' },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cancelLink: { marginTop: 20, alignItems: 'center' },
  cancelText: { color: '#666', fontSize: 14 },
  accentText: { color: '#2e7d32', fontWeight: 'bold' },
});
