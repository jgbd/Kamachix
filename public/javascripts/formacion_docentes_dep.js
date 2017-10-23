$(document).ready(function(){

  Load_first_time();
  Load_filterfirst_time();


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



  // ajax para consulta de formacion docente por año

  $('#frmDepartamento').submit(function(event) {
    //se coloca los datos del form en el formato adecuado para enviar al server

    var formData = {
          //aqui se encriptan en MD5 antes de enviar
          'anio': $('#lst_anio').val(),
          'c':7,
          'cod':$("#lst_dep").val(),
          'periodo':$("#lst_per").val()
        };
    //el metodo ajax para consulta asyncronica
    if($('#lst_anio').val() == '0' || $("#lst_dep").val()=='0' || $("#lst_per").val()=='0') {
      $("#messageError").html("seleccione una opcion de cada lista");
      $('#myModal').modal('show');
    }
    else{
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
        if(conta == 4){
          //ciclo para llenar los datos en las filas en r
            for(var i = conta-4 ; i<conta; i++){
              r = r+"<tr><td><label id='forma"+i+"' name='forma"+i+"'>"+json.rows[i].nom_formacion+
              "</label></td><td><label id='tot"+i+"'>"+json.rows[i].t_completo+"</label></td></tr>";
            }

            tittle="Nivel de Formación Docentes Tiempo Completo de Pregrado Año: "+json.rows[conta-3].anio+"  Periodo: "+json.rows[conta-3].periodo;
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


            //cambio de graficas de barras
              $("#graph1").change(function () {
                if($(this).val() === '1'){
                  columnGraph(arra,divgraph1,'Docentes Tiempo Completo','nivel','cantidad',0,0);
                }
                else if($(this).val() === '2'){
                  columnGraph(arra,divgraph1,'Docentes Tiempo Completo','nivel','cantidad',40,30);
                }
                else if($(this).val() === '3'){
                  lineGraph(arra,divgraph1,'Docentes Tiempo Completo','nivel','cantidad');
                }
                else if($(this).val() === '4'){
                  areaGraph(arra,divgraph1,'Docentes Tiempo Completo','nivel','cantidad');
                }
                else if($(this).val() === '5'){
                  barGraph(arra,divgraph1,'Docentes Tiempo Completo','nivel','cantidad',0,0);
                }
                else if($(this).val() === '6'){
                  barGraph(arra,divgraph1,'Docentes Tiempo Completo','nivel','cantidad',40,30);
                }
                else if($(this).val() === '7'){
                  pieGraph(arra, divgraph1, "nivel", "cantidad","Porcentaje Docentes Tiempo Completo");
                }
                else if($(this).val() === '8'){
                  pieGraph3D(arra, divgraph1, "nivel", "cantidad","Porcentaje Docentes Tiempo Completo");
                }
              });

            //
            pieGraph(arra, divgraph1, "nivel", "cantidad","Porcentaje Docentes Tiempo Completo");


        }
        else{
           $("#messageError").html("El departamento seleccionado no tiene suficientes datos para ser visualizado.");
           $('#myModal').modal('show');
           
        }


      }
    });
    panoramaG();
  }


   closedivfilter();
  event.preventDefault()
  });

  $("#btnfil").click(function (){
        opendivfilter();
  });

  //funciones para el modal


});

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

