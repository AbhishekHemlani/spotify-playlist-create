require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const spotifyRoutes = require('./routes/spotify');
const recommendationRoutes = require('./routes/recommendation');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use('/api/spotify', spotifyRoutes);
app.use('/api/recommendations', recommendationRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});