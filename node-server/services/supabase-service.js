const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    'Error: SUPABASE_URL and SUPABASE_ANON_KEY environment variables must be set'
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Save an itinerary to Supabase
 * @param {Object} itinerary - The itinerary to save
 * @returns {Promise<Object>} The saved itinerary
 */
async function saveItinerary(itinerary) {
  try {
    const { data, error } = await supabase
      .from('itineraries')
      .insert([
        {
          title: itinerary.title,
          description: itinerary.description,
          destination: itinerary.destination,
          duration: itinerary.duration,
          estimated_cost: itinerary.estimatedCost,
          image_url: itinerary.imageUrl,
          tags: itinerary.tags,
          best_for: itinerary.bestFor,
          daily_plan: itinerary.dailyPlan,
          packing_list: itinerary.packingList,
          additional_tips: itinerary.additionalTips,
          created_at: new Date().toISOString(),
          is_favorite: false,
        },
      ])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error saving itinerary to Supabase:', error);
    throw new Error(`Failed to save itinerary: ${error.message}`);
  }
}

/**
 * Get all saved itineraries
 * @param {string} countryFilter - Optional country filter
 * @returns {Promise<Array>} List of itineraries
 */
async function getSavedItineraries(countryFilter = null) {
  try {
    let query = supabase.from('itineraries').select('*');

    if (countryFilter) {
      query = query.ilike('destination', `%${countryFilter}%`);
    }

    const { data, error } = await query.order('created_at', {
      ascending: false,
    });

    if (error) throw error;

    // Transform the data to match our application's format
    return data.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      destination: item.destination,
      duration: item.duration,
      estimatedCost: item.estimated_cost,
      imageUrl: item.image_url,
      tags: item.tags,
      bestFor: item.best_for,
      dailyPlan: item.daily_plan,
      packingList: item.packing_list,
      additionalTips: item.additional_tips,
      createdAt: item.created_at,
      isFavorite: item.is_favorite,
    }));
  } catch (error) {
    console.error('Error fetching itineraries from Supabase:', error);
    throw new Error(`Failed to fetch itineraries: ${error.message}`);
  }
}

/**
 * Get a saved itinerary by ID
 * @param {string} id - Itinerary ID
 * @returns {Promise<Object>} The itinerary
 */
async function getSavedItineraryById(id) {
  try {
    const { data, error } = await supabase
      .from('itineraries')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) return null;

    // Transform the data to match our application's format
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      destination: data.destination,
      duration: data.duration,
      estimatedCost: data.estimated_cost,
      imageUrl: data.image_url,
      tags: data.tags,
      bestFor: data.best_for,
      dailyPlan: data.daily_plan,
      packingList: data.packing_list,
      additionalTips: data.additional_tips,
      createdAt: data.created_at,
      isFavorite: data.is_favorite,
    };
  } catch (error) {
    console.error('Error fetching itinerary from Supabase:', error);
    throw new Error(`Failed to fetch itinerary: ${error.message}`);
  }
}

/**
 * Toggle favorite status of an itinerary
 * @param {string} id - Itinerary ID
 * @returns {Promise<Object>} Updated itinerary
 */
async function toggleFavoriteItinerary(id) {
  try {
    // First get the current state
    const { data: currentItinerary, error: fetchError } = await supabase
      .from('itineraries')
      .select('is_favorite')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Toggle the favorite status
    const { data, error } = await supabase
      .from('itineraries')
      .update({ is_favorite: !currentItinerary.is_favorite })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      isFavorite: data.is_favorite,
    };
  } catch (error) {
    console.error('Error toggling favorite status:', error);
    throw new Error(`Failed to update favorite status: ${error.message}`);
  }
}

/**
 * Delete a saved itinerary
 * @param {string} id - Itinerary ID
 * @returns {Promise<boolean>} Success status
 */
async function deleteSavedItinerary(id) {
  try {
    const { error } = await supabase.from('itineraries').delete().eq('id', id);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error deleting itinerary from Supabase:', error);
    throw new Error(`Failed to delete itinerary: ${error.message}`);
  }
}