// funcion para cargar los datos por primera vez
function Load_first_time(){
  $.ajax({
    type: "GET", //el el tipo de peticion puede ser GET y POsT
    url: "consultaFormacion", //la url del que realizara la consulta
    dataType : 'json',
    data:{c:3},//Primera consulta
    //se ejecutasi todo se realiza bien
    success : function(json) {
      $("#txtjson").val(JSON.stringify(json));
      $("#datBody").html('');
      var r="";//variable para llenar los datos y el html e cada una de las filas
      var conta=json.rowCount;
      //ciclo para llenar los datos en las filas en r
      for(var i = conta-4 ; i<conta; i++){
        r = r+"<tr><td><label id='forma"+i+"' name='forma"+i+"'>"+json.rows[i].nom_formacion+
        "</label></td><td><label id='tot"+i+"'>"+json.rows[i].t_completo+"</label></td></tr>";
      }

      tittle="Nivel de Formación Docentes Tiempo Completo Año: "+json.rows[conta-3].anio+" Periodo: "+json.rows[conta-3].periodo;
      $("#datBody").append(r);
      $("#titulo").append(tittle);

      var arra=[];

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
          columnGraph(arra,divgraph1,'Docentes Tiempo Completo','nivel','cantidad',0,0);
        }
        else if($(this).val() === '2'){
          columnGraph(arra,divgraph1,'Docentes Tiempo Completo','nivel','cantidad',40,30);
        }
        else if($(this).val() === '3'){
          lineGraph(arra,divgraph1,'Docentes Tiempo Completo','nivel','cantidad');
        }
        else if($(this).val() === '4'){
          areaGraph(arra,divgraph1,'Docentes Tiempo Completo','nivel','cantidad');
        }
        else if($(this).val() === '5'){
          barGraph(arra,divgraph1,'Docentes Tiempo Completo','nivel','cantidad',0,0);
        }
        else if($(this).val() === '6'){
          barGraph(arra,divgraph1,'Docentes Tiempo Completo','nivel','cantidad',40,30);
        }
        else if($(this).val() === '7'){
          pieGraph(arra, divgraph1, "nivel", "cantidad","Porcentaje Docentes Tiempo Completo");
        }
        else if ($(this).val() === '8'){
          pieGraph3D(arra, divgraph1, "nivel", "cantidad","Porcentaje Docentes Tiempo Completo");
        }
      });
      //grafica que aparece por defecto
      pieGraph(arra, divgraph1, "nivel", "cantidad","Porcentaje Docentes Tiempo Completo");


    var totalTC=0;
    for(l=0;l<json.rowCount;l++){
      totalTC +=json.rows[l].t_completo ;
    }

    }
});

