var now = new Date();//Hora del sistema.
var mes=now.getMonth()+1;//formato string mes actual

$(document).ready(function(){
  /*Load_Insert();//Define si muestra o no el formulario
                      //de ingreso de datos tomando en cuenta la fecha de sistema y
                      //anterior entrada*/
  Load_Start();//carga tabla y gráficos a partir de datos almacenados anteriormente
  Load_Department_List();
  //solo queda el valor de Seleccionar año en las listas
  $("#lstanho1").append('<option value="0" selected>Seleccionar Año</option>');
  $("#lstanho2").append('<option value="0" selected>Seleccionar Año</option>');
  Load_Semiannual();
  Load_Year_List();//carga menú desplegable de años para el formulario de filtro

  //carga datos y gráficos a partir del filtro de años realizado
  $("#frmfilter").submit(function(event){
    Load_Filter();
    event.preventDefault();
  });
  //carga datos formulario insertar
  $("#frmupdate").submit(function(event){
    Load_Update();
    event.preventDefault();
  });
});

// function getPDF(){
//   alert('jola')
// }

function Load_Insert(){//Define si muestra o no el formulario
                      //de ingreso de datos tomando en cuenta la fecha de sistema y
                      //anterior entrada
  var anho=now.getFullYear();//formato string año actual
  $('#tabledoctc').html('Registro Semestre ');
  $('#tablest').html('Registro Semestre ');
  if(mes<3){
    $.ajax({
      type: "get",
      url: "consultaDocentesTC",
      dataType : 'json',
      data:{c:4,'anho': anho-1},//señala a la consulta de existencia de datos semestre b del año anterior
      success : function(json) {
        if (json.rowCount) opendivupdate(anho,mes);//si esta condición no se cumple
                                                    //significa que ya está el indicador
                                                    //actualizado a la fecha
        else {
          $('#tabledoctc').append('B de '+anho+' Cierre');
          $('#tablest').append('B de '+anho+' Cierre');
          $('#ndoctc').html('Promedio de Docentes Tiempo Completo: '+json.rows[0].docentes);
          $("#flagdoctc").html('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Número de Docentes Tiempo Completo al día"></td>');
          $('#nest').html(json.rows[0].estudiantes);
          $('#flagest').html('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Número de Estudiantes al día"></td>');//Coloca estado actualizado de estudiantes
        }
      }
    });
  }
  else if(mes>6 && mes<9){
    $.ajax({
      type: "get", //el el tipo de peticion puede ser GET y POsT
      url: "consultaDocentesTC", //la url del que realizara la consulta
      dataType : 'json',
      data:{c:3,'anho': anho},//señala a la consulta de existencia de datos del año en curso
      success : function(json) {
        if (json.rowCount==0) opendivupdate(anho,mes);//si esta condición no se cumple
                                                      //significa que los datos del semestre A
                                                      //ya fueron ingresados
        else {
          $('#tabledoctc').append('A de '+anho+' Corte');
          $('#tablest').append('A de '+anho+' Corte');
          $('#ndoctc').html('Promedio de Docentes Tiempo Completo: '+json.rows[0].docentes);
          $("#flagdoctc").html('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Número de Docentes Tiempo Completo al día"></td>');
          $('#nest').html(json.rows[0].estudiantes);
          $('#flagest').html('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Número de Estudiantes al día"></td>');//Coloca estado actualizado de estudiantes
        }
      }
    });
  }
  else if(mes>=3 && mes<=6){
    $.ajax({
      type: "get", //el el tipo de peticion puede ser GET y POsT
      url: "consultaDocentesTC", //la url del que realizara la consulta
      dataType : 'json',
      data:{c:3,'anho': anho-1},//señala a la consulta de existencia de datos del semestre B del año anterior
      success : function(json) {
        if (json.rowCount!=0) {
          anho=anho-1;
          $('#tabledoctc').append('B de '+anho+' Cierre');
          $('#tablest').append('B de '+anho+' Cierre');
          $('#sem2').html('<input type="hidden" id="sem1" value="B">');
          $('#year2').html('<input type="hidden" id="year1" value='+anho+'>');
          $('#ndoctc').html('Promedio de Docentes Tiempo Completo: '+json.rows[0].docentes);
          $("#flagdoctc").html('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Número de Docentes Tiempo Completo al día"></td>');
          $('#nest').html(json.rows[0].estudiantes);
          $('#flagest').html('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Número de Estudiantes al día"></td>');//Coloca estado actualizado de estudiantes
        }
      }
    });
  }
  else{
    $.ajax({
      type: "get", //el el tipo de peticion puede ser GET y POsT
      url: "consultaDocentesTC", //la url del que realizara la consulta
      dataType : 'json',
      data:{c:4,'anho': anho},//señala a la consulta de existencia de datos del año en curso
      success : function(json) {
        if (json.rowCount!=0) {
          $('#tabledoctc').append('A de '+anho+' Corte');
          $('#tablest').append('A de '+anho+' Corte');
          $('#sem2').html('<input type="hidden" id="sem1" value="B">');
          $('#year2').html('<input type="hidden" id="year1" value='+anho+'>');
          $('#ndoctc').html('Promedio de Docentes Tiempo Completo: '+json.rows[0].docentes);
          $("#flagdoctc").html('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Número de Docentes Tiempo Completo al día"></td>');
          $('#nest').html(json.rows[0].estudiantes);
          $('#flagest').html('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Número de Estudiantes al día"></td>');//Coloca estado actualizado de estudiantes
        }
      }
    });
  }
}

