$(document).ready(function() {
    
    $('#tablaResult').DataTable( {
      columns: [
        {data:'id',  sClass:"firstCol", "render": function (id, type, row) {
          return '<a href="#" onclick="irDetalle(&quot;'+id+'&quot;);">'+id+'</a>';}
        },
        {data:'subCliente'},
        {data:'tipDocumento'},
        {data:'nomDocumento'},
        {data:'estDocumento'},
        {data:'fecRegistro',  "render": function (fecRegistro, type, row) {
          return formatFechaBackEnd(fecRegistro, 'DD.MM.YY hh:mm:ss a');}
        },
        {data:'fecDocumento',  "render": function (fecDocumento, type, row) {
          return formatFechaBackEnd(fecDocumento, 'DD.MM.YY');}
        },
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

    // comp toastr
    configToastr();

    // setear fechas inicials
    //setDates();

    // cargar data de componentes
    loadDataComps();

    // para testing (eliminar)
    testSetIniValues();

});

// Click "btnLimpiar"
$("#btnLimpiar").click(function () 
{
  $('#selSociedad :nth-child(1)').prop('selected', true);// To select via index
  $('#selNegocio :nth-child(1)').prop('selected', true);
  $('#selCliente :nth-child(1)').prop('selected', true);
  $('#selSubcli :nth-child(1)').prop('selected', true);
  $('#selProyecto :nth-child(1)').prop('selected', true);
  //$('#startDate').val('05/02/2018 10:00:00');
  //$('#endDate').val('08/02/2018 19:40:20');
  $('#selTipoDoc :nth-child(1)').prop('selected', true);
  $('#selEstDoc :nth-child(1)').prop('selected', true);
  $('#txtNomDoc').val('');
  $('#selEsquema :nth-child(1)').prop('selected', true);
  $('#selApp :nth-child(1)').prop('selected', true);
  $('#selFlujo :nth-child(1)').prop('selected', true);
});

// Click "btnBuscar"
$("#btnBuscar").click(function () 
{
  console.log('***readParams***');
  let dataIn = readParams();
  
  console.log('JSON object request:');
  console.log(JSON.stringify(dataIn));

  console.log('***getData***');
  if (dataIn.isOk)
  {
    let dataRes = getData(dataIn);
    let arrData = [];

    console.log('resp Backend:')
    console.log(dataRes);

    if (dataRes.monitoreo === null)
    {
      toastr.error('Ocurri&oacute; un error en la ejecuci&oacute;n del proceso');
    }
    else
    {
      // rpta OK
      if (dataRes.body.monitoreo.codigo === 0)
      {
        // existen registros
        if (dataRes.body.monitoreo.total_regs > 0)
        {
          arrData = dataRes.body.monitoreo.regs;
          //debug
          arrData.forEach(element => {
            dateTmp = new Date(element.fecRegistro);
            dateTmp2 = new Date(element.fecDocumento);
            /* console.log(`fecReg: ${element.fecRegistro}`);
            console.log(`fecReg trans: ${dateTmp}`);
            console.log(`fecDoc: ${element.fecDocumento}`);
            console.log(`fecDoc trns: ${dateTmp2}`); */
          });
          // pintar data
          setData(arrData);
        }
        else
        {
          toastr.warning('No se encontró resultado para los filtros aplicados');
        }
      }
      else
      {
        toastr.error('Ocurri&oacute; un error en la ejecuci&oacute;n del proceso');
        console.log('Mensaje error Backend:');
        console.log(dataRes.body.monitoreo.errorMessage);
      }
    }
  }
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
  let vTipFiltro  = '1'; //NO se envia ningún parametro filtro / select

  if (isAllCamposCompletados()) { // se completaron todos los campos
    vTipFiltro = '0'; //Se envia parametros filtro / select
  }

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

  let dataIn;

  //validar fechas
  if ( (vFecMin === "") || (vFecMax === "") )
  {
    //alert('completar campos fecha');
    toastr.error('completar campos fecha');
    dataIn = { isOk: false };
  }
  else
  {

    // build Obj param
    dataIn =
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
      fecMax: transFecha(vFecMax),
      tipFiltro: vTipFiltro,
      isOk: true
    };

    clean(dataIn);
  }
  return dataIn;
}

function getData(dataIn)
{
  let arrData = [];
   // Call API LOCAL
  $.ajax({
    type: "POST",
    url: "/api/buscar",
    data: dataIn,
    async: false,
    success: function (data) {
      arrData = data;
      console.log('data respuesta:');
      console.log(arrData);
    },
    error: function (jqXHR, textStatus, err) {
      console.log('error: ' + JSON.stringify(jqXHR));
    },
  });
  return arrData;
}

function setData(jsonData)
{

  if (isAllCamposCompletados()) // se completaron todos los campos;
  {
    // agregar a JSON campos que no devuelve el BackEnd (select)
    jsonData.forEach(element => {

      element.subCliente   = $('#selSubcli').find('option:selected').val();
      element.tipDocumento = $('#selTipoDoc').find('option:selected').val();
      element.nomDocumento = $('#txtNomDoc').val();
      element.estDocumento = $('#selEstDoc').find('option:selected').val();

    });
  }

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

function configToastr()
{
  toastr.options.positionClass = 'toast-bottom-right';
  toastr.options.extendedTimeOut = 0; //1000;
  toastr.options.timeOut = 2000;
  toastr.options.fadeOut = 250;
  toastr.options.fadeIn  = 250;
}

/* 
  **********************
  **** Utilitarios  ****
  **********************
*/

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

function clean(obj) {
  for (var propName in obj) { 
    if (obj[propName] === null || obj[propName] === undefined || obj[propName] == '') {
      delete obj[propName];
    }
  }
}

function isAllCamposCompletados()
{
  // check empty components
  let ret = true;

  $('.form-control').each(function() {
    if ($(this).val() === '') {
      ret = false;
    }
  });

  console.log('todos los campos:' + ret);

  return ret;
}

function testSetIniValues()
{
  $('#selSociedad :nth-child(2)').prop('selected', true);// To select via index
  $('#selNegocio :nth-child(2)').prop('selected', true);
  $('#selCliente :nth-child(2)').prop('selected', true);
  $('#selSubcli :nth-child(2)').prop('selected', true);
  $('#selProyecto :nth-child(2)').prop('selected', true);
  $('#startDate').val('05/02/2018 10:00:00');
  $('#endDate').val('08/02/2018 19:40:20');
  //$('#startDate').val('');
  //$('#endDate').val('');
  $('#selTipoDoc :nth-child(2)').prop('selected', true);
  $('#selEstDoc :nth-child(2)').prop('selected', true);
  $('#txtNomDoc').val('MIDOCUMENTITO.txt');
  $('#selEsquema :nth-child(2)').prop('selected', true);
  $('#selApp :nth-child(2)').prop('selected', true);
  $('#selFlujo :nth-child(2)').prop('selected', true);
  
}

function loadDataComps()
{
  // combo 'selSociedad'
  let data =
  [
    {"value":"SOC01", "text":"SOC01"},
    {"value":"SOC02", "text":"SOC02"},
    {"value":"SOC03", "text":"SOC03"}
  ];
  addOptions($('#selSociedad'), data);

  // combo 'selNegocio'
  data =
  [
    {"value":"NEG01", "text":"NEG01"},
    {"value":"NEG02", "text":"NEG02"},
    {"value":"NEG03", "text":"NEG03"}
  ];
  addOptions($('#selNegocio'), data);

  // combo 'selCliente'
  data =
  [
    {"value":"CLI01", "text":"CLI01"},
    {"value":"CLI02", "text":"CLI02"},
    {"value":"CLI03", "text":"CLI03"}
  ];
  addOptions($('#selCliente'), data);

  // combo 'selSubcli'
  data =
  [
    {"value":"1101", "text":"1101"},
    {"value":"1102", "text":"1102"},
    {"value":"1103", "text":"1103"}
  ];
  addOptions($('#selSubcli'), data);

  // combo 'selProyecto'
  data =
  [
    {"value":"PROY01", "text":"PROY01"},
    {"value":"PROY02", "text":"PROY02"},
    {"value":"PROY03", "text":"PROY03"}
  ];
  addOptions($('#selProyecto'), data);

  // combo 'selTipoDoc'
  data =
  [
    {"value":"Traslados", "text":"Traslados"},
    {"value":"TrasladosB", "text":"TrasladosB"},
    {"value":"TrasladosC", "text":"TrasladosC"}
  ];
  addOptions($('#selTipoDoc'), data);

  // combo 'selEstDoc'
  data =
  [
    {"value":"Correcto", "text":"Correcto"},
    {"value":"Incorrecto", "text":"Incorrecto"}
  ];
  addOptions($('#selEstDoc'), data);

   // combo 'selEsquema'
   data =
   [
     {"value":"ESQ01", "text":"ESQ01"},
     {"value":"ESQ02", "text":"ESQ02"},
     {"value":"ESQ03", "text":"ESQ03"}
   ];
   addOptions($('#selEsquema'), data);

  // combo 'selApp'
  data =
  [
    {"value":"APP01", "text":"APP01"},
    {"value":"APP02", "text":"APP02"},
    {"value":"APP03", "text":"APP03"}
  ];
  addOptions($('#selApp'), data);

  // combo 'selFlujo'
  data =
  [
    {"value":"FLU01", "text":"FLU01"},
    {"value":"FLU02", "text":"FLU02"},
    {"value":"FLU03", "text":"FLU03"},
    {"value":"MF_MB_MININT_DESPACHO_ALMACEN_REQ.msgflow", "text":"MF_MB_MININT_DESPACHO_ALMACEN_REQ.msgflow"}    
  ];
  addOptions($('#selFlujo'), data);
 
}

function addOptions(comp, items)
{
  comp.append('<option value="">-Todos-</option>');
  $.each(items, function (i, item) {
    comp.append($('<option>', { 
        value: item.value,
        text : item.text 
    }));
  });
}

function formatFechaBackEnd(dateMil, format)
{
  let fecSub = dateMil.toString().substring(0,13);
  let fec    = new Date(+fecSub);
  return moment(fec).format(format);
}