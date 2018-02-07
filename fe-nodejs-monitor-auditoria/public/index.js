$(document).ready(function() {
    
    $('#tablaResult').DataTable( {
      columns: [
        {data:'id',  "render": function (id, type, row) {
          return '<a href="#" onclick="irDetalle(&quot;'+id+'&quot;);">'+id+'</a>';}
        },
        {data: null, render: function (data, type, row ) {
          return $('#selSubcli').find('option:selected').val();}
        },
        {data: null, render: function (data, type, row ) {
          return $('#selTipoDoc').find('option:selected').val();}
        },
        {data: null, render: function (data, type, row ) {
          return $('#txtNomDoc').val();}
        },
        {data: null, render: function (data, type, row ) {
          return $('#selEstDoc').find('option:selected').val();}
        },
        {data:'fecRegistro'},
        {data:'fecDocumento'},
        {data:'key',  "render": function (key, type, row) {
          return '<a href="#" onclick="verData(' + key +');">Data</a>';}
        },
        {data:'canal'}
      ],
        paging:   true,
        ordering: true,
        info:     true,
        searching: false
    });

    // comp calendar
    configCalendars();

    //setear fechas inicials
    //setDates();

});

$("#btnBuscar").click(function () 
{
  console.log('***readParams***');
  let dataIn = readParams();
  
  console.log('JSON object request:');
  console.log(dataIn);

  console.log('***getData***');
  let dataRes = getData(dataIn);

  setData(dataRes);
  console.log('***fin***');
});
    

function readParams()
{
  let vSociedad   = $('#selSociedad').find('option:selected').val();
  let vNegocio    = $('#selNegocio').find('option:selected').val();
  let vCliente    = $('#selCliente').find('option:selected').val();
  let vSubCli     = $('#selSubcli').find('option:selected').val();
  let vProyecto   = $('#selProyecto').find('option:selected').val();
  let vFecMin     = $('#startDate').val();
  let vFecMax     = $('#endDate').val();
  let vTipoDoc    = $('#selTipoDoc').find('option:selected').val();
  let vEstDoc     = $('#selEstDoc').find('option:selected').val();
  let vNomDoc     = $('#txtNomDoc').val();
  let vEsquema    = $('#selEsquema').find('option:selected').val();
  let vApp        = $('#selApp').find('option:selected').val();
  let vFlujo      = $('#selFlujo').find('option:selected').val();

  // log params
  console.log('lectura de params:');
  console.log('vSociedad: [' + vSociedad + ']');
  console.log('vNegocio:  [' + vNegocio + ']');
  console.log('vCliente:  [' + vCliente + ']');
  console.log('vSubCli:   [' + vSubCli + ']');
  console.log('vProyecto: [' + vProyecto + ']');
  console.log('vTipoDoc:  [' + vTipoDoc + ']');
  console.log('vEstDoc:   [' + vEstDoc + ']');
  console.log('vNomDoc:   [' + vNomDoc + ']');
  console.log('vEsquema:  [' + vEsquema + ']');
  console.log('vApp:      [' + vApp + ']');
  console.log('vFlujo:    [' + vFlujo + ']');
  console.log('vFecMin:   [' + vFecMin + ']');
  console.log('vFecMax:   [' + vFecMax + ']');

  //validar fechas
  if ( (vFecMin === "") || (vFecMax === "") )
  {
    alert('completar campos fecha');
    return; 
  }

  // build Obj param
  let dataIn =
  {
    sociedad: vSociedad,
    negocio: vNegocio,
    cliente: vCliente,
    subCliente: vSubCli,
    proyecto: vProyecto,
    tipDocumento: vTipoDoc,
    estDocumento: vEstDoc,
    nomDocumento: vNomDoc,
    esquema: vEsquema,
    aplicacion: vApp,    
    flujo: vFlujo,
    fecMin: transFecha(vFecMin),
    fecMax: transFecha(vFecMax)
  };

  clean(dataIn);

  return dataIn;
}

function getData(dataIn)
{
  let arrData = [];
  let i = 0;

   // Call API LOCAL
  $.ajax({
    type: "POST",
    url: "/api/buscar",
    data: dataIn,
    async: false,
    success: function (data) {
      arrData = data.body.monitoreo.regs;
    },
    error: function (jqXHR, textStatus, err) {
      console.log('error: ' + JSON.stringify(jqXHR));
    },
  });
  return arrData;
}

function setData(jsonData)
{
    let datatable = $('#tablaResult').DataTable();
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
            /*console.log('buscarxkey result:');
            console.log(JSON.stringify(result)); */
            let parser = JSON.parse(result.body);
            $('#pData').text(parser.monitoreo.data);
        },
        error: function (jqXHR, textStatus, err) {
          console.log('error: ' + JSON.stringify(jqXHR));
        },
      });
}

// Ir a pagina 'detalle'
function irDetalle(id)
{
  console.log('---metodo irDetalle---');
  window.location = `detalle.html?id=${id}&nomDoc=${$('#txtNomDoc').val()}&tipDoc=${$('#selTipoDoc').find('option:selected').val()}`;
}

/* 
  - IN: fecStr - DD/MM/AAAA hh:mm:ss
  - OUT: AAAA-MM-DDThh:mm:ss
*/
function transFecha(fecStr)
{
    let anio = fecStr.substring(6,10);
    let mes  = fecStr.substring(3,5);
    let dia  = fecStr.substring(0,2);
    let hor  = fecStr.substring(11,13);
    let min  = fecStr.substring(14,16);
    let sec  = fecStr.substring(17);
    let ret  = anio + '-' + mes + '-' + dia + 'T' + hor + ':' + min + ':' + sec;
    return ret;
}

function configCalendars()
{
  // attribs
  $('#dtpIni').datetimepicker({
    defaultDate: new Date(),
    format: 'DD/MM/YYYY HH:mm:ss',
    ignoreReadonly: true
  });
  
  $('#dtpFin').datetimepicker({
    format: 'DD/MM/YYYY HH:mm:ss',
    ignoreReadonly: true,
    useCurrent: false //Important! See issue #1075
  });

  // validation
  $("#dtpIni").on("dp.change", function (e) {
      $('#dtpFin').data("DateTimePicker").minDate(e.date);
  });
  $("#dtpFin").on("dp.change", function (e) {
      $('#dtpIni').data("DateTimePicker").maxDate(e.date);
  });
}

function clean(obj) {
  for (var propName in obj) { 
    if (obj[propName] === null || obj[propName] === undefined || obj[propName] == '') {
      delete obj[propName];
    }
  }
}
