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
       //ciclo para llenar los datos en las filas en r
       for(var i = conta-4 ; i<conta; i++){
         r = r+"<tr><td><label id='forma"+i+"' name='forma"+i+"'>"+json.rows[i].formacion+
         "</label></td><td><label id='tot"+i+"'>"+json.rows[i].t_completo+"</label></td></tr>";
       }

       tittle="Formacion docentes del año: "+json.rows[conta-3].anio;
       $("#datBody").append(r);
       $("#titulo").append(tittle);

       var arra=[];

       for(var i =conta-4; i<conta;i++){
         var programa = {
           "nivel": json.rows[i].formacion,
           "cantidad": json.rows[i].t_completo,
           "color": colo3[i]
         }
         arra.push(programa);

       }
       var doctor=((json.rows[conta-4].t_completo *100)/50).toFixed(2);
       var especia=((json.rows[conta-3].t_completo *100)/60).toFixed(2);
       var magist=((json.rows[conta-2].t_completo*100)/150).toFixed(2);
       var profes=json.rows[conta-1].t_completo;

       var nomdoc=json.rows[conta-4].formacion;
       var nomesp=json.rows[conta-3].formacion;
       var nommag=json.rows[conta-2].formacion;
       var nompro=json.rows[conta-1].formacion;

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

       //
       columnGraph(arra, "divgraph1", "Docentes tiempo completo", "nivel", "cantidad",0,0);
        // Cambio de graficas de pastel
      $("#graph2").change(function () {
        if($(this).val() === '1'){
           pieGraph(arra, divgraph2, "nivel", "cantidad");
        }
        else{
           pieGraph3D(arra, divgraph2, "nivel", "cantidad");
        }
      });
       pieGraph(arra, "divgraph2", "nivel", "cantidad");
       if(doctor>100){
         doctor=100;
         gaugesGraph(doctor,divsem1,'r','y','g',25,50, 'Doctor', '%');
       }
       else {gaugesGraph(doctor,divsem1,'r','y','g',25,50, 'Doctor', '%');}
       if(especia>100){
         especia=100;
         gaugesGraph(especia,divsem2,'r','y','g',30,60, 'Especialista', '%');
       }
       else{
         gaugesGraph(especia,divsem2,'r','y','g',30,60, 'Especialista', '%');
       }
       if(magist>100){
         magist=100;
         gaugesGraph(magist,divsem3,'r','y','g',40,70, 'Magister', '%');
       }
       else{
         gaugesGraph(magist,divsem3,'r','y','g',40,70, 'Magister', '%');
       }

       gaugesGraph(profes,divsem4,'g','y','r',40,70, 'Cantidad Profesionales', ' ');
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
       $("#lst_Anio").append(r2);
      }
   });
  }

  // ajax para consulta de formacion docente por año

  $('#frmformacion').submit(function(event) {
    //se coloca los datos del form en el formato adecuado para enviar al server
    var formData = {
          //aqui se encriptan en MD5 antes de enviar
          'anio': $('#lst_Anio').val()
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
       //ciclo para llenar los datos en las filas en r
       for(var i = conta-4 ; i<conta; i++){
         r = r+"<tr><td><label id='forma"+i+"' name='forma"+i+"'>"+json.rows[i].formacion+
         "</label></td><td><label id='tot"+i+"'>"+json.rows[i].t_completo+"</label></td></tr>";
       }

       tittle="Formacion docentes del año: "+json.rows[conta-3].anio;
       $("#datBody").append(r);
       $("#titulo").append(tittle);

       var arra=[];

       for(var i =0; i<4;i++){
         var programa = {
           "nivel": json.rows[i].formacion,
           "cantidad": json.rows[i].t_completo,
           "color": colo3[i]
         }
         arra.push(programa);

       }
       var doctor=((json.rows[0].t_completo *100)/50).toFixed(2);
       var especia=((json.rows[1].t_completo *100)/60).toFixed(2);
       var magist=((json.rows[2].t_completo*100)/150).toFixed(2);
       var profes=json.rows[3].t_completo;

       var nomdoc=json.rows[0].formacion;
       var nomesp=json.rows[1].formacion;
       var nommag=json.rows[2].formacion;
       var nompro=json.rows[3].formacion;

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
       columnGraph(arra,divgraph1,'Docentes tiempo completo','nivel','cantidad',0,0);rs
       // Cambio de graficas de pastel
      $("#graph2").change(function () {
        if($(this).val() === '1'){
           pieGraph(arra, divgraph2, "nivel", "cantidad");
        }
        else{
           pieGraph3D(arra, divgraph2, "nivel", "cantidad");
        }
      });

       pieGraph(arra, divgraph2, "nivel", "cantidad");

       if(doctor>100){
         doctor=100;
         gaugesGraph(doctor,divsem1,'r','y','g',25,50, 'Doctor', '%');
       }
       else {gaugesGraph(doctor,divsem1,'r','y','g',25,50, 'Doctor', '%');}
       if(especia>100){
         especia=100;
         gaugesGraph(especia,divsem2,'r','y','g',30,60, 'Especialista', '%');
       }
       else{
         gaugesGraph(especia,divsem2,'r','y','g',30,60, 'Especialista', '%');
       }
       if(magist>100){
         magist=100;
         gaugesGraph(magist,divsem3,'r','y','g',40,70, 'Magister', '%');
       }
       else{
         gaugesGraph(magist,divsem3,'r','y','g',40,70, 'Magister', '%');
       }
       gaugesGraph(profes,divsem4,'g','y','r',40,70, 'Cantidad Profesionales', ' ');
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
