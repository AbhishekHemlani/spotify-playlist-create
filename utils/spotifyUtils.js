const axios = require('axios')
require('dotenv').config

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

async function getSpotifyAccessToken() {
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
}

module.exports = { getSpotifyAccessToken };