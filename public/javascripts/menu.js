$(document).ready(function(){
  //activa la opcion de submenu en el navbar
  $('[data-submenu]').submenupicker();
  //inicia editor
  // alert('hola')
  $('.summernote').summernote({
    toolbar: [
      ["style", ["style"]],
      ["font", ["bold", "italic","underline", "clear"]],
      ["fontname", ["fontname"]],
      ["color", ["color"]],
      ["para", ["ul", "ol", "paragraph"]],
      ["table", ["table"]],
      ["insert", ["picture"]],
      ["view", ["help"]]
    ],
    lang: 'es-ES'
  });
  //se ejecuta al submit de el boton para cargar el archivo de informacion satisfaccion
  $('#uploadformsatisfaccion').submit(function(event){
    var cx = comprueba_extension($('#filesatisfaccion').val());
    $('#mesage span').removeClass('green');
    $('#mesage span').addClass('red');
    $('#mesage p').removeClass('green');
    $('#mesage p').addClass('red');
    if(cx===0) {
      $('#mesage span').addClass('glyphicon glyphicon-alert');
      $('#mesage p').html('Seleccione un archivo!!');
    }
    else if(cx===1) {
      $('#mesage span').addClass('glyphicon glyphicon-alert');
      $('#mesage p').html('Formato de archivo no valido!!');
    }
    else{
      loadfile('/uploadfilesatisfaccion','filesatisfaccion');
    }
    event.preventDefault();
  });

  //se ejecuta al submit de el boton para cargar el archivo de informacion cohorte
  $('#uploadformcohorte').submit(function(event){
    var cx = comprueba_extension($('#filescohorte').val());
    $('#mesage span').removeClass('green');
    $('#mesage span').addClass('red');
    $('#mesage p').removeClass('green');
    $('#mesage p').addClass('red');
    if(cx===0) {
      $('#mesage span').addClass('glyphicon glyphicon-alert');
      $('#mesage p').html('Seleccione un archivo!!');
    }
    else if(cx===1) {
      $('#mesage span').addClass('glyphicon glyphicon-alert');
      $('#mesage p').html('Formato de archivo no valido!!');
    }
    else{
      loadfile('/uploadfilecohorte','filescohorte');
    }
    event.preventDefault();
  });

  //se ejecuta al submit de el boton para cargar el archivo de informacion periodo
  $('#uploadformperiodo').submit(function(event){
    var cx = comprueba_extension($('#filesperiodo').val());
    $('#mesage span').removeClass('green');
    $('#mesage span').addClass('red');
    $('#mesage p').removeClass('green');
    $('#mesage p').addClass('red');
    if(cx===0) {
      $('#mesage span').addClass('glyphicon glyphicon-alert');
      $('#mesage p').html('Seleccione un archivo!!');
    }
    else if(cx===1) {
      $('#mesage span').addClass('glyphicon glyphicon-alert');
      $('#mesage p').html('Formato de archivo no valido!!');
    }
    else{
      loadfile('/uploadfileperiodo','filesperiodo');
    }
    event.preventDefault();
  });

  //se ejecuta al submit de el boton para cargar el archivo de informacion del nivel de formacion docentes
  $('#uploadformacion').submit(function(event){
    var cx = comprueba_extension($('#fileformacion').val());
    $('#mesage span').removeClass('green');
    $('#mesage span').addClass('red');
    $('#mesage p').removeClass('green');
    $('#mesage p').addClass('red');
    if(cx===0) {
      $('#mesage span').addClass('glyphicon glyphicon-alert');
      $('#mesage p').html('Seleccione un archivo!!');
    }
    else if(cx===1) {
      $('#mesage span').addClass('glyphicon glyphicon-alert');
      $('#mesage p').html('Formato de archivo no valido!!');
    }
    else{
      loadfile('/uploadfileformacion','fileformacion');
    }
    event.preventDefault();
  });

  //se ejecuta al submit de el boton para cargar el archivo de informacion de estudiantes en cada departamento
  $('#uploadestudiantes').submit(function(event){
    var cx = comprueba_extension($('#filestudiantes').val());
    $('#mesage span').removeClass('green');
    $('#mesage span').addClass('red');
    $('#mesage p').removeClass('green');
    $('#mesage p').addClass('red');
    if(cx===0) {
      $('#mesage span').addClass('glyphicon glyphicon-alert');
      $('#mesage p').html('Seleccione un archivo!!');
    }
    else if(cx===1) {
      $('#mesage span').addClass('glyphicon glyphicon-alert');
      $('#mesage p').html('Formato de archivo no valido!!');
    }
    else{
      loadfile('/uploadfilestudiantes','filestudiantes');
    }
    event.preventDefault();
  });

  //se ejecuta al dar click para recuperar contraseña
  $('#frmrecover').submit(function(event){
    var formData = {
          'user': $('#txtreuser').val(),
        };
    $.ajax({
     type: "POST", //el el tipo de peticion puede ser GET y POsT
     url: "validarestart", //la url del que realizara la consulta
     data: formData, //los datos que seran enviados al server
     dataType : 'json', //el formato de datos enviados y devueltos del server
     //se ejecutasi todo se realiza bien
     success : function(json) {
       //aqui comprobamos que si el resultado existe lo redirecciona al siguiente pagina
       if(json>0){
         $("#resrecover").text("Por favor revise su bandeja de entrada." );
       }else{
         $("#resrecover").text("El usuario no existe, vuelva a intentar." );
       }
     }
    });
    event.preventDefault();
  });
});

