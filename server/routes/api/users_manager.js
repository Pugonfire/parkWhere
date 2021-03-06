/** Handles user entity
 * @module users_manager
 * @requires express
 * @requires database_api
 */
const express = require('express');
const database = require('../../database_api');
const router = express.Router();

/**
 * GET: User details
 * Sends user object if user exists
 * Sends null if user does not exist
 * @name /
 * @function
 * @inner
 * @param {string} req - Request
 * @param {string} res - Response
 */
router.get('/', async (req, res) => {
  const user_fav = database.connectCollection('user');
  console.log('Get user', req.query['id']);
  res.send(await user_fav.findOne({ id: req.query['id'] }));
});

/**
 * POST: Create new user entity
 * User entity: id, name, array of favorite carparks, array of search history results
 * @name /
 * @function
 * @inner
 * @param {string} req - Request
 * @param {string} res - Response
 */
router.post('/', async (req, res) => {
  const user_fav = database.connectCollection('user');
  console.log(req.body.id, req.body.name);
  await user_fav.insertOne({
    id: req.body.id,
    name: req.body.name,
    favorites: [],
    searchHistory: [],
  });
  res.status(201).send(); // to show successful
});

/**
 * POST: Update user entity
 * Update favorites, search history, or user name
 * @name /update
 * @function
 * @inner
 * @param {string} req - Request
 * @param {string} res - Response
 */
router.post('/update', async (req, res) => {
  const user_fav = database.connectCollection('user');
  switch (req.body.field) {
    case 'favorites':
      await user_fav.updateOne({ id: req.body.id }, { $set: { favorites: req.body.content } });
      break;
    case 'searchHistory':
      await user_fav.updateOne({ id: req.body.id }, { $set: { searchHistory: req.body.content } });
      break;
    case 'name':
      break;
    default:
      console.log('invalid field');
  }
  res.status(201).send(); // to show successful
});

module.exports = router;
