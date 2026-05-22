import { View, Text } from 'react-native';
import Header from '../../src/components/Header';

export default function UploadScreen() {
  return (
    <View className="flex-1 bg-slate-950 items-center justify-center">
      <Header />
      <Text className="text-white text-lg">Pantalla de Favoritos</Text>
    </View>
  );
}