//se invoca para generar el pdf del reporte
function getPDF(){

  //se inicia el servidor de reportes
  jsreport.serverUrl = 'http://190.254.4.49:5488';

  //areglo para contener todo lo que se envia a el reporte
  var atrind=[];

  //se saca la info basica del Indicador para el reporte
  for (var i = 1; i < 18; i++) {
    atrind.push($("#atrinfo"+i).val());
    if(i===12){
      var ran = $("#atrinfo18").val()+' '+$("#atrinfo19").val()+' Muy Adecuado \n'+
                $("#atrinfo20").val()+' '+$("#atrinfo21").val()+' Adecuado \n'+
                $("#atrinfo22").val()+' '+$("#atrinfo23").val()+' Inadecuado';
      atrind.push(ran);
    }
  }

  //se saca la tabla de resultados para el reporte
  var tabres = $('#divtab').html().toString();
  atrind.push(tabres);

  var txtcal = $('#txtcal').summernote('code');
  var txtlec = $('#txtlec').summernote('code');
  //
  //tinymce.triggerSave();
  // //se saca la info de la calificacion y lectura del reporte
  // //.replace(/\n/g,'<br>'))
  atrind.push(txtcal);
  atrind.push(txtlec);

  //se obtiene el svg de la grafica 1
  var $g1 = $('#divg1 div.amcharts-main-div div.amcharts-chart-div').html();
  var img1 = svgtoimg($g1);
  atrind.push(img1);

  //se obtiene si existe una leyend en la primera grafica
  var $gle1 = $('#divg1 div.amcharts-main-div div.amChartsLegend.amcharts-legend-div').html()
  if($gle1 != 'undefined'){
    var imgle1 = svgtoimg($gle1);
    atrind.push(imgle1);
  }else{
    atrind.push("");
  }

  //se obtiene el svg de la grafica 2
  var $g2 = $('#divg2 div.amcharts-main-div div.amcharts-chart-div').html();
  var img2 = svgtoimg($g2);
  atrind.push(img2);

  //se obtiene si existe una leyend en la segunda grafica
  var $gle2 = $('#divg2 div.amcharts-main-div div.amChartsLegend.amcharts-legend-div').html()
  if($gle2 != 'undefined'){
    var imgle2 = svgtoimg($gle2);
    atrind.push(imgle2);
  }else{
    atrind.push("");
  }


  //se crea la variable que contiene todo las configuraciones para e reportes
  var request = {
    template: {
      "shortid":"B1E4W75Ke",
      "engine ":"none",
      "recipe" : "phantom-pdf"
    },
    data: {
      "proceso":atrind[0],
      "lider":atrind[1],
      "objproceso":atrind[2],
      "nombreindi":atrind[3],
      "atrmedir":atrind[4],
      "objcalidad":atrind[5],
      "tipoindi":atrind[6],
      "frecuencia":atrind[7],
      "percalculo":atrind[8],
      "tendencia":atrind[9],
      "meta":atrind[10],
      "objindicador":atrind[11],
      "rango":atrind[12],
      "formula":atrind[13],
      "modografica":atrind[14],
      "puntoregistro":atrind[15],
      "responcalculo":atrind[16],
      "instructivo":atrind[17],
      "resultindi":atrind[18],
      "calificacion":atrind[19],
      "lectura":atrind[20],
      "grafica1":atrind[21],
      "grafica2":atrind[23],
      "leyend1":atrind[22],
      "leyend2":atrind[24],
    },
    options: {
      preview:true,
      "Content-Disposition": "filename=myreport.pdf",
      "authorization": {
        "grantEdit": true
      }
    }
   };

   jsreport.headers['Authorization'] = "Basic " + btoa("admin:password");

   jsreport.renderAsync(request).then(function(res) {
     console.log(res);

     //open in new window
     window.open(res.toDataURI())

     //open download dialog
     //res.download('test.pdf')
   });
  //  var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
   //
  //  if(!isOpera){
  //   //  alert('hola')
  //    jsreport.render('_blank', request);
   //
  //  }else{
  //    jsreport.download('myReport.pdf', request);
  //  }

}