//panorama general
$.ajax({
    type: "GET", //el el tipo de peticion puede ser GET y POsT
    url: "consultaFormacion", //la url del que realizara la consulta
    dataType : 'json',
    data:{c:9},//Primera consulta
    //se ejecutasi todo se realiza bien
    success : function(json) {
      var r2="";//variable para llenar los datos y el html e cada una de las filas
      var conta=json.rowCount;

      var arra2=[];


      //condicion para saber si los datos que se consultaron tienen los datos de los dos periodos de cada año
      if(json.rows[0].anio == json.rows[1].anio && json.rows[2].anio == json.rows[3].anio && json.rows[4].anio == json.rows[5].anio && json.rows[6].anio == json.rows[7].anio && json.rows[8].anio == json.rows[9].anio ){
      //ciclo para llenar el array para las graficas con los objetos de dos periodos
        for(var i =conta-1; i>=conta-10;i--){
          var y=i-1;
          var programa2;
          if(json.rows[i].periodo == '2'){
            programa2 = {
                "anio": json.rows[i].anio,
                "periodoa": json.rows[i].total,
                "periodob": json.rows[y].total

            }
          }
          else{
            programa2 = {
                "anio": json.rows[i].anio,
                "periodob": json.rows[y].total,
                "periodoa": json.rows[i].total

            }
          }

          arra2.push(programa2);
          i=i-1;
        }
        //ciclo para llenar los datos en las filas en r
        for(var i = 0 ; i<conta; i++){
          if(json.rows[i].periodo === '2 '){
            r2 = r2+"<tr><td><label id='anio"+i+"' name='anio"+i+"'>"+json.rows[i].anio+
            "</label></td><td><label id='tot"+i+"'>"+json.rows[i].total+"</label></td></tr>";

          }
        }

        //cambio de graficas
        $("#graph2").change(function () {
          if($(this).val() === '1'){
            columnTwoGraph(arra2,'divgraph2','Docentes TC Periodo A\n vs\n  Docentes TC Periodo B',json.fields[1].name,"periodob","periodoa",0,0,"Periodo A","Periodo B");
          }
          else if($(this).val() === '2'){
            columnTwoGraph(arra2,'divgraph2','Docentes TC Periodo A\n vs\n Docentes TC Periodo B',json.fields[1].name,"periodob","periodoa",40,30,"Periodo A","Periodo B");
          }
          else if($(this).val() === '3'){
            lineTwoGraph(arra2,'divgraph2','Docentes TC Periodo A\n vs\n Docentes TC Periodo B',json.fields[1].name,"periodob","periodoa","Periodo A","Periodo B");
          }
          else if($(this).val() === '4'){
            barTwoGraph(arra2,'divgraph2','Docentes TC Periodo A\n vs\n Docentes TC Periodo B',json.fields[1].name,"periodob","periodoa",0,0,"Periodo A","Periodo B");
          }
          else if($(this).val() === '5'){
            barTwoGraph(arra2,'divgraph2','Docentes TC Periodo A\n vs\n Docentes TC Periodo B',json.fields[1].name,"periodob","periodoa",40,30,"Periodo A","Periodo B");
          }
        });
        columnTwoGraph(arra2,'divgraph2','Docentes TC Periodo A\n vs\n  Docentes TC Periodo B',json.fields[1].name,"periodob","periodoa",0,0,"Periodo A","Periodo B");

      }
      //si no se cumple la condicion anterior se grafican os dtos devueltos en graficas simples indicando solamente el valor del periodo b
      else{
         var colo3=[];
      //ciclo para llenar el array para las graficas con los objetos de un periodo
        for(var i =conta-1; i>=conta-10;i--){
          var programa2;
          if(json.rows[i].periodo == '2 '){
            programa2 = {
                "anio": json.rows[i].anio,
                "periodo": json.rows[i].total,
                "color": colo3[i]
            }
            arra2.push(programa2);
          }          

        }
        //ciclo para llenar los datos en las filas en r
        for(var i = 0 ; i<conta; i++){
          if(json.rows[i].periodo === '2 '){
            r2 = r2+"<tr><td><label id='anio"+i+"' name='anio"+i+"'>"+json.rows[i].anio+
            "</label></td><td><label id='tot"+i+"'>"+json.rows[i].total+"</label></td></tr>";

          }
        }

        //cambio de graficas
        $("#graph2").change(function () {
          if($(this).val() === '1'){
            columnGraph(arra2,divgraph2,'Docentes TC Periodo B','anio','periodo',0,0);
          }
          else if($(this).val() === '2'){
            columnGraph(arra2,divgraph2,'Docentes TC Periodo B','anio','periodo',40,30);
          }
          else if($(this).val() === '3'){
            lineGraph(arra2,divgraph2,'Docentes Tiempo Completo Periodo B','anio','periodo');
          }
          else if($(this).val() === '4'){
            barGraph(arra2,divgraph2,'Docentes Tiempo Completo','anio','periodo',0,0);
          }
          else if($(this).val() === '5'){
            barGraph(arra2,divgraph2,'Docentes Tiempo Completo','anio','periodo',40,30);
          }
        });
        //grafica que aparece por defecto
        columnGraph(arra2,divgraph2,'Docentes TC Periodo B','anio','periodo',0,0);

      }

      tittle2=json.rows[conta-3].name+" <br><br> Nivel de Formación Docentes Tiempo Completo de los Últimos 5 Años";
      $("#datBody2").append(r2);
      $("#titulo2").append(tittle2);


    }
});
}

