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
import apiClient from '../../api/apiClient'; // Tu cliente Axios configurado

export default function EditProfileView({ user, onProfileUpdated, onBack }) {
  // --- ESTADOS DE DATOS ---
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // --- ESTADOS DE UBICACIÓN ---
  const [communities, setCommunities] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);

  const [selectedCommunity, setSelectedCommunity] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedMunicipality, setSelectedMunicipality] = useState('');

  // --- IMAGEN Y LOADING ---
  const [avatarUri, setAvatarUri] = useState(user?.avatar || null);
  const [imageChanged, setImageChanged] = useState(false);
  const [loading, setLoading] = useState(false);

  // 1️⃣ Cargar Comunidades Autónomas
  useEffect(() => {
    apiClient
      .get('/communities')
      .then((res) =>
        setCommunities(
          Array.isArray(res.data) ? res.data : res.data.data || [],
        ),
      )
      .catch((err) => {
        Alert.alert(
          'Error',
          'No se pudieron cargar las comunidades autónomas.',
        );
        console.error('Error comunidades:', err);
      });
  }, []);

  // 2️⃣ Cargar Provincias al cambiar Comunidad
  useEffect(() => {
    if (!selectedCommunity) {
      setProvinces([]);
      return;
    }
    apiClient
      .get(`/provinces/${selectedCommunity}`)
      .then((res) =>
        setProvinces(Array.isArray(res.data) ? res.data : res.data.data || []),
      )
      .catch((err) => {
        Alert.alert(
          'Error',
          'No se pudieron cargar las provincias de esta comunidad.',
        );
        console.error('Error provincias:', err);
      });
  }, [selectedCommunity]);

  // 3️⃣ Cargar Municipios al cambiar Provincia
  useEffect(() => {
    if (!selectedProvince) {
      setMunicipalities([]);
      return;
    }
    apiClient
      .get(`/municipalities/${selectedProvince}`)
      .then((res) =>
        setMunicipalities(
          Array.isArray(res.data) ? res.data : res.data.data || [],
        ),
      )
      .catch((err) => {
        Alert.alert(
          'Error',
          'No se pudieron cargar los municipios de esta provincia.',
        );
        console.error('Error municipios:', err);
      });
  }, [selectedProvince]);

  // Seleccionar foto de la galería
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permiso denegado', 'Se necesita acceso a tus fotos.');
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
      setImageChanged(true); // Marcamos que la imagen es nueva y local
    }
  };

  // Enviar el Formulario
  const handleUpdateSubmit = async () => {
    setLoading(true);
    const formData = new FormData();

    formData.append('username', username);
    formData.append('email', email);

    if (selectedMunicipality) {
      formData.append('municipality_id', selectedMunicipality);
    }
    if (newPassword) {
      formData.append('old_password', oldPassword);
      formData.append('new_password', newPassword);
    }

    // 2. Adjuntar la foto si se ha cambiado localmente
    if (imageChanged && avatarUri) {
      // 🌐 COMPROBACIÓN PARA ENTORNO WEB (Ej: http://localhost o blob:)
      if (
        avatarUri.startsWith('blob:') ||
        (typeof window !== 'undefined' && !avatarUri.startsWith('file:'))
      ) {
        try {
          // Convertimos la URI temporal del navegador en un Blob binario real
          const responseBlob = await fetch(avatarUri);
          const blob = await responseBlob.blob();

          // Adjuntamos el Blob directamente. PHP lo reconocerá instantáneamente como $_FILES
          formData.append('avatar', blob, 'avatar.jpg');
        } catch (blobError) {
          Alert.alert(
            'Error de Imagen (Web)',
            'No se pudo procesar el archivo seleccionado en el navegador.',
          );
          console.error(
            'Error convirtiendo la imagen a Blob en Web:',
            blobError,
          );
          setLoading(false);
          return;
        }
      } else {
        // 📱 COMPROBACIÓN PARA ENTORNO MÓVIL NATIVO (Android / iOS)
        const filename = avatarUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        formData.append('avatar', {
          uri: avatarUri,
          name: filename,
          type: type,
        });
      }
    }

    try {
      const response = await apiClient.post('/user/update', formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.success) {
        Alert.alert('¡Hecho!', 'Perfil actualizado con éxito.');

        // 🛡️ CONTROL DE SEGURIDAD: Evita que falle si el prop no se define en el padre
        if (typeof onProfileUpdated === 'function') {
          onProfileUpdated(response.data.user);
        } else {
          Alert.alert(
            'Advertencia',
            "El perfil se guardó en el servidor, pero 'onProfileUpdated' no está configurado como función en el componente padre.",
          );
        }

        onBack();
      }
    } catch (error) {
      // Extraemos información útil del error para mostrarla en la Alerta
      const serverMessage = error.response?.data?.message || error.message;
      const serverErrors = error.response?.data?.errors;

      let msg = `Detalle técnico: ${serverMessage}`;

      if (serverErrors) {
        // Si hay errores de validación de Laravel (ej: contraseña vieja mal escrita)
        msg = Object.values(serverErrors).flat().join('\n');
        Alert.alert('Error de validación', msg);
      } else {
        // Cualquier otro tipo de error de red o de servidor (500, 404, etc.)
        Alert.alert('Error de red / servidor', msg);
      }

      console.log(
        'Error al actualizar:',
        error.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Editar Perfil</Text>

      {/* 📸 SECCIÓN AVATAR */}
      <View style={styles.avatarSection}>
        <TouchableOpacity
          style={styles.avatarBubble}
          onPress={pickImage}
          disabled={loading}
        >
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarPlaceholder}>📸{'\n'}Cambiar foto</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* DATOS BÁSICOS */}
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

      {/* CAMBIO DE CONTRASEÑA */}
      <Text style={styles.sectionLabel}>Cambiar Contraseña (Opcional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Contraseña antigua"
        secureTextEntry
        value={oldPassword}
        onChangeText={setOldPassword}
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder="Nueva contraseña"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        editable={!loading}
      />

      {/* CAMBIO DE UBICACIÓN */}
      <Text style={styles.sectionLabel}>Actualizar Ubicación (Opcional)</Text>
      <View style={styles.pickerBox}>
        <Picker
          selectedValue={selectedCommunity}
          onValueChange={(v) => setSelectedCommunity(v)}
          enabled={!loading}
        >
          <Picker.Item label="Cambiar comunidad..." value="" />
          {communities.map((item) => (
            <Picker.Item key={item.id} label={item.name} value={item.id} />
          ))}
        </Picker>
      </View>

      <View style={styles.pickerBox}>
        <Picker
          selectedValue={selectedProvince}
          onValueChange={(v) => setSelectedProvince(v)}
          enabled={!loading && provinces.length > 0}
        >
          <Picker.Item label="Cambiar provincia..." value="" />
          {provinces.map((item) => (
            <Picker.Item key={item.id} label={item.name} value={item.id} />
          ))}
        </Picker>
      </View>

      <View style={styles.pickerBox}>
        <Picker
          selectedValue={selectedMunicipality}
          onValueChange={(v) => setSelectedMunicipality(v)}
          enabled={!loading && municipalities.length > 0}
        >
          <Picker.Item label="Cambiar municipio..." value="" />
          {municipalities.map((item) => (
            <Picker.Item key={item.id} label={item.name} value={item.id} />
          ))}
        </Picker>
      </View>

      {/* BOTONES ACCIÓN */}
      <TouchableOpacity
        style={[styles.submitButton, loading && styles.buttonDisabled]}
        onPress={handleUpdateSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Guardar Cambios</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelLink}
        onPress={onBack}
        disabled={loading}
      >
        <Text style={styles.cancelText}>Cancelar y volver</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { padding: 24, backgroundColor: '#fff', paddingBottom: 50 },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#222',
    textAlign: 'center',
  },
  avatarSection: { alignItems: 'center', marginBottom: 20 },
  avatarBubble: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  avatarImage: { width: '100%', height: '100%' },
  avatarPlaceholder: { textAlign: 'center', color: '#777', fontSize: 12 },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    height: 48,
    paddingHorizontal: 16,
    marginBottom: 12,
    color: '#333',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 10,
    marginBottom: 6,
    marginLeft: 2,
  },
  pickerBox: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#0288d1',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  buttonDisabled: { backgroundColor: '#b3e5fc' },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cancelLink: { marginTop: 15, alignItems: 'center' },
  cancelText: { color: '#d32f2f', fontSize: 15, fontWeight: '500' },
});
