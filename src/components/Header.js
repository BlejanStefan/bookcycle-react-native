import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import BookCycleLogo from './BookCycleLogo';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const webTabs = [
    { name: 'Subir Anuncio', path: '/upload' },
    { name: 'Favoritos', path: '/favorites' },
    { name: 'Buzón', path: '/inbox' },
    { name: 'Perfil', path: '/profile' },
  ];

  const isWeb = Platform.OS === 'web';

  return (
    // Fondo de la Navbar superior: Gris pizarra oscuro elegante
    <View
      style={{
        width: '100%',
        backgroundColor: '#0f172a',
        borderBottomWidth: 1,
        borderBottomColor: '#1e293b',
      }}
    >
      {/* SECCIÓN SUPERIOR: Logo + Buscador + Filtro */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: 1200,
          width: '100%',
          paddingHorizontal: 24,
          paddingVertical: 14,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        {/* LOGO E INICIO */}
        {isWeb ? (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => router.push('/')}
              style={{ marginRight: 24 }}
            >
              <BookCycleLogo width={190} height={52} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
                backgroundColor:
                  pathname === '/' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
              }}
            >
              <FontAwesome5
                name="book-open"
                size={14}
                color={pathname === '/' ? '#10b981' : '#cbd5e1'}
                style={{ marginRight: 8 }}
              />
              <Text
                style={{
                  color: pathname === '/' ? '#34d399' : '#ffffff',
                  fontWeight: '600',
                  fontSize: 14,
                }}
              >
                Inicio
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{ padding: 8, backgroundColor: '#020617', borderRadius: 12 }}
          >
            <FontAwesome5 name="book-reader" size={20} color="#10b981" />
          </View>
        )}

        {/* BUSCADOR (¡Modificado maxWidth para que sea un pelín más largo! 🚀) */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: isWeb ? 1 : 1, // Le damos flexibilidad para ocupar espacio libre
            maxWidth: isWeb ? 650 : 'auto', // 👈 Aumentado de 460 a 650 para hacerlo más largo
            backgroundColor: '#020617',
            borderWidth: 1,
            borderColor: '#334155',
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 8,
            marginHorizontal: isWeb ? 32 : 12, // Más espacio de separación a los lados
          }}
        >
          <Ionicons name="search" size={16} color="#94a3b8" />
          <TextInput
            placeholder="Buscar por título, autor, ISBN..."
            placeholderTextColor="#64748b"
            style={{
              flex: 1,
              color: '#ffffff',
              marginLeft: 8,
              fontSize: 14,
              backgroundColor: 'transparent',
              borderWidth: 0,
              ...Platform.select({
                web: { outlineStyle: 'none' },
              }),
            }}
          />
        </View>

        {/* FILTRO */}
        <TouchableOpacity
          style={{
            backgroundColor: '#020617',
            padding: 10,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#334155',
          }}
        >
          <FontAwesome5 name="sliders-h" size={14} color="#10b981" />
        </TouchableOpacity>
      </View>

      {/* SECCIÓN INFERIOR: Menú de pestañas */}
      {isWeb && (
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: '#1e293b',
            backgroundColor: '#020617',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              maxWidth: 1200,
              width: '100%',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            {webTabs.map((tab) => {
              const isActive = pathname === tab.path;
              return (
                <TouchableOpacity
                  key={tab.path}
                  onPress={() => router.push(tab.path)}
                  style={{
                    paddingVertical: 14,
                    paddingHorizontal: 4,
                    borderBottomWidth: 3,
                    borderBottomColor: isActive ? '#10b981' : 'transparent',
                    marginHorizontal: 18,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: isActive ? '700' : '500',
                      color: isActive ? '#34d399' : '#ffffff',
                      letterSpacing: 0.3,
                    }}
                  >
                    {tab.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
}
