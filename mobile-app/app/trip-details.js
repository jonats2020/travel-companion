import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../styles/colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  getSavedItineraryById,
  fetchItineraryDetails,
  toggleFavoriteItinerary,
} from '../services/api';

const { width } = Dimensions.get('window');

export default function TripDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('about');

  console.log({ itinerary });

  useEffect(() => {
    const loadItineraryDetails = async () => {
      try {
        setLoading(true);
        let itineraryData = null;

        if (id) {
          // Try to get the itinerary from Supabase
          itineraryData = await getSavedItineraryById(id);

          if (!itineraryData) {
            console.log(
              `No itinerary found with ID ${id} in Supabase, trying in-memory database`
            );
            // If not found in Supabase, check in-memory DB as fallback (only during development)
            itineraryData = await fetchItineraryDetails(id);
          }
        }

        if (itineraryData) {
          setItinerary(itineraryData);
          setIsFavorite(itineraryData.isFavorite || false);
        } else {
          setError('Itinerary not found');
        }
      } catch (err) {
        console.error('Error fetching itinerary details:', err);
        setError('Failed to load itinerary details');
      } finally {
        setLoading(false);
      }
    };

    // Only load data if we have a valid ID
    if (id) {
      loadItineraryDetails();
    } else {
      setError('No itinerary ID provided');
      setLoading(false);
    }
  }, [id]);

  const handleToggleFavorite = async () => {
    try {
      setSaveLoading(true);
      if (itinerary.id) {
        const result = await toggleFavoriteItinerary(itinerary.id);
        if (result) {
          setIsFavorite(!isFavorite);
        }
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    } finally {
      setSaveLoading(false);
    }
  };

  const renderRatingStars = (rating) => {
    return (
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <MaterialIcons
            key={star}
            name={star <= rating ? 'star' : 'star-outline'}
            size={18}
            color={colors.rating}
          />
        ))}
        <Text style={styles.reviewCount}>
          ({itinerary.reviewCount || 87} reviews)
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color={colors.primary} />
        <Text style={styles.loadingText}>Loading itinerary details...</Text>
      </View>
    );
  }

  if (error || !itinerary) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name='error-outline' size={48} color={colors.error} />
        <Text style={styles.errorText}>{error || 'Itinerary not found'}</Text>
        <Button
          mode='contained'
          onPress={() => router.back()}
          style={styles.errorButton}
        >
          Go Back
        </Button>
      </View>
    );
  }

  const renderAboutContent = () => (
    <View style={styles.tabContent}>
      <View style={styles.infoSection}>
        <Text style={styles.infoLabel}>Best Time to visit</Text>
        <Text style={styles.infoValue}>April, May, June and September</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoLabel}>Description</Text>
        <Text style={styles.description}>
          {itinerary.description}
          <Text style={styles.readMore}> read more</Text>
        </Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoLabel}>Images</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.imagesScroll}
        >
          {itinerary.images ? (
            itinerary.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.galleryImage}
                resizeMode='cover'
              />
            ))
          ) : (
            <Image
              source={{ uri: itinerary.imageUrl }}
              style={styles.galleryImage}
              resizeMode='cover'
            />
          )}
        </ScrollView>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoLabel}>Review</Text>
        {renderRatingStars(itinerary.rating || 4.5)}
      </View>
    </View>
  );

  const renderThingsToDoContent = () => (
    <View style={styles.tabContent}>
      <Text style={styles.thingsToDoText}>Things to see and do</Text>
      <Text style={styles.thingsToDoDescription}>{itinerary.description}</Text>

      <View style={styles.thingsToDoGrid}>
        <TouchableOpacity style={styles.thingsToDoItem}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=2070&auto=format&fit=crop',
            }}
            style={styles.thingsToDoImage}
          />
          <View style={styles.thingsToDoImageOverlay}>
            <MaterialIcons name='visibility' size={24} color='white' />
            <Text style={styles.thingsToDoImageText}>Attractions</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.thingsToDoItem}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2074&auto=format&fit=crop',
            }}
            style={styles.thingsToDoImage}
          />
          <View style={styles.thingsToDoImageOverlay}>
            <MaterialIcons name='restaurant' size={24} color='white' />
            <Text style={styles.thingsToDoImageText}>Restaurants</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.thingsToDoItem}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop',
            }}
            style={styles.thingsToDoImage}
          />
          <View style={styles.thingsToDoImageOverlay}>
            <MaterialIcons name='hotel' size={24} color='white' />
            <Text style={styles.thingsToDoImageText}>Hotels</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.thingsToDoItem}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?q=80&w=2070&auto=format&fit=crop',
            }}
            style={styles.thingsToDoImage}
          />
          <View style={styles.thingsToDoImageOverlay}>
            <MaterialIcons name='directions' size={24} color='white' />
            <Text style={styles.thingsToDoImageText}>How to reach there</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPackagesContent = () => (
    <View style={styles.tabContent}>
      <View style={styles.packageHeader}>
        <Text style={styles.packageTitle}>
          {itinerary.destination} packages (
          {itinerary.packages ? itinerary.packages.length : 2})
        </Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.packagesList}>
        <View style={styles.packageCard}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc32?q=80&w=2070&auto=format&fit=crop',
            }}
            style={styles.packageImage}
          />
          <TouchableOpacity style={styles.packageFavoriteButton}>
            <MaterialIcons name='favorite-border' size={20} color='white' />
          </TouchableOpacity>

          <View style={styles.packageContent}>
            <Text style={styles.packageName}>
              Experience {itinerary.destination} in your Budget
            </Text>
            <Text style={styles.packageDetails}>
              Flight, activity, airport transfers
            </Text>
            <View style={styles.packageFooter}>
              <Text style={styles.packagePrice}>
                ${itinerary.estimatedCost} (Per Person)
              </Text>
              <View style={styles.packageDuration}>
                <Text style={styles.packageDurationText}>
                  {itinerary.duration}D/{itinerary.duration - 1}N
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.packageCard}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1559628129-67cf63b72248?q=80&w=2034&auto=format&fit=crop',
            }}
            style={styles.packageImage}
          />
          <TouchableOpacity style={styles.packageFavoriteButton}>
            <MaterialIcons name='favorite-border' size={20} color='white' />
          </TouchableOpacity>

          <View style={styles.packageContent}>
            <Text style={styles.packageName}>
              Luxury {itinerary.destination} Experience
            </Text>
            <Text style={styles.packageDetails}>
              Private tour, premium stays, guided trips
            </Text>
            <View style={styles.packageFooter}>
              <Text style={styles.packagePrice}>
                ${Math.round(itinerary.estimatedCost * 1.8)} (Per Person)
              </Text>
              <View style={styles.packageDuration}>
                <Text style={styles.packageDurationText}>
                  {itinerary.duration}D/{itinerary.duration - 1}N
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle='light-content' />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <ImageBackground
            source={{ uri: itinerary.imageUrl }}
            style={styles.coverImage}
            resizeMode='cover'
          >
            <View style={styles.headerOverlay}>
              <View style={styles.headerActions}>
                <TouchableOpacity
                  style={styles.headerButton}
                  onPress={() => router.back()}
                >
                  <MaterialIcons name='arrow-back' size={24} color='white' />
                </TouchableOpacity>

                <View style={styles.headerRightButtons}>
                  <TouchableOpacity
                    style={styles.headerButton}
                    onPress={handleToggleFavorite}
                  >
                    <MaterialIcons
                      name={isFavorite ? 'favorite' : 'favorite-border'}
                      size={24}
                      color='white'
                    />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.headerButton}>
                    <MaterialIcons name='share' size={24} color='white' />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>

        <View style={styles.content}>
          <View style={styles.titleSection}>
            <Text style={styles.destinationTitle}>{itinerary.title}</Text>
            <Text style={styles.destinationSubtitle}>
              ({itinerary.destination})
            </Text>
            {renderRatingStars(itinerary.rating || 4.5)}
          </View>

          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'about' && styles.activeTab]}
              onPress={() => setSelectedTab('about')}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === 'about' && styles.activeTabText,
                ]}
              >
                About
              </Text>
              {selectedTab === 'about' && <View style={styles.tabIndicator} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, selectedTab === 'things' && styles.activeTab]}
              onPress={() => setSelectedTab('things')}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === 'things' && styles.activeTabText,
                ]}
              >
                Things to do
              </Text>
              {selectedTab === 'things' && <View style={styles.tabIndicator} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                selectedTab === 'packages' && styles.activeTab,
              ]}
              onPress={() => setSelectedTab('packages')}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === 'packages' && styles.activeTabText,
                ]}
              >
                {itinerary.destination} packages
              </Text>
              {selectedTab === 'packages' && (
                <View style={styles.tabIndicator} />
              )}
            </TouchableOpacity>
          </View>

          {selectedTab === 'about' && renderAboutContent()}
          {selectedTab === 'things' && renderThingsToDoContent()}
          {selectedTab === 'packages' && renderPackagesContent()}

          {selectedTab === 'packages' && (
            <View style={styles.bookingSection}>
              <View style={styles.priceInfo}>
                <Text style={styles.priceText}>
                  ${itinerary.estimatedCost} (per person)
                </Text>
              </View>
              <TouchableOpacity style={styles.bookButton}>
                <Text style={styles.bookButtonText}>Book now</Text>
              </TouchableOpacity>
            </View>
          )}

          {selectedTab === 'about' && (
            <View style={styles.tourInfoSection}>
              <Text style={styles.tourInfoTitle}>Tour Information</Text>

              <View style={styles.tourInfoItem}>
                <Text style={styles.tourInfoLabel}>Duration:</Text>
                <Text style={styles.tourInfoValue}>
                  {itinerary.duration} Days, {itinerary.duration - 1} Nights
                </Text>
              </View>

              <View style={styles.tourInfoItem}>
                <Text style={styles.tourInfoLabel}>Start Point:</Text>
                <Text style={styles.tourInfoValue}>
                  {itinerary.startPoint ||
                    `${itinerary.destination} International Airport`}
                </Text>
              </View>

              <View style={styles.tourInfoItem}>
                <Text style={styles.tourInfoLabel}>End Point:</Text>
                <Text style={styles.tourInfoValue}>
                  {itinerary.endPoint ||
                    `${itinerary.destination} International Airport`}
                </Text>
              </View>

              <Text style={styles.includedTitle}>Included</Text>

              <View style={styles.includedItems}>
                <View style={styles.includedItem}>
                  <MaterialIcons
                    name='flight'
                    size={24}
                    color={colors.primary}
                  />
                </View>

                <View style={styles.includedItem}>
                  <MaterialIcons
                    name='directions-car'
                    size={24}
                    color={colors.primary}
                  />
                </View>

                <View style={styles.includedItem}>
                  <MaterialIcons
                    name='restaurant'
                    size={24}
                    color={colors.primary}
                  />
                </View>

                <View style={styles.includedItem}>
                  <MaterialIcons
                    name='hotel'
                    size={24}
                    color={colors.primary}
                  />
                </View>

                <View style={styles.includedItem}>
                  <MaterialIcons
                    name='check-circle'
                    size={24}
                    color={colors.primary}
                  />
                </View>
              </View>

              <View style={styles.bookingSection}>
                <View style={styles.priceInfo}>
                  <Text style={styles.priceText}>
                    ${itinerary.estimatedCost} (per person)
                  </Text>
                </View>
                <TouchableOpacity style={styles.bookButton}>
                  <Text style={styles.bookButtonText}>Book now</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
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
    backgroundColor: colors.background,
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    marginBottom: 24,
    color: colors.error,
    fontSize: 16,
    textAlign: 'center',
  },
  errorButton: {
    backgroundColor: colors.primary,
  },
  header: {
    width: '100%',
    height: 300,
  },
  coverImage: {
    width: '100%',
    height: 300,
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginTop: 20,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  headerRightButtons: {
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingTop: 20,
  },
  titleSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  destinationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  destinationSubtitle: {
    fontSize: 16,
    color: colors.darkGray,
    marginVertical: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  reviewCount: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.darkGray,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    position: 'relative',
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: colors.darkGray,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    width: '80%',
    backgroundColor: colors.primary,
  },
  tabContent: {
    padding: 16,
  },
  infoSection: {
    marginBottom: 24,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  infoValue: {
    fontSize: 14,
    color: colors.darkGray,
  },
  description: {
    fontSize: 14,
    color: colors.darkGray,
    lineHeight: 22,
  },
  readMore: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  imagesScroll: {
    marginTop: 12,
  },
  galleryImage: {
    width: 120,
    height: 90,
    borderRadius: 8,
    marginRight: 12,
  },
  thingsToDoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  thingsToDoDescription: {
    fontSize: 14,
    color: colors.darkGray,
    lineHeight: 22,
    marginBottom: 24,
  },
  thingsToDoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  thingsToDoItem: {
    width: '48%',
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  thingsToDoImage: {
    width: '100%',
    height: '100%',
  },
  thingsToDoImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thingsToDoImageText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  packageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
  },
  packagesList: {
    marginBottom: 16,
  },
  packageCard: {
    borderRadius: 12,
    backgroundColor: colors.cardBackground,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  packageImage: {
    width: '100%',
    height: 160,
  },
  packageFavoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  packageContent: {
    padding: 12,
  },
  packageName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  packageDetails: {
    fontSize: 14,
    color: colors.darkGray,
    marginBottom: 8,
  },
  packageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  packagePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  packageDuration: {
    backgroundColor: colors.lightAccent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  packageDurationText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  tourInfoSection: {
    padding: 16,
    backgroundColor: colors.background,
  },
  tourInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  tourInfoItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tourInfoLabel: {
    fontSize: 14,
    color: colors.darkGray,
    width: 100,
  },
  tourInfoValue: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  includedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 16,
  },
  includedItems: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  includedItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  priceInfo: {
    flex: 1,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  bookButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
