require('dotenv').config(); 
const { Pool } = require('pg');  //create db connection to pool of Postgresql dbs
const express = require('express'); //import express module
const bodyParser = require('body-parser'); //middleware, which is used to parse incoming requests and make it accessible
const axios = require('axios'); //be able to make http request to external apis like the spotify api 
const { spawn } = require('child_process'); //cretae a command for running new processes like shell commands or scripts, like the python ml script 
 
const app = express(); //create an express app 
const port = 3000; //port number which server will listen 

const pool = new Pool({
   user: process.env.DB_USER,
   host: process.env.DB_HOST, 
   database: process.env.DB_NAME, 
   password: process.env.DB_PASSWORD, 
   port: process.env.DB_PORT, 
   ssl: {
    rejectUnauthorized: false
   }
})

app.use(bodyParser.json())

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

async function getSpotifyAccessToken(){
    const response = await axios.post()


}
