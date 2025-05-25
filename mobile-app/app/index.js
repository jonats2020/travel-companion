import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  FlatList, 
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../styles/colors';
import DestinationCard from '../components/DestinationCard';
import CollectionCard from '../components/CollectionCard';
import { 
  fetchDestinations, 
  fetchCollections,
  getSavedItineraries
} from '../services/api';

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [destinations, setDestinations] = useState([]);
  const [collections, setCollections] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [featuredDestinations, setFeaturedDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('New York');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Fetch destinations from Supabase
      const destinationsData = await fetchDestinations();
      
      // Fetch collections from Supabase
      const collectionsData = await fetchCollections();
      
      // Extract featured destinations (first 2)
      const featured = destinationsData.slice(0, 2);
      
      // Get saved itineraries from Supabase
      const itinerariesData = await getSavedItineraries();
      
      setDestinations(destinationsData);
      setFeaturedDestinations(featured);
      setCollections(collectionsData);
      setItineraries(itinerariesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      router.push('/search');
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleDestinationPress = (destination) => {
    router.push({
      pathname: '/destination',
      params: { id: destination.id }
    });
  };

  const handleCollectionPress = (collection) => {
    router.push({
      pathname: '/collection',
      params: { id: collection.id, title: collection.title }
    });
  };

  const handleItineraryPress = (itinerary) => {
    router.push({
      pathname: '/trip-details',
      params: { id: itinerary.id }
    });
  };

  const handleSearchPress = () => {
    router.push('/search');
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading amazing destinations...</Text>
      </View>
    );
  }

  const renderTopDestinationItem = ({ item }) => (
    <View style={styles.topDestinationItem}>
      <TouchableOpacity 
        onPress={() => handleDestinationPress(item)}
        activeOpacity={0.8}
      >
        <ImageBackground
          source={{ uri: item.imageUrl }}
          style={styles.topDestinationImage}
          imageStyle={styles.topDestinationImageStyle}
        >
          <View style={styles.topDestinationOverlay}>
            <Text style={styles.topDestinationText}>{item.name}</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>
              Hi Traveler, Ready to travel?
            </Text>
            <View style={styles.locationContainer}>
              <MaterialIcons name="location-on" size={16} color="#fff" />
              <Text style={styles.locationText}>{currentLocation}</Text>
              <MaterialIcons name="keyboard-arrow-down" size={16} color="#fff" />
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <MaterialIcons name="notifications" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        
        {/* Search Bar */}
        <TouchableOpacity 
          style={styles.searchBarButton}
          onPress={handleSearchPress}
        >
          <MaterialIcons name="search" size={22} color={colors.darkGray} style={styles.searchIcon} />
          <Text style={styles.searchPlaceholder}>Search your destination</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Featured Destinations Carousel */}
        <View style={styles.featuredSection}>
          {featuredDestinations.length > 0 ? (
            <FlatList
              data={featuredDestinations}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <DestinationCard 
                  destination={item} 
                  onPress={handleDestinationPress}
                  featured={true}
                  style={styles.featuredCard}
                />
              )}
              contentContainerStyle={styles.featuredList}
            />
          ) : (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>
                No featured destinations available yet. Please add destinations to your Supabase database.
              </Text>
            </View>
          )}
        </View>
        
        {/* Latest Collections */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest Collection for you</Text>
            <TouchableOpacity onPress={() => router.push('/collections')}>
              <Text style={styles.seeAllText}>see all</Text>
            </TouchableOpacity>
          </View>
          
          {collections.length > 0 ? (
            <View style={styles.collectionsContainer}>
              {collections.map((collection, index) => (
                <CollectionCard 
                  key={collection.id} 
                  collection={collection} 
                  onPress={handleCollectionPress}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>
                No collections available yet. Please add collections to your Supabase database.
              </Text>
            </View>
          )}
        </View>
        
        {/* Top Destinations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top international destination</Text>
            <TouchableOpacity onPress={() => router.push('/top-destinations')}>
              <Text style={styles.seeAllText}>see all</Text>
            </TouchableOpacity>
          </View>
          
          {destinations.length > 0 ? (
            <FlatList
              data={destinations}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              renderItem={renderTopDestinationItem}
              scrollEnabled={false}
              contentContainerStyle={styles.topDestinationsGrid}
            />
          ) : (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>
                No destinations available yet. Please add destinations to your Supabase database.
              </Text>
            </View>
          )}
        </View>
        
        {/* Saved Itineraries */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Saved Itineraries</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.generateButton}
                onPress={() => router.push('/generate-itinerary')}
              >
                <MaterialIcons name="auto-awesome" size={16} color={colors.primary} />
                <Text style={styles.generateButtonText}>Generate</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/saved-itineraries')}>
                <Text style={styles.seeAllText}>see all</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {itineraries.length > 0 ? (
            <FlatList
              data={itineraries.slice(0, 2)}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <DestinationCard 
                  destination={{
                    ...item,
                    name: item.title,
                    tagline: item.destination,
                    price: item.estimatedCost,
                    duration: `${item.duration}D`,
                    rating: 4,
                  }}
                  onPress={() => handleItineraryPress(item)}
                  style={styles.itineraryCard}
                />
              )}
              contentContainerStyle={styles.itinerariesList}
            />
          ) : (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>
                No saved itineraries yet. Generate your first AI travel plan!
              </Text>
              <TouchableOpacity 
                style={styles.emptyStateButton}
                onPress={() => router.push('/generate-itinerary')}
              >
                <MaterialIcons name="auto-awesome" size={18} color="white" />
                <Text style={styles.emptyStateButtonText}>Generate AI Itinerary</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        <View style={styles.bottomSpace} />
      </ScrollView>
      
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
          <MaterialIcons name="home" size={24} color={colors.primary} />
          <Text style={[styles.navText, styles.activeNavText]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="book-online" size={24} color={colors.darkGray} />
          <Text style={styles.navText}>Booking</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="favorite-border" size={24} color={colors.darkGray} />
          <Text style={styles.navText}>Favorites</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="person-outline" size={24} color={colors.darkGray} />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: colors.primary,
    fontSize: 16,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingTop: 64,
    paddingBottom: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#fff',
    marginHorizontal: 4,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 100,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: colors.darkGray,
  },
  section: {
    marginVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(103, 80, 164, 0.08)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 100,
    marginRight: 16,
  },
  generateButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary,
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
  },
  featuredSection: {
    marginTop: 16,
  },
  featuredList: {
    paddingHorizontal: 16,
  },
  featuredCard: {
    marginRight: 16,
    width: 300,
  },
  collectionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  topDestinationsGrid: {
    paddingHorizontal: 16,
  },
  topDestinationItem: {
    flex: 1,
    maxWidth: '50%',
    padding: 8,
  },
  topDestinationImage: {
    height: 120,
    justifyContent: 'flex-end',
  },
  topDestinationImageStyle: {
    borderRadius: 16,
  },
  topDestinationOverlay: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 12,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  topDestinationText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  itinerariesList: {
    paddingHorizontal: 16,
  },
  itineraryCard: {
    marginRight: 16,
    width: 300,
  },
  bottomSpace: {
    height: 80,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeNavItem: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  navText: {
    fontSize: 12,
    color: colors.darkGray,
    marginTop: 4,
  },
  activeNavText: {
    color: colors.primary,
  },
  emptyStateContainer: {
    padding: 20,
    backgroundColor: colors.lightAccent,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.darkAccent,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 100,
  },
  emptyStateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  }
});