function Load_filterfirst_time(){
  $.ajax({
    type: "GET", //el el tipo de peticion puede ser GET y POsT
    url: "consultaFormacion", //la url del que realizara la consulta
    dataType : 'json',
    data:{c:4},//Primera consulta
    //se ejecutasi todo se realiza bien
    success : function(json) {
      $("#lst_dep").append('<option value="0" selected>Seleccionar Departamento</option>');
      $("#lst_anio").append('<option value="0" selected>Seleccionar Año</option>');
      $("#lst_per").append('<option value="0" selected>Seleccionar Periodo</option>');
      //llenado de lista de departamentos
      var r2="";
      for(var j = 0 ; j<json.rowCount; j++){
        r2 = r2+"<option value='"+json.rows[j].codigo+"'>"+ json.rows[j].name+"</option> ";
      }
      $("#lst_dep").append(r2);


    }
  });

}

function Load_filter_period(){  //ajax para llenar la lista de periodos
   $("#lst_per").html('');
  $.ajax({
      type: "GET", //el el tipo de peticion puede ser GET y POsT
      url: "consultaFormacion", //la url del que realizara la consulta
      dataType : 'json',
      data:{c:12,
          'program':$("#lst_dep").val(),
          'anio':$("#lst_anio").val()},//Primera consulta
      //se ejecutasi todo se realiza bien
      success : function(json) {
        $("#lst_per").append('<option value="0" selected>Seleccionar periodo</option>');
        // llenado de lista de periodo
        var r4="";
        for(var k = 0 ; k<json.rowCount; k++){
          r4 = r4+"<option value='"+json.rows[k].periodo+"'>"+ json.rows[k].periodo+"</option> ";
        }
        $("#lst_per").append(r4);


      }
  });

}

function Load_filter_year(){
   $("#lst_anio").html('');
  //ajax para llenar la lista de años
  $.ajax({
    type: "GET", //el el tipo de peticion puede ser GET y POsT
    url: "consultaFormacion", //la url del que realizara la consulta
    dataType : 'json',
    data:
      {c:5,
      'program':$("#lst_dep").val()},//Primera consulta
    //se ejecutasi todo se realiza bien
    success : function(json) {
        $("#lst_anio").append('<option value="0" selected>Seleccionar Año</option>');
      // llenado de lista de años
        var r3="";
      for(var i = 0 ; i<json.rowCount; i++){
        r3 = r3+"<option value='"+json.rows[i].anio+"'>"+ json.rows[i].anio+"</option> ";
      }
      $("#lst_anio").append(r3);

      }
  });
}

