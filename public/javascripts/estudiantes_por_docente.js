var now = new Date();//Hora del sistema.
//var mes=now.getMonth()+1;//formato string mes actual
var mes=7;//formato string mes actual

$(document).ready(function(){
  Load_Insert();//Define si muestra o no el formulario
                      //de ingreso de datos tomando en cuenta la fecha de sistema y
                      //anterior entrada
  Load_Start();//carga tabla y gráficos a partir de datos almacenados anteriormente
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
     //alert(json.rowCount);
       for (var j = json.rowCount-1; j >=0; j--) {
        $("#tableres").append('<tr>');
        $("#tableres").append('<td>'+json.rows[j].Anho+'</td>');
        $("#tableres").append('<td>'+json.rows[j].razonanual+'</td>');

        //--Verificación y muestra de etiquetas de estado de los KPI's en función de la meta a lo largo de los años---------------------------------------------------------------------------------------------------------------
        if(json.rows[j].razonanual>=45)
          $("#tableres").append('<td class="est"><img id="est" src="/images/red.PNG" alt="RED" title="Meta de Estudiantes por Docente Tiempo Completo no alcanzada ('+json.rows[j].razonanual+' de 35)"></td>');
        else if(json.rows[j].razonanual<45 && json.rows[j].razonanual>=35)
          if(j>0 && json.rows[j-1].razonanual<35)
              $("#tableres").append('<td class="est"><img id="est" src="/images/orange.PNG" alt="ORANGE" title="La meta de Estudiantes por Docente Tiempo Completo está bajando ('+json.rows[j].razonanual+' de 35)"></td>');
          else if(j>0 && json.rows[j-1].razonanual<json.rows[j].razonanual)
              $("#tableres").append('<td class="est"><img id="est" src="/images/orange.PNG" alt="ORANGE" title="La meta de Estudiantes por Docente Tiempo Completo se ha alejado ('+json.rows[j].razonanual+' de 35)"></td>');
          else
              $("#tableres").append('<td class="est"><img id="est" src="/images/orange.PNG" alt="ORANGE" title="La meta de Estudiantes por Docente Tiempo Completo está cerca a alcanzarse ('+json.rows[j].razonanual+' de 35)"></td>');
        else
          $("#tableres").append('<td class="est"><img id="est" src="/images/verde.png" alt="GREEN" title="Meta de Estudiantes por Docente Tiempo Completo alcanzada ('+json.rows[j].razonanual+' de 35)"></td>');
        //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

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
        }
        //-------------------------------------------------------

       //cambio
      $("#graph1").change(function () {
        if($(this).val() === '1'){
          columnGraph(datarray,'divgraph1','Número de Estudiantes por Docente \n',json.fields[0].name,json.fields[1].name,0,0);
        }
        else if($(this).val() === '2'){
          columnGraph(datarray,'divgraph1','Número de Estudiantes por Docente \n',json.fields[0].name,json.fields[1].name,40,30);
        }
        else if($(this).val() === '3'){
          lineGraph(datarray,'divgraph1','Número de Estudiantes por Docente \n',json.fields[0].name,json.fields[1].name);
        }
        else if($(this).val() === '4'){
          areaGraph(datarray,'divgraph1','Número de Estudiantes por Docente \n',json.fields[0].name,json.fields[1].name);
        }
        else if($(this).val() === '5'){
          barGraph(datarray,'divgraph1','Número de Estudiantes por Docente \n',json.fields[0].name,json.fields[1].name,0,0);
        }
        else if($(this).val() === '6'){
          barGraph(datarray,'divgraph1','Número de Estudiantes por Docente \n',json.fields[0].name,json.fields[1].name,40,30);
        }
      });
      columnGraph(datarray,'divgraph1','Número de Estudiantes por Docente \n',json.fields[0].name,json.fields[1].name,0,0);
      if(mes<=6) gaugesGraph(json.rows[json.rowCount-1].razonanual,'divgraph2','g','y','r',35,45,'Estudiantes por Docente', '%');
      else gaugesGraph(json.rows[json.rowCount-2].razonanual,'divgraph2','g','y','r',35,45,'Estudiantes por Docente', '%');
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
          columnTwoGraph(datarray,'divgraph3','Número de estudiantes por Docente\n por Semestre',json.fields[0].name,json.fields[1].name,json.fields[2].name,0,0,"A","B");
        }
        else if($(this).val() === '2'){
          columnTwoGraph(datarray,'divgraph3','Número de estudiantes por Docente\n por Semestre',json.fields[0].name,json.fields[1].name,json.fields[2].name,40,30,"A","B");
        }
        else if($(this).val() === '3'){
          lineTwoGraph(datarray,'divgraph3','Número de estudiantes por Docente\n por Semestre',json.fields[0].name,json.fields[1].name,json.fields[2].name,"A","B");
        }
        else if($(this).val() === '4'){
          barTwoGraph(datarray,'divgraph3','Número de estudiantes por Docente\n por Semestre',json.fields[0].name,json.fields[1].name,json.fields[2].name,0,0,"A","B");
        }
        else if($(this).val() === '5'){
          barTwoGraph(datarray,'divgraph3','Número de estudiantes por Docente\n por Semestre',json.fields[0].name,json.fields[1].name,json.fields[2].name,40,30,"A","B");
        }
      });
     columnTwoGraph(datarray,'divgraph3','Número de estudiantes por Docente\n por Semestre',json.fields[0].name,json.fields[1].name,json.fields[2].name,0,0,"A","B");
     lineTwoGraph(datarray,'divgraph4','Número de estudiantes por Docente\n por Semestre',json.fields[0].name,json.fields[1].name,json.fields[2].name,"A","B");
     gaugesGraph(json.rows[json.rowCount-5].razonanual,'divper1','g','y','r',35,45, 'Estudiantes por Docente año:'+json.rows[json.rowCount-5].Anho, '%');
     gaugesGraph(json.rows[json.rowCount-1].razonanual,'divper2','g','y','r',35,45, 'Estudiantes por Docente año: '+ fin, '%');
   }
 });
}

