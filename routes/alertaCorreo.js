var express = require('express');
var router = express.Router();
var configdb = require("../config/dbConfig.js");
var configmail = require("../config/emailconfig.js");

//variable que controla el pool de conexiones
var pool = configdb.configdb();

router.post('/', function(req, res, next) {
  var sql = 'SELECT us.email, pr.nombre '+
            'FROM public.users us JOIN public.programas pr ON pr.departamento = us.codigo '+
            'WHERE	pr.codigo = $1 LIMIT 1 '

  console.log(req.body.codigo);
  var cod;
  if(req.body.codigo<100){
    cod='0'+req.body.codigo;
    if(req.body.codigo<10){
      cod='0'+cod;
    }
  }else {
    cod=req.body.codigo;
  }


  //aqui se crea la conexion a DB
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
  //Aqui es donde se realiza el query de la DB
  //recibe el sql, el arreglo siguiente contiene los parametros que van en el sql  preparado
  //la funcion anonima recive la variable de err que controla el error  y la result
  //que es la que controla el resultado de la consulta el cual es un JSON
    client.query(sql, [cod],function(err, result) {
      done();
      if(err) {
        return console.error('error running query', err);
      }
      // recupera cosa para el mensaje
      var email = result.rows[0].email;
      var programa = result.rows[0].nombre;
      if(programa.indexOf('Pasto')>-1){
        programa = programa.replace('Pasto','')
      }else if (programa.indexOf('Túquerres')>-1) {
        programa = programa.replace('Túquerres','')
      }else if (programa.indexOf('Buesaco')>-1 ) {
        programa = programa.replace('Buesaco','')
      }else if (programa.indexOf('Ipiales')>-1) {
        programa = programa.replace('Ipiales','')
      }

      var texto = "";
      if(req.body.gravedad == 1){
        texto+='<center><h2 style="color:orange">¡Atención!,</h2></center><br><p>Por favor su programa: <b>'+ programa + '</b> Tiene menos de dos años para reacreditarse. Verifique.</p>';

        var sqlup = 'UPDATE public.acreditacion_alta_calidad SET mail = true' +
                    ' WHERE programa = $1 AND activo=true'
      } else{
        texto+='<center><h2 style="color:red">¡Atención!,</h2></center><br><p>Por favor su programa: <b>'+ programa + '<b> Tiene menos de un año para reacreditarse. Verifique.</p>';

        var sqlup = 'UPDATE public.acreditacion_alta_calidad SET mail = false' +
                    ' WHERE programa = $1 AND activo=true '
      }
      //envio mensajes
      let transporter = configmail.configmail();
      let mailOptions = {
          from: '"Kamachix" <indicadoresacademicos@udenar.edu.co>', // sender address
          to: 'juanbasdel@udenar.edu.co', // list of receivers
          subject: 'Alerta de Reacreditacion ✔', // Subject line
          text: ' ',
          html: texto // plain text body
      };
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Message %s sent: %s', info.messageId, info.response);
      });
      //aqui se crea la conexion a DB
      pool.connect(function(err, client, done) {
        if(err) {
          return console.error('error fetching client from pool', err);
        }
      //Aqui es donde se realiza el query de la DB
      //recibe el sql, el arreglo siguiente contiene los parametros que van en el sql  preparado
      //la funcion anonima recive la variable de err que controla el error  y la result
      //que es la que controla el resultado de la consulta el cual es un JSON
        client.query(sqlup, [cod],function(err, result) {
          done();
          if(err) {
            return console.error('error running query', err);
          }
          console.log("Si altero : "+result.rowCount);
        });
      });

      //se ejecuta si el usuario o password no son correctas y no se puede conectar al SGBD
      pool.on('error', function (err, client) {
        console.error('idle client error', err.message, err.stack)
      });

    });
  });
  //se ejecuta si el usuario o password no son correctas y no se puede conectar al SGBD
  pool.on('error', function (err, client) {
  console.error('idle client error', err.message, err.stack)
  });

});

module.exports = router;
