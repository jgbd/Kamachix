var express = require('express');
var router = express.Router();
var configdb = require("../config/dbConfig.js");
var AES = require("crypto-js/aes");
var SHA256 = require("crypto-js/sha256");
'use strict';
const nodemailer = require('nodemailer');

//variable que controla el pool de conexiones
var pool = configdb.configdb();

router.post('/', function(req, res, next) {
  var date = new Date();
  var enc = ""+date.getDate()+date.getMonth()+date.getFullYear();
  var fec = SHA256(enc).toString();
  var sql = 'SELECT u.codigo, u.encriptado FROM public.users u WHERE u.user LIKE MD5($1)';  //aqui se crea la conexion a DB
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    //Aqui es donde se realiza el query de la DB
    //resive el sql, el arreglo siguiente contiene los parametros que van en el sql  preparado
    //la funcion anonima recive la variable de err que controla el error  y la result
    //que es la que controla el resultado de la consulta el cual es un JSON
    client.query(sql,[req.body.user], function(err, result) {
      done();
      if(err) {
        return console.error('error running query', err);
      }

      //estos seran los datos de cada objeto o programa devuelto
      if(result.rowCount>0){
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: '"Outlook365"',
            auth: {
                user: 'juanbasdel@udenar.edu.co',
                pass: '1085301712Jgbd'
            }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Juan Bastidas" <juanbasdel@udenar.edu.co>', // sender address
            to: 'juanbasdel@gmail.com', // list of receivers
            subject: 'Recuperar contraseña kamachix ✔', // Subject line
            text: 'http://10.42.0.1:3000/recover/'+result.rows[0].encriptado+'/'+fec, // plain text body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });
        res.json('1');
      }else{
        res.json('0');
      }
    });
  });
  //se ejecuta si el usuario o password no son correctas y no se puede conectar al SGBD
  pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
  });
});

module.exports = router;
