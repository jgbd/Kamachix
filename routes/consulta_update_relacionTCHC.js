var express = require('express');
var router = express.Router();
//var crypto = require("crypto-js");
var pg = require("pg");

//Variable que configura la conexion al SGBD postgresql
var config = {
  user: 'postgres', //env var: PGUSER
  database: 'datos_indicadores', //env var: PGDATABASE
  password: '123', //env var: PGPASSWORD
  host: 'localhost', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

//variable que controla el pool de conexiones
var pool = new pg.Pool(config);

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
    var sql='select count(*) as conteo from "Datawarehouse".relacion_docentes_kpi where anio=$1';
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
