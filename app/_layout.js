import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

export default function RootLayout() {
  return (
    // Forzamos a que el contenedor raíz ocupe toda la pantalla de forma limpia
    <View style={{ flex: 1, backgroundColor: '#020617' }}>
      <Stack
        screenOptions={{
          // 💡 Esto elimina de raíz cualquier cabecera nativa del Stack principal
          headerShown: false,
          contentStyle: { backgroundColor: '#020617' },
        }}
      >
        {/* Declaramos el grupo de pestañas principal */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>

      <StatusBar style="light" />
    </View>
  );
}