//funcion para sacar el svg y convertirlo en imagen
function svgtoimg(svgdiv){
  var $g = svgdiv;
  if($g){
    var arr = $g.split('<a');
    var svg = arr[0];
    if(svg){
      svg = svg.replace(/\r?\n|\r/g, '').trim();

      //se obtiene la img en base64 de grafica 1
      var canvasg = document.createElement("canvas");
      var contextg = canvasg.getContext("2d");
      contextg.clearRect(0, 0, canvasg.width, canvasg.height);
      canvg(canvasg, svg);
      var imgData = canvasg.toDataURL('image/png');

      return imgData
    }
  }
  return "";
}

//se invoca para editar los informes
function editRepor(){

  //se oculta y visibiliza los botones del formulario
  $("#btnsave").css('visibility','visible');
  $("#btnedit").css('visibility','hidden');
  $("#btnpdf").css('visibility','hidden');
  var l,l2,l3;  

  //se recorre los atributos del infomre y se quita el solo lectura

  for (var i = 1; i < 24; i++) {
    $("#atrinfo"+i).removeAttr('readonly');
  }
  // consulta para colocar el signo correcto
  $.ajax({
   type: "POST", //el el tipo de peticion puede ser GET y POsT
   url: "consultaFormacion", //la url a la  que se realizara la consulta
   data:{c:11,'id':$("#txtindser").val()},
   dataType : 'json',
   success : function(json) {   
    if(json.rows[0].sim_Rango_MA === '< '){
      //lista 1
      l = "<select id='atrinfo18' name'atrinfo18' class='form-control'> <option value='< ' selected>Menor</option><option value='> '>Mayor</option><option value='= '>Igual</option></select>";
      $("#list").html('');
      $("#list").append(l);
      if(json.rows[0].sim_Rango_A === '< '){
        //lista 2
        l2 = "<select id='atrinfo20' name'atrinfo20' class='form-control'> <option value='< ' selected>Menor</option><option value='> '>Mayor</option><option value='= '>Igual</option></select>";
        $("#list2").html('');
        $("#list2").append(l2);
        if(json.rows[0].sim_Rango_I === '< '){
          //lista 3
          l3 = "<select id='atrinfo22' name'atrinfo22' class='form-control'> <option value='< ' selected>Menor</option><option value='> '>Mayor</option><option value='= '>Igual</option></select>";
          $("#list3").html('');
          $("#list3").append(l3);
        }
        else if(json.rows[0].sim_Rango_I === '> '){
          //lista 3
          l3 = "<select id='atrinfo22' name'atrinfo22' class='form-control'> <option value='< '>Menor</option><option value='> ' selected>Mayor</option><option value='= '>Igual</option></select>";
          $("#list3").html('');
          $("#list3").append(l3);
        }
        else if(json.rows[0].sim_Rango_I === '= '){
          //lista 3
          l3 = "<select id='atrinfo22' name'atrinfo22' class='form-control'> <option value='< '>Menor</option><option value='> ' >Mayor</option><option value='= ' selected>Igual</option></select>";
          $("#list3").html('');
          $("#list3").append(l3);
        }
      }
      else if(json.rows[0].sim_Rango_A === '> '){
        //lista 2
        l2 = "<select id='atrinfo20' name'atrinfo20' class='form-control'> <option value='< ' >Menor</option><option value='> ' selected>Mayor</option><option value='= '>Igual</option></select>";
        $("#list2").html('');
        $("#list2").append(l2);
        if(json.rows[0].sim_Rango_I === '< '){
          //lista 3
          l3 = "<select id='atrinfo22' name'atrinfo22' class='form-control'> <option value='< ' selected>Menor</option><option value='> '>Mayor</option><option value='= '>Igual</option></select>";
          $("#list3").html('');
          $("#list3").append(l3);
        }
        else if(json.rows[0].sim_Rango_I === '> '){
          //lista 3
          l3 = "<select id='atrinfo22' name'atrinfo22' class='form-control'> <option value='< '>Menor</option><option value='> ' selected>Mayor</option><option value='= '>Igual</option></select>";
          $("#list3").html('');
          $("#list3").append(l3);
        }
        else if(json.rows[0].sim_Rango_I === '= '){
          //lista 3
          l3 = "<select id='atrinfo22' name'atrinfo22' class='form-control'> <option value='< '>Menor</option><option value='> ' >Mayor</option><option value='= ' selected>Igual</option></select>";
          $("#list3").html('');
          $("#list3").append(l3);
        }

      }
      else if(json.rows[0].sim_Rango_A === '= '){
        //lista 2
        l2 = "<select id='atrinfo20' name'atrinfo20' class='form-control'> <option value='< ' >Menor</option><option value='> ' >Mayor</option><option value='= ' selected>Igual</option></select>";
        $("#list2").html('');
        $("#list2").append(l2);
        if(json.rows[0].sim_Rango_I === '< '){
          //lista 3
          l3 = "<select id='atrinfo22' name'atrinfo22' class='form-control'> <option value='< ' selected>Menor</option><option value='> '>Mayor</option><option value='= '>Igual</option></select>";
          $("#list3").html('');
          $("#list3").append(l3);
        }
        else if(json.rows[0].sim_Rango_I === '> '){
          //lista 3
          l3 = "<select id='atrinfo22' name'atrinfo22' class='form-control'> <option value='< '>Menor</option><option value='> ' selected>Mayor</option><option value='= '>Igual</option></select>";
          $("#list3").html('');
          $("#list3").append(l3);
        }
        else if(json.rows[0].sim_Rango_I === '= '){
          //lista 3
          l3 = "<select id='atrinfo22' name'atrinfo22' class='form-control'> <option value='< '>Menor</option><option value='> ' >Mayor</option><option value='= ' selected>Igual</option></select>";
          $("#list3").html('');
          $("#list3").append(l3);
        }
      }
    }
    else if(json.rows[0].sim_Rango_MA === '> '){
       //lista 1
      l = "<select id='atrinfo18' name'atrinfo18' class='form-control'> <option value='< '>Menor</option><option value='> ' selected>Mayor</option><option value='= '>Igual</option></select>";
      $("#list").html('');
      $("#list").append(l);
      if(json.rows[0].sim_Rango_A === '< '){
        //lista 2
        l2 = "<select id='atrinfo20' name'atrinfo20' class='form-control'> <option value='< ' selected>Menor</option><option value='> '>Mayor</option><option value='= '>Igual</option></select>";
        $("#list2").html('');
        $("#list2").append(l2);
        if(json.rows[0].sim_Rango_I === '< '){
          //lista 3
          l3 = "<select id='atrinfo22' name'atrinfo22' class='form-control'> <option value='< ' selected>Menor</option><option value='> '>Mayor</option><option value='= '>Igual</option></select>";
          $("#list3").html('');
          $("#list3").append(l3);
        }
        else if(json.rows[0].sim_Rango_I === '> '){
          //lista 3
          l3 = "<select id='atrinfo22' name'atrinfo22' class='form-control'> <option value='< '>Menor</option><option value='> ' selected>Mayor</option><option value='= '>Igual</option></select>";
          $("#list3").html('');
          $("#list3").append(l3);
        }
        else if(json.rows[0].sim_Rango_I === '= '){
          //lista 3
          l3 = "<select id='atrinfo22' name'atrinfo22' class='form-control'> <option value='< '>Menor</option><option value='> ' >Mayor</option><option value='= ' selected>Igual</option></select>";
          $("#list3").html('');
          $("#list3").append(l3);
        }
      }
      else if(json.rows[0].sim_Rango_A === '> '){
        //lista 2
        l2 = "<select id='atrinfo20' name'atrinfo20' class='form-control'> <option value='< ' >Menor</option><option value='> ' selected>Mayor</option><option value='= '>Igual</option></select>";
        $("#list2").html('');
        $("#list2").append(l2);
        if(json.rows[0].sim_Rango_I === '< '){
          //lista 3
          l3 = "<select id='atrinfo22' name'atrinfo22' class='form-control'> <option value='< ' selected>Menor</option><option value='> '>Mayor</option><option value='= '>Igual</option></select>";
          $("#list3").html('');
          $("#list3").append(l3);
        }
        else if(json.rows[0].sim_Rango_I === '> '){
          //lista 3
          l3 = "<select id='atrinfo22' name'atrinfo22' class='form-control'> <option value='< '>Menor</option><option value='> ' selected>Mayor</option><option value='= '>Igual</option></select>";
          $("#list3").html('');
          $("#list3").append(l3);
        }
        else if(json.rows[0].sim_Rango_I === '= '){
          //lista 3
          l3 = "<select id='atrinfo22' name'atrinfo22' class='form-control'> <option value='< '>Menor</option><option value='> ' >Mayor</option><option value='= ' selected>Igual</option></select>";
          $("#list3").html('');
          $("#list3").append(l3);
        }

      }
      else if(json.rows[0].sim_Rango_A === '= '){
        //lista 2
        l2 = "<select id='atrinfo20' name'atrinfo20' class='form-control'> <option value='< ' >Menor</option><option value='> ' >Mayor</option><option value='= ' selected>Igual</option></select>";
        $("#list2").html('');
        $("#list2").append(l2);
        if(json.rows[0].sim_Rango_I === '< '){
          //lista 3
          l3 = "<select id='atrinfo22' name'atrinfo22' class='form-control'> <option value='< ' selected>Menor</option><option value='> '>Mayor</option><option value='= '>Igual</option></select>";
          $("#list3").html('');
          $("#list3").append(l3);
        }
        else if(json.rows[0].sim_Rango_I === '> '){
          //lista 3
          l3 = "<select id='atrinfo22' name'atrinfo22' class='form-control'> <option value='< '>Menor</option><option value='> ' selected>Mayor</option><option value='= '>Igual</option></select>";
          $("#list3").html('');
          $("#list3").append(l3);
        }
        else if(json.rows[0].sim_Rango_I === '= '){
          //lista 3
          l3 = "<select id='atrinfo22' name'atrinfo22' class='form-control'> <option value='< '>Menor</option><option value='> ' >Mayor</option><option value='= ' selected>Igual</option></select>";
          $("#list3").html('');
          $("#list3").append(l3);
        }
      }      

    }
    else if(json.rows[0].sim_Rango_MA === '= '){
       //lista 1
      l = "<select id='atrinfo18' name'atrinfo18' class='form-control'> <option value='< '>Menor</option><option value='> ' >Mayor</option><option value='= ' selected>Igual</option></select>";
      $("#list").html('');
      $("#list").append(l);
      if(json.rows[0].sim_Rango_A === '< '){
        //lista 2
        l2 = "<select id='atrinfo20' name'atrinfo20' class='form-control'> <option value='< ' selected>Menor</option><option value='> '>Mayor</option><option value='= '>Igual</option></select>";
        $("#list2").html('');
        $("#list2").append(l2);
        if(json.rows[0].sim_Rango_I === '< '){
          //lista 3
          l3 = "<select id='atrinfo22' name'atrinfo22' class='form-control'> <option value='< ' selected>Menor</option><option value='> '>Mayor</option><option value='= '>Igual</option></select>";
          $("#list3").html('');
          $("#list3").append(l3);
        }
        else if(json.rows[0].sim_Rango_I === '> '){
          //lista 3
          l3 = "<select id='atrinfo22' name'atrinfo22' class='form-control'> <option value='< '>Menor</option><option value='> ' selected>Mayor</option><option value='= '>Igual</option></select>";
          $("#list3").html('');
          $("#list3").append(l3);
        }
        else if(json.rows[0].sim_Rango_I === '= '){
          //lista 3
          l3 = "<select id='atrinfo22' name'atrinfo22' class='form-control'> <option value='< '>Menor</option><option value='> ' >Mayor</option><option value='= ' selected>Igual</option></select>";
          $("#list3").html('');
          $("#list3").append(l3);
        }
      }
      else if(json.rows[0].sim_Rango_A === '> '){
        //lista 2
        l2 = "<select id='atrinfo20' name'atrinfo20' class='form-control'> <option value='< ' >Menor</option><option value='> ' selected>Mayor</option><option value='= '>Igual</option></select>";
        $("#list2").html('');
        $("#list2").append(l2);
        if(json.rows[0].sim_Rango_I === '< '){
          //lista 3
          l3 = "<select id='atrinfo22' name'atrinfo22' class='form-control'> <option value='< ' selected>Menor</option><option value='> '>Mayor</option><option value='= '>Igual</option></select>";
          $("#list3").html('');
          $("#list3").append(l3);
        }
        else if(json.rows[0].sim_Rango_I === '> '){
          //lista 3
          l3 = "<select id='atrinfo22' name'atrinfo22' class='form-control'> <option value='< '>Menor</option><option value='> ' selected>Mayor</option><option value='= '>Igual</option></select>";
          $("#list3").html('');
          $("#list3").append(l3);
        }
        else if(json.rows[0].sim_Rango_I === '= '){
          //lista 3
          l3 = "<select id='atrinfo22' name'atrinfo22' class='form-control'> <option value='< '>Menor</option><option value='> ' >Mayor</option><option value='= ' selected>Igual</option></select>";
          $("#list3").html('');
          $("#list3").append(l3);
        }

      }
      else if(json.rows[0].sim_Rango_A === '= '){
        //lista 2
        l2 = "<select id='atrinfo20' name'atrinfo20' class='form-control'> <option value='< ' >Menor</option><option value='> ' >Mayor</option><option value='= ' selected>Igual</option></select>";
        $("#list2").html('');
        $("#list2").append(l2);
        if(json.rows[0].sim_Rango_I === '< '){
          //lista 3
          l3 = "<select id='atrinfo22' name'atrinfo22' class='form-control'> <option value='< ' selected>Menor</option><option value='> '>Mayor</option><option value='= '>Igual</option></select>";
          $("#list3").html('');
          $("#list3").append(l3);
        }
        else if(json.rows[0].sim_Rango_I === '> '){
          //lista 3
          l3 = "<select id='atrinfo22' name'atrinfo22' class='form-control'> <option value='< '>Menor</option><option value='> ' selected>Mayor</option><option value='= '>Igual</option></select>";
          $("#list3").html('');
          $("#list3").append(l3);
        }
        else if(json.rows[0].sim_Rango_I === '= '){
          //lista 3
          l3 = "<select id='atrinfo22' name'atrinfo22' class='form-control'> <option value='< '>Menor</option><option value='> ' >Mayor</option><option value='= ' selected>Igual</option></select>";
          $("#list3").html('');
          $("#list3").append(l3);
        }
      } 
    }    
   }
  })

  
    //$("#atrinfo18").html(' '); */
}

