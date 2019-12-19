const axios = require('axios');

const display = (data) => {
    for(let key in data) {
        console.log(`${key}: ${data[key]}`);
    }
}

const search = (title) => {
    if(title.length < 1) {
        title = `Mr. Nobody`;
    }
    let url = `https://www.omdbapi.com/?t=${title}&y=&plot=short&apikey=trilogy`;
    let data = {};
    axios.get(url).then(function(response){

        const searchValues = ['Title', 'Year','Country', 'Language', 'Plot', 'Actors', 'imdbRating',];
        for(let i = 0; i < searchValues.length; i++) {
            let key = searchValues[i];
            data[key] = response.data[key];
        }

        //Rotten Romatoes Rating:
        for(let i = 0; i < response.data.Ratings.length; i++) {
            // console.log(response.data.Ratings[i]);
            let currentRating = response.data.Ratings[i];
            for(let key in currentRating) {
                // console.log(`${key} - ${currentRating[key]}`);
                if(currentRating[key] === 'Rotten Tomatoes') {
                    let selectedRating = currentRating;
                    for(let key in selectedRating) {
                        if(key === 'Value') {
                            // console.log(selectedRating[key]); //91%
                            data['Rotten Tomatoes Rating'] = currentRating[key];
                        }
                    }
                }
            }
        }
        display(data);
    });
}

module.exports.search = search;