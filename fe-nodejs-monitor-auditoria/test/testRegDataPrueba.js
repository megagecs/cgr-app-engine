const request = require('request');
const fs  = require('fs');

let jsonFile = JSON.parse(fs.readFileSync('data_prueba.json', 'utf8'));
let numInsertados = 0;

console.log('inicio');
jsonFile.forEach(function(item) {

    let options = {
        url:'http://localhost:8080/monitoreo/registrar/',
        method:'POST',
        json:item
        };

    request(options, function (error, response, body) {
        if (body.monitoreo.codigo === 0)
        {
            numInsertados++;
        }
        console.log(`numInsertados: ${numInsertados}`);
    });
});

console.log('fin');