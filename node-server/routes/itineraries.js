const express = require('express');
const router = express.Router();
const { generateItineraryWithAI } = require('../services/openai-service');
const {
  saveItinerary,
  getSavedItineraries,
  getSavedItineraryById,
  toggleFavoriteItinerary,
  deleteSavedItinerary,
} = require('../services/supabase-service');
const {
  handleGenerateItineraries,
} = require('../controllers/itinerary-controller');

/**
 * @route GET /api/itineraries
 * @desc Get all itineraries from Supabase
 */
router.get('/', async (req, res, next) => {
  try {
    const { country } = req.query;

    // Get saved itineraries from Supabase
    const itineraries = await getSavedItineraries(country);
    res.json(itineraries);
  } catch (error) {
    console.error('Error fetching itineraries:', error);
    next(error);
  }
});

/**
 * @route GET /api/itineraries/:id
 * @desc Get a specific itinerary by ID from Supabase
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate UUID format
    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidPattern.test(id)) {
      return res.status(400).json({ message: `Invalid UUID format: ${id}` });
    }

    // Get itinerary from Supabase
    const itinerary = await getSavedItineraryById(id);

    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    res.json(itinerary);
  } catch (error) {
    console.error(`Error fetching itinerary with ID ${req.params.id}:`, error);
    next(error);
  }
});

/**
 * @route POST /api/itineraries
 * @desc Create a new itinerary in Supabase
 */
router.post('/', async (req, res, next) => {
  try {
    const newItinerary = req.body;

    if (!newItinerary.title || !newItinerary.destination) {
      return res
        .status(400)
        .json({ message: 'Title and destination are required' });
    }

    // Save to Supabase
    const itinerary = await saveItinerary(newItinerary);
    res.status(201).json(itinerary);
  } catch (error) {
    console.error('Error creating itinerary:', error);
    next(error);
  }
});

/**
 * @route PUT /api/itineraries/:id/favorite
 * @desc Toggle favorite status of an itinerary
 */
router.put('/:id/favorite', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate UUID format
    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidPattern.test(id)) {
      return res.status(400).json({ message: `Invalid UUID format: ${id}` });
    }

    const result = await toggleFavoriteItinerary(id);
    res.json(result);
  } catch (error) {
    console.error(
      `Error toggling favorite for itinerary ${req.params.id}:`,
      error
    );
    next(error);
  }
});

/**
 * @route DELETE /api/itineraries/:id
 * @desc Delete a saved itinerary
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate UUID format
    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidPattern.test(id)) {
      return res.status(400).json({ message: `Invalid UUID format: ${id}` });
    }

    await deleteSavedItinerary(id);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(`Error deleting itinerary ${req.params.id}:`, error);
    next(error);
  }
});

/**
 * @route POST /api/itineraries/generate
 * @desc Generate a single itinerary using AI
 */
router.post('/generate', async (req, res, next) => {
  try {
    const { country, days } = req.body;

    if (!country) {
      return res.status(400).json({ message: 'Country is required' });
    }

    // Default to 7 days if not specified
    const duration = days || 7;

    // Generate itinerary
    const generatedItinerary = await generateItineraryWithAI(country, duration);

    // Return the generated itinerary without saving
    res.status(200).json(generatedItinerary);
  } catch (error) {
    console.error('Error generating itinerary:', error);
    next(error);
  }
});

module.exports = router;
