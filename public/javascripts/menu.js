$(document).ready(function(){
  //activa la opcion de submenu en el navbar
  $('[data-submenu]').submenupicker();

  //se ejecuta al submit de el boton para cargar el archivo de informacion satisfaccion
  $('#uploadformsatisfaccion').submit(function(event){
    var cx = comprueba_extension($('#filesatisfaccion').val());
    if(cx===0) {
      $('#mesage span').addClass('glyphicon glyphicon-alert');
      $('#mesage p').html('Seleccione un archivo!!');
    }
    else if(cx===1) {
      $('#mesage span').addClass('glyphicon glyphicon-alert');
      $('#mesage p').html('Formato de archivo no valido!!');
    }
    else{
      loadfile('/uploadfilesatisfaccion','filesatisfaccion');
    }
    event.preventDefault();
  });

  //se ejecuta al submit de el boton para cargar el archivo de informacion cohorte
  $('#uploadformcohorte').submit(function(event){
    var cx = comprueba_extension($('#filescohorte').val());
    if(cx===0) {
      $('#mesage span').addClass('glyphicon glyphicon-alert');
      $('#mesage p').html('Seleccione un archivo!!');
    }
    else if(cx===1) {
      $('#mesage span').addClass('glyphicon glyphicon-alert');
      $('#mesage p').html('Formato de archivo no valido!!');
    }
    else{
      loadfile('/uploadfilecohorte','filescohorte');
    }
    event.preventDefault();
  });

  //se ejecuta al submit de el boton para cargar el archivo de informacion periodo
  $('#uploadformperiodo').submit(function(event){
    var cx = comprueba_extension($('#filesperiodo').val());
    if(cx===0) {
      $('#mesage span').addClass('glyphicon glyphicon-alert');
      $('#mesage p').html('Seleccione un archivo!!');
    }
    else if(cx===1) {
      $('#mesage span').addClass('glyphicon glyphicon-alert');
      $('#mesage p').html('Formato de archivo no valido!!');
    }
    else{
      loadfile('/uploadfileperiodo','filesperiodo');
    }
    event.preventDefault();
  });

  //se ejecuta al submit de el boton para cargar el archivo de informacion del nivel de formacion docentes
  $('#uploadformacion').submit(function(event){
    var cx = comprueba_extension($('#fileformacion').val());
    if(cx===0) {
      $('#mesage span').addClass('glyphicon glyphicon-alert');
      $('#mesage p').html('Seleccione un archivo!!');
    }
    else if(cx===1) {
      $('#mesage span').addClass('glyphicon glyphicon-alert');
      $('#mesage p').html('Formato de archivo no valido!!');
    }
    else{
      loadfile('/uploadfileformacion','fileformacion');
    }
    event.preventDefault();
  });

});


//se invoca para generar el pdf del reporte
function getPDF(){

  //se inicia el servidor de reportes
  jsreport.serverUrl = 'http://localhost:5488';

  //areglo para contener todo lo que se envia a el reporte
  var atrind=[];

  //se saca la info basica del Indicador para el reporte
  for (var i = 1; i < 19; i++) {
    atrind.push($("#atrinfo"+i).val());
  }

  //se saca la tabla de resultados para el reporte
  var tabres = $('#divtab').html().toString();
  atrind.push(tabres);

  //se saca la info de la calificacion y lectura del reporte
  atrind.push($('#txtcal').val().replace(/\n/g,'<br>'));
  atrind.push($('#txtlec').val().replace(/\n/g,'<br>'));

  //se obtiene el svg de la grafica 1
  var $g1 = $('#divg1 div.amcharts-main-div div.amcharts-chart-div').html();
  var img1 = svgtoimg($g1);
  atrind.push(img1);

  //se obtiene si existe una leyend en la primera grafica
  var $gle1 = $('#divg1 div.amcharts-main-div div.amChartsLegend.amcharts-legend-div').html()
  if($gle1 != 'undefined'){
    var imgle1 = svgtoimg($gle1);
    atrind.push(imgle1);
  }else{
    atrind.push("");
  }

  //se obtiene el svg de la grafica 2
  var $g2 = $('#divg2 div.amcharts-main-div div.amcharts-chart-div').html();
  var img2 = svgtoimg($g2);
  atrind.push(img2);

  //se obtiene si existe una leyend en la segunda grafica
  var $gle2 = $('#divg2 div.amcharts-main-div div.amChartsLegend.amcharts-legend-div').html()
  if($gle2 != 'undefined'){
    var imgle2 = svgtoimg($gle2);
    atrind.push(imgle2);
  }else{
    atrind.push("");
  }


  //se crea la variable que contiene todo las configuraciones para e reportes
  var request = {
    template: {
      "shortid":"B1E4W75Ke",
      "engine ":"none",
      "recipe" : "phantom-pdf"
    },
    data: {
      "proceso":atrind[0],
      "lider":atrind[1],
      "objproceso":atrind[2],
      "nombreindi":atrind[3],
      "atrmedir":atrind[4],
      "objcalidad":atrind[5],
      "tipoindi":atrind[6],
      "frecuencia":atrind[7],
      "percalculo":atrind[8],
      "tendencia":atrind[9],
      "meta":atrind[10],
      "objindicador":atrind[11],
      "rango":atrind[12],
      "formula":atrind[13],
      "modografica":atrind[14],
      "puntoregistro":atrind[15],
      "responcalculo":atrind[16],
      "instructivo":atrind[17],
      "resultindi":atrind[18],
      "calificacion":atrind[19],
      "lectura":atrind[20],
      "grafica1":atrind[21],
      "grafica2":atrind[23],
      "leyend1":atrind[22],
      "leyend2":atrind[24],
    },
    options: {
      preview:true,
      "Content-Disposition": "filename=myreport.pdf"
    }
   };

   jsreport.headers['Content-Type'] = "application/json " ;
   jsreport.headers['Authorization'] = "Basic " + btoa("admin:password");

   var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

   if(!isOpera){
    //  alert('hola')
     jsreport.render('_blank', request);

   }else{
     jsreport.download('myReport.pdf', request);
   }


}

