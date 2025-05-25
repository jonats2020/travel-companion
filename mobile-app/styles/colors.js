import { DefaultTheme } from 'react-native-paper';

export const colors = {
  primary: '#5864F2',       // Primary purple-blue
  secondary: '#4751DB',     // Darker purple-blue
  accent: '#FF8A65',        // Coral accent
  lightAccent: '#E9EAFF',   // Light purple tint
  darkAccent: '#4048AB',    // Dark purple-blue
  background: '#FFFFFF',    // White background
  cardBackground: '#F8F8F8', // White card background
  text: '#333333',          // Dark text
  lightGray: '#E0E0E0',     // Light gray for dividers
  darkGray: '#777777',      // Dark gray for secondary text
  error: '#F44336',         // Error red
  success: '#4CAF50',       // Success green
  warning: '#FF9800',       // Warning orange
  caption: '#757575',       // Caption text color
  highlight: '#E8F5E9',     // Highlight background
  surface: '#FFFFFF',       // Surface color
  shadow: 'rgba(0, 0, 0, 0.1)', // Shadow color
  overlay: 'rgba(0, 0, 0, 0.5)', // Overlay color
  rating: '#FFC107',        // Rating stars
  chip: '#ECEFF1',          // Chip background
  chipText: '#455A64',      // Chip text
  gradientStart: '#6471FF', // Gradient start color
  gradientEnd: '#4751DB',   // Gradient end color
};

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    accent: colors.accent,
    background: colors.background,
    surface: colors.cardBackground,
    text: colors.text,
    error: colors.error,
  },
  roundness: 12,
  animation: {
    scale: 1.0,
  },
};