const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

const posts = require('./routes/api/posts');
const ura = require('./routes/api/ura');
const carparks = require('./routes/api/carpark_manager');
const { sendFile } = require('express/lib/response');

app.use('/api/posts', posts);
app.use('/api/ura', ura);
app.use('/api/carpark_manager', carparks);

// Handle production
if (process.env.NODE_ENV === 'production') {
  // Static folder
  app.use(express.static(__dirname + '/public'));

  // Handle SPA
  app.get(/.*/, (req, res) => sendFile(__dirname + '/public/index.html'));
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
