require("dotenv").config();
const https = require('https');
const moment = require('moment');
const inquirer = require('inquirer');
const spotify = require('./spotify');
const movie = require('./movie');
const doWhatItSays = require('./doWhatItSays');
const log = require('./log');

const bandsSearch = (artist) => {
    if(artist.length > 0) {
        const searchArtist = artist;
        const url = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    
        https.get(url, (res) => {
            
            let data = '';
    
            res.on('data', (d) => {
                data += d.toString();
            });
    
            res.on('end', () => {
                // Need name of Venue, Venue Location, Date of Event in MM/DD/YYYY
                jsonData = JSON.parse(data);
                if(jsonData.length < 1) {
                    console.log(`No information found for ${searchArtist}`);
                } else {
                    const venue = jsonData[0].venue.name;
                    const location = `${jsonData[0].venue.city}, ${jsonData[0].venue.region}, ${jsonData[0].venue.country}`;
                    let date = moment(jsonData[0].datetime);
                    date = date.format('MM/DD/YYYY');   
                    const bandsData = `Name of Venue: ${venue}\nLocation: ${location}\nData: ${date}`;
                    console.log(bandsData);
                }
            });
        });
    } else {
        console.log('No artist/band information entered to search.');
    }
}

const newSearch = (miliSeconds) => {
    setTimeout(promptAction, miliSeconds);
}

const methodSwitcher  = (action, searchTerm) => {
    switch(action) {
        case 'concert-this':
            bandsSearch(searchTerm);
            break;
        case 'spotify-this-song':
            spotify.search(searchTerm);
            break;
        case 'movie-this':
            movie.search(searchTerm);
            break;
        case 'do-what-it-says':
            doWhatItSays.search('./random.txt', doWhatItSaysFunction); 
            break;
        default:
            break;
    }
}

const doWhatItSaysFunction = (input) => {
    const action = input[0];
    let searchArray = input.slice(1, input.length);
    let searchTerm = searchArray.toString();
    searchTerm = searchTerm.replace(/,/g, ' ');
    log.writeLog(action, searchTerm);
    methodSwitcher(action, searchTerm);
}

const promptAction = () => {
    console.log('\n---------------------- NEW SEARCH ------------------------')
    inquirer.prompt([
        {
            type: 'list',
            message:'what do you want to do?',
            name: 'action',
            choices: ['movie-this', 'concert-this', 'spotify-this-song', 'do-what-it-says']
        }
    ]).then(answer => {
        promptSearch(answer.action);
    })
}

const promptSearch = (action) => {
    if(action === 'do-what-it-says') {
        doWhatItSays.search('./random.txt', doWhatItSaysFunction); 
        newSearch(5000);
    } else {
        inquirer.prompt(
            {
                type: 'string',
                name: 'searchTerm',
                message:  'what do you want to search?'
            }
        ).then(answer => {
            methodSwitcher(action, answer.searchTerm);
            log.writeLog(action, answer.searchTerm);
            newSearch(3000);
        })
    }
}

promptAction();