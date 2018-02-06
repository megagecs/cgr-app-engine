$(document).ready(function() {

    $('#example').DataTable( {
        columns: [
            {data:'msgId'},
            {data:'sociedad'},
            {data:'flujo'},
            {data:'secuencia'},
            {data:'codigoApp'},
            {data:'evento'},
            {data:'tipo'},
            {data:'fechaHora'},
            {data:'key',  "render": function (key, type, row) {
                return '<a href="#" onclick="verData(' + key +');">Ver Data</a>';}
            }
        ],
        paging:   true,
        ordering: true,
        info:     true,
        searching: false
    });
});

$("#btnBuscar").click(function () 
{
    console.log('readData');
    var dataIn = readData();
    console.log('getData');
    var dataRes = getData(dataIn);
    console.log('setData');
    setData(dataRes);
    console.log('fin');
});
    

function readData()
{
  let vMsgId    = $('#txtMsgId').val();
  let vFecMin   = $('#txtFechaIni').val();
  let vFecMax   = $('#txtFechaFin').val();
  let vCodApp   = $('#txtCodApp').val();
  let dataIn;

  if ( (vFecMin == "") || (vFecMax == "") )
  {
    alert('completar campos fecha');
    return; 
  }
  else
  {
    dataIn =
    {
        msgId : vMsgId,
        codApp: vCodApp,
        fecMin: vFecMin,
        fecMax: vFecMax
    }  
  }

  console.log('lectura de params:');
  console.log('msgId: [' + vMsgId + ']');
  console.log('fecMin: [' + vFecMin + ']');
  console.log('fecMax: [' + vFecMax + ']');
  console.log('codApp: [' + vCodApp + ']');

  console.log('JSON request:');
  console.log(JSON.stringify(dataIn));

  clean(dataIn);
  console.log('JSON request (clean):');
  console.log(JSON.stringify(dataIn));

  return dataIn;
}

function getData(dataIn)
{
  var arrData = [];
  var i = 0;

   // Call API LOCAL
  $.ajax({
    type: "POST",
    url: "/api/buscar",
    data: dataIn,
    async: false,
    success: function (data) {
      console.log('total_regs (return): ' + data.body.monitoreo.total_regs);
      $.each(data.body.monitoreo.regs, function(i, item) {
        arrData.push(item);
      });
    },
    error: function (jqXHR, textStatus, err) {
      console.log('error: ' + JSON.stringify(jqXHR));
    },
  });
  console.log('arrData (length):' + arrData.length);
  console.log('index   (i):' + i);
  return arrData;
}

function setData(jsonData)
{
    var datatable = $('#example').DataTable();
    datatable
        .clear()
        .rows.add(jsonData)
        .draw();
}

function clean(obj) {
    for (var propName in obj) { 
      if (obj[propName] === null || obj[propName] === undefined || obj[propName] == '') {
        delete obj[propName];
      }
    }
  }

function verData(key)
{
    //alert(key);

    var modal = document.getElementById('myModal');
    modal.style.display = "block";

    var span = document.getElementsByClassName("close")[0];
  
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