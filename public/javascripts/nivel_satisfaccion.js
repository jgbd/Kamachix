$(document).ready(function(){
  //invoca la funcion cargar programas
  Load_Fist_time();
  Load_Programs_Lst();
  Load_Year_List();

  //al hacer clik en el boton para realizar submit al formualrio

  $("#frmfilter").submit(function(event){
    Load_Filter();
    event.preventDefault();
  });

  // al hacer click para cambiar grafica del primer div
  // se puede obtar por de columna o de barras horizontales
  //$("input[name=cgdiv1]").click(function () {

  $("#cgdiv1").change(function () {
    var json = JSON.parse($('#txtjson').val());
    if($(this).val() === '1'){
      columnGraph(json.datos,'divgraph1','Nivel de Satisfaccion \n'+json.Programa,json.fields[0],json.fields[1],0,0);
    }
    else if($(this).val() === '2'){
      columnGraph(json.datos,'divgraph1','Nivel de Satisfaccion \n'+json.Programa,json.fields[0],json.fields[1],40,30);
    }
    else if($(this).val() === '3'){
      barGraph(json.datos,'divgraph1','Nivel de Satisfaccion \n'+json.Programa,json.fields[0],json.fields[1],0,0);
    }
    else if($(this).val() === '4'){
      barGraph(json.datos,'divgraph1','Nivel de Satisfaccion \n'+json.Programa,json.fields[0],json.fields[1],40,30);
    }
  });

  // cambia grafica del segundo div
  // se puede tener o de linea o de area
  //$("input[name=cgdiv2]").click(function () {

  $("#cgdiv2").change(function () {
    var json = JSON.parse($('#txtjson').val());
    if($(this).val() === '1'){
      lineGraph(json.datos,'divgraph2','Nivel de Satisfaccion \n'+json.Programa,json.fields[0],json.fields[1]);
    }else{
      areaGraph(json.datos,'divgraph2','Nivel de Satisfaccion \n'+json.Programa,json.fields[0],json.fields[1]);
    }
  });
});

function Load_Programs_Lst(){
  $.ajax({
   type: "GET", //el el tipo de peticion puede ser GET y POsT
   url: "consultaFiltros", //la url del que realizara la consulta
   dataType : 'json',
   data:{c:1},//Primera consulta
   //se ejecutasi todo se realiza bien
   success : function(json) {
     //alert(JSON.stringify(json));

     for (var i = 0; i < json.rowCount; i++) {
       if (json.rows[i].Programa == "Udenar") {
         $("#lstprog").append('<option value="'+
         json.rows[i].Programa+'"selected>'
         +json.rows[i].nombre
         +'</option>');
       }else {
         $("#lstprog").append('<option value="'+
         json.rows[i].Programa+'">'
         +json.rows[i].nombre
         +'</option>');
       }
     }
   }
 });
}

function Load_Year_List(){
   $.ajax({
    type: "get", //el el tipo de peticion puede ser GET y POsT
    url: "consultaFiltros", //la url del que realizara la consulta
    dataType : 'json',
    data:{c:2},//se envia un valor para despues coneste saber que consulta
    //realizar a la base de daos
    //se ejecutasi todo se realiza bien
    success : function(json) {
      $("#lstanho1").append('<option value="0" selected>Seleccionar Año</option>');
      $("#lstanho2").append('<option value="0" selected>Seleccionar Año</option>');
      for (var i = 0; i < json.rowCount; i++) {
        $("#lstanho1").append('<option value="'+
        json.rows[i].Anho+'">'
        +json.rows[i].Anho
        +'</option>');

        $("#lstanho2").append('<option value="'+
        json.rows[i].Anho+'">'
        +json.rows[i].Anho
        +'</option>');
      }
    }
  });
}

