import React from 'react';
import { Stack } from 'expo-router';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from '../styles/colors';

export default function AppLayout() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <Stack>
          <Stack.Screen
            name='index'
            options={{
              title: 'Travel Planner',
              headerShown: false,
              headerStyle: {
                backgroundColor: theme.colors.primary,
              },
              // headerTintColor: '#fff',
              // headerTitleStyle: {
              //   fontWeight: 'bold',
              // },
            }}
          />
          <Stack.Screen
            name='trip-details'
            options={{
              title: 'Trip Details',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name='generate-itinerary'
            options={{
              title: 'Generate Itinerary',
              headerStyle: {
                backgroundColor: theme.colors.primary,
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          />
          <Stack.Screen
            name='saved-itinerary'
            options={{
              title: 'Saved Itinerary',
              // headerStyle: {
              //   backgroundColor: theme.colors.primary,
              // },
              // headerTintColor: '#fff',
              // headerTitleStyle: {
              //   fontWeight: 'bold',
              // },
            }}
          />
        </Stack>
        <StatusBar style='auto' />
      </PaperProvider>
    </SafeAreaProvider>
  );
}