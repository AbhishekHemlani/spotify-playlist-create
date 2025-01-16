const express = require('express');
const { getSpotifyAccessToken } = require('../utils/spotifyUtils');
const router = express.Router();

router.get('/access-token', async (req, res) => {
    try {
        const token = await getSpotifyAccessToken();
        res.json({ accessToken: token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get Spotify access token' });
    }
});

module.exports = router;
