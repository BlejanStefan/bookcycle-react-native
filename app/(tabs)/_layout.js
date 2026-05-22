import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  const isWeb = Platform.OS === 'web';

  return (
    <Tabs
      screenOptions={{
        // Ocultamos la cabecera nativa en todas las pantallas
        headerShown: false,

        // Colores de los iconos/textos de la barra inferior (Móvil)
        tabBarActiveTintColor: '#10b981', // Verde esmeralda activo
        tabBarInactiveTintColor: '#64748b', // Gris slate inactivo

        // Estilo de la barra de pestañas inferior
        tabBarStyle: {
          backgroundColor: '#0f172a',
          borderTopWidth: 1,
          borderTopColor: '#1e293b',
          height: 65,
          paddingBottom: 10,
          paddingTop: 8,
          // 💡 Escondemos por completo la barra inferior nativa en Web, ya que usamos nuestro Header customizado
          display: isWeb ? 'none' : 'flex',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      {/* Pestaña: Inicio */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" size={size} color={color} />
          ),
        }}
      />

      {/* Pestaña: Subir Anuncio */}
      <Tabs.Screen
        name="upload"
        options={{
          title: 'Subir',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" size={size} color={color} />
          ),
        }}
      />

      {/* Pestaña: Favoritos */}
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={size} color={color} />
          ),
        }}
      />

      {/* Pestaña: Buzón */}
      <Tabs.Screen
        name="inbox"
        options={{
          title: 'Buzón',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="mail" size={size} color={color} />
          ),
        }}
      />

      {/* Pestaña: Perfil */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
