const express = require('express');
const router = express.Router();
const request = require('request');
const fs  = require('fs');

router.post('/api/buscar', function (req, res) {
    console.log('entro api FE local - buscar:' + new Date().toISOString());
    var options = {
        json: req.body,
        url:'http://localhost:8080/monitoreo/listar',
        method:'POST'
      };

    request(options, function (error, response, body) {
        return res.status(200).jsonp(
            {body}
        );
    });
});

router.post('/api/buscarxkey', function (req, res) {
    console.log('entro api02 FE local - buscarxkey:' + new Date().toISOString());
    var options = {
        url:'http://localhost:8080/monitoreo/listarByKey/' + req.body.key,
        method:'GET'
      };

    request(options, function (error, response, body) {
        return res.status(200).jsonp(
            {body}
        );
    });
});

router.post('/api/buscarxid', function (req, res) {
    console.log('entro api02 FE local - buscarxid:' + new Date().toISOString());
    var options = {
        url:'http://localhost:8080/monitoreo/listar/' + req.body.id,
        method:'GET'
      };

    request(options, function (error, response, body) {
        return res.status(200).jsonp(
            {body}
        );
    });
});

router.post('/api/registrarxfile', function (req, res) {
    console.log('entro api02 FE local - registrarxfile:' + new Date().toISOString());
    let jsonFile = JSON.parse(fs.readFileSync('data_prueba.json', 'utf8'));
    let numInsertados = 0;

    jsonFile.forEach(function(item) {

        let options = {
            url:'http://localhost:8080/monitoreo/registrar/',
            method:'POST',
            json:item
          };

        request(options, function (error, response, body) {
            if (body.monitoreo.codigo === 0)
            {
                console.log('entro if');
                numInsertados++;
                console.log('numInsetados:'+numInsertados);
            }
            console.log('fin req');
        });
        console.log('numInsetados2:'+numInsertados);
    });

    console.log('fin');
    console.log(numInsertados);

    return res.status(200).jsonp(
        {
            "totalObjs":jsonFile.length
        }
    );

});

module.exports = router;