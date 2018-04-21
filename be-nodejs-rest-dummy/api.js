'use strict';

// Load libs.
const express  = require('express');
const router   = express.Router();

// URI: '/api/monitoreo'
router.route('/api/helloworld')

    .post(function (req, res)
    {
        // resp OK
        return res.status(200).jsonp({
            "respuesta":
            {
                "codigo" : 0,
                "descripcion" : "ejecucion exitosa",
                "mensaje" : "hello world"
            }
        });

    }) // END POST function

module.exports = router;