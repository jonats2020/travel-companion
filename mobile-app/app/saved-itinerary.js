import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getSavedItineraries, deleteSavedItinerary } from '../services/api';
import { colors } from '../styles/colors';

export default function SavedItinerariesScreen() {
  const router = useRouter();
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadItineraries();
  }, []);

  const loadItineraries = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getSavedItineraries();
      setItineraries(data);
    } catch (err) {
      console.error('Error loading saved itineraries:', err);
      setError(
        'Failed to load your saved itineraries. Please try again later.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadItineraries();
  };

  const handleItineraryPress = (itinerary) => {
    router.push({
      pathname: '/trip-details',
      params: { id: itinerary.id },
    });
  };

  const handleGeneratePress = () => {
    router.push('/generate-itinerary');
  };

  const handleDeleteItinerary = async (id) => {
    try {
      await deleteSavedItinerary(id);
      // Filter out the deleted itinerary
      setItineraries((currentItineraries) =>
        currentItineraries.filter((item) => item.id !== id)
      );
    } catch (err) {
      console.error('Error deleting itinerary:', err);
      alert('Failed to delete itinerary. Please try again.');
    }
  };

  const renderItineraryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itineraryCard}
      onPress={() => handleItineraryPress(item)}
    >
      <Image
        source={{
          uri:
            item.imageUrl ||
            'https://images.unsplash.com/photo-1508009603885-50cf7c8dd0d5',
        }}
        style={styles.itineraryImage}
      />
      <View style={styles.itineraryContent}>
        <Text style={styles.itineraryTitle}>{item.title}</Text>
        <Text style={styles.itineraryDestination}>
          {item.destination}, {item.country}
        </Text>
        <View style={styles.itineraryDetails}>
          <View style={styles.itineraryDetailItem}>
            <MaterialIcons
              name='calendar-today'
              size={16}
              color={colors.primary}
            />
            <Text style={styles.itineraryDetailText}>{item.duration} Days</Text>
          </View>
          <View style={styles.itineraryDetailItem}>
            <MaterialIcons
              name='attach-money'
              size={16}
              color={colors.primary}
            />
            <Text style={styles.itineraryDetailText}>
              ${item.estimatedCost}
            </Text>
          </View>
          {item.isFavorite && (
            <View style={styles.favoriteTag}>
              <MaterialIcons name='favorite' size={14} color='#fff' />
            </View>
          )}
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteItinerary(item.id)}
      >
        <MaterialIcons name='delete-outline' size={20} color={colors.error} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name='arrow-back' size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Itineraries</Text>
        <TouchableOpacity
          style={styles.generateButton}
          onPress={handleGeneratePress}
        >
          <MaterialIcons name='auto-awesome' size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color={colors.primary} />
          <Text style={styles.loadingText}>
            Loading your saved itineraries...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <MaterialIcons name='error-outline' size={48} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadItineraries}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : itineraries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name='flight' size={48} color={colors.lightGray} />
          <Text style={styles.emptyTitle}>No Saved Itineraries</Text>
          <Text style={styles.emptyText}>
            You haven't saved any travel itineraries yet. Generate some AI
            itineraries to get started!
          </Text>
          <TouchableOpacity
            style={styles.generateItineraryButton}
            onPress={handleGeneratePress}
          >
            <MaterialIcons name='auto-awesome' size={20} color='#fff' />
            <Text style={styles.generateItineraryButtonText}>
              Generate AI Itinerary
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={itineraries}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItineraryItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          ListFooterComponent={
            <TouchableOpacity
              style={styles.generateMoreButton}
              onPress={handleGeneratePress}
            >
              <MaterialIcons
                name='auto-awesome'
                size={18}
                color={colors.primary}
              />
              <Text style={styles.generateMoreButtonText}>
                Generate More Itineraries
              </Text>
            </TouchableOpacity>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    color: colors.text,
  },
  generateButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(103, 80, 164, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    color: colors.primary,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    color: colors.text,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  generateItineraryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  generateItineraryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  list: {
    padding: 16,
  },
  itineraryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itineraryImage: {
    width: '100%',
    height: 150,
  },
  itineraryContent: {
    padding: 16,
  },
  itineraryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  itineraryDestination: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 12,
  },
  itineraryDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itineraryDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  itineraryDetailText: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 4,
    fontWeight: '500',
  },
  favoriteTag: {
    backgroundColor: colors.accent,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginLeft: 'auto',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.8)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  generateMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(103, 80, 164, 0.08)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 16,
  },
  generateMoreButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
