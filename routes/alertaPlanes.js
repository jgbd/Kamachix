var express = require('express');
var router = express.Router();
var configdb = require("../config/dbConfig.js");
var configmail = require("../config/emailconfig.js");

//variable que controla el pool de conexiones
var pool = configdb.configdb();

router.get('/', function(req, res, next) {
  var sql = 'SELECT pr.nombre, de.email, de.alternative_email '+
            'FROM public.programas pr JOIN public.users de '+
            'ON pr.departamento=de.codigo WHERE pr.snies = $1 LIMIT 1'

  pool.connect(function(err, client, done) {
    client.query(sql, [req.query.snies],function(err, result) {
      done();
      if(err) {
        return console.error('error running query', err);
      }
      var texto = '<center> <h2 style="color:orange">Atención</h2>';
      var sqlup = '';
      switch (req.query.plan) {
        case "1": texto += '<p>El programa <b>'+result.rows[0].nombre+
                        ' </b>Tiene menos de 30 dias para entregar el primer plan de mejoramiento</p>';
                  sqlup = 'UPDATE public.acreditacion_alta_calidad SET mailpm1 = TRUE '+
                          'WHERE programa = $1 AND activo = TRUE';
          break;
        case "2": texto += '<p>El programa <b>'+result.rows[0].nombre+
                        ' </b>Tiene menos de 30 dias para entregar la primera auto evaluación</p>';
                  sqlup = 'UPDATE public.acreditacion_alta_calidad SET mailaev1 = TRUE '+
                          'WHERE programa = $1 AND activo = TRUE';
          break;
        case "3": texto += '<p>El programa <b>'+result.rows[0].nombre+
                        ' </b>Tiene menos de 30 dias para entregar el segundo plan de mejoramiento</p>';
                  sqlup = 'UPDATE public.acreditacion_alta_calidad SET mailpm2 = TRUE '+
                          'WHERE programa = $1 AND activo = TRUE';
          break;
        case "4": texto += '<p>El programa <b>'+result.rows[0].nombre+
                        ' </b>Tiene menos de 30 dias para entregar la segunda auto evaluación</p>';
                  sqlup = 'UPDATE public.acreditacion_alta_calidad SET mailaev2 = TRUE '+
                          'WHERE programa = $1 AND activo = TRUE';
          break;
        case "5": texto += '<p>El programa <b>'+result.rows[0].nombre+
                        ' </b>Tiene menos de 30 dias para realizar el tramite ante el Ministerio de Educación Nacional</p>';
                  sqlup = 'UPDATE public.acreditacion_alta_calidad SET mailmen = TRUE '+
                          'WHERE programa = $1 AND activo = TRUE';
          break;
        default: texto = '';
      }
      texto += '</center>'
      //envio mensajes
      let transporter = configmail.configmail();
      let mailOptions = {
          from: '"Indicadores Academicos Udenar" <indicadoresacademicos@udenar.edu.co>', // sender address
          to: ''+result.row[0].email+', '+result.rows[0].alternative_email, // list of receivers
          subject: 'Alerta de seguimiento acreditacion ✔', // Subject line
          text: 'Pro favor revizar indicadoresacademicos.udenar.edu.co ',
          html: texto // plain text body
      };
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Message %s sent: %s', info.messageId, info.response);
      });
      pool.connect(function(err, client, done) {
        client.query(sqlup,[req.query.snies],function(err, result) {
          done();
          if(err) {
            return console.error('error running query', err);
          }
        });
      });
      //se ejecuta si el usuario o password no son correctas y no se puede conectar al SGBD
      pool.on('error', function (err, client) {
        console.error('idle client error', err.message, err.stack)
      });

      res.json('si');
    });
  });
  //se ejecuta si el usuario o password no son correctas y no se puede conectar al SGBD
  pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
  });
});
module.exports = router;
