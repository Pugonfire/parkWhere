const express = require('express');
const mongodb = require('mongodb');
const axios = require('axios');

const router = express.Router();

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

// Search for specific carpark
router.post('/search', async (req, res) => {
  //fuzzy search
  const regex = new RegExp(escapeRegex(req.body.ppName), 'gi');
  const carpark_details = await connectDB('carpark_details');
  updateSearchHistory(req.body.ppName);
  res.send(await carpark_details.find({ ppName: regex }).toArray());
});

// GET: User's 10 recent search history
router.get('/ush', async (req, res) => {
  const user_history = await connectDB('user_history');
  res.send(await user_history.find({}).sort({ createdAt: 1 }).toArray());
});

// Update User's search history
async function updateSearchHistory(search) {
  const user_history = await connectDB('user_history');
  await user_history.insertOne({
    text: search,
    createdAt: new Date(),
  });

  console.log("User's history updated");
}

// To connect to MongoDB
async function connectDB(collection) {
  // replace this
  const client = await mongodb.MongoClient.connect(
    'mongodb+srv://max:fizjic-jihwy4-Momqez@cluster0.zpk7p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
    }
  );
  // Database name here
  return client.db('Cluster0').collection(collection);
}

module.exports = router;