function Load_Fist_time(){
  //$("#cgc1").attr('checked',true);
  $("#tableres").append('');
  $.ajax({
   type: "get", //el el tipo de peticion puede ser GET y POsT
   url: "consulta", //la url del que realizara la consulta
   dataType : 'json',
   success : function(json) {
    $("#txtjson").val(JSON.stringify(json));
    $("#programa").html(json.Programa);
    for (var j = 0; j <json.count; j++) {
      $("#tableres").append('<tr>');
        $("#tableres").append('<td>'+json.datos[j].Nivel+'</td>');
        $("#tableres").append('<td>'+json.datos[j].Anho+'</td>');
        if(json.datos[j].Nivel<=40)
          $("#tableres").append('<td><img id="est" src="/images/red.PNG" alt="RED" title="Su nivel de Satisfacción esta muy bajo"></td>');
        else if(json.datos[j].Nivel>40 && json.datos[j].Nivel<=70)
          $("#tableres").append('<td><img id="est" src="/images/orange.PNG" alt="ORANGE" title="Su nivel de Satisfacción esta bajando demasiado"></td>');
        else
          $("#tableres").append('<td><img id="est" src="/images/verde.png" alt="GREEN" title="Su nivel de Satisfacción es bueno "></td>');
      $("#tableres").append('</tr>');
    }

    columnGraph(json.datos,'divgraph1','Nivel de Satisfaccion \n'+json.Programa,json.fields[0],json.fields[1],0,0);
    lineGraph(json.datos,'divgraph2','Nivel de Satisfaccion \n'+json.Programa,json.fields[0],json.fields[1]);
    gaugesGraph(json.datos[json.count-1].Nivel,'divgraph3','r','y','g',40,70,'Satisfacción Actual', '%');
   }
  });
}

function Load_Filter(){
  $("#cgc1").attr('checked',true);
  var ban = true;
  //vacea el contenido de la tabla para volver a cargar datos nuevos
  $("#tableres").html("");
  //se obtiene los valores de las input en variables
  var program = $('#lstprog').val(), yearfrom = $("#lstanho1").val(), yearto = $("#lstanho2").val();

  if(yearfrom==yearto  && yearfrom!=0 && yearto!=0){
    ban=false;
    $('#myModal').modal('show');
  }
  if(yearfrom>yearto && yearto!=0){
    var aux = yearfrom;
    yearfrom=yearto;
    yearto=aux;
  }

  //se coloca los datos del form en el formato adecuado para enviar al server
  var formData = {
        'program': program,
        'yearfrom': yearfrom,
        'yearto':yearto
      };
  //el metodo ajax para consulta asyncronica
  if(ban){
    $.ajax({
     type: "post", //el el tipo de peticion puede ser GET y POsT
     url: "consulta", //la url del que realizara la consulta
     data : formData,
     dataType : 'json',
     success : function(json) {
       $("#txtjson").val(JSON.stringify(json));
      //  alert($("#txtjson").val());
       //recorre el json y se coloca el resultado en la tabla correspondiente
       $("#programa").html(json.Programa);
       for (var j = 0; j <json.count; j++) {
         $("#tableres").append('<tr>');
           $("#tableres").append('<td>'+json.datos[j].Nivel+'</td>');
           $("#tableres").append('<td>'+json.datos[j].Anho+'</td>');
           if(json.datos[j].Nivel<=40)
             $("#tableres").append('<td><img id="est" src="/images/red.PNG" alt="RED" title="Su nivel de Satisfacción esta muy bajo"></td>');
           else if(json.datos[j].Nivel>40 && json.datos[j].Nivel<=70)
             $("#tableres").append('<td><img id="est" src="/images/orange.PNG" alt="ORANGE" title="Su nivel de Satisfacción esta bajando demasiado"></td>');
           else
             $("#tableres").append('<td><img id="est" src="/images/verde.png" alt="GREEN" title="Su nivel de Satisfacción es bueno "></td>');
         $("#tableres").append('</tr>');
       }

      //se envia los datos a las diferentes graficasque se realizan
      columnGraph(json.datos,'divgraph1','Nivel de Satisfaccion \n'+json.Programa,json.fields[0],json.fields[1],0,0);
      lineGraph(json.datos,'divgraph2','Nivel de Satisfaccion \n'+json.Programa,json.fields[0],json.fields[1]);
      gaugesGraph(json.datos[json.count-1].Nivel,'divgraph3','r','y','g',40,70,'Satisfaccion Actual', '%');
     }
    });
  }
  closedivfilter();
}

//funciones para efecos graficos de la app
function opendivfilter(){
  $("#divfilter").modal('show');
}

function closedivfilter(){
  $("#divfilter").modal('hide');
}

function hidenmodal(){
    $("#myModal").modal('hide');
    $("#divfilter").modal('show');
}
