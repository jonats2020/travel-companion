import axios from 'axios';

// Base URL for API
const API_URL = 'http://localhost:8000'; // Using localhost to connect to our server

// API endpoints
const ENDPOINTS = {
  DESTINATIONS: '/api/destinations',
  ITINERARIES: '/api/itineraries',
  SEARCH: '/api/destinations/search',
  GENERATE_ITINERARIES: '/api/itineraries/generate',
  COLLECTIONS: '/api/destinations/collections',
};

// Setup axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 25000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error handler
const handleError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('Response error:', error.response.data);
    return Promise.reject(error.response.data);
  } else if (error.request) {
    // The request was made but no response was received
    console.error('Request error:', error.request);
    return Promise.reject({
      message: 'No response from server. Please check your connection.',
    });
  } else {
    // Something happened in setting up the request
    console.error('Error:', error.message);
    return Promise.reject({ message: 'Request failed. Please try again.' });
  }
};

// API functions
export const fetchDestinations = async () => {
  try {
    const response = await api.get(ENDPOINTS.DESTINATIONS);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const searchDestinations = async (query) => {
  try {
    const response = await api.get(`${ENDPOINTS.SEARCH}?query=${query}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const fetchItineraries = async (countryFilter = '') => {
  try {
    let url = ENDPOINTS.ITINERARIES;
    if (countryFilter) {
      url += `?country=${countryFilter}`;
    }
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const fetchItineraryDetails = async (itineraryId) => {
  try {
    const response = await api.get(`${ENDPOINTS.ITINERARIES}/${itineraryId}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const generateItineraries = async (country, days) => {
  try {
    const response = await api.post(`${ENDPOINTS.GENERATE_ITINERARIES}`, {
      country,
      days,
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Function removed as requested

export const getSavedItineraries = async (countryFilter = '') => {
  try {
    let url = ENDPOINTS.ITINERARIES;
    if (countryFilter) {
      url += `?country=${countryFilter}`;
    }
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getSavedItineraryById = async (id) => {
  try {
    // Check if id is a valid UUID
    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidPattern.test(id)) {
      console.error(`Invalid UUID format: ${id}`);
      return null;
    }

    // Simple RESTful endpoint
    const response = await api.get(`${ENDPOINTS.ITINERARIES}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch itinerary: ${error.message}`);
    return handleError(error);
  }
};

export const saveItinerary = async (itinerary) => {
  try {
    // Use standard POST to the collection endpoint
    const response = await api.post(ENDPOINTS.ITINERARIES, itinerary);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const toggleFavoriteItinerary = async (id) => {
  try {
    // Check if id is a valid UUID
    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidPattern.test(id)) {
      console.error(`Invalid UUID format for favorite toggle: ${id}`);
      return null;
    }

    // Update specific itinerary
    const response = await api.put(`${ENDPOINTS.ITINERARIES}/${id}/favorite`);
    return response.data;
  } catch (error) {
    console.error(`Failed to toggle favorite: ${error.message}`);
    return handleError(error);
  }
};

export const deleteSavedItinerary = async (id) => {
  try {
    // Check if id is a valid UUID
    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidPattern.test(id)) {
      console.error(`Invalid UUID format for deletion: ${id}`);
      return false;
    }

    // Standard DELETE request
    await api.delete(`${ENDPOINTS.ITINERARIES}/${id}`);
    return true;
  } catch (error) {
    console.error(`Failed to delete itinerary: ${error.message}`);
    return handleError(error);
  }
};

/**
 * Fetch all collections
 * @returns {Promise<Array>} Collections
 */
export const fetchCollections = async () => {
  try {
    const response = await api.get(ENDPOINTS.COLLECTIONS);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Fetch destinations for a specific collection
 * @param {string} collectionId - Collection ID
 * @returns {Promise<Array>} Destinations in the collection
 */
export const fetchCollectionDestinations = async (collectionId) => {
  try {
    const response = await api.get(`${ENDPOINTS.COLLECTIONS}/${collectionId}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Fetch a destination by ID
 * @param {string} id - Destination ID
 * @returns {Promise<Object>} Destination details
 */
export const fetchDestinationById = async (id) => {
  try {
    const response = await api.get(`${ENDPOINTS.DESTINATIONS}/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export default {
  fetchDestinations,
  searchDestinations,
  fetchItineraries,
  fetchItineraryDetails,
  generateItineraries,
  getSavedItineraries,
  getSavedItineraryById,
  saveItinerary,
  toggleFavoriteItinerary,
  deleteSavedItinerary,
  fetchCollections,
  fetchCollectionDestinations,
  fetchDestinationById,
};
