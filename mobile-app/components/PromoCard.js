import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../mobile-app/styles/colors';

const PromoCard = ({ promo, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Card
        style={[
          styles.card,
          { backgroundColor: promo.color || colors.promoBackground },
        ]}
      >
        <Card.Content style={styles.content}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name={promo.icon || 'tag'}
              size={28}
              color='#FFF'
            />
          </View>
          <View style={styles.textContainer}>
            <Title style={styles.title}>{promo.title}</Title>
            <Paragraph style={styles.description} numberOfLines={2}>
              {promo.description}
            </Paragraph>
          </View>
          {promo.discount && (
            <View style={styles.discountContainer}>
              <Paragraph style={styles.discount}>{promo.discount}</Paragraph>
              <Paragraph style={styles.discountLabel}>OFF</Paragraph>
            </View>
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  card: {
    borderRadius: 12,
    elevation: 2,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  discountContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  discount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.accent,
    textAlign: 'center',
  },
  discountLabel: {
    fontSize: 10,
    color: colors.darkGray,
    textAlign: 'center',
  },
});

export default PromoCard;