function Load_Year_List(){//carga menú desplegable de años para el formulario de filtro
   $.ajax({
    type: "get", //el el tipo de peticion puede ser GET y POsT
    url: "consultaDocentesTC", //la url del que realizara la consulta
    dataType : 'json',
    data:{c:1},//se envia un valor para despues coneste saber que consulta
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

function Load_Filter(){//valida y carga filtro de años a consulta KPI
  var ban = true;
  //se obtiene los valores de las input en variables
  var yearfrom = $("#lstanho1").val(), yearto = $("#lstanho2").val();
  if(yearfrom==yearto  && yearfrom!=0 && yearto!=0){
    ban=false;
    $('#myModal').modal('show');
  }
  if(yearfrom>yearto && yearto!=0){
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
      type: "post", //el el tipo de peticion puede ser GET y POsT
      url: "consultaFiltradaEstudiantesDocentes", //la url del que realizara la consulta
      data : formData,
      dataType : 'json',
      success : function(json) {
        var now = new Date();
        $("#lblper").html("<br> Indicador Estudiantes por Docente Tiempo Completo años: "+json.datos[0].Anho+" a "+json.datos[json.count-1].Anho);
        $("#graph3").change(function () {
          if($(this).val() === '1'){
            columnTwoGraph(json.datos,'divgraph3','Número de estudiantes por Docente\n por Semestre',json.fieldsthree[0],json.fieldsthree[1],json.fieldsthree[2],0,0,"A","B");
          }
          else if($(this).val() === '2'){
            columnTwoGraph(json.datos,'divgraph3','Número de estudiantes por Docente\n por Semestre',json.fieldsthree[0],json.fieldsthree[1],json.fieldsthree[2],40,30,"A","B");
          }
          else if($(this).val() === '3'){
            lineTwoGraph(json.datos,'divgraph3','Número de estudiantes por Docente\n por Semestre',json.fieldsthree[0],json.fieldsthree[1],json.fieldsthree[2],"A","B");
          }
          else if($(this).val() === '4'){
            barTwoGraph(json.datos,'divgraph3','Número de estudiantes por Docente\n por Semestre',json.fieldsthree[0],json.fieldsthree[1],json.fieldsthree[2],0,0,"A","B");
          }
          else if($(this).val() === '5'){
            barTwoGraph(json.datos,'divgraph3','Número de estudiantes por Docente\n por Semestre',json.fieldsthree[0],json.fieldsthree[1],json.fieldsthree[2],40,30,"A","B");
          }
        });
        columnTwoGraph(json.datos,'divgraph3','Número de estudiantes por Docente\n por Semestre',json.fieldsthree[0],json.fieldsthree[1],json.fieldsthree[2],0,0,"A","B");
        lineTwoGraph(json.datos,'divgraph4','Número de estudiantes por Docente\n por Semestre',json.fieldsthree[0],json.fieldsthree[1],json.fieldsthree[2],"A","B");
        gaugesGraph(json.datos[0].razonanual,'divper1','g','y','r',35,45, 'Estudiantes por Docente año: '+json.datos[0].Anho, '%');
        gaugesGraph(json.datos[json.count-1].razonanual,'divper2','g','y','r',35,45, 'Estudiantes por Docente año: '+json.datos[json.count-1].Anho, '%');
      }
    });
  }
  closedivfilter();
}

function Load_Update(){//carga datos obtenidos del formulario de ingreso de estudiantes-docentes
  //se obtiene los valores de las input en variables
  var anho = $("#year1").val(), estudiantes = $("#est1").val(), docentes= $("#doctc1").val(), semestre= $("#sem1").val();
  //se coloca los datos del form en el formato adecuado para enviar al server
  var formData = {
    'anho': anho,
    'estudiantes': estudiantes,
    'docentes': docentes,
    'semestre': semestre
  };
  $.ajax({
      type: "post", //el el tipo de peticion puede ser GET y POsT
      url: "actualizaDocentesTC", //señala a inserción de datos generales de programa a acreditarse en public
      data : formData,
      dataType : 'json',
      success : function(json) {}
  });
  alert("Nuevo KPI ingresado");
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
  $('#divupdate').html(
      '<div class="modal-content">'+
        '<div class="modal-header">'+
          '<button type="button" data-dismiss="modal" aria-label="Close" class="close">'+
            '<span aria-hidden="true">×</span>'+
          '</button>'+
          '<h4 id="modal-title" class="modal-title"></h4>'+
          '<h4 id="titgral"></h4>'+
        '</div>'+
        '<div class="modal-body">'+
          '<table class="table table-hover table-bordered table-responsed">'+
            '<tbody class="col-sm-3"></tbody>'+
            '<tbody class="col-sm-6">'+
              '<tr>'+
                '<label for="sem"></label>'+
                '<td colspan="2" id="sem"></td>'+
                '<div id="sem2"></div>'+
                '<div id="year2"></div>'+
              '</tr>'+
              '<tr>'+
                '<label for="nroestu"></label>'+
                '<td>Número de Estudiantes:</td>'+
                '<td id="est"></td>'+
              '</tr>'+
              '<tr>'+
                '<label for="nrodoctc"> </label>'+
                '<td>Número de Docentes Tiempo Completo:</td>'+
                '<td id="doctc"></td>'+
              '</tr>'+
              '<tr>'+
                '<td colspan="2">'+
                  '<span class="btn btn-info">'+
                    '<a onCLick="Load_Update()">'+'<img title="Ingresar" alt="Ingresar" /></a></span>'+
                '</td>'+
              '</tr>'+
            '</tbody>'+
            '<tbody class="col-sm-3"></tbody>'+
          '</table>'+
        '</div>'+
      '<div class="modal-footer"></div>'+
    '</div>');
  $('#titgral').html('Ingreso Estudiantes y Docentes para el Año ');
  $('#sem').html('SEMESTRE ');
  if(month<3){//el formulario tomará como datos por defecto los resultados del indicador del año anterior
    $.ajax({
      type: "get",
      url: "consultaDocentesTC",
      dataType : 'json',
      data:{c:5,'anho': year},//señala a consulta semestralizada de estudiantes y docentes en función
                              //del año anterior y tipo de titulación
      success : function(json) {
        if(json.rows[0].estudiantesb==0) {
          $('#titgral').append(year);
          $('#sem').append('B');
          $('#sem2').html('<input type="hidden" id="sem1" value="B">');
          $('#year2').html('<input type="hidden" id="year1" value='+year+'>');
          $('#est').html('<input type="number" pattern="[0-9]" id="est1" value='+json.rows[0].estudiantesa+' min='+json.rows[0].estudiantesa+' max="99999" class="form-control" required>');
          $('#doctc').html('<input type="number" pattern="[0-9]" id="doctc1" value='+json.rows[0].docentesa+' min='+json.rows[0].docentesa+' max="999" class="form-control" required>');
        }
      }
    });
  }
  else if (month>6 && month<9){//el formulario tomará como datos por defecto los datos ingresados en el asemestre A del año en curso
    $.ajax({
      type: "get", //el el tipo de peticion puede ser GET y POsT
      url: "consultaDocentesTC", //la url del que realizara la consulta
      dataType : 'json',
      data:{c:3,'anho': year},
      success : function(json) {
        if(json.rows[0].estudiantes!=0) {
          $('#titgral').append(year+1);
          $('#sem').append('A');
          $('#sem2').html('<input type="hidden" id="sem1" value="A">');
          $('#year2').html('<input type="hidden" id="year1" value='+(year+1)+'>');
          $('#est').html('<input type="number" pattern="[0-9]" id="est1" value='+json.rows[0].estudiantes+' min='+json.rows[0].estudiantes+' max="99999" class="form-control" required>');
          $('#doctc').html('<input type="number" pattern="[0-9]" id="doctc1" value='+json.rows[0].docentes+' min='+json.rows[0].docentes+' max="999" class="form-control" required>');
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
                         //fecha de inicio del programa recién acreditado en datawarehouse
  $.ajax({
      type: "get",
      url: "consultaDocentesTC",
      data : {c:5,'anho': fec},//señala a consulta de existencia de KPI en función del año
      dataType : 'json',
      success : function(json) {
        if(json.rows[0].docentesb==0) Ins_KPI(fec,json.rows[0].estudiantesprom,json.rows[0].docentesprom)//ingresa nuevo kpi en función de primer programa acreditado en el año
        else Upd_KPI(fec,json.rows[0].estudiantesb,json.rows[0].docentesb,json.rows[0].estudiantesprom,json.rows[0].docentesprom);//actualiza kpi en presencia de más de un programa acreditado ya existente en ese año
      }
  });
}

function Ins_KPI(anho,estudiantesa,docentesa){//ingresa nuevo kpi en función de primer programa acreditado en el año
  //alert(anho+' '+estudiantesa+' '+docentesa);
  $.ajax({
      type: "get",
      url: "actualizaKPIDocentesTC",
      data : {c:1,'anho': anho,'estudiantesa': estudiantesa,'docentesa': docentesa},//señala a inserción en datawarehouse
      dataType : 'json',
      success : function(json) {
        Load_Start();
        Load_Semiannual();
      }
  });
}

function Upd_KPI(anho,estudiantesb,docentesb,estudiantesprom,docentesprom){//actualiza kpi en presencia de más de un programa acreditado ya existente en ese año
  $.ajax({
      type: "get",
      url: "actualizaKPIDocentesTC", //la url del que realizara la consulta
      data : {c:2,'anho': anho,'estudiantesb': estudiantesb,'docentesb': docentesb,'estudiantesprom': estudiantesprom,'docentesprom': docentesprom},////señala a actualización en datawarehouse
      dataType : 'json',
      success : function(json) {
        Load_Start();
        Load_Semiannual();
      }
  });
}
