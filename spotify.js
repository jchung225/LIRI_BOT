require("dotenv").config();
const keys = require('./keys');
// const axios = require('axios');
const Spotify = require('node-spotify-api');

const spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
})

const replaceKey = (key) => {
    switch(key){
        case 'songName':
            return 'Song Name';
        case 'artist':
            return 'Artist';
        case 'album':
            return 'Album';
        case 'previewUrl':
            return 'Preview URL';
    }
}

const save = (data, array, index) => {       
    let result = {
        songName: data.tracks.items[index].name,
        artist: data.tracks.items[index].artists[0].name,
        album: data.tracks.items[index].album.name,
        previewUrl: data.tracks.items[index].preview_url 
    }
    array.push(result);       
}

const display = (array) =>{
    console.log(`Displaying the top ${array.length} results:`)
    for(let i = 0; i < array.length; i++) {
        console.log(`\n#${i+1}`);
        for(let key in array[i]) {
            if(array[i][key] === null) {
                console.log(`${replaceKey(key)}: Not available.`);
            } else {
                console.log(`${replaceKey(key)}: ${array[i][key]}`);
            }
        }
    }
}

const search = (songName) => {
    let spotifyResults = [];

    if(songName.length < 1) {
        songName = `The Sign`;
        spotify.search({type: 'track', query: songName}, (err, data) => {
            if(err) {
                return console.log(`Error: ${err}`);
            }
            for(let i = 0; i < data.tracks.items.length; i++) {
                if(data.tracks.items[i].artists[0].name === 'Ace of Base'){
                    // console.log(data.tracks.items[i].artists[0].name);
                    // console.log(data.tracks.items[i]);
                    save(data, spotifyResults, i);
                }
            }
            display(spotifyResults);
        });
    } else {
        spotify.search({type: 'track', query: songName}, (err, data) => {
            if(err) {
                return console.log(`Error: ${err}`);
            }
    
            for(let i = 0; i < 3; i++) {
                save(data, spotifyResults, i);      
            }

            display(spotifyResults);
        });
    }
}

module.exports.search = search;