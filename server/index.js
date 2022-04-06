/** Backend server entry point.
 * @module app
 * @requires express
 * @requires bodyParser
 * @requires cors
 * @requires database
 * @requires carpark_manager
 * @requires search_manager
 * @requires users_manager
 */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const database = require('./database_api');

const app = express();

/** Middleware. */
app.use(bodyParser.json());
app.use(cors());

/**
 * Initialise singleton database instance.
 */
database.connectDB();

const carparks = require('./routes/api/carpark_manager');
const search = require('./routes/api/search_manager');
const users = require('./routes/api/users_manager');

const { sendFile } = require('express/lib/response');

app.use('/api/carpark_manager', carparks);
app.use('/api/search_manager', search);
app.use('/api/users_manager', users);

/**
 * Handle Production.
 */
if (process.env.NODE_ENV === 'production') {
  /**
   * Static folder.
   */
  app.use(express.static(__dirname + '/public/'));

  /**
   * Handle SPA.
   */
  app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
}

// const { port } = require('../config');
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
