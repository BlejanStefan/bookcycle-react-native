import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import apiClient from '../../api/apiClient'; // 🚀 Tu cliente de Axios con la IP fija

export default function LoginView({ onLogin, onGoToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLocalLogin = async () => {
    // Validación rápida antes de enviar
    if (!email || !password) {
      Alert.alert(
        'Campos obligatorios',
        'Por favor, introduce tu correo y contraseña.',
      );
      return;
    }

    setLoading(true);
    try {
      // Hacemos el POST directo a http://192.168.1.132/api/login
      const response = await apiClient.post('/login', {
        email: email,
        password: password,
      });

      if (response.data && response.data.success) {
        // Si es exitoso, le pasamos los datos del usuario y el token al padre (Profile.js)
        onLogin(response.data.user, response.data.token);
      }
    } catch (error) {
      console.log('Error en Login:', error);
      // Capturamos el mensaje de error de Laravel (ej: credenciales incorrectas)
      const errorMsg =
        error.response?.data?.message || 'No se pudo conectar con el servidor.';
      Alert.alert('Error de autenticación', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Hola de nuevo!</Text>

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
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!loading}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLocalLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.link}
        onPress={onGoToRegister}
        disabled={loading}
      >
        <Text style={styles.linkText}>
          ¿No tienes cuenta? <Text style={styles.linkBold}>Regístrate</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 24, color: '#222' },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    height: 52,
    paddingHorizontal: 16,
    marginBottom: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#1e88e5',
    borderRadius: 10,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { backgroundColor: '#90caf9' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link: { marginTop: 24, alignItems: 'center' },
  linkText: { color: '#666', fontSize: 15 },
  linkBold: { color: '#1e88e5', fontWeight: 'bold' },
});
