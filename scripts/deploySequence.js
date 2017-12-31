/**
 * This script is used after ng build step
 */
var fs = require('fs');

fs.createReadStream(__dirname + '/../dist/browser/index.html').pipe(
    fs.createWriteStream(__dirname + '/../functions/dist/index.html')
);