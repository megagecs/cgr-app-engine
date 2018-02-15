const express = require('express');
const router = express.Router();
const request = require('request');
const apiServer = 'http://localhost:8081/monitoreo';

router.post('/api/buscar', function (req, res) {
    console.log('entro api FE local - buscar:' + new Date().toISOString());
    var options = {
        json: req.body,
        url:`${apiServer}/listar`,
        //url:'http://localhost:8081/monitoreo/listar',
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
        url: `${apiServer}/listarByKey/${req.body.key}`,
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
        url: `${apiServer}/listar/${req.body.id}`,
        method:'GET'
      };

    request(options, function (error, response, body) {
        return res.status(200).jsonp(
            {body}
        );
    });
});

module.exports = router;