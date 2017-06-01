var now = new Date();//Hora del sistema.
var anhoinicio=now.getFullYear();//formato string año actual
var mesinicio=now.getMonth()+1;//formato string mes actual
var diainicio=now.getDate();//formato string día actual

$(document).ready(function(){
  Load_Start();//carga tabla y gráficos a partir de datos almacenados anteriormente
  Load_Accredited();//carga tabla-menú de programas acreditados al año actual
  Load_Not_Accredited();//carga tabla-menú de programas no acreditados al año actual
  Load_Year_List();//carga menú desplegable de años para el formulario de filtro

  //carga datos y gráficos a partir del filtro de años realizado
  $("#frmfilter").submit(function(event){
    Load_Filter();
    event.preventDefault();
  });
  //carga datos formulario reacreditar
  $("#frmupdate").submit(function(event){
    Load_Update();
    event.preventDefault();
  });
  //carga datos formulario insertar
  $("#frminsert").submit(function(event){
    Load_Update();
    event.preventDefault();
  });
});

function Load_Start(){//carga tabla y gráficos a partir de datos almacenados anteriormente
  $("#tableres").html('');
  $.ajax({
    type: "GET", //peticion
    url: "consultaAcreditacion", //la url del que realizara la consulta
    dataType : 'json',
    data:{c:1},//señala a consulta general de la tabla de acreditación en datawarehouse
    success : function(json) {
      $("#lblper").html("Indicador Acreditación Alta Calidad años: "+json.rows[json.rowCount-5].Anho+" a "+now.getFullYear());
      for (var i = json.rowCount-1; i >=json.rowCount-5; i--) {
        $("#goal").html("Meta: "+json.rows[i].num_Rango_MA+"% (Acreditados/Total Programas)");
        $("#tableres").append('<tr>');
        $("#tableres").append('<td>'+json.rows[i].Anho+'</td>');
        $("#tableres").append('<td>'+json.rows[i].acreditados+'</td>');
        $("#tableres").append('<td>'+json.rows[i].programas+'</td>');
        $("#tableres").append('<td>'+json.rows[i].razon+'</td>');

        //--Verificación y muestra de etiquetas de estado de los KPI's en función de la meta a lo largo de los años---------------------------------------------------------------------------------------------------------------
        // condiciones para insertar el estado rojo verde o amarillo segun el estado de meta y segun los rangos establecidos en los manuales
        //en caso de que el simbolo del rango adecuado sea '= '
        if(json.rows[i].sim_Rango_A === '= '){
          if(json.rows[i].razon == json.rows[i].num_Rango_A){
            $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta de Acreditación en Alta Calidad de Programas Académicos está bajando ('+json.rows[i].razon+'% de '+json.rows[i].num_Rango_MA+'%)"></td>');
          }
          else if(json.rows[i].sim_Rango_MA === '> '){
            if(json.rows[i].razon > json.rows[i].num_Rango_MA){
              $("#tableres").append('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta de Acreditación en Alta Calidad de Programas Académicos alcanzada ('+json.rows[i].razon+'% de '+json.rows[i].num_Rango_MA+'%)"></td>');
            }
            else{
              $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta de Acreditación en Alta Calidad de Programas Académicos no alcanzada ('+json.rows[i].razon+'% de '+json.rows[i].num_Rango_MA+'%)"></td>');
            }

          }
          else if(json.rows[i].sim_Rango_MA === '< '){
            if(json.rows[i].razon < json.rows[i].num_Rango_MA){
              $("#tableres").append('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta de Acreditación en Alta Calidad de Programas Académicos alcanzada ('+json.rows[i].razon+'% de '+json.rows[i].num_Rango_MA+'%)"></td>');
            }
            else{
              $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta de Acreditación en Alta Calidad de Programas Académicos no alcanzada ('+json.rows[i].razon+'% de '+json.rows[i].num_Rango_MA+'%)"></td>');

            }

          }
        }

        //en caso de que el simbolo del rango muy adecuado sea el simbolo de mayor '>'
        else if(json.rows[i].sim_Rango_MA === '> '){
          if(json.rows[i].razon >= json.rows[i].num_Rango_MA){
            $("#tableres").append('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta de Acreditación en Alta Calidad de Programas Académicos alcanzada ('+json.rows[i].razon+'% de '+json.rows[i].num_Rango_MA+'%)"></td>');
          }
          else if(json.rows[i].sim_Rango_A === '> '){
            if(json.rows[i].razon >= json.rows[i].num_Rango_A){
              $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta de Acreditación en Alta Calidad de Programas Académicos está bajando ('+json.rows[i].razon+'% de '+json.rows[i].num_Rango_MA+'%)"></td>');
            }
            else{
              $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta de Acreditación en Alta Calidad de Programas Académicos no alcanzada ('+json.rows[i].razon+'% de '+json.rows[i].num_Rango_MA+'%)"></td>');

            }
          }
          else if(json.rows[i].sim_Rango_A === '< ' && json.rows[i].sim_Rango_I === '< ' ){
            if(json.rows[i].razon <= json.rows[i].num_Rango_A && json.rows[i].razon > json.rows[i].num_Rango_I){
              $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta de Acreditación en Alta Calidad de Programas Académicos está bajando ('+json.rows[j].razon+'% de '+json.rows[i].num_Rango_MA+'%)"></td>');
            }
            else if(json.rows[i].razon <= json.rows[i].num_Rango_I){
              $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta de Acreditación en Alta Calidad de Programas Académicos no alcanzada ('+json.rows[i].razon+'% de '+json.rows[i].num_Rango_MA+'%)"></td>');
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
        if(json.rows[i].sim_Rango_MA === '= '){
          if(json.rows[i].razon == json.rows[i].num_Rango_MA){
            $("#tableres").append('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta de Acreditación en Alta Calidad de Programas Académicos alcanzada ('+json.rows[i].razon+'% de '+json.rows[i].num_Rango_MA+'%)"></td>');
          }
          else if(json.rows[i].sim_Rango_A === '> '){
            if(json.rows[i].razon > json.rows[i].num_Rango_A){
              $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta de Acreditación en Alta Calidad de Programas Académicos está bajando ('+json.rows[i].razon+'% de '+json.rows[i].num_Rango_MA+'%)"></td>');

            }
            else{
              $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta de Acreditación en Alta Calidad de Programas Académicos no alcanzada ('+json.rows[i].razon+'% de '+json.rows[i].num_Rango_MA+'%)"></td>');

            }

          }
          else if(json.rows[i].sim_Rango_A === '< '){
            if(json.rows[i].sim_Rango_I === '< '){
              if(json.rows[i].razon <= json.rows[i].num_Rango_A && json.rows[i].razon > json.rows[i].num_Rango_I){
                $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta de Acreditación en Alta Calidad de Programas Académicos está bajando ('+json.rows[i].razon+'% de '+json.rows[i].num_Rango_MA+'%)"></td>');
              }
              else{
                $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta de Acreditación en Alta Calidad de Programas Académicos no alcanzada ('+json.rows[i].razon+'% de '+json.rows[i].num_Rango_MA+'%)"></td>');

              }
            }

            if(json.rows[i].sim_Rango_I === '> '){
              if(json.rows[i].razon <= json.rows[i].num_Rango_A ){
                $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta de Acreditación en Alta Calidad de Programas Académicos está bajando ('+json.rows[i].razon+'% de '+json.rows[i].num_Rango_MA+'%)"></td>');
              }
              else{
                $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta de Acreditación en Alta Calidad de Programas Académicos no alcanzada ('+json.rows[i].razon+'% de '+json.rows[i].num_Rango_MA+'%)"></td>');

              }
            }

          }
        }
      //-----------------------------------------------------------------
        $("#tableres").append('</tr>');
      }

      //--Filtra gráficas a 5 años-----------------------------
      var datarray=[];
      for (var i = json.rowCount-5; i < json.rowCount; i++) {
        var d ={
          "razon": json.rows[i].razon,
          "Anho": json.rows[i].Anho,
          "acreditados": json.rows[i].acreditados,
          "programas": json.rows[i].programas
        };
        datarray.push(d);
      }
      //-------------------------------------------------------

      $("#graph1").change(function () {
        if($(this).val() === '1'){
          columnGraph(datarray,'divgraph1','Nivel de Acreditación \n',json.fields[0].name,json.fields[3].name,0,0);
        }
        if($(this).val() === '2'){
          columnGraph(datarray,'divgraph1','Nivel de Acreditación \n',json.fields[0].name,json.fields[3].name,40,30);
        }
        else if($(this).val() === '3'){
          lineGraph(datarray,'divgraph1','Nivel de Acreditación \n',json.fields[0].name,json.fields[3].name);
        }
        else if($(this).val() === '4'){
          areaGraph(datarray,'divgraph1','Nivel de Acreditación \n',json.fields[0].name,json.fields[3].name);
        }
        else if($(this).val() === '5'){
          barGraph(datarray,'divgraph1','Nivel de Acreditación \n',json.fields[0].name,json.fields[3].name,0,0);
        }
        else if($(this).val() === '6'){
          barGraph(datarray,'divgraph1','Nivel de Acreditación \n',json.fields[0].name,json.fields[3].name,40,30);
        }
      });
      $("#graph2").change(function () {
        if($(this).val() === '1'){
          columnTwoGraph(datarray,'divgraph2','Programas Acreditados\n vs\n Total de Programas Pregrado',json.fields[0].name,json.fields[1].name,json.fields[2].name,0,0,"Programas Acreditados","Total Programas");
        }
        else if($(this).val() === '2'){
          columnTwoGraph(datarray,'divgraph2','Programas Acreditados\n vs\n Total de Programas Pregrado',json.fields[0].name,json.fields[1].name,json.fields[2].name,40,30,"Programas Acreditados","Total Programas");
        }
        else if($(this).val() === '3'){
          lineTwoGraph(datarray,'divgraph2','Programas Acreditados\n vs\n Total de Programas Pregrado',json.fields[0].name,json.fields[1].name,json.fields[2].name,"Programas Acreditados","Total Programas");
        }
        else if($(this).val() === '4'){
          barTwoGraph(datarray,'divgraph2','Programas Acreditados\n vs\n Total de Programas Pregrado',json.fields[0].name,json.fields[1].name,json.fields[2].name,0,0,"Programas Acreditados","Total Programas");
        }
        else if($(this).val() === '5'){
          barTwoGraph(datarray,'divgraph2','Programas Acreditados\n vs\n Total de Programas Pregrado',json.fields[0].name,json.fields[1].name,json.fields[2].name,40,30,"Programas Acreditados","Total Programas");
        }
      });
      columnGraph(datarray,'divgraph1','Nivel de Acreditación \n',json.fields[0].name,json.fields[3].name,40,30);

      columnTwoGraph(datarray,'divgraph2','Programas Acreditados\n vs\n Total de Programas Pregrado',json.fields[0].name,json.fields[1].name,json.fields[2].name,40,30,"Programas Acreditados","Total Programas");
      //semaforo divgraph3
      //toma los datos de los manuales del indicador para graficar el acelerometro

      if(json.rows[json.rowCount-1].sim_Rango_MA == '< ' && json.rows[json.rowCount-1].sim_Rango_I == '> '){

        gaugesGraph(json.rows[json.rowCount-1].razon,'divgraph3','g','y','r',json.rows[json.rowCount-1].num_Rango_MA,json.rows[json.rowCount-1].sim_Rango_I, 'Acreditación \n Alta Calidad', '%');

      }
      else if(json.rows[json.rowCount-1].sim_Rango_MA === '= ' && json.rows[json.rowCount-1].sim_Rango_A == '< ' && json.rows[json.rowCount-1].sim_Rango_A == '> ' ){

        gaugesGraph(json.rows[json.rowCount-1].razon,'divgraph3','y','g','r',json.rows[json.rowCount-1].num_Rango_I,json.rows[json.rowCount-1].num_Rango_MA, 'Acreditación \n Alta Calidad', '%');

      }

      else if(json.rows[json.rowCount-1].sim_Rango_MA === '= ' && json.rows[json.rowCount-1].sim_Rango_A == '< ' && json.rows[json.rowCount-1].sim_Rango_A == '< ' ){

        alert('los simbolos para los rangos Adecuado e inadecuado no pueden ser el simbolo menor(<). por ende la grafica del estado del indicador (velocimetro) no se mostrara');

      }
      else {

        gaugesGraph(json.rows[json.rowCount-1].razon,'divgraph3','r','y','g',json.rows[json.rowCount-1].num_Rango_I,json.rows[json.rowCount-1].num_Rango_MA,'Acreditación \n Alta Calidad', '%');

      }
    }
  });
}

function Load_Accredited(){//carga tabla-menú de programas acreditados actualmente
  $("#tableresprogram").html('');
  $.ajax({
    type: "GET", //peticion
    url: "consultaAcreditacion", //la url del que realizara la consulta
    dataType : 'json',
    data:{c:2,flag:1},//señala a consulta general de programas acreditados activos en public
    success : function(json) {
      $("#anhoactual").html('<h6>Programas Acreditados en Alta Calidad al año '+now.getFullYear()+'</h>');
      for (var j = json.rowCount-1; j >=0; j--) {
        $("#tableresprogram").append('<tr>');
        var codigo=parseInt(json.rows[j].programa);

        //-formato especial a string para formulario de entrada por defecto de fecha inicio de acreditación-----------
        var inicio=new Date(json.rows[j].inicioacreditacion);
        var anhoinicio=inicio.getFullYear();
        var mesinicio=inicio.getMonth()+1;
        var diainicio=inicio.getDate();
        //------------------------------------------------------------------------------------------------------------

        var anhofin=inicio.setFullYear(anhoinicio+json.rows[j].periodo);//se obtiene el año de finalización de
                                                                        //acreditación del programa
        var resto = inicio.getTime()-now.getTime();//diferencia de tiempo entre fecha finalización acreditación y
                                                    //fecha actual del sistema
        var intervalo = Math.floor(resto/(1000*60*60*24));//formato a días de la diferencia de tiempo entre
                                                          //fecha finalización acreditación y fecha actual del sistema
        var periodo = 365*json.rows[j].periodo;//formato a años del periodo de duración del programa acreditado

        //--Verificación y muestra de etiquetas de estado de los programas acreditados en función de días restantes de expiración--------------------------------------------------------------------------------------------
        if(intervalo<0)
          Supr_Accreditation(json.rows[j].programa);//desactiva programa acreditado si este ya expiró
        else {
          $("#tableresprogram").append('<td>'+json.rows[j].abreviatura+'</td>');

          //--Verificación y muestra de etiquetas de expiración de acreditación de cada programa por días--------------------------------------------------------------------------------------------------------------------
          if (intervalo>0 && intervalo<=365){
            $("#tableresprogram").append('<td><img id="est" src="/images/red.svg" alt="RED" title="Acreditación a punto de expirar en '+intervalo+' días"></td>');
            $("#tableresprogram").append('<td style="border: inset 0pt"><span class="btn btn-warning btn-small">'+
                                              '<a style=, onCLick="opendivupdate('+codigo+','+diainicio+','+mesinicio+','+anhoinicio+','+json.rows[j].periodo+',1)">'+'<img title="ReAcreditar" alt="ReAcreditar" /></a></span></td>');//carga formulario de actualización de acreditacion programa
            if(intervalo=== 365){
              alert('enviar mensaje con codig programa');
            }
          }
          else if(intervalo>365 && intervalo<=730){
            $("#tableresprogram").append('<td><img id="est" src="/images/orange.svg" alt="ORANGE" title="Acreditado hasta dentro de '+intervalo+' días"></td>');
            $("#tableresprogram").append('<td style="border: inset 0pt">');}
          else{
            $("#tableresprogram").append('<td><img id="est" src="/images/verde.svg" alt="GREEN" title="Acreditado"></td>');
            $("#tableresprogram").append('<td style="border: inset 0pt">');
          }
          //----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        }
        $("#tableresprogram").append('</tr>');
       }
   }
 });
}

function Load_Not_Accredited(){//carga tabla-menú de programas no acreditados al año actual
  $("#tableresprogram2").html('');
  $.ajax({
    type: "GET",
    url: "consultaAcreditacion",
    dataType : 'json',
    data:{c:3,flag:1},//señala a consulta excepcion de programas no acreditados
    success : function(json) {
      $("#anhoactual2").html('<h6>Programas No Acreditados al año '+now.getFullYear()+'</h>');
      for (var j = json.rowCount-1; j >=0; j--) {
        $("#tableresprogram2").append('<tr>');
        var codigo=parseInt(json.rows[j].codigo);
        $("#tableresprogram2").append('<td>'+json.rows[j].abreviatura+'</td>');
        $("#tableresprogram2").append('<td"><span class="btn btn-success btn-small"><a onCLick="opendivupdate('+codigo+','+diainicio+','+mesinicio+','+anhoinicio+',0,0)"><img title="Acreditar" alt="Acreditar" /></a></span></td>');//carga formulario de actualización de acreditacion programa
        $("#tableresprogram2").append('</tr>');
      }
   }
 });
}

function Load_Year_List(){//carga menú desplegable de años para el formulario de filtro
   $.ajax({
    type: "GET",
    url: "consultaAcreditacion",
    dataType : 'json',
    data:{c:1},//señala a consulta general de la tabla de acreditación en datawarehouse
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

function Load_Filter(){//valida y carga filtro de años a consulta KPI de acreditación
  var ban = true;
  //se obtiene los valores de las input en variables
  var yearfrom = $("#lstanho1").val(), yearto = $("#lstanho2").val();
  if(yearfrom==0 || yearto==0) {//validación para falta de selección de años
    ban=false;
    $("#messageError").html("Seleccione una opción de cada lista");
    $('#myModal').modal('show');
  }
  else if(yearfrom==yearto  && yearfrom!=0 && yearto!=0){//validación para selección de años iguales
    ban=false;
    $("#messageError").html("No seleccione el mismo año dos veces");
    $('#myModal').modal('show');
  }
  else if(yearfrom>yearto && yearto!=0){
    var aux = yearfrom;
    yearfrom=yearto;
    yearto=aux;
  }

  //se coloca los datos del form en el formato adecuado para enviar al server
  var formData = {
    'yearfrom': yearfrom,
    'yearto':yearto
  };
  //el metodo ajax para consulta asyncronica
  if(ban){
    $.ajax({
      type: "post",
      url: "consultaFiltradaAcreditacion",//señala a consulta filtrada por años de la tabla de acreditación en datawarehouse
      data : formData,
      dataType : 'json',
      success : function(json) {
        $("#lblper").html("Indicador Acreditación Alta Calidad años: "+json.datos[0].Anho+" a "+json.datos[json.count-1].Anho);
        $("#graph2").change(function () {
          if($(this).val() === '1'){
            columnTwoGraph(json.datos,'divgraph2','Programas Acreditados\n vs\n Total de Programas Pregrado',json.fieldstwo[0],json.fieldstwo[1],json.fieldstwo[2],0,0,"Programas Acreditados","Total Programas");
          }
          else if($(this).val() === '2'){
            columnTwoGraph(json.datos,'divgraph2','Programas Acreditados\n vs\n Total de Programas Pregrado',json.fieldstwo[0],json.fieldstwo[1],json.fieldstwo[2],40,30,"Programas Acreditados","Total Programas");
          }
          else if($(this).val() === '3'){
            lineTwoGraph(json.datos,'divgraph2','Programas Acreditados\n vs\n Total de Programas Pregrado',json.fieldstwo[0],json.fieldstwo[1],json.fieldstwo[2],"Programas Acreditados","Total Programas");
          }
          else if($(this).val() === '4'){
            barTwoGraph(json.datos,'divgraph2','Programas Acreditados\n vs\n Total de Programas Pregrado',json.fieldstwo[0],json.fieldstwo[1],json.fieldstwo[2],0,0,"Programas Acreditados","Total Programas");
          }
          else if($(this).val() === '5'){
            barTwoGraph(json.datos,'divgraph2','Programas Acreditados\n vs\n Total de Programas Pregrado',json.fieldstwo[0],json.fieldstwo[1],json.fieldstwo[2],40,30,"Programas Acreditados","Total Programas");
          }
        });
        columnTwoGraph(json.datos,'divgraph2','Programas Acreditados\n vs\n Total de Programas Pregrado',json.fieldstwo[0],json.fieldstwo[1],json.fieldstwo[2],40,30,"Programas Acreditados","Total Programas");

        //semaforo divgraph3
        //toma los datos de los manuales del indicador para graficar el acelerometro

        if(json.rows[json.rowCount-1].sim_Rango_MA == '< ' && json.rows[json.rowCount-1].sim_Rango_I == '> '){

          gaugesGraph(json.rows[json.rowCount-1].razon,'divgraph3','g','y','r',json.rows[json.rowCount-1].num_Rango_MA,json.rows[json.rowCount-1].sim_Rango_I, 'Acreditación \n Alta Calidad', '%');

        }
        else if(json.rows[json.rowCount-1].sim_Rango_MA === '= ' && json.rows[json.rowCount-1].sim_Rango_A == '< ' && json.rows[json.rowCount-1].sim_Rango_A == '> ' ){

          gaugesGraph(json.rows[json.rowCount-1].razon,'divgraph3','y','g','r',json.rows[json.rowCount-1].num_Rango_I,json.rows[json.rowCount-1].num_Rango_MA, 'Acreditación \n Alta Calidad', '%');

        }

        else if(json.rows[json.rowCount-1].sim_Rango_MA === '= ' && json.rows[json.rowCount-1].sim_Rango_A == '< ' && json.rows[json.rowCount-1].sim_Rango_A == '< ' ){

          alert('los simbolos para los rangos Adecuado e inadecuado no pueden ser el simbolo menor(<). por ende la grafica del estado del indicador (velocimetro) no se mostrara');

        }
        else {

          gaugesGraph(json.rows[json.rowCount-1].razon,'divgraph3','r','y','g',json.rows[json.rowCount-1].num_Rango_I,json.rows[json.rowCount-1].num_Rango_MA,'Acreditación \n Alta Calidad', '%');

        }
      }
    });
  }
  closedivfilter();
}

//funciones para efectos graficos de la app
function opendivfilter(){
  $("#divfilter").modal('show');
}

function closedivfilter(){
  $("#divfilter").modal('hide');
}

function Load_Update(){//carga datos obtenidos del formulario de ingreso de programa
  //se obtiene los valores de las input en variables
  var codigo = $("#cod1").val(), inicio= $("#ini1").val(), periodo = $("#per1").val(), reacredited = $("#flag1").val();
  if (reacredited) Supr_Accreditation(codigo);//desactiva programa acreditado si este ya expiró
  //se coloca los datos del form en el formato adecuado para enviar al server
  var formData = {
    'codigo': codigo,
    'inicio': inicio,
    'periodo': periodo
  };
  $.ajax({
      type: "post", //el el tipo de peticion puede ser GET y POsT
      url: "actualizaAltaCalidad", //señala a inserción de datos generales de programa a acreditarse en public
      data : formData,
      dataType : 'json',
      success : function(json) {
      }
  });
  Search_Year_KPI(inicio);//busca la existencia de otros registros de año en función de la
                          //fecha de inicio del programa recién acreditado en datawarehouse
  closedivupdate();
}

function opendivupdate(cod,iniday,inimonth,iniyear,per,flag){//carga formulario de ingreso-actualizacion de programa
  if(cod<100) cod='0'+cod;
  if(iniday<10) iniday='0'+iniday;
  if(inimonth<10) inimonth='0'+inimonth;
  $("#flag").html('<input type="hidden" id="flag1" value='+flag+' class="form-control" readonly>');
  $("#cod").html('<input type="text" id="cod1" value='+cod+' class="form-control" readonly>');
  if(flag==0)
    $("#ini").html('<td data-provide="datepicker" data-date-language="es"><input type="text" id="ini1" value='+iniday+'/'+inimonth+'/'+(iniyear+per)+' class="form-control" required></td>');
  else
    $("#ini").html('<td data-provide="datepicker" data-date-language="es" data-date-start-date='+iniday+'/'+inimonth+'/'+(iniyear+per)+'><input type="text" id="ini1" value='+iniday+'/'+inimonth+'/'+(iniyear+per)+' class="form-control" required></td>');
  if(per==0)
    $("#per").html('<input type="number" pattern="[1-9]" id="per1" value='+1+' min="1" max="9" class="form-control" required>');
  else
    $("#per").html('<input type="number" pattern="[1-9]" id="per1" value='+per+' min="1" max="9" class="form-control" required>');
  $("#divupdate").modal('show');
}

function closedivupdate(cod,iniday,inimonth,iniyear,per){
  $("#divupdate").modal('hide');
}

function hidenmodal(){
    $("#myModal").modal('hide');
    $("#divfilter").modal('show');
}

function Supr_Accreditation(cod){//desactiva programa acreditado si este ya expiró
  var formData = {
    'codigo': cod
  };
  $.ajax({
      type: "post",
      url: "desactivaAltaCalidad",
      data : formData,//señala a actualización a estado de inactivo de programa expirado en public
      dataType : 'json',
      success : function(json) {
      }
  });
}

function Search_Year_KPI(fec){//busca la existencia de otros registros de año en función de la
                          //fecha de inicio del programa recién acreditado en datawarehouse
  $.ajax({
      type: "get",
      url: "consultaAcreditacion",
      data : {c:4,'anho': fec},//señala a consulta de existencia de KPI en función del año
      dataType : 'json',
      success : function(json) {
        if(json.rowCount==0) Ins_KPI(fec)//ingresa nuevo kpi en función de primer programa acreditado en el año
        else Upd_KPI(fec);//actualiza kpi en presencia de más de un programa acreditado ya existente en ese año
      }
  });
}

function Ins_KPI(anho){//ingresa nuevo kpi en función de primer programa acreditado en el año
  $.ajax({
      type: "get",
      url: "actualizaKPIAcreditacion",
      data : {c:1,'anho': anho, 'flag': 1},//señala a inserción en datawarehouse
      dataType : 'json',
      success : function(json) {
        Load_Start();
        Load_Accredited();
        Load_Not_Accredited();
      }
  });
}

function Upd_KPI(anho){//actualiza kpi en presencia de más de un programa acreditado ya existente en ese año
  $.ajax({
      type: "get",
      url: "actualizaKPIAcreditacion", //la url del que realizara la consulta
      data : {c:2,'anho': anho, 'flag': 1},////señala a actualización en datawarehouse
      dataType : 'json',
      success : function(json) {
        Load_Start();
        Load_Accredited();
        Load_Not_Accredited();
      }
  });
}
