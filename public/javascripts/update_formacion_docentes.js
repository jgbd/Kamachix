$(document).ready(function (){

    //ciclo para llenar a lista de años desde 1970 a 2050
    var r2="";
    for(var j = 1970 ; j<2051; j++){
      r2 = r2+"<option value='"+j+"'>"+j+"</option> ";
    }
    
    $("#lst_Anio").append(r2);
    $("#lst_Anio2").append(r2);
    $("#lst_Anio3").append(r2);
    $("#lst_Anio4").append(r2);


    //zona de eventos

    //evento submit a botton submit atraves del formulario
    //formulario de actulizacion de doctores
    $("#frm1").submit(function (event){

        var aniojs = $('#lst_Anio').val().toString(); // obtener el año actual
        var formData;

        //alert(ano.toString());
        formData = {
          //se toman los dos años seleccionados
          'cantc': parseInt($("#tc").val()),
          'canhc': parseInt($("#hc").val()),
          'canto': parseInt($("#to").val()),
          'c':1,
          'nom':'Doctor',
          'anio':aniojs
        };
        // datos que se enviaran para consultar si ya existe un dato de ese año en la tabla de relacion docentes
        formDataRela ={
          'anio':aniojs,
          'd':1
        };

        // datos para actualizar el registro en la tabla relacion_docentes
        formDataRela3 ={
          'anio':aniojs,
          'd':3
        };


        // inserta el registro de profesores con titulo de doctor a la tabla formacion_kpi
        $.ajax({

           type: "POST", //el el tipo de peticion puede ser GET y POsT
           url: "consultas_update_formacion", //la url del que realizara la consulta
           data:formData,
           dataType : 'json',
           //data:{c:1,tc:parseInt($("#doctor").val())},//datos para insertar
           success : function(json) {
             alert('Actualizacion realizada correctamente')

           }

        });

        // ajax para consultar si existe unregistro en la tabla relacion_docentes_kpi
        $.ajax({

           type: "POST", //el el tipo de peticion puede ser GET y POsT
           url: "consulta_update_relacionTCHC", //la url del que realizara la consulta
           data:formDataRela,
           dataType : 'json',
           //data:{c:1,tc:parseInt($("#doctor").val())},//datos para insertar
           success : function(json) {


             // si existen un registro de ese año en la tabla relacion_docentes_kpi
             if(json.rows[0].conteo > 0){
               // ajax para actualizar el registro con los datos de la tabla formacion_kpi
               $.ajax({
                type: "POST", //el el tipo de peticion puede ser GET y POsT
                url: "consulta_update_relacionTCHC", //la url del que realizara la consulta
                data:formDataRela3,
                dataType : 'json',
                //data:{c:1,tc:parseInt($("#doctor").val())},//datos para insertar
                success : function(json) {
                  //alert('registro actualizado')

                  }

              });


             }


           }

       });
       


    });

    //formulario de actulizacion de magister
    $("#frm2").submit(function (event){

        var aniojs = $('#lst_Anio2').val().toString(); // obtener el año actual
        var formData;

        //alert(ano.toString());
        formData = {
          //se toman los dos años seleccionados
          'cantc': parseInt($("#tc2").val()),
          'canhc': parseInt($("#hc2").val()),
          'canto': parseInt($("#to2").val()),
          'c':1,
          'nom':'Magister',
          'anio':aniojs
        };
        // datos que se enviaran para consultar si ya existe un dato de ese año en la tabla de relacion docentes
        formDataRela ={
          'anio':aniojs,
          'd':1
        };

        // datos para actualizar el registro en la tabla relacion_docentes
        formDataRela3 ={
          'anio':aniojs,
          'd':3
        };


        // inserta el registro de profesores con titulo de doctor a la tabla formacion_kpi
        $.ajax({

           type: "POST", //el el tipo de peticion puede ser GET y POsT
           url: "consultas_update_formacion", //la url del que realizara la consulta
           data:formData,
           dataType : 'json',
           //data:{c:1,tc:parseInt($("#doctor").val())},//datos para insertar
           success : function(json) {
             alert('Actualizacion realizada correctamente')

           }

        });

        // ajax para consultar si existe unregistro en la tabla relacion_docentes_kpi
        $.ajax({

           type: "POST", //el el tipo de peticion puede ser GET y POsT
           url: "consulta_update_relacionTCHC", //la url del que realizara la consulta
           data:formDataRela,
           dataType : 'json',
           //data:{c:1,tc:parseInt($("#doctor").val())},//datos para insertar
           success : function(json) {


             // si existen un registro de ese año en la tabla relacion_docentes_kpi
             if(json.rows[0].conteo > 0){
               // ajax para actualizar el registro con los datos de la tabla formacion_kpi
               $.ajax({
                type: "POST", //el el tipo de peticion puede ser GET y POsT
                url: "consulta_update_relacionTCHC", //la url del que realizara la consulta
                data:formDataRela3,
                dataType : 'json',
                //data:{c:1,tc:parseInt($("#doctor").val())},//datos para insertar
                success : function(json) {
                  //alert('registro actualizado')

                  }

              });


             }
           }

       })
    });

    //formulario de actulizacion de especialistas
    $("#frm3").submit(function (event){

        var aniojs = $('#lst_Anio3').val().toString(); // obtener el año actual
        var tiempoc= parseInt($("#tc3").val());
        var horac=parseInt($("#hc3").val());
        var tiempoo=parseInt($("#to3").val());
        var formData;

        //alert(ano.toString());
        // datos para insertar en la tabla formacion_kpi
        formData = {
          //se toman los dos años seleccionados
          'cantc': tiempoc,
          'canhc': horac,
          'canto': tiempoo,
          'c':1,
          'nom':'Especialista',
          'anio':aniojs
        };


        // datos que se enviaran para consultar si ya existe un dato de ese año en la tabla de relacion docentes
        formDataRela ={
          'anio':aniojs,
          'd':1
        };

        // datos para actualizar el registro en la tabla relacion_docentes
        formDataRela3 ={
          'anio':aniojs,
          'd':3
        };

        //inserta el registro de profesores con titulo de doctor a la tabla formacion_kpi
        $.ajax({
          type: "POST", //el el tipo de peticion puede ser GET y POsT
          url: "consultas_update_formacion", //la url del que realizara la consulta
          data:formData,
          dataType : 'json',
          //data:{c:1,tc:parseInt($("#doctor").val())},//datos para insertar
          success : function(json) {
            alert('Actualizacion realizada correctamente')

          }
        });

        consulta_relacion();

        function consulta_relacion(){
          // ajax para consultar si existe unregistro en la tabla relacion_docentes_kpi
          $.ajax({

             type: "POST", //el el tipo de peticion puede ser GET y POsT
             url: "consulta_update_relacionTCHC", //la url del que realizara la consulta
             data:formDataRela,
             dataType : 'json',
             //data:{c:1,tc:parseInt($("#doctor").val())},//datos para insertar
             success : function(json) {


               // si existen un registro de ese año en la tabla relacion_docentes_kpi
               if(json.rows[0].conteo > 0){
                 // ajax para actualizar el registro con los datos de la tabla formacion_kpi
                 $.ajax({
                  type: "POST", //el el tipo de peticion puede ser GET y POsT
                  url: "consulta_update_relacionTCHC", //la url del que realizara la consulta
                  data:formDataRela3,
                  dataType : 'json',
                  //data:{c:1,tc:parseInt($("#doctor").val())},//datos para insertar
                  success : function(json) {
                    //alert('registro actualizado')

                    }

                });

               }

             }

         })
        }


    });
    //ormulario de actulizacion de profesionales
    $("#frm4").submit(function (event){

        var aniojs = $('#lst_Anio4').val().toString(); // obtener el año actual
        var formData;

        //alert(ano.toString());
        formData = {
          //se toman los dos años seleccionados
          'cantc': parseInt($("#tc").val()),
          'canhc': parseInt($("#hc").val()),
          'canto': parseInt($("#to").val()),
          'c':1,
          'nom':'Profesional',
          'anio':aniojs
        };
        // datos que se enviaran para consultar si ya existe un dato de ese año en la tabla de relacion docentes
        formDataRela ={
          'anio':aniojs,
          'd':1
        };

        // datos para actualizar el registro en la tabla relacion_docentes
        formDataRela3 ={
          'anio':aniojs,
          'd':3
        };


        // inserta el registro de profesores con titulo de doctor a la tabla formacion_kpi
        $.ajax({

           type: "POST", //el el tipo de peticion puede ser GET y POsT
           url: "consultas_update_formacion", //la url del que realizara la consulta
           data:formData,
           dataType : 'json',
           //data:{c:1,tc:parseInt($("#doctor").val())},//datos para insertar
           success : function(json) {
             alert('Actualizacion realizada correctamente')

           }

        });

        // ajax para consultar si existe unregistro en la tabla relacion_docentes_kpi
        $.ajax({

           type: "POST", //el el tipo de peticion puede ser GET y POsT
           url: "consulta_update_relacionTCHC", //la url del que realizara la consulta
           data:formDataRela,
           dataType : 'json',
           //data:{c:1,tc:parseInt($("#doctor").val())},//datos para insertar
           success : function(json) {


             // si existen un registro de ese año en la tabla relacion_docentes_kpi
             if(json.rows[0].conteo > 0){
               // ajax para actualizar el registro con los datos de la tabla formacion_kpi
               $.ajax({
                type: "POST", //el el tipo de peticion puede ser GET y POsT
                url: "consulta_update_relacionTCHC", //la url del que realizara la consulta
                data:formDataRela3,
                dataType : 'json',
                //data:{c:1,tc:parseInt($("#doctor").val())},//datos para insertar
                success : function(json) {
                  //alert('registro actualizado')

                }

              });


             }

           }

       })

    });
    

});
