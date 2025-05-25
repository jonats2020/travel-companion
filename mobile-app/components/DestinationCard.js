import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../styles/colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width / 2 - 24; // Half width minus padding

const DestinationCard = ({
  destination,
  onPress,
  style,
  compact = false,
  featured = false,
  horizontal = false,
}) => {
  const imageHeight = featured ? 180 : compact ? 120 : 160;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        featured && styles.featuredContainer,
        horizontal && styles.horizontalContainer,
        style,
      ]}
      onPress={() => onPress(destination)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: destination.imageUrl }}
        style={[
          styles.image,
          { height: imageHeight },
          featured && styles.featuredImage,
          horizontal && styles.horizontalImage,
        ]}
        resizeMode='cover'
      />

      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => console.log('Toggle favorite', destination.id)}
      >
        <MaterialIcons
          name={destination.isFavorite ? 'favorite' : 'favorite-border'}
          size={24}
          color='#fff'
        />
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {destination.name}
        </Text>

        <Text style={styles.subtitle} numberOfLines={1}>
          {destination.tagline}
        </Text>

        {!compact && destination.rating && (
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <MaterialIcons
                key={star}
                name={star <= destination.rating ? 'star' : 'star-border'}
                size={16}
                color={colors.rating}
              />
            ))}
            {destination.reviewCount && (
              <Text style={styles.reviewCount}>
                ({destination.reviewCount})
              </Text>
            )}
          </View>
        )}

        {destination.price && (
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${destination.price}</Text>
            {destination.duration && (
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>{destination.duration}</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featuredContainer: {
    width: width - 32,
  },
  horizontalContainer: {
    width: width - 32,
    flexDirection: 'row',
    height: 120,
  },
  image: {
    width: '100%',
    height: 160,
  },
  featuredImage: {
    width: '100%',
  },
  horizontalImage: {
    width: 120,
    height: 120,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: 12,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.darkGray,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewCount: {
    fontSize: 12,
    color: colors.darkGray,
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  durationBadge: {
    backgroundColor: colors.lightAccent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  durationText: {
    fontSize: 12,
    color: colors.darkAccent,
    fontWeight: '600',
  },
});

export default DestinationCard;
