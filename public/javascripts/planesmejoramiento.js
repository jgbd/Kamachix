$(document).ready(function(){
  load_programs();
});
//carga los acreditados en la lista desplegable
function load_programs(){
  clear();
  //el metodo ajax para consulta asyncronica
  $.ajax({
   type: "get", //el el tipo de peticion puede ser GET y POsT
   url: "/consultaplanes", //la url del que realizara la consulta
   dataType : 'json', //el formato de datos enviados y devueltos del server
   //se ejecutasi todo se realiza bien
   success : function(json) {
     $("#lstacre").html('<option selected value=0>Seleccione Programa'+'</option>')
     for (var i = 0; i < json.length; i++) {
       $("#lstacre").append('<option value='+json[i].programa+'p'+json[i].periodo+'>'+json[i].nombre+'</option>')
     }
   }
  });
}

//permite ver las fechas para los pasos de la reacreditación
function viewplans(){
  clear();
  enableschecks();
  var inf = $("#lstacre").val().split('p');
  var formdata = {
    snies: inf[0],
    periodo: inf[1]
  }

  $("#txtsnies").val(inf[0]);
  $("#plestacre").val("Activo");
  //el metodo ajax para consulta asyncronica
  $.ajax({
   type: "post", //el el tipo de peticion puede ser GET y POsT
   url: "/consultaplanes",
   data: formdata, //la url del que realizara la consulta
   dataType : 'json', //el formato de datos enviados y devueltos del server
   //se ejecutasi todo se realiza bien
   success : function(json) {
     //se da formato a la fecha inicio acreditación
     var feciniacre=new Date(json[0].inicio);
     var feciniacreday=feciniacre.getDate();
     var feciniacremonth=feciniacre.getMonth()+1;
     if (feciniacreday<10) feciniacreday='0'+feciniacreday;
     if (feciniacremonth<10) feciniacremonth='0'+feciniacremonth;

     //se da formato a la fecha fin acreditación
     var fecfinacre=new Date(json[0].fin);
     var fecfinacreday=fecfinacre.getDate();
     var fecfinacremonth=fecfinacre.getMonth()+1;
     if (fecfinacreday<10) fecfinacreday='0'+fecfinacreday;
     if (fecfinacremonth<10) fecfinacremonth='0'+fecfinacremonth;
     $("#imgestmen").html(calculate_state(fecfinacre));
     if (json[0].chkmen) {
       $("#imgestmen").html("<img src='/images/verde.svg' alt='green' title=Entregado class=plest>");
       document.getElementById('chtrmen').disabled=true;
     }

     //se da formato a la fecha fin plan mejoramiento 1 acreditación
     var fecpm1=new Date(json[0].fpm1);
     var fecpm1day=fecpm1.getDate();
     var fecpm1month=fecpm1.getMonth()+1;
     if (fecpm1day<10) fecpm1day='0'+fecpm1day;
     if (fecpm1month<10) fecpm1month='0'+fecpm1month;
     $("#imgestpm1").html(calculate_state(fecpm1));
     if (json[0].chkpm1) {
       $("#imgestpm1").html("<img src='/images/verde.svg' alt='green' title=Entregado class=plest>");
       document.getElementById('chpm1').disabled=true;
     }

    //se da formato a la fecha fin auto evaluación 1 acreditación
     var fecaev1=new Date(json[0].feva1);
     var fecaev1day=fecaev1.getDate();
     var fecaev1month=fecaev1.getMonth()+1;
     if (fecaev1day<10) fecaev1day='0'+fecaev1day;
     if (fecaev1month<10) fecaev1month='0'+fecaev1month;
     $("#imgestaev1").html(calculate_state(fecaev1));
     if (json[0].chkaev1) {
       $("#imgestaev1").html("<img src='/images/verde.svg' alt='green' title=Entregado class=plest>");
       document.getElementById('cheva1').disabled=true;
     }

    //se da formato a la fecha fin plan mejoramiento 2  y auto evaluación 2 acreditación
     if (json[0].fpm2!='no aplica'){
      //plan mejoramiento 2
      var fecpm2=new Date(json[0].fpm2);
      var fecpm2day=fecpm2.getDate();
      var fecpm2month=fecpm2.getMonth()+1;
      if (fecpm2day<10) fecpm2day='0'+fecpm2day;
      if (fecpm2month<10) fecpm2month='0'+fecpm2month;
      $("#imgestpm2").html(calculate_state(fecpm2));
      if (json[0].chkpm2) {
        $("#imgestpm2").html("<img src='/images/verde.svg' alt='green' title=Entregado class=plest>");
        document.getElementById('chpm2').disabled=true;
      }

      // auto evaluación 2
      var fecave2=new Date(json[0].feva2);
      var fecave2day=fecave2.getDate();
      var fecave2month=fecave2.getMonth()+1;
      if (fecave2day<10) fecave2day='0'+fecave2day;
      if (fecave2month<10) fecave2month='0'+fecave2month;
      $("#imgestaev2").html(calculate_state(fecave2));

      if (json[0].chkaev2) {
        $("#imgestaev2").html("<img src='/images/verde.svg' alt='green' title=Entregado class=plest>");
        document.getElementById('cheva2').disabled=true;
      }
      //envian datos a la vista de pm2 y eva2
      $("#fecpm2").val(fecpm2day+'/'+fecpm2month+'/'+fecpm2.getFullYear());
      $("#fecave2").val(fecave2day+'/'+fecave2month+'/'+fecave2.getFullYear());
      document.getElementById("chpm2").disabled = false;
      document.getElementById("cheva2").disabled = false;
     }
     else{
       //envian datos a la vista de pm2 y eva2 si no aplica
      $("#fecpm2").val(json[0].fpm2);
      $("#fecave2").val(json[0].feva2);
      $("#imgestpm2").html("");
      $("#imgestaev2").html("");
      document.getElementById("chpm2").disabled = true;
      document.getElementById("cheva2").disabled = true;
     }
     ////envian datos a la vista fecini fecfin pm1 eva1 finmen
     $("#feciniacre").val(feciniacreday+'/'+feciniacremonth+'/'+feciniacre.getFullYear());
     $("#fecfinacre").val(fecfinacreday+'/'+fecfinacremonth+'/'+fecfinacre.getFullYear());
     $("#fecpm1").val(fecpm1day+'/'+fecpm1month+'/'+fecpm1.getFullYear());
     $("#fecaev1").val(fecaev1day+'/'+fecaev1month+'/'+fecaev1.getFullYear());
     $("#fectrmen").val(fecfinacreday+'/'+fecfinacremonth+'/'+fecfinacre.getFullYear());
   }
  });
}