//funcion para sacar el svg y convertirlo en imagen
function svgtoimg(svgdiv){
  var $g = svgdiv;
  if($g){
    var arr = $g.split('<a');
    var svg = arr[0];
    if(svg){
      svg = svg.replace(/\r?\n|\r/g, '').trim();

      //se obtiene la img en base64 de grafica 1
      var canvasg = document.createElement("canvas");
      var contextg = canvasg.getContext("2d");
      contextg.clearRect(0, 0, canvasg.width, canvasg.height);
      canvg(canvasg, svg);
      var imgData = canvasg.toDataURL('image/png');

      return imgData
    }
  }
  return "";
}

//se invoca para editar los informes
function editRepor(){
  alert('La edicion solo es para este informe');
  //se recorre los atribbutos del infomre y se quita el solo lectura
  for (var i = 1; i < 19; i++) {
    $("#atrinfo"+i).removeAttr('readonly');
  }

}

//abre el modal de reportes
function openmodalreport(){
  try{
    $("#modalinfo").modal('show');
    var date = new Date();

    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();

    var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");

    $("#fecha").html(""+day+" de "+meses[month]+" de "+year);
    $("#divtab").html($("#divtable").html());
    $("#divg1").html($("#divgraph1").html());
    $("#divg2").html($("#divgraph2").html());
  }
  catch(err){
    $("#modalinforeport").modal('show');
  }
}

//abre modal de cargar datos satisfaccion
function openmodaluploadsatisfaccion(){
  $("#modaluploadsatisfaccion").modal('show');
  $('#mesage').html("");
}

//abre modal para cargar datos de formacion docentes
function openmodaluploadFormacion(){
  $("#modaluploadFormacion").modal('show');
  $('#mesage').html("");

}

//abre modal cargar datos desercion por cohorte
function openmodaluploadcohorte(){
  $("#modaluploadcohorte").modal('show');
  $('#mesage').html("");
}

//abre modal cargar datos desercion por periodo
function openmodaluploadperiodo(){
  $("#modaluploadperiodo").modal('show');
  $('#mesage').html("");
}

//abre modal cargar daos doctores
function modalupdateformacionDO(){
  $("#modalupdateformacionDO").modal('show');
  $('#mesage').html("");
}

//abre modal cargar daos magister
function modalupdateformacionMA(){
  $("#modalupdateformacionMA").modal('show');
  $('#mesage').html("");
}

//abre modal cargar daos Especialista
function modalupdateformacionES(){
  $("#modalupdateformacionES").modal('show');
  $('#mesage').html("");
}

//abre modal cargar daos profesionales
function modalupdateformacionPR(){
  $("#modalupdateformacionPR").modal('show');
  $('#mesage').html("");
}

//abre modal para login de la aplicacion
function openmodallogin(){
  $("#modallogin").modal('show');
}
