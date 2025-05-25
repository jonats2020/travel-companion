const express = require('express');
const router = express.Router();
const {
  getDestinations,
  getDestinationById,
  searchDestinations,
  getCollections,
  getDestinationsByCollection,
} = require('../services/supabase-service');

/**
 * @route GET /api/destinations
 * @desc Get all destinations
 */
router.get('/', async (req, res, next) => {
  try {
    const { limit } = req.query;
    const destinations = await getDestinations(limit ? parseInt(limit) : null);
    res.json(destinations);
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/destinations/search
 * @desc Search destinations by query
 */
router.get('/search', async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }

    const results = await searchDestinations(query);
    res.json(results);
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/destinations/collections
 * @desc Get all collections
 */
router.get('/collections', async (req, res, next) => {
  try {
    const collections = await getCollections();
    res.json(collections);
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/destinations/collections/:id
 * @desc Get destinations in a specific collection
 */
router.get('/collections/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const destinations = await getDestinationsByCollection(id);
    res.json(destinations);
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/destinations/:id
 * @desc Get a specific destination by ID
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const destination = await getDestinationById(id);

    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    res.json(destination);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
