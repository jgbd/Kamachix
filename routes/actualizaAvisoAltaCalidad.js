var express = require('express');
var router = express.Router();
var configdb = require("../config/dbConfig.js");
//variable que controla el pool de conexiones
var pool = configdb.configdb();

//metodo que se llama despues de invocar por POST a la pagina
//la funcion anonima que resive tiene tres parametros
//req que es la peticion
//res que esla respuesta
//next que es la siguiente function

router.post('/', function(req, res, next) {
  var beforedata=[req.body.aviso,req.body.codigo,req.body.gravedad];
  var sql ='UPDATE "public"."acreditacion_alta_calidad" SET aviso=$1,gravedad=$3 WHERE resolucion=$2';
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query(sql,beforedata,function(err, result) {
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
});

module.exports = router;
