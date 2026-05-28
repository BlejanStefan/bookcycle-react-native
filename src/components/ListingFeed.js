import React from 'react';
import {
  FlatList,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

export default function ListingFeed({ data, refreshing, onRefresh }) {
  // Renderizador de cada tarjeta (Equivalente al ViewHolder de Android)
  const renderItem = ({ item }) => {
    // Sacamos la primera imagen si existe, si no, ponemos una de respaldo
    const mainImage =
      item.images && item.images.length > 0
        ? item.images[0].path
        : 'https://via.placeholder.com/150';

    return (
      <TouchableOpacity style={styles.card} activeOpacity={0.9}>
        {/* Imagen del Libro */}
        <Image source={{ uri: mainImage }} style={styles.bookImage} />

        {/* Detalles del Anuncio */}
        <View style={styles.infoContainer}>
          <Text style={styles.bookTitle} numberOfLines={2}>
            {item.book_title}
          </Text>

          <Text style={styles.authorText} numberOfLines={1}>
            {item.authors.length > 0
              ? item.authors.join(', ')
              : 'Autor desconocido'}
          </Text>

          {/* Badge de Estado del Libro */}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.condition}</Text>
          </View>

          {/* Precio */}
          <Text style={styles.priceText}>
            {parseFloat(item.price) === 0
              ? 'Intercambio'
              : `${parseFloat(item.price).toFixed(2)}€`}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.listing_id.toString()}
      contentContainerStyle={styles.listContainer}
      refreshing={refreshing} // Control de "Pull to refresh"
      onRefresh={onRefresh} // Acción al deslizar hacia abajo
      ListEmptyComponent={
        // Qué mostrar si no hay datos
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No se encontraron anuncios disponibles.
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    // Sombras para iOS y Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookImage: {
    width: 90,
    height: 130,
    borderRadius: 8,
    backgroundColor: '#eaeaea',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'space-between',
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  authorText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  badgeText: {
    color: '#1e88e5',
    fontSize: 12,
    fontWeight: '600',
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  },
});
