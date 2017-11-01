$(document).ready(function(){
  //invoca la funcion cargar programas
  Load_Fist_time();
  Load_Programs_Lst();
  //solo queda el valor de Seleccionar periodo en las listas
  $("#lstanho1").append('<option value="0" selected>Seleccionar Año</option>');
  $("#lstanho2").append('<option value="0" selected>Seleccionar Año</option>');
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
      columnGraph(json.datos,'divgraph1','Nivel de Satisfacción \n'+json.Programa,json.fields[0],json.fields[1],0,0);
    }
    else if($(this).val() === '2'){
      columnGraph(json.datos,'divgraph1','Nivel de Satisfacción \n'+json.Programa,json.fields[0],json.fields[1],40,30);
    }
    else if($(this).val() === '3'){
      barGraph(json.datos,'divgraph1','Nivel de Satisfacción \n'+json.Programa,json.fields[0],json.fields[1],0,0);
    }
    else if($(this).val() === '4'){
      barGraph(json.datos,'divgraph1','Nivel de Satisfacción \n'+json.Programa,json.fields[0],json.fields[1],40,30);
    }
  });

  // cambia grafica del segundo div
  // se puede tener o de linea o de area
  //$("input[name=cgdiv2]").click(function () {

  $("#cgdiv2").change(function () {
    var json = JSON.parse($('#txtjson').val());
    if($(this).val() === '1'){
      lineGraph(json.datos,'divgraph2','Nivel de Satisfacción \n'+json.Programa,json.fields[0],json.fields[1]);
    }else{
      areaGraph(json.datos,'divgraph2','Nivel de Satisfacción \n'+json.Programa,json.fields[0],json.fields[1]);
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
     $("#lstprog").append('<option selected value="'+
     '0'+'">'
     +'Seleccione Programa'
     +'</option>');
     for (var i = 0; i < json.rowCount; i++) {
         $("#lstprog").append('<option value="'+
         json.rows[i].Programa+'">'
         +json.rows[i].nombre
         +'</option>');
     }
   }
 });
}

