const express = require('express');
const router = express.Router();

const database = require('../../database_api');

// Get user details
router.get('/', async (req, res) => {
  const user_fav = database.connectCollection('user');
  console.log('Get user', req.query['id']);
  res.send(await user_fav.findOne({ id: req.query['id'] }));
  // sends user object if user exists
  // sends null if user does not exist
});

// Create user
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

// Append user favorites to the []
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
