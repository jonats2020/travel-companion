import React from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../mobile-app/styles/colors';

const SearchBar = ({ placeholder, value, onChangeText, onSubmit }) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchInputContainer}>
        <MaterialIcons
          name='search'
          size={22}
          color={colors.darkGray}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder || 'Search your destination'}
          placeholderTextColor={colors.darkGray}
          value={value}
          onChangeText={onChangeText}
          returnKeyType='search'
          onSubmitEditing={onSubmit}
        />
        {value ? (
          <TouchableOpacity
            onPress={() => onChangeText('')}
            style={styles.clearButton}
          >
            <MaterialIcons name='clear' size={20} color={colors.darkGray} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: '100%',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 100,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: colors.text,
  },
  clearButton: {
    padding: 4,
  },
});

export default SearchBar;
