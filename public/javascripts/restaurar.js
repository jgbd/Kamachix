$(document).ready(function(){
  $('#frmrec').submit(function(event){
    comparar_textos($('#txtpass1').val(), $('#txtpass2').val());
    event.preventDefault();
  });
});

function comparar_textos(texto_1, texto_2) {
	var tam_txt_1 = texto_1.length;
	var tam_txt_2 = texto_2.length;
  var ban = true;
	if (tam_txt_1 != tam_txt_2) {
    ban = false;
	} else {
		for (n = 0; n < tam_txt_1; n++) {
			if (texto_1.charAt(n) != texto_2.charAt(n)) {
        ban = false;
        break;
	    }
    }
  }
  if(ban){
    actualizarcontrasena();
  }else {
    alert('las contraseñas no coinciden');
  }
}

function actualizarcontrasena(){
  alert($('#txtpass1').val());
  var formData = {
        'pass': $('#txtpass1').val(),
      };
  $.ajax({
   type: "POST", //el el tipo de peticion puede ser GET y POsT
   url: "recover", //la url del que realizara la consulta
   data: formData, //los datos que seran enviados al server
   dataType : 'json', //el formato de datos enviados y devueltos del server
   //se ejecutasi todo se realiza bien
   success : function(json) {
    //  aqui comprobamos que si el resultado existe lo redirecciona al siguiente pagina
     if(json>0){
       $("#resrec").text("La contraseña se cambio con exito." );
     }else{
       $("#resrecover").text("La contraseña no se pudo cambiar, vuelve a intentar." );
     }
   }
  });
}