//se realizan calculos para verificar estado de cada paso de la reacreditación
function calculate_state(fecha){
  var now = new Date();
  var resto = fecha.getTime()-now.getTime();
  resto = Math.floor(resto/(1000*60*60*24));
  var cad='';
  if(resto>0){
    cad ='<img src='+"'/images/orange.svg' alt='orange' title='Quedan "+resto+" dias para Entrega' class=plest>";
  }else{
    cad ='<img src='+"'/images/red.svg' alt='red' title='Fecha de Entrega venció hace "+Math.abs(resto)+" dias' class='plest'>";
  }
  return cad;
}
//limpia la pantalla al Inicio

function clear(){
   $("#txtsnies").val('');
   $("#plestacre").val("");
   $("#feciniacre").val("");
   $("#fecfinacre").val("");
   $("#fecpm1").val("");
   $("#fecaev1").val("");
   $("#fecpm2").val("");
   $("#fecave2").val("");
   $("#fectrmen").val("");
   document.getElementById('chpm1').checked=false;
   document.getElementById('cheva1').checked=false;
   document.getElementById('chpm2').checked=false;
   document.getElementById('cheva2').checked=false;
   document.getElementById('chtrmen').checked=false;
}

//invoca al aceptar la entrega
function checkeds(){
  var cpm1=false;
  var caev1=false;
  var cpm2=false;
  var caev2=false;
  var cmen=false;

  if ($("#chpm1").is(':checked')) {
    cpm1 = true;
    document.getElementById('chpm1').disabled=true;
  }

  if ($("#cheva1").is(':checked')) {
    caev1 = true;
    document.getElementById('cheva1').disabled=true;
  }

  if ($("#chpm2").is(':checked')) {
    cpm2 = true;
    document.getElementById('chpm2').disabled=true;
  }

  if ($("#cheva2").is(':checked')) {
    caev2 = true;
    document.getElementById('cheva2').disabled=true;
  }

  if ($("#chtrmen").is(':checked')) {
    cmen = true;
    document.getElementById('chtrmen').disabled=true;
  }

  var formdata = {
    snies:$("#txtsnies").val(),
    cp1:cpm1,
    cae1:caev1,
    cp2:cpm2,
    cae2:caev2,
    cm:cmen
  }

  $.ajax({
   type: "post", //el el tipo de peticion puede ser GET y POsT
   url: "/actualizaplanes", //la url del que realizara la consulta
   data: formdata,
   dataType : 'json', //el formato de datos enviados y devueltos del server
   //se ejecutasi todo se realiza bien
   success : function(json) {
     if(json>0) {
       $("#modalconfirm").modal('hide');
       viewplans()
     }
   }
  });

}

//habilita todos los checks
function enableschecks(){
  document.getElementById('chpm1').disabled=false;
  document.getElementById('cheva1').disabled=false;
  document.getElementById('chpm2').disabled=false;
  document.getElementById('cheva2').disabled=false;
  document.getElementById('chtrmen').disabled=false;
}

//abrir modal de Confirmacion de Entrega
function openconfirmation(){
  $("#modalconfirm").modal('show');
}

//boton Cancelar Entrega
function cancelsend(){
  document.getElementById('chpm1').checked=false;
  document.getElementById('cheva1').checked=false;
  document.getElementById('chpm2').checked=false;
  document.getElementById('cheva2').checked=false;
  document.getElementById('chtrmen').checked=false;
  $("#modalconfirm").modal('hide');
}
