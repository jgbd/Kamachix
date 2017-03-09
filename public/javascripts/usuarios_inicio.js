$(document).ready(function(){
  //se ejecuta al dar submit en el formulario de login
  $('#frmlogin').submit(function(event) {
    //se coloca los datos del form en el formato adecuado para enviar al server
    var formData = {
          //aqui se encriptan en MD5 antes de enviar
          'user': $('#txtuser').val(),
          'pass': $('#txtpass').val()
        };
    //el metodo ajax para consulta asyncronica
    $.ajax({
     type: "POST", //el el tipo de peticion puede ser GET y POsT
     url: "consultaUsuario", //la url del que realizara la consulta
     data: formData, //los datos que seran enviados al server
     dataType : 'json', //el formato de datos enviados y devueltos del server
     //se ejecutasi todo se realiza bien
     success : function(json) {
       //aqui comprobamos que si el resultado existe lo redirecciona al siguiente pagina
       if(json>0){
         location.href="/"; //metodo de resireccionamiento
       }else{
         $("#respuesta").text("Error en nombre de usuario o contraseña \n Vuelva a Intentar" );
       }
     }
   });
  event.preventDefault();
  });
});
