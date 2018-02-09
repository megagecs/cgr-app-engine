//exponer api para registro de JSONs desde archivo

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