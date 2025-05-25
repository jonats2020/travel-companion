import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../mobile-app/styles/colors';

const ItineraryCard = ({ itinerary, onPress }) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(itinerary)}
      style={styles.container}
    >
      <Card style={styles.card}>
        <Card.Cover source={{ uri: itinerary.imageUrl }} style={styles.image} />
        <Card.Content style={styles.content}>
          <Title style={styles.title}>{itinerary.title}</Title>
          <Paragraph style={styles.description} numberOfLines={2}>
            {itinerary.description}
          </Paragraph>

          <View style={styles.detailsContainer}>
            <View style={styles.detail}>
              <MaterialCommunityIcons
                name='calendar-range'
                size={16}
                color={colors.accent}
              />
              <Paragraph style={styles.detailText}>
                {itinerary.duration} days
              </Paragraph>
            </View>

            <View style={styles.detail}>
              <MaterialCommunityIcons
                name='cash'
                size={16}
                color={colors.accent}
              />
              <Paragraph style={styles.detailText}>
                ${itinerary.estimatedCost}
              </Paragraph>
            </View>
          </View>

          <View style={styles.tagsContainer}>
            {itinerary.tags &&
              itinerary.tags.slice(0, 3).map((tag, index) => (
                <Chip
                  key={index}
                  style={styles.chip}
                  textStyle={styles.chipText}
                >
                  {tag}
                </Chip>
              ))}
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 12,
    elevation: 3,
    backgroundColor: colors.cardBackground,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  image: {
    height: 140,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 10,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 4,
    fontSize: 14,
    color: colors.darkGray,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 4,
    backgroundColor: colors.lightAccent,
  },
  chipText: {
    fontSize: 12,
    color: colors.darkAccent,
  },
});

export default ItineraryCard;
