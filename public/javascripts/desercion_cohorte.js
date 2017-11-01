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
      columnGraph(json.datos.reverse(),'divgraph1','Deserción por Cohorte\n'+json.Programa,json.fields[0],json.fields[1],0,0);
    }
    else if($(this).val() === '2'){
      columnGraph(json.datos.reverse(),'divgraph1','Deserción por Cohorte\n'+json.Programa,json.fields[0],json.fields[1],40,30);
    }
    else if($(this).val() === '3'){
      barGraph(json.datos.reverse(),'divgraph1','Deserción por Cohorte\n'+json.Programa,json.fields[0],json.fields[1],0,0);
    }
    else{
      barGraph(json.datos.reverse(),'divgraph1','Deserción por Cohorte\n'+json.Programa,json.fields[0],json.fields[1],40,30);    }
  });

  // cambia grafica del segundo div
  // se puede tener o de linea o de area
  $("#cgdiv2").change(function () {
    var json = JSON.parse($('#txtjson').val());
    if($(this).val() === '1'){
      lineGraph(json.datos.reverse(),'divgraph2','Deserción por Cohorte\n'+json.Programa,json.fields[0],json.fields[1]);
    }else{
      areaGraph(json.datos.reverse(),'divgraph2','Deserción por Cohorte\n'+json.Programa,json.fields[0],json.fields[1]);
    }
  });
});

