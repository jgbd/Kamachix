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
     $("#feciniacre").val(json[0].inicio);
     $("#fecfinacre").val(json[0].fin);
     $("#fecpm1").val(json[0].fpm1);
     $("#fecaev1").val(json[0].feva1);
     $("#fecpm2").val(json[0].fpm2);
     $("#fecave2").val(json[0].feva2);
     $("#fectrmen").val(json[0].fin);
   }
  });
}
