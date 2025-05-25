import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Slider } from 'react-native-elements';
import { generateItineraries } from '../services/api';
import { colors } from '../styles/colors';

export default function GenerateItineraryScreen() {
  const router = useRouter();
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(5);
  const [budget, setBudget] = useState(1500);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedItineraries, setGeneratedItineraries] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleGenerate = async () => {
    if (!destination) {
      setError('Please enter a destination');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setShowResults(false);

      // Extract country from destination input (assume format "City, Country")
      const country = destination.includes(',')
        ? destination.split(',')[1].trim()
        : destination.trim();

      // Generate a single itinerary
      const result = await generateItineraries(country, days);

      if (result) {
        // Put the single itinerary in an array for consistent rendering
        setGeneratedItineraries([result]);
        setShowResults(true);
      } else {
        setError('Failed to generate itinerary. Please try again.');
      }
    } catch (err) {
      console.error('Error generating itinerary:', err);
      setError(
        'An error occurred while generating the itinerary. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleViewItinerary = (id) => {
    router.push(`/trip-details?id=${id}`);
  };

  const handleBack = () => {
    if (showResults) {
      setShowResults(false);
    } else {
      router.back();
    }
  };

  const renderResults = () => {
    if (!showResults) return null;

    // Helper function to parse JSON if it's a string
    const parseDailyPlan = (plan) => {
      if (!plan) return [];
      if (typeof plan === 'string') {
        try {
          return JSON.parse(plan);
        } catch (e) {
          console.error('Error parsing daily plan:', e);
          return [];
        }
      }
      return plan;
    };

    // Format the packing list items
    const renderPackingList = (items) => {
      if (!items || !Array.isArray(items) || items.length === 0) {
        return (
          <Text style={styles.emptyListText}>No packing list available</Text>
        );
      }

      return items.map((item, idx) => (
        <View key={`pack-${idx}`} style={styles.packingItem}>
          <MaterialIcons name='check-circle' size={16} color={colors.primary} />
          <Text style={styles.packingItemText}>{item}</Text>
        </View>
      ));
    };

    // Format a single day of activities
    const renderDayPlan = (day) => {
      if (!day) return null;

      return (
        <View style={styles.dayPlanCard}>
          <Text style={styles.dayTitle}>
            {day.title}
          </Text>
          <Text style={styles.dayDescription}>{day.description}</Text>

          {day.activities && day.activities.length > 0 ? (
            <View style={styles.activitiesList}>
              {day.activities.map((activity, idx) => (
                <View key={`activity-${idx}`} style={styles.activityItem}>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    <Text style={styles.activityDescription}>
                      {activity.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyListText}>
              No activities listed for this day
            </Text>
          )}
        </View>
      );
    };

    return (
      <ScrollView
        style={styles.resultsContainer}
        contentContainerStyle={styles.resultsContentContainer}
      >
        {generatedItineraries.map((itinerary, index) => {
          // Get the correct image URL field
          const imageUrl = itinerary.image_url || itinerary.imageUrl;
          // Parse the daily plan if it's a string
          const dailyPlan = parseDailyPlan(
            itinerary.daily_plan || itinerary.dailyPlan
          );
          // Get packing list from either field name
          const packingList =
            itinerary.packing_list || itinerary.packingList || [];
          // Get additional tips
          const additionalTips =
            itinerary.additional_tips || itinerary.additionalTips || '';

          return (
            <View key={itinerary.id || index} style={styles.fullItineraryCard}>
              {/* Header section with image and basic info */}
              <Image
                source={{
                  uri:
                    imageUrl ||
                    'https://images.unsplash.com/photo-1508009603885-50cf7c8dd0d5',
                }}
                style={styles.itineraryImage}
              />

              <View style={styles.itineraryHeader}>
                <Text style={styles.itineraryTitle}>{itinerary.title}</Text>
                <Text style={styles.itineraryDestination}>
                  {itinerary.destination}, {itinerary.country}
                </Text>
                <View style={styles.itineraryMeta}>
                  <View style={styles.metaItem}>
                    <MaterialIcons
                      name='calendar-today'
                      size={16}
                      color={colors.primary}
                    />
                    <Text style={styles.metaText}>
                      {itinerary.duration} Days
                    </Text>
                  </View>
                  <View style={styles.metaItem}>
                    <MaterialIcons
                      name='attach-money'
                      size={16}
                      color={colors.primary}
                    />
                    <Text style={styles.metaText}>
                      ${itinerary.estimated_cost || itinerary.estimatedCost}
                    </Text>
                  </View>
                  <View style={styles.metaItem}>
                    <MaterialIcons
                      name='person'
                      size={16}
                      color={colors.primary}
                    />
                    <Text style={styles.metaText}>
                      {itinerary.best_for || itinerary.bestFor}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.itineraryDescription}>
                <Text style={styles.descriptionText}>
                  {itinerary.description}
                </Text>
              </View>

              {/* Travel info section */}
              <View style={styles.travelInfoSection}>
                <Text style={styles.sectionTitle}>Travel Information</Text>
                <View style={styles.travelInfoItem}>
                  <Text style={styles.infoLabel}>Start Point:</Text>
                  <Text style={styles.infoValue}>
                    {itinerary.start_point || itinerary.startPoint}
                  </Text>
                </View>
                <View style={styles.travelInfoItem}>
                  <Text style={styles.infoLabel}>End Point:</Text>
                  <Text style={styles.infoValue}>
                    {itinerary.end_point || itinerary.endPoint}
                  </Text>
                </View>
              </View>

              {/* Daily plan section */}
              <View style={styles.dailyPlanSection}>
                <Text style={styles.sectionTitle}>Daily Plan</Text>
                {dailyPlan && dailyPlan.length > 0 ? (
                  dailyPlan.map((day, idx) => renderDayPlan(day))
                ) : (
                  <Text style={styles.emptyListText}>
                    No daily plan available
                  </Text>
                )}
              </View>

              {/* Packing list section */}
              <View style={styles.packingListSection}>
                <Text style={styles.sectionTitle}>Packing List</Text>
                <View style={styles.packingListContainer}>
                  {renderPackingList(packingList)}
                </View>
              </View>

              {/* Additional tips section */}
              {additionalTips && (
                <View style={styles.tipsSection}>
                  <Text style={styles.sectionTitle}>Additional Tips</Text>
                  <Text style={styles.tipsText}>{additionalTips}</Text>
                </View>
              )}
            </View>
          );
        })}

        <TouchableOpacity
          style={styles.generateAgainButton}
          onPress={() => setShowResults(false)}
        >
          <Text style={styles.generateAgainButtonText}>
            Generate a New Itinerary
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  const renderGenerateForm = () => {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.formContainer}
      >
        <Text style={styles.inputLabel}>Where do you want to go?</Text>
        <TextInput
          style={styles.input}
          placeholder='City, Country (e.g. Bali, Indonesia)'
          value={destination}
          onChangeText={setDestination}
        />

        <Text style={styles.inputLabel}>How many days?</Text>
        <View style={styles.sliderContainer}>
          <Slider
            value={days}
            onValueChange={(value) => setDays(value)}
            minimumValue={2}
            maximumValue={14}
            step={1}
            trackStyle={styles.sliderTrack}
            thumbStyle={styles.sliderThumb}
            minimumTrackTintColor={colors.primary}
          />
          <Text style={styles.sliderValue}>{days} days</Text>
        </View>

        <Text style={styles.inputLabel}>What's your budget? (per person)</Text>
        <View style={styles.sliderContainer}>
          <Slider
            value={budget}
            onValueChange={(value) => setBudget(value)}
            minimumValue={500}
            maximumValue={5000}
            step={100}
            trackStyle={styles.sliderTrack}
            thumbStyle={styles.sliderThumb}
            minimumTrackTintColor={colors.primary}
          />
          <Text style={styles.sliderValue}>${budget}</Text>
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={styles.generateButton}
          onPress={handleGenerate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color='white' />
          ) : (
            <>
              <MaterialIcons name='auto-awesome' size={20} color='white' />
              <Text style={styles.generateButtonText}>
                Generate AI Itineraries
              </Text>
            </>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <MaterialIcons name='arrow-back' size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {showResults ? 'Generated Itineraries' : 'Create AI Itinerary'}
        </Text>
      </View>

      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {showResults ? renderResults() : renderGenerateForm()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
    backgroundColor: 'white',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 16,
    color: colors.text,
  },
  contentContainer: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 16,
  },
  sliderContainer: {
    marginVertical: 8,
  },
  sliderTrack: {
    height: 6,
    borderRadius: 3,
  },
  sliderThumb: {
    width: 24,
    height: 24,
    backgroundColor: colors.primary,
    borderRadius: 12,
    elevation: 2,
  },
  sliderValue: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8,
    color: colors.primary,
  },
  generateButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 24,
  },
  generateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  errorText: {
    color: colors.error,
    marginTop: 16,
    textAlign: 'center',
  },
  resultsContainer: {
    flex: 1,
  },
  resultsContentContainer: {
    padding: 16,
  },

  // Enhanced detailed itinerary card
  fullItineraryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itineraryImage: {
    width: '100%',
    height: 200,
  },
  itineraryHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itineraryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  itineraryDestination: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 12,
  },
  itineraryMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginLeft: 4,
  },
  itineraryDescription: {
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },

  // Travel info section
  travelInfoSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  travelInfoItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
    width: 100,
  },
  infoValue: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },

  // Daily plan section
  dailyPlanSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  dayPlanCard: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  dayDescription: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 12,
    lineHeight: 20,
  },
  activitiesList: {
    marginTop: 8,
  },
  activityItem: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  activityTime: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.primary,
    width: 80,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 13,
    color: colors.textLight,
    lineHeight: 18,
  },

  // Packing list section
  packingListSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  packingListContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  packingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    paddingVertical: 6,
  },
  packingItemText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },

  // Tips section
  tipsSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  tipsText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
  },

  // Empty states
  emptyListText: {
    fontSize: 14,
    color: colors.textLight,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 12,
  },

  // Generate again button
  generateAgainButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 24,
    marginBottom: 40,
  },
  generateAgainButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});
