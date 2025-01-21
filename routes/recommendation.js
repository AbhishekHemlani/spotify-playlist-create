const express = require('express');
const pool = require('../config/db');
const { filterSongs, rankRecommendations, createSpotifyPlaylist } = require('../utils/recommendationUtils');
const { getRecentTracks, getTopArtists, getSpotifyAccessToken, getUserId  } = require('../utils/spotifyUtils');
const router = express.Router();

// Fetch distinct genres
router.get('/genres', async (req, res) => {
    try {
        const result = await pool.query('SELECT DISTINCT genre FROM songs');
        const genres = result.rows.map(row => row.genre);
        res.status(200).json({ success: true, genres });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching genres' });
    }
});

// Recommend songs based on user input
router.post('/recommend', async (req, res) => {
    const { mood, genres, numberOfTracks } = req.body;

    try {
        const accessToken = await getSpotifyAccessToken();
        
        // Fetch user's Spotify ID
        const userId = await getUserId(accessToken);
        
        // Fetch recent tracks and favorite artists
        const recentTracks = await getRecentTracks(accessToken);
        const favoriteArtists = await getTopArtists(accessToken);

        // Filter songs from Kaggle dataset
        const kaggleSongs = await filterSongs(mood, genres);

        // Combine and rank recommendations
        const rankedSongs = rankRecommendations(kaggleSongs, recentTracks, { mood, genres });

        // Generate Spotify playlist
        const playlistUrl = await createSpotifyPlaylist(accessToken, userId, rankedSongs.slice(0, numberOfTracks));

        res.status(200).json({ success: true, playlistUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error generating recommendations' });
    }
});


module.exports = router;