//funcion para guardar cambios de los reportes por parte del susuario administrador
function saveReport(){
  var formData = {};
  for (var i = 1; i < 24; i++) {
    formData['atr'+i]=$("#atrinfo"+i).val();
  }
  formData['indser']=$("#txtindser").val();

  $.ajax({
   type: "POST", //el el tipo de peticion puede ser GET y POsT
   url: "manuales", //la url a la  que se realizara la consulta
   data : formData,
   dataType : 'json',
   success : function(json) {
     //se oculta y visibiliza los botones del formulario
     $("#btnsave").css('visibility','hidden');
     $("#btnedit").css('visibility','visible');
     $("#btnpdf").css('visibility','visible');

     for (var i = 1; i < 24; i++) {
       if(!$("#atrinfo"+i).attr('readonly'))
         $("#atrinfo"+i).attr('readonly','readonly');
     }


     if(json>0){
       $("#lblupdreport").html('Actualización Correcta.');
       setTimeout(function(){
         $("#lblupdreport").html('');
       },1000);
     }
   }
  })
}

//abre modal acerca de
function openabout(){
  $("#modalabout").modal('show');
}

//abre el modal de reportes
function openmodalreport(){
  $("#modalinfo").modal('show');

  //se oculta y visibiliza los botones del formulario
  $("#btnsave").css('visibility','hidden');
  $("#btnedit").css('visibility','visible');
  $("#btnpdf").css('visibility','visible');

  for (var i = 1; i < 24; i++) {
    if(!$("#atrinfo"+i).attr('readonly'))
      $("#atrinfo"+i).attr('readonly','readonly');
  }


  var date = new Date();

  var day = date.getDate();
  var month = date.getMonth();
  var year = date.getFullYear();

  var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
  uploadatareport($("#txtindser").val());

  $("#fecha").html(""+day+" de "+meses[month]+" de "+year);
  $("#divtab").html($("#divtable").html());
  $("#divg1").html($("#divgraph1").html());
  $("#divg2").html($("#divgraph2").html());

}