//panorama general
function panoramaG(){

    $("#titulo2").html('');
  var formData2 = {
    'c':10,
    'cod':$("#lst_dep").val()
  };
  $.ajax({
      type: "GET", //el el tipo de peticion puede ser GET y POsT
      url: "consultaFormacion", //la url del que realizara la consulta
      dataType : 'json',
      data: formData2, //los datos que seran enviados al server
      //se ejecutasi todo se realiza bien
      success : function(json) {

        var r2="";//variable para llenar los datos y el html e cada una de las filas
        var conta=json.rowCount;

        var arra2=[];


        //condicion para saber si los datos que se consultaron tienen los datos de los dos periodos de cada año
        if(json.rows[0].anio == json.rows[1].anio && json.rows[2].anio == json.rows[3].anio && json.rows[4].anio == json.rows[5].anio && json.rows[6].anio == json.rows[7].anio && json.rows[8].anio == json.rows[9].anio ){
        //ciclo para llenar el array para las graficas con los objetos de dos periodos
          for(var i =conta-1; i>=conta-10;i--){
            var y=i-1;
            var programa2;

            if(json.rows[i].periodo == '2 '){
              //alert(json.rows[i].periodo)
              programa2 = {
                  "anio": json.rows[i].anio,
                  "periodoa": json.rows[i].total,
                  "periodob": json.rows[y].total

              }

            }
            else{
              programa2 = {
                  "anio": json.rows[i].anio,
                  "periodoa": json.rows[y].total,
                  "periodob": json.rows[i].total

              }
            }

            arra2.push(programa2);
            i=i-1;
          }
          //ciclo para llenar los datos en las filas en r

          for(var i = 0 ; i<conta; i++){
            if(json.rows[i].periodo === '2 '){
              r2 = r2+"<tr><td><label id='anio"+i+"' name='anio"+i+"'>"+json.rows[i].anio+
              "</label></td><td><label id='tot"+i+"'>"+json.rows[i].total+"</label></td></tr>";

            }
          }

          //cambio de graficas
          $("#graph2").change(function () {
            if($(this).val() === '1'){
              columnTwoGraph(arra2,'divgraph2','Docentes TC Periodo A\n vs\n  Docentes TC Periodo B',json.fields[1].name,"periodob","periodoa",0,0,"Periodo A","Periodo B");
            }
            else if($(this).val() === '2'){
              columnTwoGraph(arra2,'divgraph2','Docentes TC Periodo A\n vs\n Docentes TC Periodo B',json.fields[1].name,"periodob","periodoa",40,30,"Periodo A","Periodo B");
            }
            else if($(this).val() === '3'){
              lineTwoGraph(arra2,'divgraph2','Docentes TC Periodo A\n vs\n Docentes TC Periodo B',json.fields[1].name,"periodob","periodoa","Periodo A","Periodo B");
            }
            else if($(this).val() === '4'){
              barTwoGraph(arra2,'divgraph2','Docentes TC Periodo A\n vs\n Docentes TC Periodo B',json.fields[1].name,"periodob","periodoa",0,0,"Periodo A","Periodo B");
            }
            else if($(this).val() === '5'){
              barTwoGraph(arra2,'divgraph2','Docentes TC Periodo A\n vs\n Docentes TC Periodo B',json.fields[1].name,"periodob","periodoa",40,30,"Periodo A","Periodo B");
            }
          });
          columnTwoGraph(arra2,'divgraph2','Docentes TC Periodo A\n vs\n  Docentes TC Periodo B',json.fields[1].name,"periodob","periodoa",0,0,"Periodo A","Periodo B");

        }
        //si no se cumple la condicion anterior se grafican os dtos devueltos en graficas simples indicando solamente el valor del periodo b
        else{
           var colo3=[];
        //ciclo para llenar el array para las graficas con los objetos de un periodo
          for(var i =conta-1; i>=conta-10;i--){
            var programa2;
            if(json.rows[i].periodo == '2 '){
              programa2 = {
                  "anio": json.rows[i].anio,
                  "periodo": json.rows[i].total,
                  "color": colo3[i]
              }
              arra2.push(programa2);
            }

            

          }
          //ciclo para llenar los datos en las filas en r
          for(var i = 0 ; i<conta; i++){
            if(json.rows[i].periodo === '2 '){
              r2 = r2+"<tr><td><label id='anio"+i+"' name='anio"+i+"'>"+json.rows[i].anio+
              "</label></td><td><label id='tot"+i+"'>"+json.rows[i].total+"</label></td></tr>";

            }
          }

          //cambio de graficas
          $("#graph2").change(function () {
            if($(this).val() === '1'){
              columnGraph(arra2,divgraph2,'Docentes TC Periodo B','anio','periodo',0,0);
            }
            else if($(this).val() === '2'){
              columnGraph(arra2,divgraph2,' Docentes TC Periodo B','anio','periodo',40,30);
            }
            else if($(this).val() === '3'){
              lineGraph(arra2,divgraph2,'Docentes Tiempo Completo Periodo B','anio','periodo');
            }
            else if($(this).val() === '4'){
              barGraph(arra2,divgraph2,'Docentes Tiempo Completo','anio','periodo',0,0);
            }
            else if($(this).val() === '5'){
              barGraph(arra2,divgraph2,'Docentes Tiempo Completo','anio','periodo',40,30);
            }
          });
          //grafica que aparece por defecto
          columnGraph(arra2,divgraph2,'Docentes TC Periodo B','anio','periodo',0,0);

        }

        tittle2=json.rows[conta-3].name+" <br><br> Nivel de Formación Docentes Tiempo Completo de los Ultimos 5 Años";

        $("#datBody2").html(r2);
        $("#titulo2").append(tittle2);


      }
  });
}
