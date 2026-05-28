import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import apiClient from '../../api/apiClient'; // Ajusta la ruta a tu apiClient

export default function MyListingsView({ onBack }) {
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Más adelante cambiaremos esto por /api/my-listings mandando el Token de Sanctum
    apiClient
      .get('/listings/random?limit=4')
      .then((res) => {
        if (res.data.success) setMyListings(res.data.data);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const handleEditListing = (id) => {
    // 🚀 AQUÍ VA TU LÓGICA DE EDICIÓN
    Alert.alert('Modo Edición', `Abriendo editor para el anuncio ID: ${id}`);
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backArrow}>⬅ Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Mis Libros en Venta</Text>
      </View>

      <FlatList
        data={myListings}
        keyExtractor={(item) => item.listing_id.toString()}
        renderStyle={styles.list}
        renderItem={({ item }) => (
          // 💡 Al pulsar, en vez de visualizar, llama al editor del anuncio
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleEditListing(item.listing_id)}
          >
            <Image source={{ uri: item.images[0]?.path }} style={styles.img} />
            <View style={styles.info}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.book_title}
              </Text>
              <Text style={styles.price}>{item.price}€</Text>
              <View style={styles.editBadge}>
                <Text style={styles.editBadgeText}>✏️ Editar Anuncio</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backArrow: { fontSize: 16, color: '#1e88e5', marginRight: 16 },
  title: { fontSize: 18, fontWeight: 'bold' },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 12,
    marginBottom: 2,
    padding: 12,
    borderRadius: 10,
  },
  img: { width: 60, height: 90, borderRadius: 6 },
  info: { marginLeft: 14, justifyContent: 'space-between', flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  price: { fontSize: 16, color: '#2e7d32', fontWeight: 'bold' },
  editBadge: {
    backgroundColor: '#fff3e0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  editBadgeText: { color: '#ef6c00', fontSize: 12, fontWeight: '600' },
});