function Load_Start(){//carga tabla y gráficos anuales del indicador a partir de datos almacenados anteriormente
  $("#tableres").html('');
  $.ajax({
   type: "GET", //el el tipo de peticion puede ser GET y POsT
   url: "consultaDocentesTC", //la url del que realizara la consulta
   dataType : 'json',
   data:{c:1},//señala a la consulta general de indicador a lo largo de los años en datawarehouse
   success : function(json) {
    $("#departamento").html('UDENAR');
       for (var i = json.rowCount-1; i >=json.rowCount-5; i--) {
         //if (i==json.rowCount-1 && json.rows[json.rowCount-1].razonb==0) i--;
        $('#meta').html('Meta: Menor a '+parseInt(json.rows[i].num_Rango_MA)+' (Estudiantes/Docente)');
        $("#tableres").append('<tr>');
        $("#tableres").append('<td>'+json.rows[i].Anho+'</td>');
        $("#tableres").append('<td>'+json.rows[i].razonanual+'</td>');
        
        //--Verificación y muestra de etiquetas de estado de los KPI's en función de la meta a lo largo de los años---------------------------------------------------------------------------------------------------------------
        // condiciones para insertar el estado rojo verde o amarillo segun el estado de meta y segun los rangos establecidos en los manuales
        //en caso de que el simbolo del rango adecuado sea '= '
        if(json.rows[i].sim_Rango_A === '= '){
          if(json.rows[i].razonanual == json.rows[i].num_Rango_A){
            $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta de Estudiantes por Docente Tiempo Completo se ha alejado ('+json.rows[i].razonanual+' de '+parseInt(json.rows[i].num_Rango_MA)+')"></td>');
          }
          else if(json.rows[i].sim_Rango_MA === '> '){
            if(json.rows[i].razonanual > json.rows[i].num_Rango_MA){                
              $("#tableres").append('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta de Estudiantes por Docente Tiempo Completo alcanzada ('+json.rows[i].razonanual+' de '+parseInt(json.rows[i].num_Rango_MA)+')"></td>');
            }
            else{                
              $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta de Estudiantes por Docente Tiempo Completo no alcanzada('+json.rows[i].razonanual+' de '+parseInt(json.rows[i].num_Rango_MA)+')"></td>');
            }

          }
          else if(json.rows[i].sim_Rango_MA === '< '){
            if(json.rows[i].razonanual < json.rows[i].num_Rango_MA){
              $("#tableres").append('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta de Estudiantes por Docente Tiempo Completo alcanzada ('+json.rows[i].razonanual+' de '+parseInt(json.rows[i].num_Rango_MA)+')"></td>');
            }
            else{
              $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta de Estudiantes por Docente Tiempo Completo no alcanzada ('+json.rows[i].razonanual+' de '+parseInt(json.rows[i].num_Rango_MA)+')"></td>');

            }

          }
        }

        //en caso de que el simbolo del rango muy adecuado sea el simbolo de mayor '>'
        else if(json.rows[i].sim_Rango_MA === '> '){ 
          if(json.rows[i].razonanual >= json.rows[i].num_Rango_MA){
            $("#tableres").append('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta de Estudiantes por Docente Tiempo Completo alcanzada ('+json.rows[i].razonanual+' de '+parseInt(json.rows[i].num_Rango_MA)+')"></td>');
          }
          else if(json.rows[i].sim_Rango_A === '> '){
            if(json.rows[i].razonanual >= json.rows[i].num_Rango_A){
              $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta de Estudiantes por Docente Tiempo Completo se ha alejado ('+json.rows[i].razonanual+' de '+parseInt(json.rows[i].num_Rango_MA)+')"></td>');
            }
            else{                
              $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta de Estudiantes por Docente Tiempo Completo no alcanzada ('+json.rows[i].razonanual+' de '+parseInt(json.rows[i].num_Rango_MA)+')"></td>');

            } 
          }
          else if(json.rows[i].sim_Rango_A === '< ' && json.rows[i].sim_Rango_I === '< ' ){
            if(json.rows[i].razonanual <= json.rows[i].num_Rango_A && json.rows[i].razonanual > json.rows[i].num_Rango_I){
              $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta de Estudiantes por Docente Tiempo Completo se ha alejado ('+json.rows[j].razonanual+' de '+parseInt(json.rows[i].num_Rango_MA)+')"></td>');
            }
            else if(json.rows[i].razonanual <= json.rows[i].num_Rango_I){
              $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta de Estudiantes por Docente Tiempo Completo no alcanzada ('+json.rows[i].razonanual+' de '+parseInt(json.rows[i].num_Rango_MA)+')"></td>');
            }

          }       
        }
        //en caso de que el simbolo del rango muy adecuado sea el simbolo de menor '<' 
        else if(json.rows[i].sim_Rango_MA === '< '){
          if(json.rows[i].razonanual <= json.rows[i].num_Rango_MA){
            $("#tableres").append('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta de Estudiantes por Docente Tiempo Completo Alcanzada ('+json.rows[i].razonanual+' de '+parseInt(json.rows[i].num_Rango_MA)+')"></td>');
          }
          else if(json.rows[i].sim_Rango_A === '> '){
            if(json.rows[i].razonanual > json.rows[i].num_Rango_A && json.rows[i].razonanual <= json.rows[i].num_Rango_I ){
              $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta de Estudiantes por Docente Tiempo Completo está bajando ('+json.rows[i].razonanual+' de '+parseInt(json.rows[i].num_Rango_MA)+')"></td>');
            }
            else{
              $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta de Estudiantes por Docente Tiempo Completo no alcanzada ('+json.rows[i].razonanual+' de '+parseInt(json.rows[i].num_Rango_MA)+')"></td>');

            }              
          }
          else if(json.rows[i].sim_Rango_A === '< '){
            if(json.rows[i].sim_Rango_I === '> '){
              if(json.rows[i].razonanual <= json.rows[i].num_Rango_A && json.rows[i].razonanual > json.rows[i].num_Rango_MA){
                $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta de Estudiantes por Docente Tiempo Completo está bajando ('+json.rows[i].razonanual+' de '+parseInt(json.rows[i].num_Rango_MA)+')"></td>');
              }
              else {
                $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta de Estudiantes por Docente Tiempo Completo no alcanzada ('+json.rows[i].razonanual+' de '+parseInt(json.rows[i].num_Rango_MA)+')"></td>');

              }
            }
          }
        
        }
        
        //en caso de que el simbolo del rango muy adecuado sea '= '
        if(json.rows[i].sim_Rango_MA === '= '){
          if(json.rows[i].razonanual == json.rows[i].num_Rango_MA){
            $("#tableres").append('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta de Estudiantes por Docente Tiempo Completo alcanzada ('+json.rows[i].razonanual+' de '+parseInt(json.rows[i].num_Rango_MA)+')"></td>');
          }
          else if(json.rows[i].sim_Rango_A === '> '){
            if(json.rows[i].razonanual > json.rows[i].num_Rango_I){
              $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta de Estudiantes por Docente Tiempo Completo no alcanzada ('+json.rows[i].razonanual+' de '+parseInt(json.rows[i].num_Rango_MA)+')"></td>');
              
            }
            else{
              $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta de Estudiantes por Docente Tiempo Completo se ha alejado ('+json.rows[i].razonanual+' de '+parseInt(json.rows[i].num_Rango_MA)+')"></td>');

            }

          }
          else if(json.rows[i].sim_Rango_A === '< '){
            if(json.rows[i].sim_Rango_I === '< '){
              if(json.rows[i].razonanual <= json.rows[i].num_Rango_A && json.rows[i].razonanual > json.rows[i].num_Rango_I){
                $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta de Estudiantes por Docente Tiempo Completo se ha alejado ('+json.rows[i].razonanual+' de '+parseInt(json.rows[i].num_Rango_MA)+')"></td>');
              }
              else{
                $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta de Estudiantes por Docente Tiempo Completo no alcanzada ('+json.rows[i].razonanual+' de '+parseInt(json.rows[i].num_Rango_MA)+')"></td>');

              }
            }

            if(json.rows[i].sim_Rango_I === '> '){
              if(json.rows[i].razonanual <= json.rows[i].num_Rango_A ){
                $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta de Estudiantes por Docente Tiempo Completo se ha alejado ('+json.rows[i].razonanual+' de '+parseInt(json.rows[i].num_Rango_MA)+')"></td>');
              }
              else{
                $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta de Estudiantes por Docente Tiempo Completo no alcanzada ('+json.rows[i].razonanual+' de '+parseInt(json.rows[i].num_Rango_MA)+')"></td>');

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
              "razona": json.rows[i].razona,
              "razonb": json.rows[i].razonb,
              "Anho": json.rows[i].Anho,
              "razonanual": json.rows[i].razonanual
            };
            datarray.push(d);
            /*if (i==json.rowCount-1 && json.rows[i].razonb==0);
            else datarray.push(d);*/
        }
        //-------------------------------------------------------

       //cambio
      $("#graph1").change(function () {
        if($(this).val() === '1'){
          columnGraph(datarray,'divgraph2','Número de Estudiantes por Docente \nUDENAR',json.fields[0].name,json.fields[1].name,0,0);
        }
        else if($(this).val() === '2'){
          columnGraph(datarray,'divgraph2','Número de Estudiantes por Docente \nUDENAR',json.fields[0].name,json.fields[1].name,40,30);
        }
        else if($(this).val() === '3'){
          lineGraph(datarray,'divgraph2','Número de Estudiantes por Docente \nUDENAR',json.fields[0].name,json.fields[1].name);
        }
        else if($(this).val() === '4'){
          areaGraph(datarray,'divgraph2','Número de Estudiantes por Docente \nUDENAR',json.fields[0].name,json.fields[1].name);
        }
        else if($(this).val() === '5'){
          barGraph(datarray,'divgraph2','Número de Estudiantes por Docente \nUDENAR',json.fields[0].name,json.fields[1].name,0,0);
        }
        else if($(this).val() === '6'){
          barGraph(datarray,'divgraph2','Número de Estudiantes por Docente \nUDENAR',json.fields[0].name,json.fields[1].name,40,30);
        }
      });
      columnGraph(datarray,'divgraph2','Número de Estudiantes por Docente \nUDENAR',json.fields[0].name,json.fields[1].name,0,0);

      if(json.rows[json.rowCount-1].razonb!=0){
        //semaforo divgraph3
        //toma los datos de los manuales del indicador para graficar el acelerometro           
          
        if(json.rows[json.rowCount-1].sim_Rango_MA == '> ' && json.rows[json.rowCount-1].sim_Rango_I == '< '){
          
          gaugesGraph(json.rows[json.rowCount-1].razonanual,'divgraph3','r','y','g',json.rows[json.rowCount-1].num_Rango_I,json.rows[json.rowCount-1].num_Rango_MA, 'Estudiantes por Docente\nUDENAR', ' estudiantes');
          
        }        
        else if(json.rows[json.rowCount-1].sim_Rango_MA === '= ' && json.rows[json.rowCount-1].sim_Rango_A == '< ' && json.rows[json.rowCount-1].sim_Rango_A == '> ' ){    
                      
          gaugesGraph(json.rows[json.rowCount-1].razonanual,'divgraph3','r','g','y',json.rows[json.rowCount-1].num_Rango_I,json.rows[json.rowCount-1].num_Rango_MA, 'Estudiantes por Docente\nUDENAR', ' estudiantes');
          
        }        

        else if(json.rows[json.rowCount-1].sim_Rango_MA === '= ' && json.rows[json.rowCount-1].sim_Rango_A == '< ' && json.rows[json.rowCount-1].sim_Rango_A == '< ' ){
          
          //alert('los simbolos para los rangos Adecuado e inadecuado no pueden ser el simbolo menor(<). por ende la grafica del estado del indicador (velocimetro) no se mostrara');
          $("#messageError").html("los simbolos para los rangos Adecuado e inadecuado no pueden ser el simbolo menor(<).");
          $('#myModal').modal('show');
          
        }
        else {  
                      
          gaugesGraph(json.rows[json.rowCount-1].razonanual,'divgraph3','g','y','r',json.rows[json.rowCount-1].num_Rango_MA,json.rows[json.rowCount-1].num_Rango_I,'Estudiantes por Docente\nUDENAR', ' estudiantes');
          
        }

      } 
      else{
        //semaforo divgraph3 
        //toma los datos de los manuales del indicador para graficar el acelerometro           
          
        if(json.rows[json.rowCount-2].sim_Rango_MA == '> ' && json.rows[json.rowCount-2].sim_Rango_I == '< '){
          
          gaugesGraph(json.rows[json.rowCount-2].razonanual,'divgraph3','r','y','g',json.rows[json.rowCount-2].num_Rango_I,json.rows[json.rowCount-2].num_Rango_MA, 'Estudiantes por Docente\nUDENAR', ' estudiantes');
          
        }   

        
        else if(json.rows[json.rowCount-2].sim_Rango_MA === '= ' && json.rows[json.rowCount-2].sim_Rango_A == '< ' && json.rows[json.rowCount-2].sim_Rango_A == '> ' ){    
                      
          gaugesGraph(json.rows[json.rowCount-2].razonanual,'divgraph3','r','g','y',json.rows[json.rowCount-2].num_Rango_I,json.rows[json.rowCount-2].num_Rango_MA,'Estudiantes por Docente\nUDENAR', ' estudiantes');
          
        }
        

        else if(json.rows[json.rowCount-2].sim_Rango_MA === '= ' && json.rows[json.rowCount-2].sim_Rango_A == '< ' && json.rows[json.rowCount-2].sim_Rango_A == '< ' ){
          
          //alert('los simbolos para los rangos Adecuado e inadecuado no pueden ser el simbolo menor(<). por ende la grafica del estado del indicador (velocimetro) no se mostrara');
          $("#messageError").html("los simbolos para los rangos Adecuado e inadecuado no pueden ser el simbolo menor(<).");
          $('#myModal').modal('show');
          
        }
        else {                         
          gaugesGraph(json.rows[json.rowCount-2].razonanual,'divgraph3','g','y','r',json.rows[json.rowCount-2].num_Rango_MA,json.rows[json.rowCount-2].num_Rango_I, 'Estudiantes por Docente\nUDENAR', ' estudiantes');
          
        }
        
      } 
   }
 });
}

function Load_Semiannual(){//carga graficos semestralizados de indicador a lo largo de los años
  $.ajax({
   type: "GET",
   url: "consultaDocentesTC",
   dataType : 'json',
   data:{c:2},//señala a la consulta general de indicador a lo largo de los años en datawarehouse
   success : function(json) {
     var now = new Date();
     var fin;
     $("#lblper").html("Indicador Estudiantes por Docente Tiempo Completo años: "+json.rows[json.rowCount-5].Anho+" a "+now.getFullYear());
     if(mes<=6) fin = now.getFullYear()-1;
     else fin = now.getFullYear();

     //--Filtra gráficas a 5 años-----------------------------
       var datarray=[];
        for (var i = json.rowCount-5; i < json.rowCount; i++) {
            var d ={
              "razona": json.rows[i].razona,
              "razonb": json.rows[i].razonb,
              "Anho": json.rows[i].Anho,
              "razonanual": json.rows[i].razonanual
            };
            datarray.push(d);
        }
        //-------------------------------------------------------

     $("#graph3").change(function () {
        if($(this).val() === '1'){
          columnTwoGraph(datarray,'divgraph1','Número de estudiantes por Docente\n por Semestre\n UDENAR',json.fields[0].name,json.fields[1].name,json.fields[2].name,0,0,"A","B");
        }
        else if($(this).val() === '2'){
          columnTwoGraph(datarray,'divgraph1','Número de estudiantes por Docente\n por Semestre\n UDENAR',json.fields[0].name,json.fields[1].name,json.fields[2].name,40,30,"A","B");
        }
        else if($(this).val() === '3'){
          lineTwoGraph(datarray,'divgraph1','Número de estudiantes por Docente\n por Semestre\n UDENAR',json.fields[0].name,json.fields[1].name,json.fields[2].name,"A","B");
        }
        else if($(this).val() === '4'){
          barTwoGraph(datarray,'divgraph1','Número de estudiantes por Docente\n por Semestre\n UDENAR',json.fields[0].name,json.fields[1].name,json.fields[2].name,0,0,"A","B");
        }
        else if($(this).val() === '5'){
          barTwoGraph(datarray,'divgraph1','Número de estudiantes por Docente\n por Semestre\n UDENAR',json.fields[0].name,json.fields[1].name,json.fields[2].name,40,30,"A","B");
        }
      });
      
     columnTwoGraph(datarray,'divgraph1','Número de estudiantes por Docente\n por Semestre\n UDENAR',json.fields[0].name,json.fields[1].name,json.fields[2].name,0,0,"A","B");
     lineTwoGraph(datarray,'divgraph4','Número de estudiantes por Docente\n por Semestre\n UDENAR',json.fields[0].name,json.fields[1].name,json.fields[2].name,"A","B");
     //semaforo divper2 y divper1     
      if(json.rows[json.rowCount-1].sim_Rango_MA == '> ' && json.rows[json.rowCount-1].sim_Rango_I == '< '){
        gaugesGraph(json.rows[json.rowCount-5].razonanual,'divper1','r','y','g',json.rows[json.rowCount-1].num_Rango_I,json.rows[json.rowCount-1].num_Rango_MA, 'Estudiantes por Docente año:'+json.rows[json.rowCount-5].Anho+'\nUDENAR', '');
        gaugesGraph(json.rows[json.rowCount-1].razonanual,'divper2','r','y','g',json.rows[json.rowCount-1].num_Rango_I,json.rows[json.rowCount-1].num_Rango_MA, 'Estudiantes por Docente año: '+ fin+'\nUDENAR', '');            
        
        
      }      
      else if(json.rows[json.rowCount-1].sim_Rango_MA === '= ' && json.rows[json.rowCount-1].sim_Rango_A == '< ' && json.rows[json.rowCount-1].sim_Rango_A == '> ' ){    
        gaugesGraph(json.rows[json.rowCount-5].razonanual,'divper1','r','g','y',json.rows[json.rowCount-1].num_Rango_I,json.rows[json.rowCount-1].num_Rango_MA, 'Estudiantes por Docente año:'+json.rows[json.rowCount-5].Anho+'\nUDENAR', '');
        gaugesGraph(json.rows[json.rowCount-1].razonanual,'divper2','r','g','y',json.rows[json.rowCount-1].num_Rango_I,json.rows[json.rowCount-1].num_Rango_MA, 'Estudiantes por Docente año: '+ fin+'\nUDENAR', '');                        
        
      }     

      else if(json.rows[json.rowCount-1].sim_Rango_MA === '= ' && json.rows[json.rowCount-1].sim_Rango_A == '< ' && json.rows[json.rowCount-1].sim_Rango_A == '< ' ){
        //alert('los simbolos para los rangos Adecuado e inadecuado no pueden ser el simbolo menor(<). por ende la grafica del estado del indicador (velocimetro) no se mostrara');
        $("#messageError").html("los simbolos para los rangos Adecuado e inadecuado no pueden ser el simbolo menor(<).");
        $('#myModal').modal('show');
         
      }
      else {                      
        gaugesGraph(json.rows[json.rowCount-5].razonanual,'divper1','g','y','r',json.rows[json.rowCount-5].num_Rango_MA,json.rows[json.rowCount-5].num_Rango_I, 'Estudiantes por Docente año:'+json.rows[json.rowCount-5].Anho+'\nUDENAR', '');
        gaugesGraph(json.rows[json.rowCount-1].razonanual,'divper2','g','y','r',json.rows[json.rowCount-1].num_Rango_MA,json.rows[json.rowCount-1].num_Rango_I, 'Estudiantes por Docente año: '+ fin+'\nUDENAR', '');            
        
      }
      
     
   }
 });
}

function Load_Year_List(){//carga menú desplegable de años para el formulario de filtro
  $("#lstanho1").html("");//estas dos líneas evitan la repetición del menú de años por selecciones anteriores
  $("#lstanho2").html("");
  $.ajax({
    type: "get", //el el tipo de peticion puede ser GET y POsT
    url: "consultaDocentesTC", //la url del que realizara la consulta
    dataType : 'json',
    data:{
      c:7,
      'department':$("#lstdep").val()
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

function Load_Department_List(){
  $.ajax({
   type: "get", //el el tipo de peticion puede ser GET y POsT
   url: "consultaDocentesTC", //la url del que realizara la consulta
   dataType : 'json',
   data:{c:8},//se envia un valor para despues coneste saber que consulta
   //realizar a la base de daos
   //se ejecutasi todo se realiza bien
   success : function(json) {
     $("#lstdep").append('<option selected value="'+
     '0'+'">'
     +'Seleccione Departamento'
     +'</option>');
     $("#lstdep").append('<option value="'+
     'UD'+'">'
     +'Universidad de Nariño'
     +'</option>');
     for (var i = 0; i < json.rowCount; i++) {
       $("#lstdep").append('<option value="'+
       json.rows[i].departamento+'">'
       +json.rows[i].name
       +'</option>');
     }
   }
 });
}

function Load_Filter(){//valida y carga filtro de años a consulta KPI
  var ban = true;
  //se obtiene los valores de las input en variables
  var department = $("#lstdep").val(), yearfrom = $("#lstanho1").val(), yearto = $("#lstanho2").val();
  if(yearfrom==0 && yearto==0){
    ban=false;
    $("#messageError").html("Seleccione una opción de cada lista");
    $('#myModal').modal('show');
  }
  else if(yearfrom==yearto  && yearfrom!=0 && yearto!=0){
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
    'department': department,
    'yearfrom': yearfrom,
    'yearto':yearto
  };
  //el metodo ajax para consulta asyncronica
  if(ban){
    $.ajax({
      type: "post", //el el tipo de peticion puede ser GET y POsT
      url: "consultaFiltradaEstudiantesDocentes", //la url del que realizara la consulta
      data : formData,
      dataType : 'json',
      success : function(json) {
        if(json.Error){
          $("#messageError").html("No existen datos");
          $('#myModal').modal('show');
          Load_Start();
        }
        else{
          var now = new Date();
          $("#departamento").html(json.datos[0].departamento);
          
          $("#graph1").change(function () {
            if($(this).val() === '1'){
              columnGraph(json.datos,'divgraph2','Número de Estudiantes por Docente \n'+json.datos[0].departamento,json.fieldsthree[0],json.fieldsthree[3],0,0);
            }
            else if($(this).val() === '2'){
              columnGraph(json.datos,'divgraph2','Número de Estudiantes por Docente \n'+json.datos[0].departamento,json.fieldsthree[0],json.fieldsthree[3],40,30);
            }
            else if($(this).val() === '3'){
              lineGraph(json.datos,'divgraph2','Número de Estudiantes por Docente \n'+json.datos[0].departamento,json.fieldsthree[0],json.fieldsthree[3]);
            }
            else if($(this).val() === '4'){
              areaGraph(json.datos,'divgraph2','Número de Estudiantes por Docente \n'+json.datos[0].departamento,json.fieldsthree[0],json.fieldsthree[3]);
            }
            else if($(this).val() === '5'){
              barGraph(json.datos,'divgraph2','Número de Estudiantes por Docente \n'+json.datos[0].departamento,json.fieldsthree[0],json.fieldsthree[3],0,0);
            }
            else if($(this).val() === '6'){
              barGraph(json.datos,'divgraph2','Número de Estudiantes por Docente \n'+json.datos[0].departamento,json.fieldsthree[0],json.fieldsthree[3],40,30);
            }
          });
          columnGraph(json.datos,'divgraph2','Número de Estudiantes por Docente \n'+json.datos[0].departamento,json.fieldsthree[0],json.fieldsthree[3],0,0);
          
          $("#tableres").html('');
          for (var i = json.count-1; i >=0; i--){
            $("#tableres").append('<tr>');
            $("#tableres").append('<td>'+json.datos[i].Anho+'</td>');
            $("#tableres").append('<td>'+json.datos[i].razonanual+'</td>');
            //--Verificación y muestra de etiquetas de estado de los KPI's en función de la meta a lo largo de los años---------------------------------------------------------------------------------------------------------------
            // condiciones para insertar el estado rojo verde o amarillo segun el estado de meta y segun los rangos establecidos en los manuales
            //en caso de que el simbolo del rango adecuado sea '= '
            if(json.datos[i].sim_Rango_A === '= '){
              if(json.datos[i].razonanual == json.datos[i].num_Rango_A){
                $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta de Estudiantes por Docente Tiempo Completo se ha alejado ('+json.datos[i].razonanual+' de '+parseInt(json.datos[i].num_Rango_MA)+')"></td>');
              }
              else if(json.datos[i].sim_Rango_MA === '> '){
                if(json.datos[i].razonanual > json.datos[i].num_Rango_MA){                
                  $("#tableres").append('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta de Estudiantes por Docente Tiempo Completo alcanzada ('+json.datos[i].razonanual+' de '+parseInt(json.datos[i].num_Rango_MA)+')"></td>');
                }
                else{                
                  $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta de Estudiantes por Docente Tiempo Completo no alcanzada('+json.datos[i].razonanual+' de '+parseInt(json.datos[i].num_Rango_MA)+')"></td>');
                }
              }
              else if(json.datos[i].sim_Rango_MA === '< '){
                if(json.datos[i].razonanual < json.datos[i].num_Rango_MA){
                  $("#tableres").append('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta de Estudiantes por Docente Tiempo Completo alcanzada ('+json.datos[i].razonanual+' de '+parseInt(json.datos[i].num_Rango_MA)+')"></td>');
                }
                else{
                  $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta de Estudiantes por Docente Tiempo Completo no alcanzada ('+json.datos[i].razonanual+' de '+parseInt(json.datos[i].num_Rango_MA)+')"></td>');
                }
              }
            }
            //en caso de que el simbolo del rango muy adecuado sea el simbolo de mayor '>'
            else if(json.datos[i].sim_Rango_MA === '> '){ 
              if(json.datos[i].razonanual >= json.datos[i].num_Rango_MA){
                $("#tableres").append('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta de Estudiantes por Docente Tiempo Completo alcanzada ('+json.datos[i].razonanual+' de '+parseInt(json.datos[i].num_Rango_MA)+')"></td>');
              }
              else if(json.datos[i].sim_Rango_A === '> '){
                if(json.datos[i].razonanual >= json.datos[i].num_Rango_A){
                  $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta de Estudiantes por Docente Tiempo Completo se ha alejado ('+json.datos[i].razonanual+' de '+parseInt(json.datos[i].num_Rango_MA)+')"></td>');
                }
                else{                
                  $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta de Estudiantes por Docente Tiempo Completo no alcanzada ('+json.datos[i].razonanual+' de '+parseInt(json.datos[i].num_Rango_MA)+')"></td>');
                } 
              }
              else if(json.datos[i].sim_Rango_A === '< ' && json.datos[i].sim_Rango_I === '< ' ){
                if(json.datos[i].razonanual <= json.datos[i].num_Rango_A && json.datos[i].razonanual > json.datos[i].num_Rango_I){
                  $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta de Estudiantes por Docente Tiempo Completo se ha alejado ('+json.datos[j].razonanual+' de '+parseInt(json.datos[i].num_Rango_MA)+')"></td>');
                }
                else if(json.datos[i].razonanual <= json.datos[i].num_Rango_I){
                  $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta de Estudiantes por Docente Tiempo Completo no alcanzada ('+json.datos[i].razonanual+' de '+parseInt(json.datos[i].num_Rango_MA)+')"></td>');
                }
              }       
            }
            //en caso de que el simbolo del rango muy adecuado sea el simbolo de menor '<' 
            else if(json.datos[i].sim_Rango_MA === '< '){
              if(json.datos[i].razonanual <= json.datos[i].num_Rango_MA){
                $("#tableres").append('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta de Estudiantes por Docente Tiempo Completo Alcanzada ('+json.datos[i].razonanual+' de '+parseInt(json.datos[i].num_Rango_MA)+')"></td>');
              }
              else if(json.datos[i].sim_Rango_A === '> '){
                if(json.datos[i].razonanual > json.datos[i].num_Rango_A && json.datos[i].razonanual <= json.datos[i].num_Rango_I ){
                  $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta de Estudiantes por Docente Tiempo Completo está bajando ('+json.datos[i].razonanual+' de '+parseInt(json.datos[i].num_Rango_MA)+')"></td>');
                }
                else{
                  $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta de Estudiantes por Docente Tiempo Completo no alcanzada ('+json.datos[i].razonanual+' de '+parseInt(json.datos[i].num_Rango_MA)+')"></td>');
                }              
              }
              else if(json.datos[i].sim_Rango_A === '< '){
                if(json.datos[i].sim_Rango_I === '> '){
                  if(json.datos[i].razonanual <= json.datos[i].num_Rango_A && json.datos[i].razonanual > json.datos[i].num_Rango_MA){
                    $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta de Estudiantes por Docente Tiempo Completo está bajando ('+json.datos[i].razonanual+' de '+parseInt(json.datos[i].num_Rango_MA)+')"></td>');
                  }
                  else {
                    $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta de Estudiantes por Docente Tiempo Completo no alcanzada ('+json.datos[i].razonanual+' de '+parseInt(json.datos[i].num_Rango_MA)+')"></td>');
                  }
                }
              }
            }
            //en caso de que el simbolo del rango muy adecuado sea '= '
            if(json.datos[i].sim_Rango_MA === '= '){
              if(json.datos[i].razonanual == json.datos[i].num_Rango_MA){
                $("#tableres").append('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta de Estudiantes por Docente Tiempo Completo alcanzada ('+json.datos[i].razonanual+' de '+parseInt(json.datos[i].num_Rango_MA)+')"></td>');
              }
              else if(json.datos[i].sim_Rango_A === '> '){
                if(json.datos[i].razonanual > json.datos[i].num_Rango_I){
                  $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta de Estudiantes por Docente Tiempo Completo no alcanzada ('+json.datos[i].razonanual+' de '+parseInt(json.datos[i].num_Rango_MA)+')"></td>');
                }
                else{
                  $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta de Estudiantes por Docente Tiempo Completo se ha alejado ('+json.datos[i].razonanual+' de '+parseInt(json.datos[i].num_Rango_MA)+')"></td>');
                }
              }
              else if(json.datos[i].sim_Rango_A === '< '){
                if(json.datos[i].sim_Rango_I === '< '){
                  if(json.datos[i].razonanual <= json.datos[i].num_Rango_A && json.datos[i].razonanual > json.datos[i].num_Rango_I){
                    $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta de Estudiantes por Docente Tiempo Completo se ha alejado ('+json.datos[i].razonanual+' de '+parseInt(json.datos[i].num_Rango_MA)+')"></td>');
                  }
                  else{
                    $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta de Estudiantes por Docente Tiempo Completo no alcanzada ('+json.datos[i].razonanual+' de '+parseInt(json.datos[i].num_Rango_MA)+')"></td>');
                  }
                }
                if(json.datos[i].sim_Rango_I === '> '){
                  if(json.datos[i].razonanual <= json.datos[i].num_Rango_A ){
                    $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta de Estudiantes por Docente Tiempo Completo se ha alejado ('+json.datos[i].razonanual+' de '+parseInt(json.datos[i].num_Rango_MA)+')"></td>');
                  }
                  else{
                    $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta de Estudiantes por Docente Tiempo Completo no alcanzada ('+json.datos[i].razonanual+' de '+parseInt(json.datos[i].num_Rango_MA)+')"></td>');
                  }
                }
              }
            }
          //-----------------------------------------------------------------
            $("#tableres").append('</tr>');
          }

          if(json.datos[json.count-1].sim_Rango_MA == '> ' && json.datos[json.count-1].sim_Rango_I == '< '){
            gaugesGraph(json.datos[json.count-1].razonanual,'divgraph3','r','y','g',json.datos[json.count-1].num_Rango_I,json.datos[json.count-1].num_Rango_MA, 'Estudiantes por Docente año:'+json.datos[json.count-1].Anho+'\n'+json.datos[0].departamento, ' estudiantes');
          }   
          else if(json.datos[json.count-1].sim_Rango_MA === '= ' && json.datos[json.count-1].sim_Rango_A == '< ' && json.datos[json.count-1].sim_Rango_A == '> ' ){    
            gaugesGraph(json.datos[json.count-1].razonanual,'divgraph3','r','g','y',json.datos[json.count-1].num_Rango_I,json.datos[json.count-1].num_Rango_MA,'Estudiantes por Docente año:'+json.datos[json.count-1].Anho+'\n'+json.datos[0].departamento, ' estudiantes');
          }
          else if(json.datos[json.count-1].sim_Rango_MA === '= ' && json.datos[json.count-1].sim_Rango_A == '< ' && json.datos[json.count-1].sim_Rango_A == '< ' ){
            //alert('los simbolos para los rangos Adecuado e inadecuado no pueden ser el simbolo menor(<). por ende la grafica del estado del indicador (velocimetro) no se mostrara');
            $("#messageError").html("los simbolos para los rangos Adecuado e inadecuado no pueden ser el simbolo menor(<).");
            $('#myModal').modal('show');
          }
          else {                         
            gaugesGraph(json.datos[json.count-1].razonanual,'divgraph3','g','y','r',json.datos[json.count-1].num_Rango_MA,json.datos[json.count-1].num_Rango_I, 'Estudiantes por Docente año:'+json.datos[json.count-1].Anho+'\n'+json.datos[0].departamento, ' estudiantes');
          }

          $("#lblper").html("<br> Indicador Estudiantes por Docente Tiempo Completo años: "+json.datos[0].Anho+" a "+json.datos[json.count-1].Anho);
          
          $("#graph3").change(function () {
            if($(this).val() === '1'){
              columnTwoGraph(json.datos,'divgraph1','Número de estudiantes por Docente\n por Semestre\n'+json.datos[0].departamento,json.fieldsthree[0],json.fieldsthree[1],json.fieldsthree[2],0,0,"A","B");
            }
            else if($(this).val() === '2'){
              columnTwoGraph(json.datos,'divgraph1','Número de estudiantes por Docente\n por Semestre\n'+json.datos[0].departamento,json.fieldsthree[0],json.fieldsthree[1],json.fieldsthree[2],40,30,"A","B");
            }
            else if($(this).val() === '3'){
              lineTwoGraph(json.datos,'divgraph1','Número de estudiantes por Docente\n por Semestre\n'+json.datos[0].departamento,json.fieldsthree[0],json.fieldsthree[1],json.fieldsthree[2],"A","B");
            }
            else if($(this).val() === '4'){
              barTwoGraph(json.datos,'divgraph1','Número de estudiantes por Docente\n por Semestre\n'+json.datos[0].departamento,json.fieldsthree[0],json.fieldsthree[1],json.fieldsthree[2],0,0,"A","B");
            }
            else if($(this).val() === '5'){
              barTwoGraph(json.datos,'divgraph1','Número de estudiantes por Docente\n por Semestre\n'+json.datos[0].departamento,json.fieldsthree[0],json.fieldsthree[1],json.fieldsthree[2],40,30,"A","B");
            }
          });
          columnTwoGraph(json.datos,'divgraph1','Número de estudiantes por Docente\n por Semestre\n'+json.datos[0].departamento,json.fieldsthree[0],json.fieldsthree[1],json.fieldsthree[2],0,0,"A","B");
        
          lineTwoGraph(json.datos,'divgraph4','Número de estudiantes por Docente\n por Semestre\n'+json.datos[0].departamento,json.fieldsthree[0],json.fieldsthree[1],json.fieldsthree[2],"A","B");
          //semaforo divper2 y divper1     
          if(json.datos[json.count-1].sim_Rango_MA == '> ' && json.datos[json.count-1].sim_Rango_I == '< '){
            gaugesGraph(json.datos[0].razonanual,'divper1','r','y','g',json.datos[0].num_Rango_I,json.datos[0].num_Rango_MA, 'Estudiantes por Docente año:'+json.datos[0].Anho+'\n'+json.datos[0].departamento, '');
            gaugesGraph(json.datos[json.count-1].razonanual,'divper2','r','y','g',json.datos[json.count-1].num_Rango_I,json.datos[json.count-1].num_Rango_MA, 'Estudiantes por Docente año: '+ json.datos[json.count-1].Anho+'\n'+json.datos[0].departamento, '');            
          
          
          }      
          else if(json.datos[json.count-1].sim_Rango_MA === '= ' && json.datos[json.count-1].sim_Rango_A == '< ' && json.datos[json.count-1].sim_Rango_A == '> ' ){    
            gaugesGraph(json.datos[0].razonanual,'divper1','r','g','y',json.datos[0].num_Rango_I,json.datos[0].num_Rango_MA, 'Estudiantes por Docente año:'+json.datos[0].Anho+'\n'+json.datos[0].departamento, '');
            gaugesGraph(json.datos[json.count-1].razonanual,'divper2','r','g','y',json.datos[json.count-1].num_Rango_I,json.datos[json.count-1].num_Rango_MA, 'Estudiantes por Docente año: '+ json.datos[json.count-1].Anho+'\n'+json.datos[0].departamento, '');                        
          
          }     

          else if(json.datos[json.count-1].sim_Rango_MA === '= ' && json.datos[json.count-1].sim_Rango_A == '< ' && json.datos[json.count-1].sim_Rango_A == '< ' ){
            //alert('los simbolos para los rangos Adecuado e inadecuado no pueden ser el simbolo menor(<). por ende la grafica del estado del indicador (velocimetro) no se mostrara');
            $("#messageError").html("los simbolos para los rangos Adecuado e inadecuado no pueden ser el simbolo menor(<).");
            $('#myModal').modal('show');
          
          }
          else {                      
            gaugesGraph(json.datos[0].razonanual,'divper1','g','y','r',json.datos[0].num_Rango_MA,json.datos[0].num_Rango_I, 'Estudiantes por Docente año:'+json.datos[0].Anho+'\n'+json.datos[0].departamento, '');
            gaugesGraph(json.datos[json.count-1].razonanual,'divper2','g','y','r',json.datos[json.count-1].num_Rango_MA,json.datos[json.count-1].num_Rango_I, 'Estudiantes por Docente año: '+ json.datos[json.count-1].Anho+'\n'+json.datos[0].departamento, '');            
          
          }
      
          //gaugesGraph(json.datos[0].razonanual,'divper1','g','y','r',35,59, 'Estudiantes por Docente año: '+json.datos[0].Anho, '');
          //gaugesGraph(json.datos[json.count-1].razonanual,'divper2','g','y','r',35,59, 'Estudiantes por Docente año: '+json.datos[json.count-1].Anho, '');
        }
      }
    });
  }
  closedivfilter();
}

function Load_filter_year(){
  $("#lst_anho").html('');
 //ajax para llenar la lista de años
 $.ajax({
   type: "post", //el el tipo de peticion puede ser GET y POsT
   url: "consultaFiltradaEstudiantesDocentes", //la url del que realizara la consulta
   dataType : 'json',
   data:{
     'program':$("#lst_dep").val()},//Primera consulta
      //se ejecutasi todo se realiza bien
     success : function(json) {
      $("#lst_anho").append('<option value="0" selected>Seleccionar Año</option>');
      // llenado de lista de años
      var r3="";
      for(var i = 0 ; i<json.rowCount; i++){
        r3 = r3+"<option value='"+json.rows[i].anio+"'>"+ json.rows[i].anio+"</option> ";
      }
      $("#lst_anho").append(r3);
     }
 });
}

function Load_Update(){//carga datos obtenidos del formulario de ingreso de estudiantes-docentes
  //se obtiene los valores de las input en variables
  //var anho = $("#year1").val(), estudiantes = $("#est1").val(), docentes= $("#doctc1").val(), semestre= $("#sem1").val();
  //alert("llega y esto manda: "+$("#year1").val()+" "+$("#est1").val()+" "+$("#sem1").val());
  var anho = $("#year1").val(), estudiantes = $("#est1").val(), semestre= $("#sem1").val();
  //se coloca los datos del form en el formato adecuado para enviar al server
  var formData = {
    'anho': anho,
    'estudiantes': estudiantes,
    //'docentes': docentes,
    'semestre': semestre
  };
  $.ajax({
      type: "post", //el el tipo de peticion puede ser GET y POsT
      url: "actualizaDocentesTC", //señala a inserción de datos generales de programa a acreditarse en public
      data : formData,
      dataType : 'json',
      success : function(json) {}
  });
  //alert("El indicador ha sido actualizado!");
  $("#error").html("El indicador ha sido actualizado!");
  $("#Modalupdate").modal("show");
  Search_Year_KPI(anho);//busca la existencia de otros registros de año en función del
                          //año en curso en datawarehouse
  closedivupdate();
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

function opendivupdate(year,month){//carga formulario de ingreso-actualizacion de indicador
  var year = year-1;
  if(month<3){//el formulario tomará como datos por defecto los resultados del indicador del año anterior
    $.ajax({
      type: "get",
      url: "consultaDocentesTC",
      dataType : 'json',
      data:{c:5,'anho': year},//señala a consulta semestralizada de estudiantes y docentes en función
                              //del año anterior y tipo de titulación
      success : function(json) {
        if(json.rows[0].estudiantesb==0) {//si esta condicion se cumple significa que aún no
                                        //hay registro de estudiantes del semestre B del año inmediatamente anterior
          $('#tabledoctc').append('B de '+year);
          $('#tablest').append('B de '+year);
          $('#sem2').html('<input type="hidden" id="sem1" value="B">');
          $('#year2').html('<input type="hidden" id="year1" value='+year+'>');
          $('#flagest').html('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Este Dato se encuentra desactualizado"></td>');//Advierte estado desactualizado de estudiantes
          if (json.rows[0].docentesprom) {//si esta condicion se cumple el nivel de formación para 
                                          //el semestre B del año anterior se encuentra al día
            $('#ndoctc').html('Promedio de Docentes Tiempo Completo: '+json.rows[0].docentesprom);
            $("#flagdoctc").html('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Número de Docentes Tiempo Completo al día"></td>');
            /*$('#nest').html('<input type="number" pattern="[0-9]" id="est1" value='+json.rows[0].estudiantesa+' max="99999" style="width: 6em" class="form-control" required>');
            $('#updest').html('<span class="btn btn-warning btn-small"><a onclick="Load_Update()"><img title="Ingresar" alt="Ingresar" /></a></span>');*/
            $('#updest').html('<span class="btn btn-primary"><a onclick="openmodaluploadEstudiantes()"><img title="Actualizar" alt="Actualizar"/></a></span>');
          }
          else {
            $('#ndoctc').html('Promedio de Docentes Tiempo Completo: '+json.rows[0].docentesa);
            $('#nest').html(json.rows[0].estudiantesa);
            $("#flagdoctc").html('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Este Dato se encuentra desactualizado"></td>');
            $('#upddoctc').html('<span class="btn btn-danger btn-small"><a onclick="openmodaluploadFormacion()"><img title="Actualizar" alt="Actualizar"/></a></span>');
          }
        }
      }
    });
  }
  else if (month>7 && month<10){//el formulario tomará como datos por defecto los datos ingresados en el asemestre A del año en curso
    $.ajax({
      type: "get", //el el tipo de peticion puede ser GET y POsT
      url: "consultaDocentesTC", //la url del que realizara la consulta
      dataType : 'json',
      data:{c:3,'anho': year},
      success : function(json) {
        if(json.rows[0].estudiantes!=0) {//si esta condicion se cumple significa que el KPI
                                        //estudiantes-docentesTC del año inmediatamente anterior está registrado
          $('#tabledoctc').append('A de '+(year+1));
          $('#tablest').append('A de '+(year+1));
          $('#sem2').html('<input type="hidden" id="sem1" value="A">');
          $('#year2').html('<input type="hidden" id="year1" value='+(year+1)+'>');
          $('#flagest').html('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Este Dato se encuentra desactualizado"></td>');//Advierte estado desactualizado de estudiantes
          Search_View(year+1,"A",json.rows[0].estudiantes,json.rows[0].docentes);//consulta si existe un registro de docentes del semestre A
        }
      }
    });
  }
  $("#divupdate").modal('show');
}

function closedivupdate(){
  $("#divupdate").modal('hide');
}

function Search_Year_KPI(fec){//busca la existencia de otros registros de año en función de la
                         //fecha del ultimo kpi estduainte-docenteTC registrado en datawarehouse
  $.ajax({
      type: "get",
      url: "consultaDocentesTC",
      data : {c:5,'anho': fec},//señala a consulta de existencia de KPI en función del año
      dataType : 'json',
      success : function(json) {
        if(json.rows[0].docentesb==null) Ins_KPI(fec,parseInt(json.rows[0].estudiantesprom),parseInt(json.rows[0].docentesa));//ingresa nuevo kpi en función de primer programa acreditado en el año
        else Upd_KPI(fec,json.rows[0].estudiantesb,json.rows[0].docentesb,json.rows[0].estudiantesprom,json.rows[0].docentesprom);//actualiza kpi en presencia de más de un programa acreditado ya existente en ese año
      }
  });
}

function Ins_KPI(anho,estudiantesa,docentesa){//ingresa nuevo kpi en función de la primera relación estudiante-docenteTC en el año
  //alert(anho+' '+estudiantesa+' '+docentesa);
  $.ajax({
      type: "get",
      url: "actualizaKPIDocentesTC",
      data : {c:1,'anho': anho,'estudiantesa': estudiantesa,'docentesa': docentesa},//señala a inserción en datawarehouse
      dataType : 'json',
      success : function(json) {
        Load_Start();
        $('#flagest').html('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Número de Estudiantes al día"></td>');//Coloca estado actualizado de estudiantes
        $('#updest').html('');//Oculta Botón de Actualización de estudiantes
        Load_Semiannual();
      }
  });
}

function Upd_KPI(anho,estudiantesb,docentesb,estudiantesprom,docentesprom){//actualiza kpi en presencia de un KPI estudiante-docenteTC existente en ese año
  $.ajax({
      type: "get",
      url: "actualizaKPIDocentesTC", //la url del que realizara la consulta
      data : {c:2,'anho': anho,'estudiantesb': estudiantesb,'docentesb': docentesb,'estudiantesprom': estudiantesprom,'docentesprom': docentesprom},////señala a actualización en datawarehouse
      dataType : 'json',
      success : function(json) {
        Load_Start();
        $('#flagest').html('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Número de Estudiantes al día"></td>');//Coloca estado actualizado de estudiantes
        $('#updest').html('');//Oculta Botón de Actualización de estudiantes
        Load_Semiannual();
      }
  });
}
function Search_View(fec,sem,estudiantes,docentes){//consulta si existe un registro de docentes del semestre A
  $.ajax({
      type: "get",
      url: "consultaDocentesTC",
      data : {c:6,'anho': fec},//señala a consulta de existencia de KPI en función del año
      dataType : 'json',
      success : function(json) {
        if (json.rowCount) {//si esta condicion se cumple significa que el indicador de nivel de formación está actualizado
            $('#ndoctc').html('Promedio de Docentes Tiempo Completo: '+json.rows[0].docentesa);
            $("#flagdoctc").html('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Número de Docentes Tiempo Completo al día"></td>');
            /*$('#nest').html('<input type="number" pattern="[0-9]" id="est1" value='+estudiantes+' max="99999" style="width: 6em" class="form-control" required>');
            $('#updest').html('<span class="btn btn-primary"><a onclick="Load_Update()"><img title="Ingresar" alt="Ingresar" /></a></span>');*/
            $('#updest').html('<span class="btn btn-primary"><a onclick="openmodaluploadEstudiantes()"><img title="Actualizar" alt="Actualizar"/></a></span>');
        }
        else {//advertencia y enlace a carga de archivo para ctualizar nivel de formacion de docentes
            $('#ndoctc').html('Promedio de Docentes Tiempo Completo: '+docentes);
            $('#nest').html(estudiantes);
            $("#flagdoctc").html('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Este Dato se encuentra desactualizado"></td>');
            $('#upddoctc').html('<span class="btn btn-primary"><a onclick="openmodaluploadFormacion()"><img title="Actualizar" alt="Actualizar"/></a></span>');
         }
      }
  });
}
