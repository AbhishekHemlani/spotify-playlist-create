const axios = require('axios');
require('dotenv').config();

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

/**
 * Get Spotify Access Token using Client Credentials Flow
 */
async function getSpotifyAccessToken() {
    try {
        const authString = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            'grant_type=client_credentials',
            {
                headers: {
                    Authorization: `Basic ${authString}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching Spotify access token:', error.response?.data || error.message);
        throw new Error('Failed to fetch Spotify access token');
    }
}

/**
 * Get Recently Played Tracks for the Logged-In User
 */
async function getRecentTracks(accessToken) {
    try {
        const response = await axios.get('https://api.spotify.com/v1/me/player/recently-played', {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { limit: 50 },
        });
        return response.data.items.map(item => item.track);
    } catch (error) {
        console.error('Error fetching recent tracks:', error.response?.data || error.message);
        throw new Error('Failed to fetch recent tracks');
    }
}

/**
 * Get the User's Top Artists
 */
async function getTopArtists(accessToken) {
    try {
        const response = await axios.get('https://api.spotify.com/v1/me/top/artists', {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { limit: 10 },
        });
        return response.data.items.map(artist => artist.id);
    } catch (error) {
        console.error('Error fetching top artists:', error.response?.data || error.message);
        throw new Error('Failed to fetch top artists');
    }
}

/**
 * Get the User's Spotify ID
 */
async function getUserId(accessToken) {
    try {
        const response = await axios.get('https://api.spotify.com/v1/me', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        return response.data.id; // Spotify User ID
    } catch (error) {
        console.error('Error fetching Spotify user ID:', error.response?.data || error.message);
        throw new Error('Failed to fetch Spotify user ID');
    }
}

module.exports = { getSpotifyAccessToken, getRecentTracks, getTopArtists, getUserId };
