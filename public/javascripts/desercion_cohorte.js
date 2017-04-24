$(document).ready(function(){
  load_start(); //carga inicial de la pagina
  loadlstsprogram();
  //solo queda el valor de Seleccionar periodo en las listas
  $("#lstperiod1").append('<option value="0" selected>Seleccionar Año</option>');
  $("#lstperiod2").append('<option value="0" selected>Seleccionar Año</option>');


  //click para cargar los filtros aqui hice cambios
  // otro cambio
  $("#frmfilter").submit(function(event){
    load_filters();
    event.preventDefault();
  });

  // al hacer click para cambiar grafica del primer div
  // se puede obtar por de columna o de barras horizontales
  $("#cgdiv1").change(function () {
    var json = JSON.parse($('#txtjson').val());
    if($(this).val() === '1'){
      columnGraph(json.datos.reverse(),'divgraph1','Desercion por cohorte\n'+json.Programa,json.fields[0],json.fields[1],0,0);
    }
    else if($(this).val() === '2'){
      columnGraph(json.datos.reverse(),'divgraph1','Desercion por cohorte\n'+json.Programa,json.fields[0],json.fields[1],40,30);
    }
    else if($(this).val() === '3'){
      barGraph(json.datos.reverse(),'divgraph1','Desercion por cohorte\n'+json.Programa,json.fields[0],json.fields[1],0,0);
    }
    else{
      barGraph(json.datos.reverse(),'divgraph1','Desercion por cohorte\n'+json.Programa,json.fields[0],json.fields[1],40,30);    }
  });

  // cambia grafica del segundo div
  // se puede tener o de linea o de area
  $("#cgdiv2").change(function () {
    var json = JSON.parse($('#txtjson').val());
    if($(this).val() === '1'){
      lineGraph(json.datos.reverse(),'divgraph2','Desercion por Cohorte\n'+json.Programa,json.fields[0],json.fields[1]);
    }else{
      areaGraph(json.datos.reverse(),'divgraph2','Desercion por Cohorte\n'+json.Programa,json.fields[0],json.fields[1]);
    }
  });
});

function load_start(){
  $('#cgdiv1 > option[value="0"]').attr('selected', 'selected');
  $('#cgdiv2 > option[value="0"]').attr('selected', 'selected');
  $("#tableres").html('');
  $("#divgraph1").html('');
  $("#divgraph2").html('');
  $("#divgraph3").html('');
  $.ajax({
   type: "GET", //el el tipo de peticion puede ser GET y POST
   url: "consultacohorte", //la url del que realizara la consulta
   dataType : 'json',
   //se ejecutasi todo se realiza bien
   success : function(json) {
      $("#txtjson").val(JSON.stringify(json));
      $("#programa").html(json.Programa);
       for (var j = json.count-1; j >=0; j--) {
         $("#tableres").append('<tr>');
           $("#tableres").append('<td>'+json.datos[j].periodo+'</td>');
           $("#tableres").append('<td>'+json.datos[j].porcentaje+'</td>');
           json.datos[j].porcentaje=json.datos[j].porcentaje.replace("%","");
           if(json.datos[j].porcentaje<=40)
             $("#tableres").append('<td class="est"><img id="est" src="/images/verde.png" alt="GREEN" title="Su nivel de Deserción es bueno"></td>');
           else if(json.datos[j].porcentaje>40 && json.datos[j].porcentaje<=70)
             $("#tableres").append('<td class="est"><img id="est" src="/images/orange.PNG" alt="ORANGE" title="Su nivel de Desercion esta subiendo demasiado"></td>');
           else
             $("#tableres").append('<td class="est"><img id="est" src="/images/red.PNG" alt="RED" title="Su nivel de Desercion en malo "></td>');
         $("#tableres").append('</tr>');
       }
      columnGraph(json.datos.reverse(),'divgraph1','Desercion por cohorte\n'+json.Programa,json.fields[0],json.fields[1],0,0);
      lineGraph(json.datos,'divgraph2','Desercion por Cohorte\n'+json.Programa,json.fields[0],json.fields[1]);
      var titleg="Nivel de Deserción por cohorte "+ json.datos[json.count-1].periodo +"\n"+ json.Programa
      gaugesGraph(json.datos[json.count-1].porcentaje,'divgraph3','g','y','r',40,70 ,titleg, '%');
   }
 });
}

function loadlstsperiod(){
  $("#lstperiod1").html("");
  $("#lstperiod2").html("");
  $.ajax({
   type: "get", //el el tipo de peticion puede ser GET y POsT
   url: "filtroscohorte", //la url del que realizara la consulta
   dataType : 'json',
   data:{
     c:2,
     'program':$("#lstprog").val()
   },//se envia un valor para despues coneste saber que consulta
   //realizar a la base de daos
   //se ejecutasi todo se realiza bien
   success : function(json) {


     $("#lstperiod1").append('<option value="0" selected>Seleccionar Año</option>');
     $("#lstperiod2").append('<option value="0" selected>Seleccionar Año</option>');

     for (var i = 0; i < json.rowCount; i++) {
       $("#lstperiod1").append('<option value="'+
       json.rows[i].periodo+'">'
       +json.rows[i].periodo
       +'</option>');

       $("#lstperiod2").append('<option value="'+
       json.rows[i].periodo+'">'
       +json.rows[i].periodo
       +'</option>');
     }
   }
 });
}