function load_start(){
  // alert("hola1")
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
       for (var i = json.count-1; i >=0; i--) {
         $("#tableres").append('<tr>');
           $("#tableres").append('<td>'+json.datos[i].periodo+'</td>');
           $("#tableres").append('<td>'+json.datos[i].porcentaje+'</td>');
           json.datos[i].porcentaje=json.datos[i].porcentaje.replace(/%/g,"");
           json.datos[i].porcentaje = parseFloat(json.datos[i].porcentaje);
           //----------------------------------------------------------------------
          //--Verificación y muestra de etiquetas de estado de los KPI's en función de la meta a lo largo de los años---------------------------------------------------------------------------------------------------------------
          // condiciones para insertar el estado rojo verde o amarillo segun el estado de meta y segun los rangos establecidos en los manuales
          //en caso de que el simbolo del rango adecuado sea '= '
          if(json.datos[i].sim_Rango_A === '= '){
            if(json.datos[i].porcentaje == json.datos[i].num_Rango_A){
              $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Deserción se esta alejando de la meta('+json.datos[i].porcentaje+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
            }
            else if(json.datos[i].sim_Rango_MA === '> '){
              if(json.datos[i].porcentaje > json.datos[i].num_Rango_MA){
                $("#tableres").append('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta del Nivel de Deserción Alcanzada ('+json.datos[i].porcentaje+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
              }
              else{
                $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Deserción no alcanzada ('+json.datos[i].porcentaje+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
              }

            }
            else if(json.datos[i].sim_Rango_MA === '< '){
              if(json.datos[i].porcentaje < json.datos[i].num_Rango_MA){
                $("#tableres").append('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta del Nivel de Deserción Alcanzada ('+json.datos[i].porcentaje+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
              }
              else{
                $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Deserción no alcanzada ('+json.datos[i].porcentaje+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');

              }

            }
          }

          //en caso de que el simbolo del rango muy adecuado sea el simbolo de mayor '>'
          else if(json.datos[i].sim_Rango_MA === '> '){
            if(json.datos[i].porcentaje >= json.datos[i].num_Rango_MA){
              $("#tableres").append('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta del Nivel de Deserción Alcanzada ('+json.datos[i].porcentaje+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
            }
            else if(json.datos[i].sim_Rango_A === '> '){
              if(json.datos[i].porcentaje >= json.datos[i].num_Rango_A){
                $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Deserción se esta alejando de la meta('+json.datos[i].porcentaje+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
              }
              else{
                $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Deserción no alcanzada ('+json.datos[i].porcentaje+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');

              }
            }
            else if(json.datos[i].sim_Rango_A === '< ' && json.datos[i].sim_Rango_I === '< ' ){
              if(json.datos[i].porcentaje <= json.datos[i].num_Rango_A && json.datos[i].porcentaje > json.datos[i].num_Rango_I){
                $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Deserción se esta alejando de la meta ('+json.datos[j].Nivel+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
              }
              else if(json.datos[i].porcentaje <= json.datos[i].num_Rango_I){
                $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Deserción no alcanzada ('+json.datos[i].porcentaje+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
              }

            }
          }
          //en caso de que el simbolo del rango muy adecuado sea el simbolo de menor '<'
          else if(json.datos[i].sim_Rango_MA === '< '){
            if(json.datos[i].porcentaje <= json.datos[i].num_Rango_MA){
              $("#tableres").append('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta del Nivel de Deserción Alcanzada ('+json.datos[i].porcentaje+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
            }
            else if(json.datos[i].sim_Rango_A === '> '){
              if(json.datos[i].porcentaje > json.datos[i].num_Rango_A && json.datos[i].porcentaje <= json.datos[i].num_Rango_I ){
                $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Deserción se esta alejando de la meta ('+json.datos[i].porcentaje+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
              }
               else{
                $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Deserción no alcanzada ('+json.datos[i].porcentaje+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');

              }
            }
            else if(json.datos[i].sim_Rango_A === '< '){
              if(json.datos[i].sim_Rango_I === '> '){
                if(json.datos[i].porcentaje <= json.datos[i].num_Rango_A && json.datos[i].porcentaje > json.datos[i].num_Rango_MA){
                  $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Deserción se esta alejando de la meta ('+json.datos[i].porcentaje+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
                }
                else {
                  $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Deserción no alcanzada ('+json.datos[i].porcentaje+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');

                }
              }
            }

          }

          //en caso de que el simbolo del rango muy adecuado sea '= '
          else if(json.datos[i].sim_Rango_MA === '= '){
            if(json.datos[i].porcentaje == json.datos[i].num_Rango_MA){
              $("#tableres").append('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta del Nivel de Deserción Alcanzada ('+json.datos[i].porcentaje+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
            }
            else if(json.datos[i].sim_Rango_A === '> '){
              if(json.datos[i].porcentaje > json.datos[i].num_Rango_A){
                $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Deserción se esta alejando de la meta ('+json.datos[i].porcentaje+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');

              }
              else{
                $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Deserción no alcanzada ('+json.datos[i].porcentaje+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');

              }

            }
            else if(json.datos[i].sim_Rango_A === '< '){
              if(json.datos[i].sim_Rango_I === '< '){
                if(json.datos[i].porcentaje <= json.datos[i].num_Rango_A && json.datos[i].porcentaje > json.datos[i].num_Rango_I){
                  $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Deserción se esta alejando de la meta ('+json.datos[i].porcentaje+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
                }
                else{
                  $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Deserción no alcanzada ('+json.datos[i].porcentaje+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');

                }
              }

              if(json.datos[i].sim_Rango_I === '> '){
                if(json.datos[i].porcentaje <= json.datos[i].num_Rango_A ){
                  $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Deserción se esta alejando de la meta ('+json.datos[i].porcentaje+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
                }
                else{
                  $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Deserción no alcanzada ('+json.datos[i].porcentaje+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');

                }
              }

            }
          }
        //-----------------------------------------------------------------
         $("#tableres").append('</tr>');
       }
      columnGraph(json.datos.reverse(),'divgraph1','Deserción por Cohorte\n'+json.Programa,json.fields[0],json.fields[1],0,0);
      lineGraph(json.datos,'divgraph2','Deserción por Cohorte\n'+json.Programa,json.fields[0],json.fields[1]);
      var titleg="Nivel de Deserción por Cohorte "+ json.datos[json.count-1].periodo +"\n"+ json.Programa
      //semaforo divgraph3
      //toma los datos de los manuales del indicador para graficar el acelerometro

      if(json.datos[json.count-1].sim_Rango_MA == '> ' && json.datos[json.count-1].sim_Rango_I == '< '){

        gaugesGraph(json.datos[json.count-1].porcentaje,divgraph3,'r','y','g',json.datos[json.count-1].num_Rango_I,json.datos[json.count-1].num_Rango_MA, titleg, '%',100);

      }

      else if(json.datos[json.count-1].sim_Rango_MA === '= ' && json.datos[json.count-1].sim_Rango_A == '< ' && json.datos[json.count-1].sim_Rango_A == '> ' ){

        gaugesGraph(json.datos[json.count-1].porcentaje,divgraph3,'r','g','y',json.datos[json.count-1].num_Rango_I,json.datos[json.count-1].num_Rango_MA, titleg, '%',100);

      }

      else if(json.datos[json.count-1].sim_Rango_MA === '= ' && json.datos[json.count-1].sim_Rango_A == '< ' && json.datos[json.count-1].sim_Rango_A == '< ' ){
        //alert('los simbolos para los rangos Adecuado e inadecuado no pueden ser el simbolo menor(<). por ende la grafica del estado del indicador (velocimetro) no se mostrara');
        $("#messageError").html("los simbolos para los rangos Adecuado e inadecuado no pueden ser el simbolo menor(<).");
        $('#myModal').modal('show');

      }

      else{
        gaugesGraph(json.datos[json.count-1].porcentaje,divgraph3,'g','y','r',json.datos[json.count-1].num_Rango_MA,json.datos[json.count-1].num_Rango_I, titleg, '%',100);

      }
      //gaugesGraph(json.datos[json.count-1].porcentaje,'divgraph3','g','y','r',40,70 ,titleg, '%');
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
  var program=$("#lstprog").val(), 
  periodfrom = $("#lstperiod1").val(), 
  periodto = $("#lstperiod2").val();

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
  //el metodo ajax para consulta f(ban){f(ban){f(ban){f(ban){f(ban){asyncronica
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
         load_start();
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
          for (var i = json.count-1; i >=0; i--) {

            $("#tableres").append('<tr>');
              $("#tableres").append('<td>'+json.datos[i].periodo+'</td>');
              $("#tableres").append('<td>'+json.datos[i].porcentaje+'</td>');
              json.datos[i].porcentaje=json.datos[i].porcentaje.replace(/%/g,"");
              json.datos[i].porcentaje = parseFloat(json.datos[i].porcentaje);
              //----------------------------------------------------------------------
              //--Verificación y muestra de etiquetas de estado de los KPI's en función de la meta a lo largo de los años---------------------------------------------------------------------------------------------------------------
              // condiciones para insertar el estado rojo verde o amarillo segun el estado de meta y segun los rangos establecidos en los manuales
              //en caso de que el simbolo del rango adecuado sea '= '
              if(json.datos[i].sim_Rango_A === '= '){
                if(json.datos[i].porcentaje == json.datos[i].num_Rango_A){
                  $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Deserción se esta alejando de la meta ('+json.datos[i].porcentaje+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
                }
                else if(json.datos[i].sim_Rango_MA === '> '){
                  if(json.datos[i].porcentaje > json.datos[i].num_Rango_MA){
                    $("#tableres").append('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta del Nivel de Deserción Alcanzada ('+json.datos[i].porcentaje+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
                  }
                  else{
                    $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Deserción no alcanzada ('+json.datos[i].porcentaje+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
                  }

                }
                else if(json.datos[i].sim_Rango_MA === '< '){
                  if(json.datos[i].porcentaje < json.datos[i].num_Rango_MA){
                    $("#tableres").append('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta del Nivel de Deserción Alcanzada ('+json.datos[i].porcentaje+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
                  }
                  else{
                    $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Deserción no alcanzada ('+json.datos[i].porcentaje+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');

                  }

                }
              }

              //en caso de que el simbolo del rango muy adecuado sea el simbolo de mayor '>'
              else if(json.datos[i].sim_Rango_MA === '> '){
                if(json.datos[i].porcentaje >= json.datos[i].num_Rango_MA){
                  $("#tableres").append('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta del Nivel de Deserción Alcanzada ('+json.datos[i].porcentaje+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
                }
                else if(json.datos[i].sim_Rango_A === '> '){
                  if(json.datos[i].porcentaje >= json.datos[i].num_Rango_A){
                    $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Deserción se esta alejando de la meta('+json.datos[i].porcentaje+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
                  }
                  else{
                    $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Deserción no alcanzada ('+json.datos[i].porcentaje+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');

                  }
                }
                else if(json.datos[i].sim_Rango_A === '< ' && json.datos[i].sim_Rango_I === '< ' ){
                  if(json.datos[i].porcentaje <= json.datos[i].num_Rango_A && json.datos[i].porcentaje > json.datos[i].num_Rango_I){
                    $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Deserción se esta alejando de la meta ('+json.datos[j].porcentaje+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
                  }
                  else if(json.datos[i].porcentaje <= json.datos[i].num_Rango_I){
                    $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Deserción no alcanzada ('+json.datos[i].porcentaje+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
                  }

                }
              }
              //en caso de que el simbolo del rango muy adecuado sea el simbolo de menor '<'
              else if(json.datos[i].sim_Rango_MA === '< '){
                if(json.datos[i].porcentaje <= json.datos[i].num_Rango_MA){
                  $("#tableres").append('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta del Nivel de Deserción Alcanzada ('+json.datos[i].porcentaje+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
                }
                else if(json.datos[i].sim_Rango_A === '> '){
                  if(json.datos[i].porcentaje > json.datos[i].num_Rango_A && json.datos[i].porcentaje <= json.datos[i].num_Rango_I ){
                    $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Deserción se esta alejando de la meta ('+json.datos[i].porcentaje+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
                  }
                  else{
                    $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Deserción no alcanzada ('+json.datos[i].porcentaje+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');

                  }
                }
                else if(json.datos[i].sim_Rango_A === '< '){
                  if(json.datos[i].sim_Rango_I === '> '){
                    if(json.datos[i].porcentaje <= json.datos[i].num_Rango_A && json.datos[i].porcentaje > json.datos[i].num_Rango_MA){
                      $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Deserción se esta alejando de la meta ('+json.datos[i].porcentaje+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
                    }
                    else {
                      $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Deserción no alcanzada ('+json.datos[i].porcentaje+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');

                    }
                  }
                }

              }

              //en caso de que el simbolo del rango muy adecuado sea '= '
              else if(json.datos[i].sim_Rango_MA === '= '){
                if(json.datos[i].porcentaje == json.datos[i].num_Rango_MA){
                  $("#tableres").append('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta del Nivel de Deserción Alcanzada ('+json.datos[i].porcentaje+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
                }
                else if(json.datos[i].sim_Rango_A === '> '){
                  if(json.datos[i].porcentaje > json.datos[i].num_Rango_A){
                    $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Deserción se esta alejando de la meta ('+json.datos[i].porcentaje+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');

                  }
                  else{
                    $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Deserción no alcanzada ('+json.datos[i].porcentaje+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');

                  }

                }
                else if(json.datos[i].sim_Rango_A === '< '){
                  if(json.datos[i].sim_Rango_I === '< '){
                    if(json.datos[i].porcentaje <= json.datos[i].num_Rango_A && json.datos[i].porcentaje > json.datos[i].num_Rango_I){
                      $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Deserción se esta alejando de la meta ('+json.datos[i].porcentaje+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
                    }
                    else{
                      $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Deserción no alcanzada ('+json.datos[i].porcentaje+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');

                    }
                  }

                  if(json.datos[i].sim_Rango_I === '> '){
                    if(json.datos[i].porcentaje <= json.datos[i].num_Rango_A ){
                      $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Deserción se esta alejando de la meta ('+json.datos[i].porcentaje+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
                    }
                    else{
                      $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Deserción no alcanzada ('+json.datos[i].porcentaje+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');

                    }
                  }

                }
              }
            //-----------------------------------------------------------------
            $("#tableres").append('</tr>');
          }
         columnGraph(json.datos.reverse(),'divgraph1','Deserción por Cohorte\n'+json.Programa,json.fields[0],json.fields[1],0,0);
         lineGraph(json.datos,'divgraph2','Deserción por Cohorte\n'+json.Programa,json.fields[0],json.fields[1]);
         var titleg="Nivel de Deserción por Cohorte "+ json.datos[json.count-1].periodo +"\n"+ json.Programa
         //semaforo divgraph3
          //toma los datos de los manuales del indicador para graficar el acelerometro

          if(json.datos[json.count-1].sim_Rango_MA == '> ' && json.datos[json.count-1].sim_Rango_I == '< '){

            gaugesGraph(json.datos[json.count-1].porcentaje,divgraph3,'r','y','g',json.datos[json.count-1].num_Rango_I,json.datos[json.count-1].num_Rango_MA, titleg, '%',100);

          }

          else if(json.datos[json.count-1].sim_Rango_MA === '= ' && json.datos[json.count-1].sim_Rango_A == '< ' && json.datos[json.count-1].sim_Rango_A == '> ' ){

            gaugesGraph(json.datos[json.count-1].porcentaje,divgraph3,'r','g','y',json.datos[json.count-1].num_Rango_I,json.datos[json.count-1].num_Rango_MA, titleg, '%',100);

          }

          else if(json.datos[json.count-1].sim_Rango_MA === '= ' && json.datos[json.count-1].sim_Rango_A == '< ' && json.datos[json.count-1].sim_Rango_A == '< ' ){
            //alert('los simbolos para los rangos Adecuado e inadecuado no pueden ser el simbolo menor(<). por ende la grafica del estado del indicador (velocimetro) no se mostrara');
            $("#messageError").html("los simbolos para los rangos Adecuado e inadecuado no pueden ser el simbolo menor(<).");
            $('#myModal').modal('show');

          }

          else{
            gaugesGraph(json.datos[json.count-1].porcentaje,divgraph3,'g','y','r',json.datos[json.count-1].num_Rango_MA,json.datos[json.count-1].num_Rango_I, titleg, '%',100);

          }
         //gaugesGraph(json.datos[json.count-1].porcentaje,'divgraph3','g','y','r',40,70,titleg, '%');
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