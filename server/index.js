const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const database = require('./database_api');

const app = express();

const https = require('https');
const fs = require('fs');

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Initialise MongoDB singleton connection
database.connectDB();

// routes
const carparks = require('./routes/api/carpark_manager');
const search = require('./routes/api/search_manager');
const users = require('./routes/api/users_manager');

const { sendFile } = require('express/lib/response');

app.use('/api/carpark_manager', carparks);
app.use('/api/search_manager', search);
app.use('/api/users_manager', users);

// Handle production
if (process.env.NODE_ENV === 'production') {
  // Static folder
  app.use(express.static(__dirname + '/public'));

  // Handle SPA
  app.get(/.*/, (req, res) => sendFile(__dirname + '/public/index.html'));
}

const port = process.env.PORT || 5000;

// app.listen(port, () => console.log(`Server started on port ${port}`));

https
  .createServer(
    {
      key: fs.readFileSync('./server.key'),
      cert: fs.readFileSync('./server.cert'),
    },
    app
  )
  .listen(port, () => console.log('HTTPS Server started on port ${port}'));
