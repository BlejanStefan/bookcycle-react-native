import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginView from '../../src/components/profile/LoginView';
import RegisterView from '../../src/components/profile/RegisterView';
import OptionsView from '../../src/components/profile/OptionsView';
import EditProfileView from '../../src/components/profile/EditProfileView';
import MyListingsView from '../../src/components/profile/MyListingsView';
import apiClient from '../../src/api/apiClient';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('login');
  const [checkingAuth, setCheckingAuth] = useState(true);

  // 🔄 Comprobar si ya había una sesión iniciada al abrir la pantalla
  useEffect(() => {
    const checkSession = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user_data');
        const storedToken = await AsyncStorage.getItem('auth_token');

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setCurrentView('options');
        }
      } catch (e) {
        console.log('Error leyendo sesión persistente:', e);
      } finally {
        setCheckingAuth(false);
      }
    };
    checkSession();
  }, []);

  // 🔑 Guardar datos al iniciar sesión correctamente
  const handleLoginSuccess = async (userData, token) => {
    try {
      await AsyncStorage.setItem('auth_token', token);
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));
      setUser(userData);
      setCurrentView('options');
    } catch (e) {
      console.log('Error guardando sesión:', e);
    }
  };

  const handleLogoutSuccess = async () => {
    try {
      // 1️⃣ PRIMERO: Avisar al servidor mientras el token siga guardado localmente
      console.log('Intentando borrar token en Laravel...');
      const response = await apiClient.post('/logout');
      console.log('Servidor respondió:', response.data);
    } catch (error) {
      // Si da un error 401 o de red, lo capturamos para analizarlo en la terminal de Metro
      console.log(
        'Error detallado en logout de Laravel:',
        error.response?.data || error.message,
      );
    } finally {
      try {
        // 2️⃣ SEGUNDO: Limpiar el almacenamiento del dispositivo móvil (SharedPreferences)
        await AsyncStorage.removeItem('auth_token');
        await AsyncStorage.removeItem('user_data');

        // 3️⃣ TERCERO: Actualizar la interfaz gráfica
        setUser(null);
        setCurrentView('login');
      } catch (e) {
        console.log('Error al limpiar almacenamiento local:', e);
      }
    }
  };

  if (checkingAuth) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1e88e5" />
      </View>
    );
  }

  const renderContent = () => {
    if (!user) {
      if (currentView === 'register') {
        return (
          <RegisterView
            // 🚀 Al registrarse correctamente, recibe el objeto de usuario y token de Laravel
            onBackToLogin={(userData, token) => {
              if (userData && token) {
                // Si vienen datos, iniciamos la sesión directamente y lo mandamos a OptionsView
                handleLoginSuccess(userData, token);
              } else {
                // Si el usuario simplemente pulsó en cancelar/volver, regresamos al login tradicional
                setCurrentView('login');
              }
            }}
          />
        );
      }
      return (
        <LoginView
          onLogin={handleLoginSuccess} // 🚀 Pasa el manejador persistente
          onGoToRegister={() => setCurrentView('register')}
        />
      );
    }

    switch (currentView) {
      case 'edit_profile':
        return (
          <EditProfileView
            user={user}
            // ✅ CORREGIDO: Usamos setCurrentView('options') en lugar de setIsEditing
            onBack={() => setCurrentView('options')}
            // 🌟 CONECTAMOS EL CABLE CORRECTAMENTE PERSISTIENDO LOS DATOS
            onProfileUpdated={async (updatedUser) => {
              try {
                // 1. Guardamos el nuevo usuario en el estado para refrescar la interfaz en vivo
                setUser(updatedUser);

                // 2. Lo hacemos persistente en el dispositivo para que no se pierda el cambio
                await AsyncStorage.setItem(
                  'user_data',
                  JSON.stringify(updatedUser),
                );

                // 3. Redirigimos de vuelta de forma segura a las opciones
                setCurrentView('options');
              } catch (storageError) {
                console.log(
                  'Error al persistir los nuevos datos del perfil:',
                  storageError,
                );
              }
            }}
          />
        );
      case 'my_listings':
        return <MyListingsView onBack={() => setCurrentView('options')} />;
      case 'options':
      default:
        return (
          <OptionsView
            user={user}
            onNavigate={(view) => setCurrentView(view)}
            onLogout={handleLogoutSuccess} // 🚀 Pasa el borrado persistente
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>{renderContent()}</SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
