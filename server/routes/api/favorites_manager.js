const express = require('express');
const router = express.Router();

const database = require('../../database_api');

// Get all users
router.get('/', async (req, res) => {
  const user_fav = database.connectCollection('user');
  console.log('Get all users');
  res.send(await user_fav.find({}).sort({ createdAt: 1 }).toArray());
});

// Update User's search history
async function updateUserFavorites(search) {
  const user_fav = database.connectCollection('user');
  await user_fav.insertOne({
    text: search,
    createdAt: new Date(),
  });
}

module.exports = router;
