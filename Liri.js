//linking to dot.env
const env = require('dotenv').config();

//linking to keys.js
const keys = require('./keys');

//bandsintown 
const Bandsintown = require('Bandsintown');
const bands = keys.bandsintown

//Spotify
const Spotify = require ('node-spotify-api');
const spotify = new Spotify(keys.spotify);

//require the .txt file to write to
const fs = require('fs');

//require the axios npm package
const axios = require('axios')

//require the omdb npm package
const Omdb = require('omdb');
let userCommand = process.argv[2];

//storing everything after userCommand as the user input/entry
let userEntry = process.argv.slice(3).join(' ')

let moment = require("moment");

const mySpotify = function() {
    // console.log(songName);
    
    spotify.search({ 
        type: 'track', 
        query: userEntry }, 
        function(err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        } 
        var trackInfo = data.tracks.items
        if (trackInfo.length > 0) {
            //Loop through all the track information array
            for (var i = 0; i < trackInfo.length; i++) {
                //Store album object as var
                let albumObject = trackInfo[i].album;
                let preview = trackInfo[i].preview_url
                //Artist name from spotify api based off search
                let artist = albumObject.artists
                let albumName = albumObject.name;
                //Loop through all of the artist array
                for (var j = 0; j < artist.length; j++) {
                    
                    //logging data to console
                    console.log('\nArtist: ' + artist[j].name)
                    console.log('Song Name: ' + userEntry.toUpperCase())
                    console.log('Preview of Song: ' + preview)
                    console.log('Album Name: ' + albumName);
                    console.log('----------------\n')
    
                }
            }
        } else {
            //if the user entry isn't a valid song
            console.log('Sorry, no information found for "' + userEntry + '" song');
        }
    });
}
const myBandsintown = function(response) {
    //env app key from .env
    let appKey = 'codingbootcamp'
    //formatting the user response and accounting for special char
    response = response.replace(/\s/g, '%20');
    response = response.replace(/\//g, '%252F');
    response = response.replace(/\?/g, '%253F');
    response = response.replace(/\*/g, '%252A');
    // response = queryParam.replace(/\"/g, "%27C"); 
    let url = 'https://rest.bandsintown.com/artists/' + userEntry + '/events?app_id=' + appKey;
    axios.get(url)
        .then(
        function(response) {
            //loop through each concert returned for an artist
            if (response.data.length > 0) {
                for (let i = 0; i < response.data.length; i++) {
                    //store response into a variable
                    let jsonData = response.data[i];

                    // translate each data variable into an array
                    let concertData = [
                        'Artist: ' + userEntry.toUpperCase(),
                        'Concert Date: ' + moment(jsonData.datetime).format('L'),
                        'Concert Time: ' + moment(jsonData.datetime).format('hh:mm A'),
                        'Venue Name: ' + jsonData.venue.name,
                        'City: ' + jsonData.venue.city
                    ].join('\n');
                    
                    // log data values to console
                    console.log('\n---------');
                    console.log(concertData);
                    console.log('\n---------');
                    
                    // log data to txt file
                    fs.appendFile("log.txt", concertData, function(err) {
                        if (err) throw err;
                    })
                }
        } else {
            //if the user entry isn't a valid song
            console.log('Sorry, no information found for "' + userEntry + '" song');
            
        }

        }
    )
}
const myOmdb = function(response) {
    let url = 'http://www.omdbapi.com/?t=' + userEntry + '&y=&plot=full&tomatoes=true&apikey=' + keys.omdb.id;
    //formatting the user response and accounting for special char
    response = response.replace(/\s/g, "%20");
    response = response.replace(/\//g, "%252F");
    response = response.replace(/\?/g, "%253F");
    response = response.replace(/\*/g, "%252A");

    axios.get(url)
    .then(function(response){
        //if results found for query
        if (response.data.length != 0) {
            
            let jsonData = response.data;
            

            
            // translate each data variable into an array
            let movieData = [
                'Movie Title: ' + jsonData.Title,
                'Movie Release Year: ' + jsonData.Year,
                'IMDB Rating: ' + jsonData.Ratings[0].Value,
                'Rotten Tomatoes Rating: ' + jsonData.Ratings[1].Value,
                'Production Country: ' + jsonData.Country,
                'Movie Language: ' + jsonData.Language,
                'Plot: ' + jsonData.Plot,
                'Main Actors: ' + jsonData.Actors,
            ].join('\n\n')
            
            // log data values to console
            console.log('\n---------');
            console.log(movieData);
            console.log('\n---------');
                    

            fs.appendFile('log.txt', movieData, function(err) {
                if (err) throw err;
            })
    } else {
        //if the user entry isn't a valid movie
        console.log('Sorry, no information found for "' + userEntry + '" movie');
        
    }
    })
    .catch(error => {
        console.log("You got an Error, brudduh.")
    });
}
let doIt = function(userCommand) {
    fs.readFile('random.txt', 'utf8', function (err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        } 
        //splitting each string in the txt file by the comma
        data = data.split(',');
        let userCommand = '';

        //determining how to parse the data if there is more than one item
        if (data.length === 2) { 
            userCommand = data[0];
            userEntry = data[1];
        } else {
            //using the data in the txt sheet as the command if only one value
            userCommand = data[0];
        }
        if (userCommand === 'spotify-this-song') {
            mySpotify();   
        } else {
            //if the user entry isn't a valid command
            console.log('I Don\'t Know That Command...');
        }

    });

}

function mySwitch(userCommand) {
    switch (userCommand) {
        case "concert-this":
            myBandsintown(userCommand);
        break;
    
        case "spotify-this-song":
            mySpotify(userCommand);
        break;
    
        case "movie-this":
            myOmdb(userCommand);
        break;
    
        case "do-what-it-says":
            doIt();
        break;

        default: 
            return console.log('\nI don\'t know "' + userCommand + '" as a command.\n');
        
    };
}
mySwitch(userCommand);