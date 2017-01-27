$(document).ready(function(){
  load_start();
  loadlstsprogram(); //carga la lista de programas
  $("#lstperiod1").append('<option value="0" selected>Seleccionar Año</option>');
  $("#lstperiod2").append('<option value="0" selected>Seleccionar Año</option>');
  $("#frmfilter").submit(function(event){
    load_filters();
    event.preventDefault();
  });

  // al hacer click para cambiar grafica del primer div
  // se puede obtar por de columna o de barras horizontales
  //$("input[name=cgdiv1]").click(function () {
  $("#cgdiv1").change(function () {
    var json = JSON.parse($('#txtjson').val());
    if($(this).val() === '1'){
      columnTwoGraph(json.datos,'divgraph1','Desercion por Periodo\n'+json.programa,json.fields[0],json.fields[1],json.fields[2],0,0,"Deserción","Retención");
    }
    else if($(this).val() === '2'){
      columnTwoGraph(json.datos,'divgraph1','Desercion por Periodo\n'+json.programa,json.fields[0],json.fields[1],json.fields[2],40,30,"Deserción","Retención");
    }
    else if($(this).val() === '3'){
      barTwoGraph(json.datos,'divgraph1','Desercion por Periodo\n'+json.programa,json.fields[0],json.fields[1],json.fields[2],0,0,"Deserción","Retención");
    }
    else{
      barTwoGraph(json.datos,'divgraph1','Desercion por Periodo\n'+json.programa,json.fields[0],json.fields[1],json.fields[2],40,30,"Deserción","Retención");
    }
  });
});

function load_start(){
  $("#cgc1").attr('checked',true);
  $("#tableres").html('');
  $("#divgraph1").html('');
  $("#divgraph2").html('');
  $("#divgraph3").html('');
  $.ajax({
   type: "GET", //el el tipo de peticion puede ser GET y POsT
   url: "consultaperiodo", //la url del que realizara la consulta
   dataType : 'json',
   //se ejecutasi todo se realiza bien
   success : function(json) {
      $("#txtjson").val(JSON.stringify(json));
      $("#lblprog").html(json.programa);
       for (var j = json.count-1; j >=0; j--) {
         $("#tableres").append('<tr>');
           $("#tableres").append('<td>'+json.datos[j].periodo+'</td>');
           $("#tableres").append('<td>'+json.datos[j].graduados+'</td>');
           $("#tableres").append('<td>'+json.datos[j].desertores+'</td>');
           json.datos[j].desercion=json.datos[j].desercion.replace(/%/g,"");
           json.datos[j].retencion=json.datos[j].retencion.replace(/%/g,"");
           $("#tableres").append('<td>'+json.datos[j].desercion+'%</td>');
           $("#tableres").append('<td>'+json.datos[j].retencion+'%</td>');
           if(json.datos[j].desercion<=40)
             $("#tableres").append('<td><img id="est" src="/images/verde.png" alt="GREEN" title="Su nivel de Deserción es bueno"></td>');
           else if(json.datos[j].desercion>40 && json.datos[j].desercion<=70)
             $("#tableres").append('<td><img id="est" src="/images/orange.PNG" alt="ORANGE" title="Su nivel de Desercion esta subiendo demasiado"></td>');
           else
             $("#tableres").append('<td><img id="est" src="/images/red.PNG" alt="RED" title="Su nivel de Desercion en malo "></td>');
         $("#tableres").append('</tr>');
       }
      columnTwoGraph(json.datos,'divgraph1','Desercion por Periodo\n'+json.programa,json.fields[0],json.fields[1],json.fields[2],0,0,"Deserción","Retención");
      lineTwoGraph(json.datos,'divgraph2','Desercion por Periodo\n'+json.programa,json.fields[0],json.fields[1],json.fields[2],"Deserción","Retención");
      gaugesTwoAxesGraph(json.datos[0].desercion,json.datos[0].retencion,'divgraph3')
   }
 });
}

