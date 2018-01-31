var express = require('express');
var router = express.Router();
var request = require('request');

router.post('/api/buscar', function (req, res) {
    console.log('entro api FE local:' + new Date().toISOString());
    var options = {
        json: req.body,
        url:'https://refreshing-park-191918.appspot.com/api/monitoreo',
        method:'POST'
      };

    request(options, function (error, response, body) {
        return res.status(200).jsonp(
            {body}
        );
    });
});

router.post('/api/buscarxkey', function (req, res) {
    console.log('entro api02 FE local:' + new Date().toISOString());
    var options = {
        url:'https://refreshing-park-191918.appspot.com/api/monitoreo/' + req.body.key,
        method:'GET'
      };

    request(options, function (error, response, body) {
        return res.status(200).jsonp(
            {body}
        );
    });
});

module.exports = router;