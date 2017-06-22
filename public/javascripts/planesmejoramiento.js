$(document).ready(function(){
  load_programs();
});

function load_programs(){
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

function viewplans(){
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
     var feciniacre=new Date(json[0].inicio);
     var feciniacreday=feciniacre.getDate();
     var feciniacremonth=feciniacre.getMonth()+1;
     if (feciniacreday<10) feciniacreday='0'+feciniacreday;
     if (feciniacremonth<10) feciniacremonth='0'+feciniacremonth;
     
     var fecfinacre=new Date(json[0].fin);
     var fecfinacreday=fecfinacre.getDate();
     var fecfinacremonth=fecfinacre.getMonth()+1;
     if (fecfinacreday<10) fecfinacreday='0'+fecfinacreday;
     if (fecfinacremonth<10) fecfinacremonth='0'+fecfinacremonth;
     
     var fecpm1=new Date(json[0].fpm1);
     var fecpm1day=fecpm1.getDate();
     var fecpm1month=fecpm1.getMonth()+1;
     if (fecpm1day<10) fecpm1day='0'+fecpm1day;
     if (fecpm1month<10) fecpm1month='0'+fecpm1month;
     
     var fecaev1=new Date(json[0].feva1);
     var fecaev1day=fecaev1.getDate();
     var fecaev1month=fecaev1.getMonth()+1;
     if (fecaev1day<10) fecaev1day='0'+fecaev1day;
     if (fecaev1month<10) fecaev1month='0'+fecaev1month;
     
     if (json[0].fpm2!='no aplica'){
      var fecpm2=new Date(json[0].fpm2);
      var fecpm2day=fecpm2.getDate();
      var fecpm2month=fecpm2.getMonth()+1;
      if (fecpm2day<10) fecpm2day='0'+fecpm2day;
      if (fecpm2month<10) fecpm2month='0'+fecpm2month;
      
      var fecave2=new Date(json[0].feva2);
      var fecave2day=fecave2.getDate();
      var fecave2month=fecave2.getMonth()+1;
      if (fecave2day<10) fecave2day='0'+fecave2day;
      if (fecave2month<10) fecave2month='0'+fecave2month;
      
      $("#fecpm2").val(fecpm2day+'/'+fecpm2month+'/'+fecpm2.getFullYear());
      $("#fecave2").val(fecave2day+'/'+fecave2month+'/'+fecave2.getFullYear());
     }
     else{
      $("#fecpm2").val(json[0].fpm2);
      $("#fecave2").val(json[0].feva2);
     }
     $("#feciniacre").val(feciniacreday+'/'+feciniacremonth+'/'+feciniacre.getFullYear());
     $("#fecfinacre").val(fecfinacreday+'/'+fecfinacremonth+'/'+fecfinacre.getFullYear());
     $("#fecpm1").val(fecpm1day+'/'+fecpm1month+'/'+fecpm1.getFullYear());
     $("#fecaev1").val(fecaev1day+'/'+fecaev1month+'/'+fecaev1.getFullYear());
     $("#fectrmen").val(fecfinacreday+'/'+fecfinacremonth+'/'+fecfinacre.getFullYear());
   }
  });
}
