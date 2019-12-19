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