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
  var val = [req.body.cp1,req.body.cae1,req.body.cp2,req.body.cae2,req.body.cm,req.body.snies];

  var sql = 'UPDATE public.acreditacion_alta_calidad SET chkpm1 = $1, chkaev1 = $2, chkpm2=$3, chkaev2=$4, chkmen=$5'+
            ' WHERE programa = $6 AND activo = TRUE';

  //aqui se crea la conexion a DB
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
  //Aqui es donde se realiza el query de la DB
  //recibe el sql, el arreglo siguiente contiene los parametros que van en el sql  preparado
  //la funcion anonima recive la variable de err que controla el error  y la result
  //que es la que controla el resultado de la consulta el cual es un JSON
    client.query(sql, val,function(err, result) {
      done();
      if(err) {
        return console.error('error running query', err);
      }
      res.json(result.rowCount);
    });
  });
  //se ejecuta si el usuario o password no son correctas y no se puede conectar al SGBD
  pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
  });
});

module.exports = router;
