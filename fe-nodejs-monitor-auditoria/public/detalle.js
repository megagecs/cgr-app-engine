$(document).ready(function(){
    let pId = getUrlParameter('id');
    let pNomDoc = getUrlParameter('nomDoc');
    let pTipDoc = getUrlParameter('tipDoc');
    console.log('URLs params:');
    console.log(pId);
    console.log(pNomDoc);
    console.log(pTipDoc);
    $('#id').text(pId);
    $('#nomDoc').text(pNomDoc);
    $('#tipDoc').text(pTipDoc);


    $('#tablaDetalle').DataTable( {
        columns: [
          {data:'secuencia'},
          {data:'evento'},
          {data:'docRelacionado'},
          {data:'key',  "render": function (key, type, row) {
            return '<a href="#" onclick="verData(' + key +');">Data</a>';}
          },
          {data:'estado'},
          {data:'descError'},
          {data:'fecRegistro'},
          {data:'fecDocumento'},
          {data:'flujo'}
        ],
          paging:   true,
          ordering: true,
          info:     true,
          searching: false
      });

    let jsonData = getData(pId);
    setData(jsonData);

});

function getUrlParameter(sParam) {
    let sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
}

function getData(id)
{
    let arrData = [];
  
     // Call API LOCAL
    $.ajax({
      type: "POST",
      url: "/api/buscarxid",
      data: {'id':id},
      async: false,
      success: function (data) {
        console.log(data);
        let parser = JSON.parse(data.body);
        arrData = parser.monitoreo.regs;
      },
      error: function (jqXHR, textStatus, err) {
        console.log('error: ' + JSON.stringify(jqXHR));
      },
    });
    return arrData;
}

function setData(jsonData)
{
    let datatable = $('#tablaDetalle').DataTable();
    datatable
        .clear()
        .rows.add(jsonData)
        .draw();
}

// Mostrar 'data' (modal)
function verData(key)
{

    let modal = document.getElementById('myModal');
    modal.style.display = "block";

    let span = document.getElementsByClassName("close")[0];
  
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Call API LOCAL
    $.ajax({
        type: "POST",
        url: "/api/buscarxkey",
        data: {"key" : parseInt(key)},
        async: false,
        success: function (result) {
            let parser = JSON.parse(result.body);
            $('#pData').text(parser.monitoreo.data);
        },
        error: function (jqXHR, textStatus, err) {
          console.log('error: ' + JSON.stringify(jqXHR));
        },
      });
}