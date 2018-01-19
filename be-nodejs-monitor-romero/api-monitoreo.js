'use strict';

// Load libs.
var express  = require('express');
var path = require('path');

var router   = express.Router();
const Datastore = require('@google-cloud/datastore'); // Imports the Google Cloud client lib

// Your Google Cloud Platform project ID
const projectId   = 'datastore-quickstart-191515';
const keyFilename = 'datastore-quickstart-5672f2cde8ca.json';

const datastore = new Datastore({
    projectId: projectId,
    keyFilename: keyFilename
});

// URI: '/api/monitoreo'
router.route('/api/monitoreo')

    .post(function (req, res)
    {
        const query = datastore.createQuery('Auditoria');

        // Read params
        var pMsgId   = req.body.msgId;
        var pCodApp  = req.body.codApp;
        var pFecMin  = req.body.fecMin;
        var pFecMax  = req.body.fecMax;
        
        // Out parm
        var arrRegs = [];

        console.log('msgId:' + pMsgId);
        console.log('codApp:' + pCodApp);        
        console.log('fecMin:' + pFecMin);
        console.log('fecMax:' + pFecMax);
        
        // Build query
        if ( pMsgId != null && pMsgId != "" )
        {
            console.log('--- filtro msgId ---');
            query.filter('msgId', '=', pMsgId);
        }

        if ( pCodApp != null && pCodApp != "" )
        {
            console.log('---filtro codApp---');
            query.filter('codigoApp', '=', pCodApp)
        }

        if ( (pFecMin != null && pFecMin != "")  &&  (pFecMax != null && pFecMax != "") )
        {
            console.log('--- filtro fecha ---');
            query
                .filter('fechaHora', '>=', fechaStrToDate(pFecMin))
                .filter('fechaHora', '<=', fechaStrToDate(pFecMax));
        }
        else
        {
            return res.status(200).jsonp({
                "monitoreo":
                {
                    "codigo" : 1,
                    "descripcion" : "valores incorrectos para campos fecha",
                }
                });
        }

        query.order('fechaHora', {descending: true});

        // exec query
        datastore
            .runQuery(query)
            .then(results => {

                arrRegs = results[0];
                
                arrRegs.forEach((reg) => {
                    const key = reg[datastore.KEY];
                    reg.key = key.id;
                });

                // resp OK
                return res.status(200).jsonp({
                    "monitoreo":
                    {
                        "codigo" : 0,
                        "descripcion" : "ejecucion exitosa",
                        "total_regs" : arrRegs.length,
                        "regs" : arrRegs
                    }
                });

        })
        .catch(err => {
            console.error('ERROR:', err);
            return res.status(200).jsonp({
                "monitoreo":
                {
                    "codigo" : 1,
                    "descripcion" : "error en la ejecucion",
                    "errorMessage" : err.message
                }
                });
        });

    }) // END POST function

    .put(function (req, res)
    {
    
        // The kind for the new entity
        const kind = 'Auditoria';

        // key 'undefined' (autogen)
        const pKey = datastore.key(kind);

        // Prepares the new entity
        const auditoria = {
            key: pKey,
            excludeFromIndexes: [
                'sociedad',
                'flujo',
                'secuencia',
                'evento',
                'tipo',
                'referencia',
                'canal',
                'usr',
                'brokerName',
                'cliente',
                'idTransaccion',
                'procesoOrq',
                'subProcesoOrq',
                'eventoOrq',
                'data'
            ],
            data:
            {
                msgId: req.body.msgId,
                sociedad: req.body.sociedad,
                flujo: req.body.flujo,
                secuencia: req.body.secuencia,
                codigoApp: req.body.codigoApp,
                evento: req.body.evento,
                tipo: req.body.tipo,
                fechaHora: fechaStrToDate(req.body.fechaHora),
                referencia: req.body.referencia,
                canal: req.body.canal,
                usr: req.body.usr,
                brokerName: req.body.brokerName,
                cliente: req.body.cliente,
                idTransaccion: req.body.idTransaccion,
                procesoOrq: req.body.procesoOrq,
                subProcesoOrq: req.body.subProcesoOrq,
                eventoOrq: req.body.eventoOrq,
                data: req.body.data
            }
        };

        // Saves the entity
        datastore
            .save(auditoria)
            .then(() => {
                console.log(`Saved!`);
                // resp OK
                return res.status(200).jsonp({
                    "monitoreo":
                    {
                        "codigo" : 0,
                        "descripcion" : "regisro exitoso"
                    }
                });
            })
            .catch(err => {
                console.error('ERROR:', err);
                return res.status(200).jsonp({
                    "monitoreo":
                    {
                        "codigo" : 1,
                        "descripcion" : "error en la ejecucion",
                        "errorMessage" : err.message
                    }
                });
            });

    }); // END PUT function

// URI: '/api/monitoreo/:key'
router.route('/api/monitoreo/:key')
    .get(function (req, res) {
        
        console.log('metodo GET');
        
        var key = req.params.key;
        
        console.log('key:' + key);
        
        const query  = datastore.createQuery('Auditoria');
        const keyVal = datastore.key(['Auditoria', datastore.int(key)]);
        
        query.filter('__key__', keyVal );

        // exec query
        datastore
        .runQuery(query)
        .then(results => {

            // resp OK
            return res.status(200).jsonp({
                "monitoreo":
                {
                    "codigo" : 0,
                    "descripcion" : "ejecucion exitosa",
                    "data" : results[0][0].data
                }
            });

        })
        .catch(err => {
            console.error('ERROR:', err);
            return res.status(200).jsonp({
                "monitoreo":
                {
                    "codigo" : 1,
                    "descripcion" : "error en la ejecucion",
                    "errorMessage" : err.message
                }
                });
        });
 
    }); // END GET function

module.exports = router;

// fecStr --> AAAA-MM-DDTHH:mm:ss
function fechaStrToDate(fecStr)
{
    let anio = parseInt(fecStr.substring(0,4));
    let mes  = parseInt(fecStr.substring(5,7)) - 1;
    let dia  = parseInt(fecStr.substring(8,10));
    let hora = parseInt(fecStr.substring(11,13));
    let min  = parseInt(fecStr.substring(14,16));
    let sec  = parseInt(fecStr.substring(17));

    return new Date(anio,mes,dia,hora,min,sec);
}