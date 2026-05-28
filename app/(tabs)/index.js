import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import ListingFeed from '../../src/components/ListingFeed'; // Tu componente externo reutilizable
import apiClient from '../../src/api/apiClient'; // 🚀 Importamos tu cliente de Axios configurado
import Header from '../../src/components/Header';
export default function HomeScreen() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Petición al endpoint usando tu apiClient de Axios
  const fetchListings = async () => {
    try {
      // Como tu base URL ya es 'http://192.168.1.132/api', solo le concatenamos el endpoint
      const response = await apiClient.get('/listings/random?limit=15');

      // Axios mete la respuesta del servidor dentro de .data
      if (response.data && response.data.success) {
        setListings(response.data.data);
      }
    } catch (error) {
      console.error('Error cargando el feed en Android/iOS:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchListings(); // Vuelve a pedir anuncios aleatorios al deslizar hacia abajo (Pull-to-refresh)
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1e88e5" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ListingFeed
        data={listings}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
