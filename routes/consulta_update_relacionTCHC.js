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
  //esta variable es la que contien la consulta a realizarse en la DB
  var canTC=req.body.cantc;
  var canHC=req.body.canhc;
  //var anio=req.body.anio;
  var anio=req.body.anio;
  var rela=req.body.rela;
  var arre;

  if(req.body.d == 1){
    console.log('entre aqui');
    var sql='select count(*) as conteo from "Datawarehouse"."KPI_Relacion_Docentes" where anio=$1';
    arre = [anio];
    console.log(anio);
  }
  else return console.log("error");
  
  //aquui se crea la conexion a DB
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    //Aqui es donde serealiza el query de la DB
    //resive el sql, el arreglo siguiente contine los parametros que van en el sql  preparado
    //la funcion anonima recive la variable de err que controla el error  y la result
    //que es la que controla el resultado de la consulta el cual es un JSON
    client.query(sql,arre,function(err, result) {
      //console.log(sql);
      done();
      if(err) {
        return console.error('error running query', err);
      }
      //se conprueba si existe resultado
      //si es mayor a 0 se crea la variable de session con el resultado
      //y se devuelve el numero de resultados que en este caso siempre debe ser 1 si esta correcto
      //y es falso se devuelve el cero que sera para jusgar que realizar del lado Frond
      //console.log(result);
      res.json(result);

    });
  });

  pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
  });

});

module.exports = router;
