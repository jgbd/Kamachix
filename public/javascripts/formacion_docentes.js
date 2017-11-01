$(document).ready(function(){

  Load_first_time();
  Load_yearfirst_time();
  

  function aleatorio(inferior,superior){
    numPosibilidades = superior - inferior
    aleat = Math.random() * numPosibilidades
    aleat = Math.floor(aleat)
    return parseInt(inferior) + aleat
  }

  var colo2=[];
  var colo3=[];
  for(j=0;j<4;j++){
    var hexadecimal = new Array("3","4","5","6","7","8","9","A","B","C","D","E","F")
    var color_aleatorio2="";
    for (i=0;i<2;i++){
      var posarray = aleatorio(0,hexadecimal.length)
      color_aleatorio2 += hexadecimal[posarray]
    }
    colo2.push(color_aleatorio2)
  }
  var nuevoc="";
  for (i=0;i<colo2.length;i++){
    nuevoc = "#00" + colo2[i] + "00";
    colo3.push(nuevoc);
  }

  // funcion para cargar los datos por primera vez
  function Load_first_time(){
    $.ajax({
     type: "GET", //el el tipo de peticion puede ser GET y POsT
     url: "consultaFormacion", //la url del que realizara la consulta
     dataType : 'json',
     data:{c:1},//Primera consulta
     //se ejecutasi todo se realiza bien
     success : function(json) {
       $("#txtjson").val(JSON.stringify(json));
       $("#datBody").html('');
       var r="";//variable para llenar los datos y el html e cada una de las filas
       var conta=json.rowCount;
       if(json.rows[0].anio==json.rows[1].anio && json.rows[2].anio==json.rows[1].anio && json.rows[0].anio==json.rows[3].anio){
         if(json.rows[4].anio==json.rows[5].anio && json.rows[4].anio==json.rows[6].anio && json.rows[4].anio==json.rows[7].anio){
            // si los datos en el indicador de formacion docentes son iguales a null( solo estan los datos del periodo 1 del ultimo año)  se vizualiza el nivel de formacion anterior al solicitado
            if(json.rows[1].t_completo == null){
              //ciclo para llenar los datos en las filas en r 
              for(var i = conta-4 ; i<conta; i++){
                r = r+"<tr><td><label id='forma"+i+"' name='forma"+i+"'>"+json.rows[i].nom_formacion+
                "</label></td><td><label id='tot"+i+"'>"+json.rows[i].t_completo+"</label></td></tr>";                

              }
              /*var fecha = new Date();
              var ano = fecha.getFullYear();
              alert('El año actual es: '+ano);*/
              tittle="Nivel de formación de docentes tiempo completo del año: "+json.rows[conta-3].anio;
              $("#datBody").append(r);
              $("#titulo").append(tittle);

              var arra=[];
              //ciclo para llenar  el array llamado arra con los datos que vana contener las diferentes graficas
              for(var i =conta-4; i<conta;i++){
                var programa = {
                  "nivel": json.rows[i].nom_formacion,
                  "cantidad": json.rows[i].t_completo
                }
                arra.push(programa);

              }
              
              //cambio de graficas de barras
                $("#graph1").change(function () {
                  if($(this).val() === '1'){
                    columnGraph(arra,divgraph1,'Docentes tiempo completo','nivel','cantidad',0,0);
                  }
                  else if($(this).val() === '2'){
                    columnGraph(arra,divgraph1,'Docentes tiempo completo','nivel','cantidad',40,30);
                  }
                  else if($(this).val() === '3'){
                    lineGraph(arra,divgraph1,'Docentes tiempo completo','nivel','cantidad');
                  }
                  else if($(this).val() === '4'){
                    areaGraph(arra,divgraph1,'Docentes tiempo completo','nivel','cantidad');
                  }
                  else if($(this).val() === '5'){
                    barGraph(arra,divgraph1,'Docentes tiempo completo','nivel','cantidad',0,0);
                  }
                  else if($(this).val() === '6'){
                    barGraph(arra,divgraph1,'Docentes tiempo completo','nivel','cantidad',40,30);
                  }
                  else if($(this).val() === '7'){
                    pieGraph(arra, divgraph1, "nivel", "cantidad","Porcentaje Docentes Tiempo Completo");
                  }
                  else if($(this).val() === '8'){
                    pieGraph3D(arra, divgraph1, "nivel", "cantidad","Porcentaje Docentes Tiempo Completo");
                  }
                });
              //grafica que aparecera por defecto
              columnGraph(arra,divgraph1,'Docentes tiempo completo','nivel','cantidad',0,0);

               //semaforo divgraph4 
              //toma los datos de los manuales del indicador para graficar el acelerometro           
               
              if(json.rows[2].sim_Rango_MA == '< ' && json.rows[2].sim_Rango_I == '> '){                
                
                gaugesGraph(json.rows[2].estado_meta,divgraph4,'g','y','r',json.rows[2].num_Rango_MA,json.rows[2].num_Rango_I, 'Indicador de Meta', '%',100);
                
              } 

              else if(json.rows[0].sim_Rango_MA === '= ' && json.rows[0].sim_Rango_A == '< ' && json.rows[0].sim_Rango_A == '> ' ){    
                           
                gaugesGraph(json.rows[0].relacion_docentes,divgraph4,'y','g','r',json.rows[0].num_Rango_I,json.rows[0].num_Rango_MA, 'Indicador de Meta', '%',100);
                
              }              

              else if(json.rows[0].sim_Rango_MA === '= ' && json.rows[0].sim_Rango_A == '< ' && json.rows[0].sim_Rango_A == '< ' ){
                
                //alert('los simbolos para los rangos Adecuado e inadecuado no pueden ser el simbolo menor(<). por ende la grafica del estado del indicador (velocimetro) no se mostrara');
                $("#messageError").html("los simbolos para los rangos Adecuado e inadecuado no pueden ser el simbolo menor(<).");
                $('#myModal').modal('show');
                 
              }

              else{                               
                gaugesGraph(json.rows[2].estado_meta,divgraph4,'r','y','g',json.rows[2].num_Rango_I,json.rows[2].num_Rango_MA, 'Indicador de Meta', '%',100);
                
              }
                             
               

              
            }
            // si los datos del indicador formacion docentes tienen datos para ser representados graficamente
            else {
              //ciclo para llenar los datos en las filas en r
              for(var i = 0 ; i<conta-4; i++){
                r = r+"<tr><td><label id='forma"+i+"' name='forma"+i+"'>"+json.rows[i].nom_formacion+
                "</label></td><td><label id='tot"+i+"'>"+json.rows[i].t_completo+"</label></td></tr>";
               

              }
              
              tittle="Nivel de formación de docentes tiempo completo del año: "+json.rows[2].anio;
              $("#datBody").append(r);
              $("#titulo").append(tittle);

              var arra=[];
              //ciclo para llenar  el array llamado arra con los datos que vana contener las diferentes graficas
              for(var i =0; i<conta-4;i++){
                var programa = {
                  "nivel": json.rows[i].nom_formacion,
                  "cantidad": json.rows[i].t_completo
                }
                arra.push(programa);

              }
             
            
              //cambio de graficas de barras
                $("#graph1").change(function () {
                  if($(this).val() === '1'){
                    columnGraph(arra,divgraph1,'Docentes tiempo completo','nivel','cantidad',0,0);
                  }
                  else if($(this).val() === '2'){
                    columnGraph(arra,divgraph1,'Docentes tiempo completo','nivel','cantidad',40,30);
                  }
                  else if($(this).val() === '3'){
                    lineGraph(arra,divgraph1,'Docentes tiempo completo','nivel','cantidad');
                  }
                  else if($(this).val() === '4'){
                    areaGraph(arra,divgraph1,'Docentes tiempo completo','nivel','cantidad');
                  }
                  else if($(this).val() === '5'){
                    barGraph(arra,divgraph1,'Docentes tiempo completo','nivel','cantidad',0,0);
                  }
                  else if($(this).val() === '6'){
                    barGraph(arra,divgraph1,'Docentes tiempo completo','nivel','cantidad',40,30);
                  }
                  else if($(this).val() === '7'){
                    pieGraph(arra, divgraph1, "nivel", "cantidad","Porcentaje Docentes Tiempo Completo");
                  }
                  else if($(this).val() === '8'){
                    pieGraph3D(arra, divgraph1, "nivel", "cantidad","Porcentaje Docentes Tiempo Completo");
                  }
                });
              //grafica que aparecera por defecto
              pieGraph(arra, divgraph1, "nivel", "cantidad","Porcentaje Docentes Tiempo Completo");


              //semaforo divgraph4 
              //toma los datos de los manuales del indicador para graficar el acelerometro           
               
              if(json.rows[2].sim_Rango_MA == '< ' && json.rows[2].sim_Rango_I == '> '){       
                
                gaugesGraph(json.rows[2].estado_meta,divgraph4,'g','y','r',json.rows[2].num_Rango_MA,json.rows[2].num_Rango_I, 'Indicador de Meta', '%',100);
                
              } 

              else if(json.rows[0].sim_Rango_MA === '= ' && json.rows[0].sim_Rango_A == '< ' && json.rows[0].sim_Rango_A == '> ' ){    
                           
                gaugesGraph(json.rows[0].relacion_docentes,divgraph4,'y','g','r',json.rows[0].num_Rango_I,json.rows[0].num_Rango_MA, 'Indicador de Meta', '%',100);
                
              }              

              else if(json.rows[0].sim_Rango_MA === '= ' && json.rows[0].sim_Rango_A == '< ' && json.rows[0].sim_Rango_A == '< ' ){
                //alert('los simbolos para los rangos Adecuado e inadecuado no pueden ser el simbolo menor(<). por ende la grafica del estado del indicador (velocimetro) no ');
                $("#messageError").html("los simbolos para los rangos Adecuado e inadecuado no pueden ser el simbolo menor(<).");
                $('#myModal').modal('show');
                 
              }

              else{                               
                gaugesGraph(json.rows[2].estado_meta,divgraph4,'r','y','g',json.rows[2].num_Rango_I,json.rows[2].num_Rango_MA, 'Indicador de Meta', '%',100);
                
              }        
            }
         }

       }
      else{
        //$("#datBody2").html('');
        //$("#datBody").html('');
        
        $("#divgraph3").html('');
        $("#divgraph2").html('');   
        $("#divgraph1").html('');
        $("#divtable").html('');     
        
        //alert('el ultimo año no tiene suficientes datos para ser visualizado. Por favor llene todos los datos de formacion docentes correspondientes al año: '+ json.rows[0].anio);
        $("#messageError2").html("El último año no tiene suficientes datos para ser visualizado. Por favor llene todos los datos de formación docentes correspondientes al año: "+ json.rows[0].anio);
        $('#myModal2').modal('show');
         $("#lst_Anio5").html('');
        
        setTimeout(function redireccion(){location.href="/"},4000); //metodo de resireccionamiento
      }

     }
  });
  // panorama general del nivel de formacion
  $.ajax({
     type: "GET", //el el tipo de peticion puede ser GET y POsT
     url: "consultaFormacion", //la url del que realizara la consulta
     dataType : 'json',
     data:{c:8},
     //se ejecutasi todo se realiza bien
     success : function(json) {
       var conta=json.rowCount;
       var tabla2;

             
       for(i=0;i<conta;i++){
           tabla2 = tabla2+"<tr><td><label id='año"+i+"' name='año"+i+"'>"+json.rows[i].anio+"</label></td><td><label id='tot"+i+"'>"+json.rows[i].completo+"</label></td>"+
                "</label></td><td><label id='nivel"+i+"'>"+json.rows[i].estado_meta+"</label></td>";
         // condiciones para insertartar el estado rojo verde o amarillo segun el estado de meta y segun los rangos establecidos en los manuales
          //en caso de que el simbolo del rango adecuado sea '= '
          if(json.rows[i].sim_Rango_A === '= '){
            if(json.rows[i].estado_meta == json.rows[i].num_Rango_A){
              tabla2 = tabla2+'<td ><img id="est" src="/images/orange.svg" alt="ORANGE" title="La Meta del Nivel de Formación Docentes se ha Alejado ('+json.rows[i].estado_meta+'% de '+json.rows[i].num_Rango_MA+'%)"></td></tr>';
            }
            else if(json.rows[i].sim_Rango_MA === '> '){
              if(json.rows[i].estado_meta > json.rows[i].num_Rango_MA){
                tabla2 = tabla2+'<td ><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta del Nivel de Formación Docentes Alcanzada ('+json.rows[i].estado_meta+'% de '+json.rows[i].num_Rango_MA+'%)"></td></tr>';

              }
              else{
                tabla2 = tabla2+'<td ><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Formación Docentes no Alcanzada ('+json.rows[i].estado_meta+'% de '+json.rows[i].num_Rango_MA+'%)"></td></tr>';

              }

            }
            else if(json.rows[i].sim_Rango_MA === '< '){
              
              if(json.rows[i].estado_meta < json.rows[i].num_Rango_MA){
                tabla2 = tabla2+'<td ><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta del Nivel de Formación Docentes Alcanzada ('+json.rows[i].estado_meta+'% de '+json.rows[i].num_Rango_MA+'%)"></td></tr>';
              }
              else{
                tabla2 = tabla2+'<td ><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Formación Docentes no Alcanzada ('+json.rows[i].estado_meta+'% de '+json.rows[i].num_Rango_MA+'%)"></td></tr>';

              }

            }
          }

          //en caso de que el simbolo del rango muy adecuado sea el simbolo de mayor '>'
          else if(json.rows[i].sim_Rango_MA === '> '){ 
            if(json.rows[i].estado_meta >= json.rows[i].num_Rango_MA){
              tabla2 = tabla2+'<td ><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta del Nivel de Formación Docentes Alcanzada ('+json.rows[i].estado_meta+'% de '+json.rows[i].num_Rango_MA+'%)"></td></tr>';
            }
            else if(json.rows[i].sim_Rango_A === '> '){
              if(json.rows[i].estado_meta >= json.rows[i].num_Rango_A){
                tabla2 = tabla2+'<td ><img id="est" src="/images/orange.svg" alt="ORANGE" title="La Meta del Nivel de Formación Docentes se ha Alejado ('+json.rows[i].estado_meta+'% de '+json.rows[i].num_Rango_MA+'%)"></td></tr>';
              }
              else{                
                tabla2 = tabla2+'<td ><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Formación Docentes no Alcanzada ('+json.rows[i].estado_meta+'% de '+json.rows[i].num_Rango_MA+'%)"></td></tr>';

              } 
            }
            else if(json.rows[i].sim_Rango_A === '< ' && json.rows[i].sim_Rango_I === '< ' ){
              if(json.rows[i].estado_meta <= json.rows[i].num_Rango_A && json.rows[i].estado_meta > json.rows[i].num_Rango_I){
                tabla2 = tabla2+'<td ><img id="est" src="/images/orange.svg" alt="ORANGE" title="La Meta del Nivel de Formación Docentes se ha Alejado ('+json.rows[i].estado_meta+'% de '+json.rows[i].num_Rango_MA+'%)"></td></tr>';
              }
              else if(json.rows[i].estado_meta <= json.rows[i].num_Rango_I){
                tabla2 = tabla2+'<td ><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Formación Docentes no Alcanzada ('+json.rows[i].estado_meta+'% de '+json.rows[i].num_Rango_MA+'%)"></td></tr>';
              }

            }       
          }
           //en caso de que el simbolo del rango muy adecuado sea el simbolo de menor '<' 
          else if(json.rows[i].sim_Rango_MA === '< '){            
            if(json.rows[i].estado_meta <= json.rows[i].num_Rango_MA){
              tabla2 = tabla2+'<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta del Nivel de Deserción Alcanzada ('+json.rows[i].estado_meta+'% de '+json.rows[i].num_Rango_MA+'%)"></td>';
            }
            else if(json.rows[i].sim_Rango_A === '> '){  
                         
              if(json.rows[i].estado_meta > json.rows[i].num_Rango_A && json.rows[i].estado_meta <= json.rows[i].num_Rango_I ){
                tabla2 = tabla2+'<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Deserción se esta alejando de la meta ('+json.rows[i].estado_meta+'% de '+json.rows[i].num_Rango_MA+'%)"></td>';
              }
              else{                 
                tabla2 = tabla2+'<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Deserción no alcanzada ('+json.rows[i].estado_meta+'% de '+json.rows[i].num_Rango_MA+'%)"></td>';

              }              
            }
            else if(json.rows[i].sim_Rango_A === '< '){
              if(json.rows[i].sim_Rango_I === '> '){
                if(json.rows[i].estado_meta <= json.rows[i].num_Rango_A && json.rows[i].estado_meta > json.rows[i].num_Rango_MA){
                  tabla2 = tabla2+'<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Deserción se esta alejando de la meta ('+json.rows[i].estado_meta+'% de '+json.rows[i].num_Rango_MA+'%)"></td>';
                }
                else {
                  tabla2 = tabla2+'<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Deserción no alcanzada ('+json.rows[i].estado_meta+'% de '+json.rows[i].num_Rango_MA+'%)"></td>';

                }
              }
            }
           
          }
          
          //en caso de que el simbolo del rango muy adecuado sea '= '
          if(json.rows[i].sim_Rango_MA === '= '){
            if(json.rows[i].estado_meta == json.rows[i].num_Rango_MA){
              tabla2 = tabla2+'<td ><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta del Nivel de Formación Docentes Alcanzada ('+json.rows[i].estado_meta+'% de '+json.rows[i].num_Rango_MA+'%)"></td></tr>';
            }
            else if(json.rows[i].sim_Rango_A === '> '){
              if(json.rows[i].estado_meta > json.rows[i].num_Rango_A){
                tabla2 = tabla2+'<td ><img id="est" src="/images/orange.svg" alt="ORANGE" title="La Meta del Nivel de Formación Docentes se ha Alejado ('+json.rows[i].estado_meta+'% de '+json.rows[i].num_Rango_MA+'%)"></td></tr>';
                

              }
              else{
                tabla2 = tabla2+'<td ><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Formación Docentes no Alcanzada ('+json.rows[i].estado_meta+'% de '+json.rows[i].num_Rango_MA+'%)"></td></tr>';

              }

            }
            else if(json.rows[i].sim_Rango_A === '< '){
              if(json.rows[i].sim_Rango_I === '< '){
                if(json.rows[i].estado_meta <= json.rows[i].num_Rango_A && json.rows[i].estado_meta > json.rows[i].num_Rango_I){
                  tabla2 = tabla2+'<td ><img id="est" src="/images/orange.svg" alt="ORANGE" title="La Meta del Nivel de Formación Docentes se ha Alejado  ('+json.rows[i].estado_meta+'% de '+json.rows[i].num_Rango_MA+'%)"></td></tr>';
                }
                else{
                  tabla2 = tabla2+'<td ><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Formación Docentes no Alcanzada ('+json.rows[i].estado_meta+'% de '+json.rows[i].num_Rango_MA+'%)"></td></tr>';

                }
              }

              if(json.rows[i].sim_Rango_I === '> '){
                if(json.rows[i].estado_meta <= json.rows[i].num_Rango_A ){
                  tabla2 = tabla2+'<td ><img id="est" src="/images/orange.svg" alt="ORANGE" title="La Meta del Nivel de Formación Docentes se ha Alejado  ('+json.rows[i].estado_meta+'% de '+json.rows[i].num_Rango_MA+'%)"></td></tr>';
                }
                else{
                  tabla2 = tabla2+'<td ><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Formación Docentes no Alcanzada ('+json.rows[i].estado_meta+'% de '+json.rows[i].num_Rango_MA+'%)"></td></tr>';

                }
              }

            }
          }
         
       }       

       $("#datBody2").append(tabla2);

       var arra2=[];
        //ciclo para llenar  el array llamado arra con los datos que vana contener las diferentes graficas
       for(var i =conta-1; i>=conta-5;i--){
         var programa = {
            "anio": json.rows[i].anio,
            "cantidad": json.rows[i].estado_meta
         }
         arra2.push(programa);

       }       
       //cambio de graficas de barras
      $("#graph2").change(function () {
        if($(this).val() === '1'){
          columnGraph(arra2,divgraph2,'Nivel de Formación Docentes','anio','cantidad',0,0);
        }
        else if($(this).val() === '2'){
          columnGraph(arra2,divgraph2,'Nivel de Formación Docentes','anio','cantidad',40,30);
        }
        else if($(this).val() === '3'){
          barGraph(arra2,divgraph2,'Nivel de Formación Docentes','anio','cantidad',0,0);
         
        }
        else if($(this).val() === '4'){
          barGraph(arra2,divgraph2,'Nivel de Formación Docentes','anio','cantidad',40,30);
          
        }
        else if($(this).val() === '5'){
           lineGraph(arra2,divgraph2,'Nivel de Formación Docentes','anio','cantidad');
        }
        else if($(this).val() === '6'){
          areaGraph(arra2,divgraph2,'Nivel de Formación Docentes','anio','cantidad');
        }
        
        
        
      });
      columnGraph(arra2,divgraph2,'Nivel de Formación Docentes','anio','cantidad',0,0);
     }

  });   

 }

  function Load_yearfirst_time(){
    $.ajax({
     type: "GET", //el el tipo de peticion puede ser GET y POsT
     url: "consultaFormacion", //la url del que realizara la consulta
     dataType : 'json',
     data:{c:2},//Primera consulta
     //se ejecutasi todo se realiza bien
     success : function(json) {
       var r2="";
       for(var j = 0 ; j<json.rowCount; j++){
         r2 = r2+"<option value='"+json.rows[j].anio+"'>"+ json.rows[j].anio+"</option> ";
       }
       $("#lst_Anio5").append(r2);
      }
   });
  }

  // ajax para consulta de formacion docente por año

  $('#frmformacion').submit(function(event) {
    //se coloca los datos del form en el formato adecuado para enviar al server
    var formData = {
          //aqui se encriptan en MD5 antes de enviar
          'anio': $('#lst_Anio5').val(),
          'c':1
        };
    //el metodo ajax para consulta asyncronica
    $.ajax({
     type: "POST", //el el tipo de peticion puede ser GET y POsT
     url: "consultaFormacion", //la url del que realizara la consulta
     data: formData, //los datos que seran enviados al server
     dataType : 'json', //el formato de datos enviados y devueltos del server
     //se ejecutasi todo se realiza bien
     success : function(json) {
       $("#datBody").html('');
       $("#titulo").html('');
       var r="";//variable para llenar los datos y el html e cada una de las filas
       var tittle="";
       var conta=json.rowCount;
       // condicion para verificar que los datos de todos los niveles de formacion del año seleccionado esten en la BD
       if(conta == 4 && json.rows[1].t_completo != null ){
         //ciclo para llenar los datos en las filas en r
          for(var i = 0 ; i<4; i++){
            r = r+"<tr><td><label id='forma"+i+"' name='forma"+i+"'>"+json.rows[i].nom_formacion+
            "</label></td><td><label id='tot"+i+"'>"+json.rows[i].t_completo+"</label></td></tr>";            
          }

          tittle="Nivel de formación de docentes tiempo completo del año: "+json.rows[conta-3].anio;
          $("#datBody").append(r);
          $("#titulo").append(tittle);

          var arra=[];

          for(var i =0; i<4;i++){
            var programa = {
              "nivel": json.rows[i].nom_formacion,
              "cantidad": json.rows[i].t_completo
            }
            arra.push(programa);

          }

         // calculo de la meta del indicador para cada nivel de formacion en porcentajes
        var sumaDocMaes=0;
        var sumatotal=0;
        var total=0;

        for(var i =0; i<conta;i++){
          sumatotal+=json.rows[i].t_completo;
          if(json.rows[i].nom_formacion == 'Doctor'){
            sumaDocMaes=json.rows[i].t_completo;
          }
          else if(json.rows[i].nom_formacion == 'Magíster'){
            sumaDocMaes+=json.rows[i].t_completo;
          }              
        }
        total=(sumaDocMaes/sumatotal)*100;
        total=total.toFixed(2);



          //cambio de graficas de barras
            $("#graph1").change(function () {
              if($(this).val() === '1'){
                columnGraph(arra,divgraph1,'Docentes tiempo completo','nivel','cantidad',0,0);
              }
              else if($(this).val() === '2'){
                columnGraph(arra,divgraph1,'Docentes tiempo completo','nivel','cantidad',40,30);
              }
              else if($(this).val() === '3'){
                lineGraph(arra,divgraph1,'Docentes tiempo completo','nivel','cantidad');
              }
              else if($(this).val() === '4'){
                areaGraph(arra,divgraph1,'Docentes tiempo completo','nivel','cantidad');
              }
              if($(this).val() === '5'){
                barGraph(arra,divgraph1,'Docentes tiempo completo','nivel','cantidad',0,0);
              }
              else if($(this).val() === '6'){
                barGraph(arra,divgraph1,'Docentes tiempo completo','nivel','cantidad',40,30);
              }
              else if($(this).val() === '7'){
                pieGraph(arra, divgraph1, "anio", "cantidad","Porcentaje Docentes Tiempo Completo");
              }
              else if($(this).val() === '8'){
                pieGraph3D(arra, divgraph1, "anio", "cantidad","Porcentaje Docentes Tiempo Completo");
              }
            });

          //grafica por defecto
           pieGraph(arra, divgraph1, "anio", "cantidad","Porcentaje Docentes Tiempo Completo");

           //semaforo divgraph4 
            //toma los datos de los manuales del indicador para graficar el acelerometro           
              
            if(json.rows[2].sim_Rango_MA == '< ' && json.rows[2].sim_Rango_I == '> '){
                
              gaugesGraph(json.rows[2].estado_meta,divgraph4,'g','y','r',json.rows[2].num_Rango_MA,json.rows[2].num_Rango_I, 'Indicador de Meta', '%',100);
              
            } 

            else if(json.rows[0].sim_Rango_MA === '= ' && json.rows[0].sim_Rango_A == '< ' && json.rows[0].sim_Rango_A == '> ' ){    
                        
              gaugesGraph(json.rows[0].relacion_docentes,divgraph4,'y','g','r',json.rows[0].num_Rango_I,json.rows[0].num_Rango_MA, 'Indicador de Meta', '%',100);
              
            }              

            else if(json.rows[0].sim_Rango_MA === '= ' && json.rows[0].sim_Rango_A == '< ' && json.rows[0].sim_Rango_A == '< ' ){
              //alert('los simbolos para los rangos Adecuado e inadecuado no pueden ser el simbolo menor(<). por ende la grafica del estado del indicador (velocimetro) no se mostrara');
               $("#messageError").html("los simbolos para los rangos Adecuado e inadecuado no pueden ser el simbolo menor(<).");
               $('#myModal').modal('show');
              
            }

            else{                               
              gaugesGraph(json.rows[2].estado_meta,divgraph4,'r','y','g',json.rows[2].num_Rango_I,json.rows[2].num_Rango_MA, 'Indicador de Meta', '%',100);
             
            }       

       }
       else{
          $("#messageError").html("el año seleccionado no tiene suficientes datos para ser visualizado. Por favor seleccione otro año ");
          $('#myModal').modal('show');
         /*alert('el año seleccionado no tiene suficientes datos. Por favor llene todos los datos de formacion docentes correspondientes a este año ');
         $("#lst_Anio5").html('');
         Load_first_time();
         Load_yearfirst_time();*/
       }


     }
   });
   closedivfilter();
  event.preventDefault()
  });

  $("#btnfil").click(function (){
        opendivfilter();
  });

  //funciones para el modal

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
});
