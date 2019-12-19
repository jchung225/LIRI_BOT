const fs = require('fs');

const writeLog = (action, searchTerm) => {
    let logText = action;
    logText += `, "${searchTerm}"\n`;
    fs.appendFile('log.txt', logText, (err) => {
        if(err) { 
            console.log('err');
        }
    });
}

module.exports.writeLog = writeLog;