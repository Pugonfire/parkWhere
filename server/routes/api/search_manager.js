/** Handles search logic and search history
 * @module search_manager
 * @requires express
 * @requires database_api
 */
const express = require('express');
const database = require('../../database_api');

const router = express.Router();

/**
 * For fuzzy search
 */
/**
 *
 * @param {*} text - String user enters to search
 * @returns {String} String with wildcards
 */
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

/**
 * POST: Search for a specific carparks
 * @name /search
 * @function
 * @inner
 * @param {string} req - Request
 * @param {string} res - Response
 */
router.post('/search', async (req, res) => {
  //fuzzy search
  const regex = new RegExp(escapeRegex(req.body.ppName), 'gi');
  const carpark_details = database.connectCollection('carpark_details');
  updateSearchHistory(req.body.ppName);
  res.send(await carpark_details.find({ ppName: regex }).toArray());
});

/**
 * GET: User's 10 recent search history
 * @name /ush
 * @function
 * @inner
 * @param {string} res - Response
 */
router.get('/ush', async (req, res) => {
  const user_history = database.connectCollection('user_history');
  res.send(await user_history.find({}).sort({ createdAt: 1 }).toArray());
});

/**
 * POST: Find carpark details
 * @name /recentcarparks
 * @function
 * @inner
 * @param {string} req - Request
 * @param {string} res - Response
 */
router.post('/recentcarparks', async (req, res) => {
  const carpark_details = database.connectCollection('carpark_details');
  res.send(await carpark_details.find({ ppName: { $in: req.body.content.carparks } }).toArray());
});

/**
 * Update User's search history
 * @param {*} search - What the user has just searched for
 */
async function updateSearchHistory(search) {
  const user_history = database.connectCollection('user_history');
  await user_history.insertOne({
    text: search,
    createdAt: new Date(),
  });

  console.log("User's history updated");
}

module.exports = router;