//llamado ajax para traer informacion de datos del inidcador
function uploadatareport(serialindi){
  $.ajax({
   type: "GET", //el el tipo de peticion puede ser GET y POsT
   url: "manuales", //la url del que realizara la consulta
   dataType : 'json',
   data:{c:serialindi},//Primera consulta
   //se ejecuta si todo se realiza bien
   success : function(json) {
     $("#atrinfo18").html('');
     $("#atrinfo20").html('');
     $("#atrinfo22").html('');
     for (var i = 0; i < 23; i++) {

       if(i===3 && serialindi===1 || i===3 && serialindi===6 || i===3 && serialindi===7){
          if(i == 17 || i == 19 || i == 21 ){
            if(json[i]=='< '){
              $("#atrinfo"+(i+1)).append('<option value="< ">Menor</option>');
            }
            else if(json[i]=='> '){
              $("#atrinfo"+(i+1)).append('<option value="> ">Mayor</option>');
            }
            else if(json[i]=='= '){
              $("#atrinfo"+(i+1)).append('<option value="= ">Igual</option>');
            }

          }
          else{
            $("#atrinfo"+(i+1)).val(json[i]+" "+$("#programa").html());

          }
       }
       else{
        if(i == 17 || i == 19 || i == 21){
          if(json[i]=='< '){
            $("#atrinfo"+(i+1)).append('<option value="< ">Menor</option>');
          }
          else if(json[i]=='> '){
            $("#atrinfo"+(i+1)).append('<option value="> ">Mayor</option>');
          }
          else if(json[i]=='= '){
            $("#atrinfo"+(i+1)).append('<option value="= ">Igual</option>');
          }

        }
        else{
          $("#atrinfo"+(i+1)).val(json[i])
        }

       }
     }
   },

   error : function(xhr, status) {
        alert('Disculpe, existió un problema');
    },
 });
}

