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

    $('.input-daterange').datepicker({
      format: 'yyyy-mm-dd',
      changeYear: true
    });

    //setear fechas inicials
    setDates();

});

$("#btnBuscar").click(function () 
{
  console.log('readParams');
  let dataIn = readParams();
  
  console.log('JSON object request:');
  console.log(dataIn);

  console.log('getData');
  let dataRes = getData(dataIn);

  /* console.log('data a setear:');
  console.log(dataRes); */
  setData(dataRes);

  console.log('fin');
});
    

function readParams()
{
  let vSociedad   = $('#selSociedad').find('option:selected').val();
  let vNegocio    = $('#selNegocio').find('option:selected').val();
  let vCliente    = $('#selCliente').find('option:selected').val();
  let vSubCli     = $('#selSubcli').find('option:selected').val();
  let vProyecto   = $('#selProyecto').find('option:selected').val();
  let vFecMin     = $('#startDate').val()+'T00:00:00';
  let vFecMax     = $('#endDate').val()+'T23:59:59';
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
  if ( (vFecMin == "") || (vFecMax == "") )
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
    fecMin: vFecMin,
    fecMax: vFecMax
  };

  /*
  clean(dataIn);
  console.log('JSON request (clean):');
  console.log(JSON.stringify(dataIn)); */

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
  - fecIni: AAAA-MM-DD
  - OUT: AAAA-MM-DDT00:00:00
*/
function transFechaIni(fecIni)
{
    let fecha = fecIni.toISOString();
    console.log('fecIni:' + fecha);
    let anio = parseInt(fecIni.substring(0,4));
    let mes  = parseInt(fecIni.substring(5,7)) - 1;
    let dia  = parseInt(fecIni.substring(8,10));

    return new Date(anio,mes,dia,0,0,0);
}

/* 
  - fecFin: AAAA-MM-DD
  - OUT: AAAA-MM-DDT23:59:59
*/
function transFechaFin(fecFin)
{
    let anio = parseInt(fecFin.substring(0,4));
    let mes  = parseInt(fecFin.substring(5,7)) - 1;
    let dia  = parseInt(fecFin.substring(8,10));

    return new Date(anio,mes,dia,23,59,59);
}

function setDates()
{

  // get values and create Date objects
  /* let today = new Date(2016,1,1);
  let tomorrow = new Date(2016,1,1); */
  let today = new Date();
  let tomorrow = new Date(today.getTime() + 1 * 86400000 );
  let sToday = today.toISOString();
  let sTomorrow = tomorrow.toISOString(); 

  // set the values
  $('#startDate').val(sToday.substring(0,10));
  $('#endDate').val(sTomorrow.substring(0,10));
  
}