function loadlstsprogram(){
  $.ajax({
   type: "get", //el el tipo de peticion puede ser GET y POsT
   url: "filtroscohorte", //la url del que realizara la consulta
   dataType : 'json',
   data:{c:1},//se envia un valor para despues coneste saber que consulta
   //realizar a la base de daos
   //se ejecutasi todo se realiza bien
   success : function(json) {
     $("#lstprog").append('<option selected value="'+
     '0'+'">'
     +'Seleccione Programa'
     +'</option>');
     for (var i = 0; i < json.rowCount; i++) {
       $("#lstprog").append('<option value="'+
       json.rows[i].programa+'">'
       +json.rows[i].nombre
       +'</option>');
     }
   }
 });
}

function load_filters(){
  var ban = true;
  //vacea el contenido de la tabla para volver a cargar datos nuevos
  $('#cgdiv1 > option[value="0"]').attr('selected', 'selected');
  $('#cgdiv2 > option[value="0"]').attr('selected', 'selected');
  $("#tableres").html("");
  $("#divgraph1").html("");
  $("#divgraph2").html("");
  $("#divgraph3").html("");
  //se obtiene los valores de las input en variables
  var program=$("#lstprog").val(), periodfrom = $("#lstperiod1").val(), periodto = $("#lstperiod2").val();

  if(periodfrom>periodto && periodto!=0){
    var aux = periodfrom;
    periodfrom=periodto;
    periodto=aux;
  }else if(periodto>periodfrom && periodfrom == 0){
    periodfrom=periodto;
  }

  //se coloca los datos del form en el formato adecuado para enviar al server
  var formData = {
        'program': program,
        'periodfrom': periodfrom,
        'periodto':periodto
      };
  //el metodo ajax para consulta asyncronica
  if(ban){
    $.ajax({
     type: "POST", //el el tipo de peticion puede ser GET y POsT
     url: "consultacohorte", //la url a la  que se realizara la consulta
     data : formData,
     dataType : 'json',
     success : function(json) {
       if(json.Error){
         $("#messageError").html("No existen datos");
         $('#myModal').modal('show');
       }else{
          $("#txtjson").val(JSON.stringify(json));
          if(periodfrom!=0){
            if(periodto!=0 && periodfrom!=periodto){
              $("#programa").html(json.Programa+"<br> Periodo: "+periodfrom+" A "+periodto);
            }else{
              $("#programa").html(json.Programa+"<br> Periodo: "+periodfrom);
            }
          }else{
            $("#programa").html(json.Programa);
          }
          for (var j = json.count-1; j >=0; j--) {
            $("#tableres").append('<tr>');
              $("#tableres").append('<td>'+json.datos[j].periodo+'</td>');
              $("#tableres").append('<td>'+json.datos[j].porcentaje+'</td>');
              json.datos[j].porcentaje=json.datos[j].porcentaje.replace("%","");
              if(json.datos[j].porcentaje<=40)
                $("#tableres").append('<td class="est"><img id="est" src="/images/verde.png" alt="GREEN" title="Su nivel de Deserción es bueno"></td>');
              else if(json.datos[j].porcentaje>40 && json.datos[j].porcentaje<=70)
                $("#tableres").append('<td class="est"><img id="est" src="/images/orange.PNG" alt="ORANGE" title="Su nivel de Desercion esta subiendo demasiado"></td>');
              else
                $("#tableres").append('<td class="est"><img id="est" src="/images/red.PNG" alt="RED" title="Su nivel de Desercion en malo "></td>');
            $("#tableres").append('</tr>');
          }
         columnGraph(json.datos.reverse(),'divgraph1','Desercion por cohorte\n'+json.Programa,json.fields[0],json.fields[1],0,0);
         lineGraph(json.datos,'divgraph2','Desercion por Cohorte\n'+json.Programa,json.fields[0],json.fields[1]);
         var titleg="Nivel de Deserción por cohorte "+ json.datos[json.count-1].periodo +"\n"+ json.Programa
         gaugesGraph(json.datos[json.count-1].porcentaje,'divgraph3','g','y','r',40,70,titleg, '%');
       }
     }
    });
  }
  closedivfilter();
}

function opendivfilter(){
  $("#modalfilter").modal('show');
}

function closedivfilter(){
  $("#modalfilter").modal('hide');
}

function hidenmodal(){
    $("#myModal").modal('hide');
    $("#modalfilter").modal('show');
}