function loadlstsperiod(){
  $("#lstperiod1").html("");
  $("#lstperiod2").html("");
  $.ajax({
   type: "get", //el el tipo de peticion puede ser GET y POsT
   url: "filtrosperiodo", //la url del que realizara la consulta
   dataType : 'json',
   data:{c:2,'program':$("#lstprog").val()},//se envia un valor para despues coneste saber que consulta
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
   url: "filtrosperiodo", //la url del que realizara la consulta
   dataType : 'json',
   data:{c:1},//se envia un valor para despues coneste saber que consulta
   //realizar a la base de daos
   //se ejecutasi todo se realiza bien
   success : function(json) {
     $("#lstprog").append('<option value="0" selected>Seleccionar Programa</option>');
     for (var i = 0; i < json.rowCount; i++) {
       $("#lstprog").append('<option value="'+
       json.rows[i].programa+'">'
       +json.rows[i].programa
       +'</option>');
     }
   }
 });
}

function load_filters(){
  $("#cgc1").attr('checked',true);
  var ban = true;
  //vacea el contenido de la tabla para volver a cargar datos nuevos
  $("#tableres").html('');
  $("#divgraph1").html('');
  $("#divgraph2").html('');
  $("#divgraph3").html('');

  //se obtiene los valores de las input en variables
  var program=$("#lstprog").val(), periodfrom = $("#lstperiod1").val(), periodto = $("#lstperiod2").val();

  if(periodfrom==periodto  && periodfrom!=0 && periodto!=0){
    ban=false;
    $("#messageError").html("No seleccione el mismo periodo");
    $('#myModal').modal('show');
  }
  if(periodfrom>periodto && periodto!=0){
    var aux = periodfrom;
    periodfrom=periodto;
    periodto=aux;
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
     url: "consultaperiodo", //la url a la  que se realizara la consulta
     data : formData,
     dataType : 'json',
     success : function(json) {
       if(json.Error){
         $("#messageError").html("No existen datos");
         $('#myModal').modal('show');
       }else{
         $("#txtjson").val(JSON.stringify(json));
         $("#lblprog").html(json.programa);
          for (var j = json.count-1; j >=0; j--) {
            $("#tableres").append('<tr>');
              $("#tableres").append('<td>'+json.datos[j].periodo+'</td>');
              $("#tableres").append('<td>'+json.datos[j].graduados+'</td>');
              $("#tableres").append('<td>'+json.datos[j].desertores+'</td>');
              json.datos[j].desercion=json.datos[j].desercion.replace(/%/g,"");
              json.datos[j].retencion=json.datos[j].retencion.replace(/%/g,"");
              $("#tableres").append('<td>'+json.datos[j].desercion+'</td>');
              $("#tableres").append('<td>'+json.datos[j].retencion+'</td>');
              if(json.datos[j].desercion<=40)
                $("#tableres").append('<td><img id="est" src="/images/verde.png" alt="GREEN" title="Su nivel de Deserción es bueno"></td>');
              else if(json.datos[j].desercion>40 && json.datos[j].desercion<=70)
                $("#tableres").append('<td><img id="est" src="/images/orange.PNG" alt="ORANGE" title="Su nivel de Desercion esta subiendo demasiado"></td>');
              else
                $("#tableres").append('<td><img id="est" src="/images/red.PNG" alt="RED" title="Su nivel de Desercion en malo "></td>');
            $("#tableres").append('</tr>');
          }
          columnTwoGraph(json.datos,'divgraph1','Desercion por Periodo\n'+json.programa,json.fields[0],json.fields[1],json.fields[2],0,0,"Deserción","Retención");
          lineTwoGraph(json.datos,'divgraph2','Desercion por Periodo\n'+json.programa,json.fields[0],json.fields[1],json.fields[2],"Deserción","Retención");
          gaugesTwoAxesGraph(json.datos[0].desercion,json.datos[0].retencion,'divgraph3')
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
