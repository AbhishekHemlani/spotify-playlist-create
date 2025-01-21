const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const recommendationRoutes = require('./routes/recommendation');
const { getSpotifyAccessToken } = require('./utils/spotifyUtils'); // Import the Spotify utility

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Spotify access token route
app.get('/api/spotify/access-token', async (req, res) => {
    try {
        const accessToken = await getSpotifyAccessToken();
        res.status(200).json({ accessToken });
    } catch (error) {
        console.error('Error fetching Spotify access token:', error);
        res.status(500).json({ success: false, message: 'Error fetching Spotify access token' });
    }
});

// Recommendation routes
app.use('/api/recommendations', recommendationRoutes);

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