/**
 * Get all destinations
 * @param {number} limit - Optional limit on number of destinations to return
 * @returns {Promise<Array>} List of destinations
 */
async function getDestinations(limit = null) {
  try {
    let query = supabase.from('destinations').select('*');

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Transform the data to match our application's format
    return data.map((item) => ({
      id: item.id,
      name: item.name,
      country: item.country,
      tagline: item.tagline,
      description: item.description,
      imageUrl: item.image_url,
      rating: item.rating,
      reviewCount: item.review_count,
      price: item.price,
    }));
  } catch (error) {
    console.error('Error getting destinations:', error);
    throw new Error(`Failed to fetch destinations: ${error.message}`);
  }
}

/**
 * Search destinations by query
 * @param {string} query - Search query
 * @returns {Promise<Array>} Matching destinations
 */
async function searchDestinations(query) {
  try {
    // Use ILIKE for case-insensitive search in Supabase (PostgreSQL)
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .or(
        `name.ilike.%${query}%,country.ilike.%${query}%,description.ilike.%${query}%,tagline.ilike.%${query}%`
      );

    if (error) throw error;

    return data.map((item) => ({
      id: item.id,
      name: item.name,
      country: item.country,
      tagline: item.tagline,
      description: item.description,
      imageUrl: item.image_url,
      rating: item.rating,
      reviewCount: item.review_count,
      price: item.price,
    }));
  } catch (error) {
    console.error(`Error searching destinations with query "${query}":`, error);
    throw new Error(`Failed to search destinations: ${error.message}`);
  }
}

/**
 * Get a destination by ID
 * @param {string} id - Destination ID
 * @returns {Promise<Object>} The destination
 */
async function getDestinationById(id) {
  try {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.log(`No destination found with ID ${id} in Supabase`);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      country: data.country,
      tagline: data.tagline,
      description: data.description,
      imageUrl: data.image_url,
      rating: data.rating,
      reviewCount: data.review_count,
      price: data.price,
    };
  } catch (error) {
    console.error(`Error getting destination with ID ${id}:`, error);
    throw new Error(`Failed to fetch destination: ${error.message}`);
  }
}

/**
 * Get all collections
 * @returns {Promise<Array>} List of collections
 */
async function getCollections() {
  try {
    const { data, error } = await supabase.from('collections').select('*');

    if (error) throw error;

    return data.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      imageUrl: item.image_url,
      placesCount: item.places_count,
    }));
  } catch (error) {
    console.error('Error getting collections:', error);
    throw new Error(`Failed to fetch collections: ${error.message}`);
  }
}

/**
 * Get destinations for a specific collection
 * @param {string} collectionId - Collection ID
 * @returns {Promise<Array>} List of destinations in the collection
 */
async function getDestinationsByCollection(collectionId) {
  try {
    const { data, error } = await supabase
      .from('destination_collections')
      .select(
        `
        destinations:destination_id(*)
      `
      )
      .eq('collection_id', collectionId);

    if (error) throw error;

    // Extract the destinations from the joined query result
    return data.map((item) => ({
      id: item.destinations.id,
      name: item.destinations.name,
      country: item.destinations.country,
      tagline: item.destinations.tagline,
      description: item.destinations.description,
      imageUrl: item.destinations.image_url,
      rating: item.destinations.rating,
      reviewCount: item.destinations.review_count,
      price: item.destinations.price,
    }));
  } catch (error) {
    console.error(
      `Error getting destinations for collection ${collectionId}:`,
      error
    );
    throw new Error(
      `Failed to fetch collection destinations: ${error.message}`
    );
  }
}

module.exports = {
  saveItinerary,
  getSavedItineraries,
  getSavedItineraryById,
  toggleFavoriteItinerary,
  deleteSavedItinerary,
  getDestinations,
  getDestinationById,
  searchDestinations,
  getCollections,
  getDestinationsByCollection,
};
