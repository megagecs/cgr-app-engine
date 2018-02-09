'use strict';

// Load libs.
let express  = require('express');
let path = require('path');

let router   = express.Router();
const Datastore = require('@google-cloud/datastore'); // Imports the Google Cloud client lib

// Your Google Cloud Platform project ID
const projectId   = 'bot-tramarsa';
//const keyFilename = 'bot-tramarsa-edd2eae61e25.json';

const datastore = new Datastore(
    { 
        "projectId": projectId
    }
);

/* const datastore = new Datastore(
    {"projectId": projectId,
     "keyFilename" : keyFilename}
); */

// URI: '/monitoreo/registrar'
router.post('/registrar', (req, res, next) => {
    
    console.log('metodo POST /registrar');

    // key 'undefined' (autogen)
    const pKey = datastore.key('Auditoria');

    // Prepares the new entity
    //          fechaHora: fechaStrToDate(req.body.fechaHora),
    //          fechaStrToDate(req.body.fecDocumento)
    // fechaStrToDate(req.body.fecRegistro),
    const auditoria = {
        key: pKey,
        excludeFromIndexes: [
            'trama'
        ],
        data:
        {
            id:             req.body.id,
            subCliente:     req.body.subCliente,
            tipDocumento:   req.body.tipDocumento,
            nomDocumento:   req.body.nomDocumento,
            estDocumento:   req.body.estDocumento,
            fecDocumento:   fechaStrToDate(req.body.fecDocumento),
            fecRegistro:    fechaStrToDate(req.body.fecRegistro),
            trama:          req.body.trama,
            canal:          req.body.canal,
            sociedad:       req.body.sociedad,
            negocio:        req.body.negocio,
            cliente:        req.body.cliente,
            proyecto:       req.body.proyecto,
            esquema:        req.body.esquema,
            aplicacion:     req.body.aplicacion,
            flujo:          req.body.flujo,
            secuencia:      req.body.secuencia,
            evento:         req.body.evento,
            docRelacionado: req.body.docRelacionado,
            estado:         req.body.estado,
            descError:      req.body.descError
        }
    };

    datastore
        .save(auditoria)
        .then(() => {
            // resp OK
            return res.status(200).jsonp({
                "monitoreo":
                {
                    "codigo" : 0,
                    "descripcion" : "ejecucion exitosa"
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

}); // END POST

// URI: '/monitoreo/listar'
router.post('/listar', (req, res, next) => {

    console.log('metodo POST /listar');

    const query = datastore.createQuery('Auditoria'); 
        //datastore
            //.createQuery('Auditoria')
            //.select(['id','fecRegistro','fecDocumento','canal']);

    // Read params
    let pSociedad = req.body.sociedad;
    let pNegocio  = req.body.negocio;
    let pCliente  = req.body.cliente;
    let pSubCli   = req.body.subCliente;
    let pProyecto = req.body.proyecto;
    let pTipoDoc  = req.body.tipDocumento;
    let pEstDoc   = req.body.estDocumento;
    let pNomDoc   = req.body.nomDocumento;
    let pEsquema  = req.body.esquema;
    let pApp      = req.body.aplicacion;
    let pFlujo    = req.body.flujo;
    let pFecMin   = req.body.fecMin;
    let pFecMax   = req.body.fecMax;
    let pTipFiltro = req.body.tipFiltro;

    console.log('tipFiltro:' + pTipFiltro);

    // selección de datos
    if (+pTipFiltro === 0) {//se envian todos los parametros de filtro / resultado
        query.select(['id','fecRegistro','fecDocumento','canal']);
    } else if (+pTipFiltro === 1 ) { //NO se envia ningún parametro filtro / resultado
        query.select(['id', 'subCliente', 'tipDocumento', 'nomDocumento', 'estDocumento', 'fecRegistro','fecDocumento','canal']);
    } else {
        return res.status(200).jsonp({
            "monitoreo":
            {
                "codigo" : 1,
                "descripcion" : "error en la ejecucion",
                "errorMessage" : "especificar el tipoFiltro correcto"
            }
        });
    }

    console.log('filtros aplicados:');

    if (pSociedad != null && pSociedad != "")
    {
        console.log('1.sociedad');
        query.filter('sociedad', '=', pSociedad);
    }

    if (pNegocio != null && pNegocio != "")
    {
        console.log('2.negocio');
        query.filter('negocio', '=', pNegocio)
    }

    if (pCliente != null && pCliente != "")
    {
        console.log('3.cliente');
        query.filter('cliente', '=', pCliente);
    }

    if (pSubCli != null && pSubCli != "")
    {
        console.log('4.subCliente');
        query.filter('subCliente', '=', pSubCli)
    }

    if (pProyecto != null && pProyecto != "")
    {
        console.log('5.proyecto');
        query.filter('proyecto', '=', pProyecto)
    }

    if (pTipoDoc != null && pTipoDoc != "")
    {
        console.log('6.tipoDocumento');
        query.filter('tipDocumento', '=', pTipoDoc)
    }

    if (pEstDoc != null && pEstDoc != "")
    {
        console.log('7.estDocumento');
        query.filter('estDocumento', '=', pEstDoc)
    }

    if (pNomDoc != null && pNomDoc != "")
    {
        console.log('8.nomDoc');
        query.filter('nomDocumento', '=', pNomDoc)
    }

    if (pEsquema != null && pEsquema != "")
    {
        console.log('9.esquema');
        query.filter('esquema', '=', pEsquema)
    }

    if (pApp != null && pApp != "")
    {
        console.log('10.aplicacion');
        query.filter('aplicacion', '=', pApp)
    }

    if (pFlujo != null && pFlujo != "")
    {
        console.log('11.flujo');
        query.filter('flujo', '=', pFlujo)
    }

    if ( (pFecMin != null && pFecMin != "")  &&  (pFecMax != null && pFecMax != "") )
    {
        console.log('12.fecha');
        query
        .filter('fecRegistro',  '>=', fechaStrToDate(pFecMin))
        .filter('fecRegistro',  '<=', fechaStrToDate(pFecMax));
    }

    query.filter('secuencia', "=", '001');
    query.order('fecRegistro', {descending: true});
    
    console.log('---FIN filtros aplicados');

    // exec query
    datastore
    .runQuery(query)
    .then(results => {

        let arrRegs = results[0];
        let key = '';

        arrRegs.forEach((reg) => {
            key = reg[datastore.KEY];
            reg.key = key.id;
            reg.fecRegistro = new Date(reg.fecRegistro);
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
}); // END /listar

// URI: '/monitoreo/listar/:id'
router.get('/listar/:id', (req, res, next) => {
    
    let pId = req.params.id;    
    const query =
        datastore
            .createQuery('Auditoria')
            .select(['secuencia','evento','docRelacionado','estado','descError','fecRegistro','fecDocumento','flujo'])
            .filter('id', '=', pId)
            .order('fecRegistro', {descending: true});

    // exec query
    datastore
    .runQuery(query)
    .then(results => {

        let arrRegs = results[0];
        let key = '';

        arrRegs.forEach((reg) => {
            key = reg[datastore.KEY];
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
}); // END GET

// URI: '/monitoreo/listar/:key'
router.get('/listarByKey/:key', (req, res, next) => {
    
    console.log('metodo /listar/:key');
    
    let key = req.params.key;
    
    console.log('key:' + key);
    
    const query  = datastore.createQuery('Auditoria');
    const keyVal = datastore.key(['Auditoria', datastore.int(key)]);
    query.filter('__key__', keyVal );

    // exec query
    datastore
    .runQuery(query)
    .then(results => {
        // resp OK
        console.log(results);
        return res.status(200).jsonp({
            "monitoreo":
            {
                "codigo" : 0,
                "descripcion" : "ejecucion exitosa",
                "data" : results[0][0].trama
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
}); // END GET


module.exports = router;

// fecStr --> AAAA-MM-DDTHH:mm:ss
function fechaStrToDate(fecStr)
{
    let ret;
    if (fecStr === 'now')
    {
        ret = new Date();
    }
    else
    {
        let anio = parseInt(fecStr.substring(0,4));
        let mes  = parseInt(fecStr.substring(5,7)) - 1;
        let dia  = parseInt(fecStr.substring(8,10));
        let hor = parseInt(fecStr.substring(11,13));
        let min  = parseInt(fecStr.substring(14,16));
        let sec  = parseInt(fecStr.substring(17));
        ret = new Date(anio,mes,dia,hor,min,sec);
    }

    return ret;
}

// fecStr --> AAAA-MM-DDTHH:mm:ss
function fechaStrToDatastore(fecStr)
{
    let ret = fecStr + '.000Z';
    return ret;
}
