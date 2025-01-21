const pool = require('../config/db');
const { getMoodThresholds } = require('./moodMapping');

async function filterSongs(mood, genres) {
    const thresholds = getMoodThresholds(mood);
    const { valence, energy, bpm, acousticness, instrumentalness, danceability, liveness } = thresholds;

    const query = `
        SELECT *
        FROM songs
        WHERE valence BETWEEN $1 AND $2
          AND energy BETWEEN $3 AND $4
          AND bpm BETWEEN $5 AND $6
          AND acousticness BETWEEN $7 AND $8
          AND instrumentalness BETWEEN $9 AND $10
          AND danceability BETWEEN $11 AND $12
          AND liveness BETWEEN $13 AND $14
          AND genre = ANY($15::text[])
    `;

    const result = await pool.query(query, [
        valence[0], valence[1],
        energy[0], energy[1],
        bpm[0], bpm[1],
        acousticness[0], acousticness[1],
        instrumentalness[0], instrumentalness[1],
        danceability[0], danceability[1],
        liveness[0], liveness[1],
        genres,
    ]);

    return result.rows;
}


function rankRecommendations(kaggleSongs, spotifyTracks, userPreferences) {
    const contentScores = kaggleSongs.map(song => calculateScore(song, userPreferences));
    const spotifyScores = spotifyTracks.map(track => 1.0); // Assign higher weight to Spotify data

    const finalScores = contentScores.map((score, i) => (
        0.3 * score + 0.7 * (spotifyScores[i] || 0)
    ));

    return kaggleSongs
        .map((song, i) => ({ ...song, score: finalScores[i] }))
        .sort((a, b) => b.score - a.score);
}

module.exports = { filterSongs, rankRecommendations };


const axios = require('axios');

async function createSpotifyPlaylist(accessToken, userId, songs) {
    const playlistResponse = await axios.post(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        { name: 'Custom Playlist', public: false },
        { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const trackUris = songs.map(song => song.uri);
    await axios.post(
        `https://api.spotify.com/v1/playlists/${playlistResponse.data.id}/tracks`,
        { uris: trackUris },
        { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    return playlistResponse.data.external_urls.spotify;
}

module.exports = { createSpotifyPlaylist };
