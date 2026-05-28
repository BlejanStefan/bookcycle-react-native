import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import Header from '../Header';

export default function OptionsView({ user, onNavigate, onLogout }) {
  console.log('=== DATOS DEL USUARIO EN OPTIONSVIEW ===', user);
  // 🛡️ Salvaguarda: si por algún motivo 'user' es null o no ha cargado, no rompemos la app
  if (!user) return null;

  // Extraemos el username de forma segura, o un fallback por si acaso
  const username = user.username || 'Usuario';
  const email = user.email || '';

  // Extraemos la propiedad avatar que viene del backend de Laravel
  const avatarUrl = user.avatar;

  const menuOptions = [
    {
      id: '1',
      title: 'Editar Perfil',
      icon: '👤',
      action: () => onNavigate('edit_profile'),
    },
    {
      id: '2',
      title: 'Mis Anuncios',
      icon: '📚',
      action: () => onNavigate('my_listings'),
    },
    {
      id: '3',
      title: 'Cerrar Sesión',
      icon: '🚪',
      action: onLogout,
      isDanger: true,
    },
  ];

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.profileHeader}>
        {/* 👤 CONTENEDOR DEL AVATAR */}
        <View style={styles.avatarContainer}>
          {avatarUrl ? (
            <Image
              source={{
                uri: avatarUrl,
                headers: { Accept: 'image/*' },
              }}
              style={styles.avatarImage}
              resizeMode="cover"
              onError={(e) =>
                console.log(
                  `Error renderizando la imagen: ${avatarUrl}`,
                  e.nativeEvent.error,
                )
              }
            />
          ) : (
            /* 🚀 Fallback: Si no hay foto, se muestra la inicial real de tu base de datos */
            <Text style={styles.avatarText}>
              {username.charAt(0).toUpperCase()}
            </Text>
          )}
        </View>

        <Text style={styles.userName}>{username}</Text>
        <Text style={styles.userEmail}>{email}</Text>
      </View>

      <FlatList
        data={menuOptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.menuItem} onPress={item.action}>
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text
              style={[styles.menuTitle, item.isDanger && styles.dangerText]}
            >
              {item.title}
            </Text>
            <Text style={styles.arrow}>➔</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  profileHeader: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    overflow: 'hidden', // 🌟 Mantiene la imagen redonda
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: { fontSize: 28, fontWeight: 'bold', color: '#1e88e5' },
  userName: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  userEmail: { color: '#666' },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuIcon: { marginRight: 14, fontSize: 18 },
  menuTitle: { flex: 1, fontSize: 16 },
  dangerText: { color: '#d32f2f' },
  arrow: { color: '#ccc' },
});
