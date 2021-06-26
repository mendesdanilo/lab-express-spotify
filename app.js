require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyWebApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
});

//Connect to the API 
spotifyWebApi
  .clientCredentialsGrant()
  .then(data => spotifyWebApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get("/home", (req, res) => {
    res.render("home");
});

//when button pressed then this below
app.get("/artist-search", async (req, res) => {
    let results = await spotifyWebApi.searchArtists(req.query.artist);
    console.log(results.body.artists);
    const artistsFromApi = results.body.artists.items 
    res.render("artist-search-result", {artistsFromApi} )
});

app.get("/albums/:artistId", async (req, res) => {
    let results = await spotifyWebApi.getArtistAlbums(req.params.artistId);
    console.log(results);
    const albums = results.body.items;
    res.render("albums", { albums });
  });
  
  app.get("/tracks/:albumId", async (req, res) => {
    const results = await spotifyWebApi.getAlbumTracks(req.params.albumId);
    const tracks = results.body.items;
    res.render("tracks", { tracks });
  });

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
