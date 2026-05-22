import React from 'react';
import { View, Text, ScrollView, Platform } from 'react-native';
import Header from '../../src/components/Header';
import BookIllustration from '../../src/components/BookIllustration';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-slate-950" style={{ width: '100%' }}>
      {/* Barra superior adaptada */}
      <Header />

      {/* Contenido principal */}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        className="p-6"
      >
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: 32,
            width: '100%',
            maxWidth: 600,
          }}
        >
          <View style={{ marginBottom: 24 }}>
            <BookIllustration size={Platform.OS === 'web' ? 300 : 240} />
          </View>

          <Text className="text-white text-2xl font-bold text-center mb-2">
            ¡Tu espacio de intercambio listo!
          </Text>
          <Text className="text-slate-400 text-center">
            Aquí empezaremos a listar las publicaciones de libros disponibles en
            tu municipio.
          </Text>
        </View>
      </ScrollView>

      <StatusBar style="light" />
    </View>
  );
}
