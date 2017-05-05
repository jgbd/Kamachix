$(document).ready(function(){


  Load_first_time();


  // tonos verdes aleatorios
  function aleatorio(inferior,superior){
    numPosibilidades = superior - inferior
    aleat = Math.random() * numPosibilidades
    aleat = Math.floor(aleat)
    return parseInt(inferior) + aleat
  }
  // para pintar las graficas de diferentes tonos de color verde
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



  function Load_first_time(){
    $.ajax({
     type: "GET", //el el tipo de peticion puede ser GET y POsT
     url: "consultaTCHC", //la url del que realizara la consulta
     dataType : 'json',
     data:{c:1},//Primera consulta
     //se ejecutasi todo se realiza bien
     success : function(json) {
       $("#txtjson").val(JSON.stringify(json));
       $("#datBody").html('');
       var r="";
       var r2="";
       var conta = json.rowCount;
       if(json.rows[0].relacion_docentes==null){
        for(var i = 1 ; i<6; i++){
          r = r+"<tr><td><label id='anio"+i+"' name='anio"+i+"'>"+json.rows[i].anio+
          "</label></td><td><label id='tc"+i+"'>"+json.rows[i].cant_docentes_tc+"</label>"+
          "</label></td><td><label id='hc"+i+"'>"+json.rows[i].cant_docentes_hc+"</label>"+
          "</label></td><td><label id='tot"+i+"'>"+json.rows[i].relacion_docentes+"</label></td>";
          if(json.rows[i].relacion_docentes<=1){
            
            r=r+'<td><img id="est" src="/images/red.PNG" alt="RED" title="la relacion docentes TC frente a docentes HC es muy baja ('+json.rows[i].relacion_docentes/1000+'de 2)"></td></tr>';
          }          
          else if(json.rows[i].relacion_docentes>1.4 && json.rows[i].relacion_docentes<=1.8 || json.rows[i].relacion_docentes>2.2 && json.rows[i].relacion_docentes<=2.6 ){
            
            r=r+'<td><img id="est" src="/images/orange.PNG" alt="ORANGE" title="la relacion docentes se  esta alejando de la meta"></td></tr>';
          } 
          else if(json.rows[i].relacion_docentes>=2.6){
              r=r+'<td><img id="est" src="/images/red.PNG" alt="RED" title="la relacion docentes TC frente a docentes HC es muy alta ('+json.rows[i].relacion_docentes/1000+'de 2)"></td></tr>';
          }
              
          else {
            
            r=r+'<td ><img id="est" src="/images/verde.png" alt="GREEN" title="la relacion docentes es buena "></td></tr>';
          }

        }

        //datos para el filtro
        for(var j = 1 ; j<conta; j++){
          r2 = r2+"<option value='"+ json.rows[j].anio +"' >"+ json.rows[j].anio+"</option>";
        }
        // se llena los Filtros
        $("#lstfilter1").append(r2);
        $("#lstfilter2").append(r2);
        //se llena la tabla
        $("#datBody").append(r);

        // titulo
        tittle="Porcentaje de Docentes de  TC con relación a los  Docentes HC de los ultimos 5 años";
        $("#titulo").append(tittle);

        //arreglo para la grafica de la division 4 con la relacion de docentes

        var arra=[];

        for(var i =1; i<6;i++){
          var programa = {
            "anio": json.rows[i].anio,
            "cantidad": json.rows[i].relacion_docentes
            
          }
          arra.push(programa);
        }

        //arreglo para la grafica de la division 2 con docentes tiempo completo
        var arra2=[];
        for(var i =1; i<6;i++){
          var programa2 = {
            "anio": json.rows[i].anio,
            "cantidad": json.rows[i].cant_docentes_tc           
          }
          arra2.push(programa2);

        }
        //arreglo para la grafica de la division 3 con docentes hora catedra
        var arra3=[];
        for(var i =1; i<6;i++){
          var programa3 = {
            "anio": json.rows[i].anio,
            "cantidad": json.rows[i].cant_docentes_hc
            
          }
          arra3.push(programa3);

        }
       }
       else{
         for(var i = 0 ; i<5; i++){
          r = r+"<tr><td><label id='anio"+i+"' name='anio"+i+"'>"+json.rows[i].anio+
          "</label></td><td><label id='tc"+i+"'>"+json.rows[i].cant_docentes_tc+"</label>"+
          "</label></td><td><label id='hc"+i+"'>"+json.rows[i].cant_docentes_hc+"</label>"+
          "</label></td><td><label id='tot"+i+"'>"+json.rows[i].relacion_docentes+"</label></td>";
          if(json.rows[i].relacion_docentes<=1){
            
            r=r+'<td><img id="est" src="/images/red.PNG" alt="RED" title="la relacion docentes TC frente a docentes HC es muy baja ('+json.rows[i].relacion_docentes/1000+'de 2)"></td></tr>';
          }          
          else if(json.rows[i].relacion_docentes>1.4 && json.rows[i].relacion_docentes<=1.8 || json.rows[i].relacion_docentes>2.2 && json.rows[i].relacion_docentes<=2.6 ){
            
            r=r+'<td><img id="est" src="/images/orange.PNG" alt="ORANGE" title="la relacion docentes se  esta alejando de la meta"></td></tr>';
          } 
          else if(json.rows[i].relacion_docentes>=2.6){
              r=r+'<td><img id="est" src="/images/red.PNG" alt="RED" title="la relacion docentes TC frente a docentes HC es muy alta ('+json.rows[i].relacion_docentes/1000+'de 2)"></td></tr>';
          }
              
          else {
            
            r=r+'<td ><img id="est" src="/images/verde.png" alt="GREEN" title="la relacion docentes es buena "></td></tr>';
          }

        }

        //datos para el filtro
        for(var j = 0 ; j<conta; j++){
          r2 = r2+"<option value='"+ json.rows[j].anio +"' >"+ json.rows[j].anio+"</option>";
        }
        // se llena los Filtros
        $("#lstfilter1").append(r2);
        $("#lstfilter2").append(r2);
        //se llena la tabla
        $("#datBody").append(r);

        // titulo
        tittle="Porcentaje de Docentes de  TC con relación a los  Docentes HC de los ultimos 5 años";
        $("#titulo").append(tittle);

        //arreglo para la grafica de la division 4 con la relacion de docentes

        var arra=[];

        for(var i =0; i<5;i++){
          var programa = {
            "anio": json.rows[i].anio,
            "cantidad": json.rows[i].relacion_docentes
            
          }
          arra.push(programa);
        }

        //arreglo para la grafica de la division 2 con docentes tiempo completo
        var arra2=[];
        for(var i =0; i<5;i++){
          var programa2 = {
            "anio": json.rows[i].anio,
            "cantidad": json.rows[i].cant_docentes_tc           
          }
          arra2.push(programa2);

        }
        //arreglo para la grafica de la division 3 con docentes hora catedra
        var arra3=[];
        for(var i =0; i<5;i++){
          var programa3 = {
            "anio": json.rows[i].anio,
            "cantidad": json.rows[i].cant_docentes_hc
            
          }
          arra3.push(programa3);

        }
       }
       //cambio de graficas de barras docentes tiempo completo
        $("#graph1").change(function () {
          if($(this).val() === '1'){
            columnGraph(arra2,divgraph1,'Docentes tiempo completo','anio','cantidad',0,0);
          }
          else if($(this).val() === '2'){
            columnGraph(arra2,divgraph1,'Docentes tiempo completo','anio','cantidad',40,30);
          }
          else if($(this).val() === '3'){
            lineGraph(arra2,divgraph1,'Docentes tiempo completo','anio','cantidad');
          }
          else if($(this).val() === '4'){
            areaGraph(arra2,divgraph1,'Docentes tiempo completo','anio','cantidad');
          }
          else if($(this).val() === '5'){
            barGraph(arra2,divgraph1,'Docentes tiempo completo','anio','cantidad',0,0);
          }
          else if($(this).val() === '6'){
            barGraph(arra2,divgraph1,'Docentes tiempo completo','anio','cantidad',40,30);
          }
           else if($(this).val() === '7'){
            pieGraph(arra2, divgraph1, "anio", "cantidad","Docentes tiempo completo");
          }
          else if($(this).val() === '8'){
            pieGraph3D(arra2, divgraph1, "anio", "cantidad","Docentes tiempo completo");
          }
        });

       //   
       columnGraph(arra2,divgraph1,"Docentes tiempo completo","anio","cantidad",0,0);

       //cambio de graficas de barras hora catedra
        $("#graph2").change(function () {
          if($(this).val() === '1'){
            columnGraph(arra3,divgraph2,'Docentes hora catedra','anio','cantidad',0,0);
          }
          else if($(this).val() === '2'){
            columnGraph(arra3,divgraph2,'Docentes hora catedra','anio','cantidad',40,30);
          }
          else if($(this).val() === '3'){
            lineGraph(arra3,divgraph2,'Docentes hora catedra','anio','cantidad');
          }
          else if($(this).val() === '4'){
            areaGraph(arra3,divgraph2,'Docentes hora catedra','anio','cantidad');
          }
          else if($(this).val() === '5'){
            barGraph(arra3,divgraph2,'Docentes hora catedra','anio','cantidad',0,0);
          }
          else if($(this).val() === '6'){
            barGraph(arra3,divgraph2,'Docentes hora catedra','anio','cantidad',40,30);
          }
          else if($(this).val() === '7'){
            pieGraph(arra3, divgraph2, "anio", "cantidad","Docentes hora catedra");
          }
          else if($(this).val() === '8'){
            pieGraph3D(arra3, divgraph2, "anio", "cantidad","Docentes hora catedra");
          }
        });

       //   
       columnGraph(arra3,divgraph2,"Docentes hora catedra","anio","cantidad",0,0);
       // cambio de grafica de tendencia relacion docentes
       $("#graph3").change(function () {

          if($(this).val() === '1'){
            columnGraph(arra,divgraph3,'Relacion docentes','anio','cantidad',0,0);
          }
          else if($(this).val() === '2'){
            columnGraph(arra,divgraph3,'Relacion docentes','anio','cantidad',40,30);
          }
          else if($(this).val() === '3'){
            lineGraph(arra,divgraph3," Relacion docentes","anio","cantidad");
          }
          else if($(this).val() === '4'){
            areaGraph(arra,divgraph3," Relacion docentes","anio","cantidad");
          } 
          else if($(this).val() === '5'){
            barGraph(arra,divgraph3,'Relacion docentes','anio','cantidad',0,0);
          }
          else if($(this).val() === '6'){
            barGraph(arra,divgraph3,'Relacion docentes','anio','cantidad',40,30);
          }
          else if($(this).val() === '7'){
            pieGraph(arra, divgraph3, "anio", "cantidad","Relacion docentes");
          }
          else if($(this).val() === '8'){
            pieGraph3D(arra, divgraph3, "anio", "cantidad","Relacion docentes");
          }

      });
       lineGraph(arra,divgraph3," Relacion docentes","anio","cantidad");
     }
   });
 }

  //gaugesGraph(profes,divgraph3,);

  // ajax para consulta de formacion docente por año

  $('#frmRelacion').submit(function(event) {
    // invierte los valores si el primer año es menor al segundo año seleccionado
    var formData;
    if($('#lstfilter1').val() > $('#lstfilter2').val()){
      //se coloca los datos del formData en el formato adecuado para enviar al server
      formData = {
        //se toman los dos años seleccionados
        'year': $('#lstfilter2').val(),
        'year2': $('#lstfilter1').val()
      };
    }
    else{
      //se coloca los datos del formData en el formato adecuado para enviar al server
      formData = {
        //se toman los dos años seleccionados
        'year': $('#lstfilter1').val(),
        'year2': $('#lstfilter2').val()
      };
    }


    //el metodo ajax para consulta asyncronica
    $.ajax({
     type: "POST", //el el tipo de peticion puede ser GET y POsT
     url: "consultaTCHC", //la url del que realizara la consulta
     data: formData, //los datos que seran enviados al server
     dataType : 'json', //el formato de datos enviados y devueltos del server
     //se ejecutasi todo se realiza bien
     success : function(json) {
       $("#datBody").html('');
       $("#titulo").html('');
       var r="";
       var final="";
       var conta = json.rowCount;

       for(var i = 0 ; i<conta; i++){
         r = r+"<tr><td><label id='anio"+i+"' name='anio"+i+"'>"+json.rows[i].anio+
         "</label></td><td><label id='tc"+i+"'>"+json.rows[i].cant_docentes_tc+"</label>"+
         "</label></td><td><label id='hc"+i+"'>"+json.rows[i].cant_docentes_hc+"</label>"+
         "</label></td><td><label id='tot"+i+"'>"+json.rows[i].relacion_docentes+"</label></td>";
         
         if(json.rows[i].relacion_docentes<=1){
           
           r=r+'<td><img id="est" src="/images/red.PNG" alt="RED" title="la relacion docentes TC frente a docentes HC es muy baja ('+json.rows[i].relacion_docentes/1000+'de 2)"></td></tr>';
         }          
         else if(json.rows[i].relacion_docentes>1.4 && json.rows[i].relacion_docentes<=1.8 || json.rows[i].relacion_docentes>2.2 && json.rows[i].relacion_docentes<=2.6 ){
           
           r=r+'<td><img id="est" src="/images/orange.PNG" alt="ORANGE" title="la relacion docentes se  esta alejando de la meta"></td></tr>';
         } 
         else if(json.rows[i].relacion_docentes>=2.6){
            r=r+'<td><img id="est" src="/images/red.PNG" alt="RED" title="la relacion docentes TC frente a docentes HC es muy alta ('+json.rows[i].relacion_docentes/1000+'de 2)"></td></tr>';
         }
             
        else {
          
          r=r+'<td ><img id="est" src="/images/verde.png" alt="GREEN" title="la relacion docentes es buena "></td></tr>';
        }
          
         

       }

       // condiciones para el titulo de las graficas
       // si en los filtros se escogio que el primer año sea mayor al segundo
       if($('#lstfilter1').val() > $('#lstfilter2').val()){
         tittle="Porcentaje de Docentes de  TC con relación a los  Docentes HC <br> del Año "+$('#lstfilter2').val()+" al Año "+$('#lstfilter1').val();
       }
       // si se scogio el mismo año en los dos filtros
       else if($('#lstfilter1').val() == $('#lstfilter2').val()){
         tittle="Porcentaje de Docentes de  TC con relación a los  Docentes HC <br> del Año "+$('#lstfilter1').val();
       }
       // si se escogio que el primer año sea menor al segundo año
       else {
         tittle="Porcentaje de Docentes de  TC con relación a los  Docentes HC <br> del Año "+$('#lstfilter1').val()+" al Año "+$('#lstfilter2').val();
       }

       // se llena la tabla
       $("#datBody").append(r);
       //se coloca el titulo
       $("#titulo").append(tittle);

       var arra=[];

       for(var i =0; i<conta;i++){
         var programa = {
           "anio": json.rows[i].anio,
           "cantidad": json.rows[i].relacion_docentes
           
         }
         arra.push(programa);

       }

       //arreglo para la grafica de la division 2 con docentes tiempo completo
       var arra2=[];
       for(var i =0; i<conta;i++){
         var programa2 = {
           "anio": json.rows[i].anio,
           "cantidad": json.rows[i].cant_docentes_tc
           
         }
         arra2.push(programa2);

       }

       //arreglo para la grafica de la division 3 con docentes hora catedra
       var arra3=[];
       for(var i =0; i<conta;i++){
         var programa3 = {
           "anio": json.rows[i].anio,
           "cantidad": json.rows[i].cant_docentes_hc
           
         }
         arra3.push(programa3);

       }
       //cambio de graficas de barras docentes tiempo completo
        $("#graph1").change(function () {
          if($(this).val() === '1'){
            columnGraph(arra2,divgraph1,'Docentes tiempo completo','anio','cantidad',0,0);
          }
          else if($(this).val() === '2'){
            columnGraph(arra2,divgraph1,'Docentes tiempo completo','anio','cantidad',40,30);
          }
          else if($(this).val() === '3'){
            lineGraph(arra2,divgraph1,'Docentes tiempo completo','anio','cantidad');
          }
          else if($(this).val() === '4'){
            areaGraph(arra2,divgraph1,'Docentes tiempo completo','anio','cantidad');
          }
          else if($(this).val() === '5'){
            barGraph(arra2,divgraph1,'Docentes tiempo completo','anio','cantidad',0,0);
          }
          else if($(this).val() === '6'){
            barGraph(arra2,divgraph1,'Docentes tiempo completo','anio','cantidad',40,30);
          }
           else if($(this).val() === '7'){
            pieGraph(arra2, divgraph1, "anio", "cantidad","Docentes tiempo completo");
          }
          else if($(this).val() === '8'){
            pieGraph3D(arra2, divgraph1, "anio", "cantidad","Docentes tiempo completo");
          }
        });

       //   
       columnGraph(arra2,divgraph1,"Docentes tiempo completo","anio","cantidad",0,0);
       //cambio de graficas de barras hora catedra
        $("#graph2").change(function () {
          if($(this).val() === '1'){
            columnGraph(arra3,divgraph2,'Docentes hora catedra','anio','cantidad',0,0);
          }
          else if($(this).val() === '2'){
            columnGraph(arra3,divgraph2,'Docentes hora catedra','anio','cantidad',40,30);
          }
          else if($(this).val() === '3'){
            lineGraph(arra3,divgraph2,'Docentes hora catedra','anio','cantidad');
          }
          else if($(this).val() === '4'){
            areaGraph(arra3,divgraph2,'Docentes hora catedra','anio','cantidad');
          }
          else if($(this).val() === '5'){
            barGraph(arra3,divgraph2,'Docentes hora catedra','anio','cantidad',0,0);
          }
          else if($(this).val() === '6'){
            barGraph(arra3,divgraph2,'Docentes hora catedra','anio','cantidad',40,30);
          }
          else if($(this).val() === '7'){
            pieGraph(arra3, divgraph2, "anio", "cantidad","Docentes hora catedra");
          }
          else if($(this).val() === '8'){
            pieGraph3D(arra3, divgraph2, "anio", "cantidad","Docentes hora catedra");
          }
        });

       //   
       columnGraph(arra3,divgraph2,"Docentes hora catedra","anio","cantidad",0,0);
       // cambio de grafica de tendencia relacion docentes
       $("#graph3").change(function () {

          if($(this).val() === '1'){
            columnGraph(arra,divgraph3,'Relacion docentes','anio','cantidad',0,0);
          }
          else if($(this).val() === '2'){
            columnGraph(arra,divgraph3,'Relacion docentes','anio','cantidad',40,30);
          }
          else if($(this).val() === '3'){
            lineGraph(arra,divgraph3," Relacion docentes","anio","cantidad");
          }
          else if($(this).val() === '4'){
            areaGraph(arra,divgraph3," Relacion docentes","anio","cantidad");
          } 
          else if($(this).val() === '5'){
            barGraph(arra,divgraph3,'Relacion docentes','anio','cantidad',0,0);
          }
          else if($(this).val() === '6'){
            barGraph(arra,divgraph3,'Relacion docentes','anio','cantidad',40,30);
          }
          else if($(this).val() === '7'){
            pieGraph(arra, divgraph3, "anio", "cantidad","Relacion docentes");
          }
          else if($(this).val() === '8'){
            pieGraph3D(arra, divgraph3, "anio", "cantidad","Relacion docentes");
          }
      });
       lineGraph(arra,divgraph3,"Relacion docentes","anio","cantidad");

     }
   });
   closedivfilter();
  event.preventDefault()
  });

  //cuando hace clik en el boton de filtros se abre el modal de filtros
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
