import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRegisterViewModel } from '../src/viewmodels/RegisterViewModel';
import { useRouter } from 'expo-router';

export default function RegisterView() {
  const router = useRouter();
  const {
    form,
    geoData,
    selectedIds,
    setSelectedIds,
    isLoading,
    errors,
    handleChange,
    handleRegister
  } = useRegisterViewModel();

  // Función que se ejecuta tras el registro con éxito
  const onRegisterSuccess = (data) => {
    alert('¡Cuenta creada con éxito!');
    router.replace('/'); // Redirigir a Home
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-slate-950"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-6">

        <Text className="text-white text-2xl font-bold mb-6 text-center">Crea tu cuenta</Text>

        {/* INPUT: USERNAME */}
        <View className="mb-4">
          <Text className="text-slate-400 mb-2 ml-1">Nombre de usuario</Text>
          <TextInput
            className={`bg-slate-900 text-white p-4 rounded-xl border ${errors?.username ? 'border-red-500' : 'border-slate-800'}`}
            placeholder="Ej: mrspaxe"
            placeholderTextColor="#475569"
            value={form.username}
            onChangeText={(val) => handleChange('username', val)}
          />
          {errors?.username && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.username[0]}</Text>}
        </View>

        {/* INPUT: EMAIL */}
        <View className="mb-4">
          <Text className="text-slate-400 mb-2 ml-1">Correo electrónico</Text>
          <TextInput
            className={`bg-slate-900 text-white p-4 rounded-xl border ${errors?.email ? 'border-red-500' : 'border-slate-800'}`}
            placeholder="correo@ejemplo.com"
            placeholderTextColor="#475569"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={(val) => handleChange('email', val)}
          />
          {errors?.email && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.email[0]}</Text>}
        </View>

        {/* SELECTOR: COMUNIDAD */}
        <View className="mb-4">
          <Text className="text-slate-400 mb-2 ml-1">Comunidad Autónoma</Text>
          <View className="bg-slate-900 rounded-xl border border-slate-800 overflow:hidden">
            <Picker
              selectedValue={selectedIds.community_id}
              onValueChange={(val) => setSelectedIds(prev => ({ ...prev, community_id: val }))}
              style={{ color: 'white' }}
              dropdownIconColor="white"
            >
              <Picker.Item label="Selecciona comunidad..." value="" />
              {geoData.communities.map(c => (
                <Picker.Item key={c.id} label={c.name} value={c.id} />
              ))}
            </Picker>
          </View>
        </View>

        {/* SELECTOR: PROVINCIA (Solo se muestra si hay comunidad) */}
        {selectedIds.community_id !== '' && (
          <View className="mb-4">
            <Text className="text-slate-400 mb-2 ml-1">Provincia</Text>
            <View className="bg-slate-900 rounded-xl border border-slate-800">
              <Picker
                selectedValue={selectedIds.province_id}
                onValueChange={(val) => setSelectedIds(prev => ({ ...prev, province_id: val }))}
                style={{ color: 'white' }}
                dropdownIconColor="white"
              >
                <Picker.Item label="Selecciona provincia..." value="" />
                {geoData.provinces.map(p => (
                  <Picker.Item key={p.id} label={p.name} value={p.id} />
                ))}
              </Picker>
            </View>
          </View>
        )}

        {/* SELECTOR: MUNICIPIO (Solo se muestra si hay provincia) */}
        {selectedIds.province_id !== '' && (
          <View className="mb-4">
            <Text className="text-slate-400 mb-2 ml-1">Municipio</Text>
            <View className={`bg-slate-900 rounded-xl border ${errors?.municipality_id ? 'border-red-500' : 'border-slate-800'}`}>
              <Picker
                selectedValue={form.municipality_id}
                onValueChange={(val) => handleChange('municipality_id', val)}
                style={{ color: 'white' }}
                dropdownIconColor="white"
              >
                <Picker.Item label="Selecciona municipio..." value="" />
                {geoData.municipalities.map(m => (
                  <Picker.Item key={m.id} label={m.name} value={m.id} />
                ))}
              </Picker>
            </View>
          </View>
        )}

        {/* INPUT: PASSWORD */}
        <View className="mb-4">
          <Text className="text-slate-400 mb-2 ml-1">Contraseña</Text>
          <TextInput
            className={`bg-slate-900 text-white p-4 rounded-xl border ${errors?.password ? 'border-red-500' : 'border-slate-800'}`}
            placeholder="********"
            placeholderTextColor="#475569"
            secureTextEntry
            value={form.password}
            onChangeText={(val) => handleChange('password', val)}
          />
        </View>

        {/* INPUT: PASSWORD CONFIRMATION */}
        <View className="mb-8">
          <Text className="text-slate-400 mb-2 ml-1">Confirmar contraseña</Text>
          <TextInput
            className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800"
            placeholder="********"
            placeholderTextColor="#475569"
            secureTextEntry
            value={form.password_confirmation}
            onChangeText={(val) => handleChange('password_confirmation', val)}
          />
          {errors?.password && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.password[0]}</Text>}
        </View>

        {/* BOTÓN DE REGISTRO */}
        <TouchableOpacity
          className={`py-4 rounded-2xl shadow-lg ${isLoading ? 'bg-slate-700' : 'bg-emerald-500 active:bg-emerald-600'}`}
          onPress={() => handleRegister(onRegisterSuccess)}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-slate-950 font-bold text-center text-lg">Registrarse</Text>
          )}
        </TouchableOpacity>

        {/* Errores generales (ej. servidor caído) */}
        {errors?.general && (
          <Text className="text-red-500 text-center mt-4">{errors.general[0]}</Text>
        )}

      </ScrollView>
    </KeyboardAvoidingView>
  );
}