function Load_Year_List(){
  $("#lstanho1").html("");
  $("#lstanho2").html("");
   $.ajax({
    type: "get", //el el tipo de peticion puede ser GET y POsT
    url: "consultaFiltros", //la url del que realizara la consulta
    dataType : 'json',
    data:{
      c:2,
      'program':$("#lstprog").val()
    },//se envia un valor para despues coneste saber que consulta
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
  $('#cgdiv1 > option[value="0"]').attr('selected', 'selected');
  $('#cgdiv2 > option[value="0"]').attr('selected', 'selected');
  $("#tableres").html('');
  $("#divgraph1").html('');
  $("#divgraph2").html('');
  $("#divgraph3").html('');
  $.ajax({
   type: "GET", //el el tipo de peticion puede ser GET y POsT
   url: "consulta", //la url del que realizara la consulta
   dataType : 'json',
   success : function(json) {
    $("#txtjson").val(JSON.stringify(json));
    $("#programa").html(json.Programa);
    for (var i = 0; i <json.count; i++) {
      $("#tableres").append('<tr>');
        $("#tableres").append('<td>'+json.datos[i].Nivel+'</td>');
        $("#tableres").append('<td>'+json.datos[i].Anho+'</td>');
        json.datos[i].Nivel=json.datos[i].Nivel.replace(/%/g,"");
        json.datos[i].Nivel=parseFloat(json.datos[i].Nivel);
        //----------------------------------------------------------------------
        //--Verificación y muestra de etiquetas de estado de los KPI's en función de la meta a lo largo de los años---------------------------------------------------------------------------------------------------------------
        // condiciones para insertar el estado rojo verde o amarillo segun el estado de meta y segun los rangos establecidos en los manuales
        //en caso de que el simbolo del rango adecuado sea '= '
        if(json.datos[i].sim_Rango_A === '= '){
          if(json.datos[i].Nivel == json.datos[i].num_Rango_A){
            $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Satisfacción está bajando ('+json.datos[i].Nivel+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
          }
          else if(json.datos[i].sim_Rango_MA === '> '){
            if(json.datos[i].Nivel > json.datos[i].num_Rango_MA){
              $("#tableres").append('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta del Nivel de Satisfacción Alcanzada ('+json.datos[i].Nivel+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
            }
            else{
              $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Satisfacción no alcanzada ('+json.datos[i].Nivel+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
            }

          }
          else if(json.datos[i].sim_Rango_MA === '< '){
            if(json.datos[i].Nivel < json.datos[i].num_Rango_MA){
              $("#tableres").append('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta del Nivel de Satisfacción Alcanzada ('+json.datos[i].Nivel+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
            }
            else{
              $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Satisfacción no alcanzada ('+json.datos[i].Nivel+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');

            }

          }
        }

        //en caso de que el simbolo del rango muy adecuado sea el simbolo de mayor '>'
        else if(json.datos[i].sim_Rango_MA === '> '){
          if(json.datos[i].Nivel >= json.datos[i].num_Rango_MA){
            $("#tableres").append('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta del Nivel de Satisfacción Alcanzada ('+json.datos[i].Nivel+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
          }
          else if(json.datos[i].sim_Rango_A === '> '){
            if(json.datos[i].Nivel >= json.datos[i].num_Rango_A){
              $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Satisfacción está bajando('+json.datos[i].Nivel+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
            }
            else{
              $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Satisfacción no alcanzada ('+json.datos[i].Nivel+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');

            }
          }
          else if(json.datos[i].sim_Rango_A === '< ' && json.datos[i].sim_Rango_I === '< ' ){
            if(json.datos[i].Nivel <= json.datos[i].num_Rango_A && json.datos[i].Nivel > json.datos[i].num_Rango_I){
              $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Satisfacción está bajando ('+json.datos[j].Nivel+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
            }
            else if(json.datos[i].Nivel <= json.datos[i].num_Rango_I){
              $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Satisfacción no alcanzada ('+json.datos[i].Nivel+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
            }

          }
        }
        //en caso de que el simbolo del rango muy adecuado sea el simbolo de menor '<'
        else if(json.datos[i].sim_Rango_MA === '< '){
          if(json.datos[i].Nivel <= json.datos[i].num_Rango_MA){
            $("#tableres").append('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta del Nivel de Satisfacción Alcanzada ('+json.datos[i].Nivel+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
          }
          else if(json.datos[i].sim_Rango_A === '> '){
            if(json.datos[i].Nivel > json.datos[i].num_Rango_A && json.datos[i].Nivel <= json.datos[i].num_Rango_I ){
              $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Deserción se esta alejando de la meta ('+json.datos[i].Nivel+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
            }
              else{
              $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Deserción no alcanzada ('+json.datos[i].Nivel+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');

            }
          }
          else if(json.datos[i].sim_Rango_A === '< '){
            if(json.datos[i].sim_Rango_I === '> '){
              if(json.datos[i].Nivel <= json.datos[i].num_Rango_A && json.datos[i].Nivel > json.datos[i].num_Rango_MA){
                $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Deserción se esta alejando de la meta ('+json.datos[i].Nivel+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
              }
              else {
                $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Deserción no alcanzada ('+json.datos[i].Nivel+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');

              }
            }
          }

        }

        //en caso de que el simbolo del rango muy adecuado sea '= '
        if(json.datos[i].sim_Rango_MA === '= '){
          if(json.datos[i].Nivel == json.datos[i].num_Rango_MA){
            $("#tableres").append('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta del Nivel de Satisfacción Alcanzada ('+json.datos[i].Nivel+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
          }
          else if(json.datos[i].sim_Rango_A === '> '){
            if(json.datos[i].Nivel > json.datos[i].num_Rango_A){
              $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Satisfacción está bajando ('+json.datos[i].Nivel+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');

            }
            else{
              $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Satisfacción no alcanzada ('+json.datos[i].Nivel+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');

            }

          }
          else if(json.datos[i].sim_Rango_A === '< '){
            if(json.datos[i].sim_Rango_I === '< '){
              if(json.datos[i].Nivel <= json.datos[i].num_Rango_A && json.datos[i].Nivel > json.datos[i].num_Rango_I){
                $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Satisfacción está bajando ('+json.datos[i].Nivel+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
              }
              else{
                $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Satisfacción no alcanzada ('+json.datos[i].Nivel+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');

              }
            }

            if(json.datos[i].sim_Rango_I === '> '){
              if(json.datos[i].Nivel <= json.datos[i].num_Rango_A ){
                $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Satisfacción está bajando está bajando ('+json.datos[i].Nivel+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
              }
              else{
                $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Satisfacción no alcanzada ('+json.datos[i].Nivel+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');

              }
            }

          }
        }
      //-----------------------------------------------------------------
      $("#tableres").append('</tr>');
    }
    columnGraph(json.datos,'divgraph1','Nivel de Satisfacción \n'+json.Programa,json.fields[0],json.fields[1],0,0);
    lineGraph(json.datos,'divgraph2','Nivel de Satisfacción \n'+json.Programa,json.fields[0],json.fields[1]);
    var titleg="Nivel de Satisfacción "+ json.datos[json.count-1].Anho +"\n"+ json.Programa

     //semaforo divgraph3
      //toma los datos de los manuales del indicador para graficar el acelerometro

      if(json.datos[json.count-1].sim_Rango_MA == '< ' && json.datos[json.count-1].sim_Rango_I == '> '){

        gaugesGraph(json.datos[json.count-1].Nivel,divgraph3,'g','y','r',json.datos[json.count-1].num_Rango_MA,json.datos[json.count-1].num_Rango_I, titleg, '%',100);

      }

      else if(json.datos[json.count-1].sim_Rango_MA === '= ' && json.datos[json.count-1].sim_Rango_A == '< ' && json.datos[json.count-1].sim_Rango_A == '> ' ){

        gaugesGraph(json.datos[json.count-1].Nivel,divgraph3,'y','g','r',json.datos[json.count-1].num_Rango_I,json.datos[json.count-1].num_Rango_MA, titleg, '%',100);

      }

      else if(json.datos[json.count-1].sim_Rango_MA === '= ' && json.datos[json.count-1].sim_Rango_A == '< ' && json.datos[json.count-1].sim_Rango_A == '< ' ){
        //alert('los simbolos para los rangos Adecuado e inadecuado no pueden ser el simbolo menor(<). por ende la grafica del estado del indicador (velocimetro) no se mostrara');
        $("#messageError").html("los simbolos para los rangos Adecuado e inadecuado no pueden ser el simbolo menor(<).");
        $('#myModal').modal('show');

      }

      else{
        gaugesGraph(json.datos[json.count-1].Nivel,divgraph3,'r','y','g',json.datos[json.count-1].num_Rango_I,json.datos[json.count-1].num_Rango_MA, titleg, '%',100);

      }
    //gaugesGraph(json.datos[json.count-1].Nivel,'divgraph3','r','y','g',40,70,titleg, '%');

   }
  });
}

function Load_Filter(){
  //$("#cgc1").attr('checked',true);
  var ban = true;
  //vacea el contenido de la tabla para volver a cargar datos nuevos
  $('#cgdiv1 > option[value="0"]').attr('selected', 'selected');
  $('#cgdiv2 > option[value="0"]').attr('selected', 'selected');
  $("#tableres").html("");
  $("#divgraph1").html("");
  $("#divgraph2").html("");
  $("#divgraph3").html("");
  //se obtiene los valores de las input en variables
  var program = $('#lstprog').val(), 
  yearfrom = $("#lstanho1").val(), 
  yearto = $("#lstanho2").val();

  if(yearfrom>yearto && yearto!=0){
    var aux = yearfrom;
    yearfrom=yearto;
    yearto=aux;
  }else if(yearto>yearfrom && yearfrom == 0){
    yearfrom=yearto;
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
     type: "POST", //el el tipo de peticion puede ser GET y POsT
     url: "consulta", //la url del que realizara la consulta
     data : formData,
     dataType : 'json',
     success : function(json) {
       if(json.Error){
         $("#messageError").html("No existen datos");
         $('#myModal').modal('show');
         Load_Fist_time();
       }else{
         $("#txtjson").val(JSON.stringify(json));
         //recorre el json y se coloca el resultado en la tabla correspondiente
         if(yearfrom!=0){
           if(yearto!=0 && yearfrom!=yearto){
             $("#programa").html(json.Programa+"<br> Periodo: "+yearfrom+" A "+yearto);
           }else{
             $("#programa").html(json.Programa+"<br> Periodo: "+yearfrom);
           }
         }else{
           $("#programa").html(json.Programa);
         }
         for (var i = 0; i <json.count; i++) {
           $("#tableres").append('<tr>');
             $("#tableres").append('<td>'+json.datos[i].Nivel+'</td>');
             $("#tableres").append('<td>'+json.datos[i].Anho+'</td>');
             json.datos[i].Nivel=json.datos[i].Nivel.replace(/%/g,"");
             json.datos[i].Nivel=parseFloat(json.datos[i].Nivel);
            //----------------------------------------------------------------------
            //--Verificación y muestra de etiquetas de estado de los KPI's en función de la meta a lo largo de los años---------------------------------------------------------------------------------------------------------------
            // condiciones para insertar el estado rojo verde o amarillo segun el estado de meta y segun los rangos establecidos en los manuales
            //en caso de que el simbolo del rango adecuado sea '= '
            if(json.datos[i].sim_Rango_A === '= '){
              if(json.datos[i].Nivel == json.datos[i].num_Rango_A){
                $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Satisfacción está bajando ('+json.datos[i].Nivel+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
              }
              else if(json.datos[i].sim_Rango_MA === '> '){
                if(json.datos[i].Nivel > json.datos[i].num_Rango_MA){
                  $("#tableres").append('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta del Nivel de Satisfacción Alcanzada ('+json.datos[i].Nivel+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
                }
                else{
                  $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Satisfacción no alcanzada ('+json.datos[i].Nivel+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
                }

              }
              else if(json.datos[i].sim_Rango_MA === '< '){
                if(json.datos[i].Nivel < json.datos[i].num_Rango_MA){
                  $("#tableres").append('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta del Nivel de Satisfacción Alcanzada ('+json.datos[i].Nivel+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
                }
                else{
                  $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Satisfacción no alcanzada ('+json.datos[i].Nivel+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');

                }

              }
            }

            //en caso de que el simbolo del rango muy adecuado sea el simbolo de mayor '>'
            else if(json.datos[i].sim_Rango_MA === '> '){
              if(json.datos[i].Nivel >= json.datos[i].num_Rango_MA){
                $("#tableres").append('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta del Nivel de Satisfacción Alcanzada ('+json.datos[i].Nivel+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
              }
              else if(json.datos[i].sim_Rango_A === '> '){
                if(json.datos[i].Nivel >= json.datos[i].num_Rango_A){
                  $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Satisfacción está bajando('+json.datos[i].Nivel+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
                }
                else{
                  $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Satisfacción no alcanzada ('+json.datos[i].Nivel+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');

                }
              }
              else if(json.datos[i].sim_Rango_A === '< ' && json.datos[i].sim_Rango_I === '< ' ){
                if(json.datos[i].Nivel <= json.datos[i].num_Rango_A && json.datos[i].Nivel > json.datos[i].num_Rango_I){
                  $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Satisfacción está bajando ('+json.datos[j].Nivel+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
                }
                else if(json.datos[i].Nivel <= json.datos[i].num_Rango_I){
                  $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Satisfacción no alcanzada ('+json.datos[i].Nivel+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
                }

              }
            }
            //en caso de que el simbolo del rango muy adecuado sea el simbolo de menor '<'
            else if(json.datos[i].sim_Rango_MA === '< '){
              if(json.datos[i].Nivel <= json.datos[i].num_Rango_MA){
                s("#tableres").append('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta del Nivel de Satisfacción Alcanzada ('+json.datos[i].Nivel+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
              }
              else if(json.datos[i].sim_Rango_A === '> '){
                if(json.datos[i].Nivel > json.datos[i].num_Rango_A && json.datos[i].Nivel <= json.datos[i].num_Rango_I ){
                  $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Deserción se esta alejando de la meta ('+json.datos[i].Nivel+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
                }
                  else{
                  $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Deserción no alcanzada ('+json.datos[i].Nivel+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');

                }
              }
              else if(json.datos[i].sim_Rango_A === '< '){
                if(json.datos[i].sim_Rango_I === '> '){
                  if(json.datos[i].Nivel <= json.datos[i].num_Rango_A && json.datos[i].Nivel > json.datos[i].num_Rango_MA){
                    $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Deserción se esta alejando de la meta ('+json.datos[i].Nivel+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
                  }
                  else {
                    $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Deserción no alcanzada ('+json.datos[i].Nivel+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');

                  }
                }
              }

            }

            //en caso de que el simbolo del rango muy adecuado sea '= '
            if(json.datos[i].sim_Rango_MA === '= '){
              if(json.datos[i].Nivel == json.datos[i].num_Rango_MA){
                $("#tableres").append('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta del Nivel de Satisfacción Alcanzada ('+json.datos[i].Nivel+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
              }
              else if(json.datos[i].sim_Rango_A === '> '){
                if(json.datos[i].Nivel > json.datos[i].num_Rango_A){
                  $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Satisfacción está bajando ('+json.datos[i].Nivel+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');

                }
                else{
                  $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Satisfacción no alcanzada ('+json.datos[i].Nivel+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');

                }

              }
              else if(json.datos[i].sim_Rango_A === '< '){
                if(json.datos[i].sim_Rango_I === '< '){
                  if(json.datos[i].Nivel <= json.datos[i].num_Rango_A && json.datos[i].Nivel > json.datos[i].num_Rango_I){
                    $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Satisfacción está bajando ('+json.datos[i].Nivel+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
                  }
                  else{
                    $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Satisfacción no alcanzada ('+json.datos[i].Nivel+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');

                  }
                }

                if(json.datos[i].sim_Rango_I === '> '){
                  if(json.datos[i].Nivel <= json.datos[i].num_Rango_A ){
                    $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Satisfacción está bajando está bajando ('+json.datos[i].Nivel+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');
                  }
                  else{
                    $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Satisfacción no alcanzada ('+json.datos[i].Nivel+'% de '+json.datos[i].num_Rango_MA+'%)"></td>');

                  }
                }

              }
            }
          //-----------------------------------------------------------------
           $("#tableres").append('</tr>');
         }

        //se envia los datos a las diferentes graficasque se realizan
        columnGraph(json.datos,'divgraph1','Nivel de Satisfacción \n'+json.Programa,json.fields[0],json.fields[1],40,30);
        lineGraph(json.datos,'divgraph2','Nivel de Satisfacción \n'+json.Programa,json.fields[0],json.fields[1]);
        var titleg="Nivel de Satisfacción "+ json.datos[json.count-1].Anho +"\n"+ json.Programa

        //semaforo divgraph3
        //toma los datos de los manuales del indicador para graficar el acelerometro

        if(json.datos[json.count-1].sim_Rango_MA == '< ' && json.datos[json.count-1].sim_Rango_I == '> '){

          gaugesGraph(json.datos[json.count-1].Nivel,divgraph3,'g','y','r',json.datos[json.count-1].num_Rango_MA,json.datos[json.count-1].num_Rango_I, titleg, '%',100);

        }

        else if(json.datos[json.count-1].sim_Rango_MA === '= ' && json.datos[json.count-1].sim_Rango_A == '< ' && json.datos[json.count-1].sim_Rango_A == '> ' ){

          gaugesGraph(json.datos[json.count-1].Nivel,divgraph3,'y','g','r',json.datos[json.count-1].num_Rango_I,json.datos[json.count-1].num_Rango_MA, titleg, '%',100);

        }

        else if(json.datos[json.count-1].sim_Rango_MA === '= ' && json.datos[json.count-1].sim_Rango_A == '< ' && json.datos[json.count-1].sim_Rango_A == '< ' ){
          alert('los simbolos para los rangos Adecuado e inadecuado no pueden ser el simbolo menor(<). por ende la grafica del estado del indicador (velocimetro) no se mostrara');

        }

        else{
          gaugesGraph(json.datos[json.count-1].Nivel,divgraph3,'r','y','g',json.datos[json.count-1].num_Rango_I,json.datos[json.count-1].num_Rango_MA, titleg, '%',100);

        }
        //gaugesGraph(json.datos[json.count-1].Nivel,'divgraph3','r','y','g',40,70,titleg, '%');

       }
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