//abre modal de cargar datos satisfaccion
function openmodaluploadsatisfaccion(){
  $('#mesage span').removeClass('green');
  $('#mesage span').addClass('red');
  $('#mesage p').removeClass('green');
  $('#mesage p').addClass('red');
  $('#mesage span').removeClass('glyphicon glyphicon-alert');
  $('#mesage span').removeClass('glyphicon glyphicon-ok');
  $('#mesage span').removeClass('glyphicon glyphicon-remove')
  $('#mesage p').html('');
  $("#modaluploadsatisfaccion").modal('show');
}

//abre modal para cargar datos de formacion docentes
function openmodaluploadFormacion(){
  $('#mesage span').removeClass('green');
  $('#mesage span').addClass('red');
  $('#mesage p').removeClass('green');
  $('#mesage p').addClass('red');
  $('#mesage span').removeClass('glyphicon glyphicon-alert');
  $('#mesage span').removeClass('glyphicon glyphicon-ok');
  $('#mesage span').removeClass('glyphicon glyphicon-remove')
  $('#mesage p').html('');
  $("#modaluploadFormacion").modal('show');
}

//abre modal cargar datos desercion por cohorte
function openmodaluploadcohorte(){
  $('#mesage span').removeClass('green');
  $('#mesage span').addClass('red');
  $('#mesage p').removeClass('green');
  $('#mesage p').addClass('red');
  $('#mesage span').removeClass('glyphicon glyphicon-alert');
  $('#mesage span').removeClass('glyphicon glyphicon-ok');
  $('#mesage span').removeClass('glyphicon glyphicon-remove')
  $('#mesage p').html('');
  $("#modaluploadcohorte").modal('show');
}

