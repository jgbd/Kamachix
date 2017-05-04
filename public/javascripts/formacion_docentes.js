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
              // calculo de la meta del indicador para cada nivel de formacion en porcentajes
             /*var especia=0;
              var doctor=0;
              var magist=0;
              var profes=0;*/
              var sumaDocMaes=0;
              var sumatotal=0;
              var total=0;

              /*for(var i =0; i<conta;i++){
                if(json.rows[i].t_completo != null && json.rows[i].nom_formacion == 'Especialista'){
                  especia +=((json.rows[i].t_completo *100)/60).toFixed(1);

                }

                else if(json.rows[i].t_completo != null && json.rows[i].nom_formacion == 'Doctor'){
                  doctor +=((json.rows[i].t_completo *100)/50).toFixed(1);
                }

                else if(json.rows[i].t_completo != null && json.rows[i].nom_formacion == 'Magister'){
                  magist+=((json.rows[i].t_completo*100)/150).toFixed(1);
                }

                else if(json.rows[i].t_completo != null && json.rows[i].nom_formacion == 'Profesional'){
                  profes+=json.rows[i].t_completo;
                }
              }*/

              for(var i =0; i<conta;i++){
                sumatotal+=json.rows[i].nom_formacion;
                if(json.rows[i].nom_formacion == 'Doctor'){
                  sumaDocMaes=json.rows[i].t_completo;
                }
                else if(json.rows[i].nom_formacion == 'Magister'){
                  sumaDocMaes+=json.rows[i].t_completo;
                }              
              }
              total=(sumaDocMaes/sumatotal)*100;
              


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
                });
              //grafica que aparecera por defecto
              columnGraph(arra, "divgraph1", "Docentes tiempo completo", "nivel", "cantidad",0,0);

              //semaforo divgraph4              
              gaugesGraph(total,divgraph4,'g','y','r',25,50, 'Indicador de Meta', '%');

                // Cambio de graficas de pastel
              $("#graph2").change(function () {
                if($(this).val() === '1'){
                  pieGraph(arra, divgraph2, "nivel", "cantidad","Porcentaje Docentes Tiempo Completo");
                }
                else{
                  pieGraph3D(arra, divgraph2, "nivel", "cantidad","Porcentaje Docentes Tiempo Completo");
                }
              });
                // grifica pie que aparece por defecto
              pieGraph(arra, "divgraph2", "nivel", "cantidad","Porcentaje Docentes Tiempo Completo");


              //semaforos divsem1
             /* if(doctor>100){
                doctor=100;
                gaugesGraph(doctor,divsem1,'r','y','g',25,50, 'Doctor', '%');
              }
              else {gaugesGraph(doctor,divsem1,'r','y','g',25,50, 'Doctor', '%');}
              if(especia>100){
                especia=100;
                gaugesGraph(especia,divsem2,'r','y','g',25,50, 'Especialista', '%');
              }
              else{
                gaugesGraph(especia,divsem2,'r','y','g',25,50, 'Especialista', '%');
              }
              if(magist>100){
                magist=100;
                gaugesGraph(magist,divsem3,'r','y','g',25,50, 'Magister', '% ');
              }
              else{
                gaugesGraph(magist,divsem3,'r','y','g',25,50, 'Magister', '% ');
              }

              gaugesGraph(profes,divsem4,'g','y','r',25,50, 'Cantidad Profesionales', ' ');
              */

            }
            // si los datos del indicador formacion docentes tienen datos para ser representados graficamente
            else {
              //ciclo para llenar los datos en las filas en r
              for(var i = 0 ; i<conta-4; i++){
                r = r+"<tr><td><label id='forma"+i+"' name='forma"+i+"'>"+json.rows[i].nom_formacion+
                "</label></td><td><label id='tot"+i+"'>"+json.rows[i].t_completo+"</label></td></tr>";
               

              }
              /*var fecha = new Date();
              var ano = fecha.getFullYear();
              alert('El año actual es: '+ano);*/
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
              // calculo de la meta del indicador para cada nivel de formacion en porcentajes
             /* var especia=0;
              var doctor=0;
              var magist=0;
              var profes=0;*/
              var sumaDocMaes=0;
              var sumatotal=0;
              var total=0;

             /* for(var i =0; i<conta-4;i++){
                if(json.rows[i].t_completo != null && json.rows[i].nom_formacion == 'Especialista'){
                  especia +=((json.rows[i].t_completo *100)/60).toFixed(1);

                }

                else if(json.rows[i].t_completo != null && json.rows[i].nom_formacion == 'Doctor'){
                  doctor +=((json.rows[i].t_completo *100)/50).toFixed(1);
                }

                else if(json.rows[i].t_completo != null && json.rows[i].nom_formacion == 'Magister'){
                  magist+=((json.rows[i].t_completo*100)/150).toFixed(1);
                }

                else if(json.rows[i].t_completo != null && json.rows[i].nom_formacion == 'Profesional'){
                  profes+=json.rows[i].t_completo;
                }
              }*/

              for(var i =0; i<conta;i++){
                sumatotal+=json.rows[i].t_completo;
                if(json.rows[i].nom_formacion == 'Doctor'){
                  sumaDocMaes=json.rows[i].t_completo;
                }
                else if(json.rows[i].nom_formacion == 'Magister'){
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
                  else if($(this).val() === '5'){
                    barGraph(arra,divgraph1,'Docentes tiempo completo','nivel','cantidad',0,0);
                  }
                  else if($(this).val() === '6'){
                    barGraph(arra,divgraph1,'Docentes tiempo completo','nivel','cantidad',40,30);
                  }
                });
              //grafica que aparecera por defecto
              columnGraph(arra, "divgraph1", "Docentes tiempo completo", "nivel", "cantidad",0,0);

              //semaforo divgraph4              
              gaugesGraph(total,divgraph4,'g','y','r',25,50, 'Indicador de Meta', '%');

                // Cambio de graficas de pastel
              $("#graph2").change(function () {
                if($(this).val() === '1'){
                  pieGraph(arra, divgraph2, "nivel", "cantidad","Porcentaje Docentes Tiempo Completo");
                }
                else{
                  pieGraph3D(arra, divgraph2, "nivel", "cantidad","Porcentaje Docentes Tiempo Completo");
                }
              });
                // grafica pie que aparece por defecto
              pieGraph(arra, "divgraph2", "nivel", "cantidad","Porcentaje Docentes Tiempo Completo");

              //semaforos
             /* if(doctor>100){
                doctor=100;
                gaugesGraph(doctor,divsem1,'r','y','g',25,50, 'Doctor', '%');
              }
              else {gaugesGraph(doctor,divsem1,'r','y','g',25,50, 'Doctor', '%');}
              if(especia>100){
                especia=100;
                gaugesGraph(especia,divsem2,'r','y','g',25,50, 'Especialista', '%');
              }
              else{
                gaugesGraph(especia,divsem2,'r','y','g',25,50, 'Especialista', '%');
              }
              if(magist>100){
                magist=100;
                gaugesGraph(magist,divsem3,'r','y','g',25,50, 'Magister', '% ');
              }
              else{
                gaugesGraph(magist,divsem3,'r','y','g',25,50, 'Magister', '% ');
              }

              gaugesGraph(profes,divsem4,'g','y','r',25,50, 'Cantidad Profesionales', ' ');
              */
            }
         }

       }
      else{
        $("#datBody").html('');
        alert('el ultimo año no tiene suficientes datos para ser vizualizado. Por favor llene todos los datos de formacion docentes correspondientes al año: '+ json.rows[0].anio);

         $("#lst_Anio5").html('');
        location.href="/"; //metodo de resireccionamiento
      }

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
            "</label></td><td><label id='tot"+i+"'>"+json.rows[i].t_completo+"</label></td>";
            if(json.rows[i].nom_formacion =='Doctor'){

              r=r+'<td class="est"><label>50</label></td></tr>';
            }
            else if(json.rows[i].nom_formacion =='Magister'){
              r=r+'<td class="est"><label>150</label></td></tr>';
            }
            else if(json.rows[i].nom_formacion =='Especialista'){
              r=r+'<td class="est"><label>60</label></td></tr>';
            }
            else{
              r=r+'<td class="est"><label>-</label></td></tr>';
            }
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
        var especia=0;
        var doctor=0;
        var magist=0;
        var profes=0;

        for(var i =0; i<4;i++){
          if(json.rows[i].t_completo != null && json.rows[i].nom_formacion == 'Especialista'){
            especia +=((json.rows[i].t_completo *100)/60).toFixed(1);

          }

          else if(json.rows[i].t_completo != null && json.rows[i].nom_formacion == 'Doctor'){
            doctor +=((json.rows[i].t_completo *100)/50).toFixed(1);
          }

          else if(json.rows[i].t_completo != null && json.rows[i].nom_formacion == 'Magister'){
            magist+=((json.rows[i].t_completo*100)/150).toFixed(1);
          }

          else if(json.rows[i].t_completo != null && json.rows[i].nom_formacion == 'Profesional'){
            profes+=json.rows[i].t_completo;
          }
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
              if($(this).val() === '5'){
                barGraph(arra,divgraph1,'Docentes tiempo completo','nivel','cantidad',0,0);
              }
              else if($(this).val() === '6'){
                barGraph(arra,divgraph1,'Docentes tiempo completo','nivel','cantidad',40,30);
              }
            });

          //
          columnGraph(arra,divgraph1,'Docentes tiempo completo','nivel','cantidad',0,0);
          // Cambio de graficas de pastel
          $("#graph2").change(function () {
            if($(this).val() === '1'){
              pieGraph(arra, divgraph2, "nivel", "cantidad","Porcentaje Docentes Tiempo Completo");
            }
            else{
              pieGraph3D(arra, divgraph2, "nivel", "cantidad","Porcentaje Docentes Tiempo Completo");
            }
          });

          pieGraph(arra, divgraph2, "nivel", "cantidad","Porcentaje Docentes Tiempo Completo");

          //graficas de acelerometro
          //Doctor
          if(doctor>100){
            doctor=100;
            gaugesGraph(doctor,divsem1,'r','y','g',25,50, 'Doctor', '%');
          }
          else {gaugesGraph(doctor,divsem1,'r','y','g',25,50, 'Doctor', '%');}
          //Especialista
          if(especia>100){
            especia=100;
            gaugesGraph(especia,divsem2,'r','y','g',30,60, 'Especialista', '%');
          }
          else{
            gaugesGraph(especia,divsem2,'r','y','g',30,60, 'Especialista', '%');
          }
          //Magister
          if(magist>100){
            magist=100;
            gaugesGraph(magist,divsem3,'r','y','g',40,70, 'Magister', '%');
          }
          else{
            gaugesGraph(magist,divsem3,'r','y','g',40,70, 'Magister', '%');
          }
          //Profesionales
          gaugesGraph(profes,divsem4,'g','y','r',40,70, 'Cantidad Profesionales', ' ');

       }
       else{
         alert('el año seleccionado no tiene suficientes datos. Por favor llene todos los datos de formacion docentes correspondientes a este año ');
         $("#lst_Anio5").html('');
         Load_first_time();
         Load_yearfirst_time();
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
