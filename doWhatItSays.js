const fs = require('fs');

const removeSpecialChars = (string) => {
    string = string.replace(/"/g, '');
    return string;
}

const search = (file, callback) => {
    fs.readFile(file, 'utf8', (err, data) => {
        if(err){
            console.err(err);
        } else {
            data = removeSpecialChars(data);
            let commandValuePair = data.split(',');
            let command = commandValuePair[0];
            let value = commandValuePair[1];
            let searchArray = value.split(' ');
            let input = [];
            input.push(command);
            for(let i = 0; i < searchArray.length; i++) {
                if(searchArray[i].length > 0) {
                    input.push(searchArray[i]);
                }
            }
            callback(input);
        }
    });
}   

module.exports.search = search;