const {
  saveItinerary,
  getSavedItineraries,
  getSavedItineraryById,
  toggleFavoriteItinerary,
  deleteSavedItinerary,
} = require('../services/supabase-service');

const { generateItineraryWithAI } = require('../services/openai-service');

/**
 * Controller to handle saving an itinerary to the database
 */
async function handleSaveItinerary(req, res, next) {
  try {
    const itinerary = req.body;

    if (!itinerary.title || !itinerary.destination) {
      return res.status(400).json({
        message: 'Title and destination are required fields',
      });
    }

    const savedItinerary = await saveItinerary(itinerary);
    res.status(201).json(savedItinerary);
  } catch (error) {
    next(error);
  }
}

/**
 * Controller to handle fetching all saved itineraries
 */
async function handleGetSavedItineraries(req, res, next) {
  try {
    const { country } = req.query;
    const itineraries = await getSavedItineraries(country);

    res.json(itineraries);
  } catch (error) {
    next(error);
  }
}

/**
 * Controller to handle fetching a single itinerary by ID
 */
async function handleGetSavedItineraryById(req, res, next) {
  try {
    const { id } = req.params;
    const itinerary = await getSavedItineraryById(id);

    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    res.json(itinerary);
  } catch (error) {
    next(error);
  }
}

/**
 * Controller to handle toggling favorite status of an itinerary
 */
async function handleToggleFavorite(req, res, next) {
  try {
    const { id } = req.params;
    const result = await toggleFavoriteItinerary(id);

    res.json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Controller to handle deleting an itinerary
 */
async function handleDeleteItinerary(req, res, next) {
  try {
    const { id } = req.params;
    const success = await deleteSavedItinerary(id);

    if (!success) {
      return res
        .status(404)
        .json({ message: 'Itinerary not found or could not be deleted' });
    }

    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

/**
 * Controller to handle generating itineraries with AI
 */
async function handleGenerateItineraries(req, res, next) {
  try {
    const { country, days, count = 4 } = req.body;

    if (!country) {
      return res.status(400).json({ message: 'Country is required' });
    }

    // Default to 7 days if not specified
    const duration = days || 7;

    // Generate multiple itineraries in parallel
    const promises = [];
    for (let i = 0; i < count; i++) {
      promises.push(generateItineraryWithAI(country, duration));
    }

    const generatedItineraries = await Promise.all(promises);

    // Save the generated itineraries to Supabase
    const savedPromises = generatedItineraries.map((itinerary) =>
      saveItinerary(itinerary)
    );
    const savedItineraries = await Promise.all(savedPromises);

    res.status(201).json(savedItineraries);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  handleSaveItinerary,
  handleGetSavedItineraries,
  handleGetSavedItineraryById,
  handleToggleFavorite,
  handleDeleteItinerary,
  handleGenerateItineraries,
};