//abre modal cargar datos desercion por periodo
function openmodaluploadperiodo(){
  $('#mesage span').removeClass('green');
  $('#mesage span').addClass('red');
  $('#mesage p').removeClass('green');
  $('#mesage p').addClass('red');
  $('#mesage span').removeClass('glyphicon glyphicon-alert');
  $('#mesage span').removeClass('glyphicon glyphicon-ok');
  $('#mesage span').removeClass('glyphicon glyphicon-remove')
  $('#mesage p').html('');
  $("#modaluploadperiodo").modal('show');
}

//abre modal para cargar datos de estudiantes por departamento
function openmodaluploadEstudiantes(){
  $('#mesage span').removeClass('green');
  $('#mesage span').addClass('red');
  $('#mesage p').removeClass('green');
  $('#mesage p').addClass('red');
  $('#mesage span').removeClass('glyphicon glyphicon-alert');
  $('#mesage span').removeClass('glyphicon glyphicon-ok');
  $('#mesage span').removeClass('glyphicon glyphicon-remove')
  $('#mesage p').html('');
  $("#modaluploadEstudiantes").modal('show');
}

//abre modal para login de la aplicacion
function openmodallogin(){
  $("#modalrestart").modal('hide');
  $("#modallogin").modal('show');
}

//abre modal cambio contraseña
function openmodalrestart(){
  $("#modallogin").modal('hide');
  $('#resrecover').html('');
  $("#txtreuser").val("");
  $("#modalrestart").modal('show');
}

//abre modla informacion
function openinfo(){
  $('#modalmoreinfo').modal('show');
}
