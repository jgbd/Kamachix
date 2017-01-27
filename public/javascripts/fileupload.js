$(document).ready(function(){
  $('#uploadform').submit(function(event){
    var cx = comprueba_extension($('#files').val());
    $('#mesage').css('color','red');
    if(cx===0) {
      $('#mesage span').addClass('glyphicon glyphicon-alert');
      $('#mesage p').html('Seleccione un archivo!!');
    }
    else if(cx===1) {
      $('#mesage span').addClass('glyphicon glyphicon-alert');
      $('#mesage p').html('Formato de archivo no valido!!');
    }
    else{
      $('#mesage').css('color','green');
      loadfile();
    }
    event.preventDefault();
  });
});

function comprueba_extension(archivo) {
   var extensiones_permitidas = new Array(".csv");
   if (!archivo) {
      //Si no tengo archivo, es que no se ha seleccionado un archivo en el formulario
      return 0;
   }else{
      //recupero la extensión de este nombre de archivo
      var extension = (archivo.substring(archivo.lastIndexOf("."))).toLowerCase();
      //compruebo si la extensión está entre las permitidas
      var permitida = false;
      for (var i = 0; i < extensiones_permitidas.length; i++) {
         if (extensiones_permitidas[i] == extension) {
         permitida = true;
         break;
         }
      }
      if (!permitida) {
        return 1
      }else{
        return 2;
      }
   }
}

function loadfile(){

  $('#mesage span').removeClass('glyphicon glyphicon-alert')
  var formData = new FormData();
  formData.append('file', $('#files')[0].files[0]);
  $.ajax({
     url : '/upload',
     type : 'POST',
     data : formData,
     processData: false,  // tell jQuery not to process the data
     contentType: false,  // tell jQuery not to set contentType
     success : function(data) {
       if(data==='0') {
         $('#mesage').css('color','red');
         $('#mesage span').addClass('glyphicon glyphicon-alert')
         $('#mesage p').html('Seleccione un archivo!!');
       }
       else if(data==='1'){
         $('#mesage').css('color','red');
         $('#mesage span').addClass('glyphicon glyphicon-alert')
         $('#mesage p').html('Formato de archivo no valido!!');
       }
       else if(data==='2'){
         $('#mesage').css('color','red');
         $('#mesage span').addClass('glyphicon glyphicon-alert')
         $('#mesage p').html('Error!!');
       }
       else {
         $('#mesage').css('color','green');
         $('#mesage span').addClass('glyphicon glyphicon-ok')
         $('#mesage p').html('Carga Exitosa!!');
       }
     }
  });
}
