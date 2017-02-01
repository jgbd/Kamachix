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
  //el metodo MD5 recive una cadena a encriptar
  //req.body es el el que contiene las variables que se reciben del form
  var usuario = req.body.user; //aqui se crea el usuario y se encripta en MD5
  var password = req.body.pass; //aqui se crea el password y se encripta en MD5

  //esta variable es la que contien la consulta a realizarse en la DB
  var sql = 'SELECT u.codigo, u.name, u.rol FROM public.users u WHERE u.user LIKE MD5($1) AND u.pass LIKE MD5($2)';

  //aquui se crea la conexion a DB
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    //Aqui es donde serealiza el query de la DB
    //resive el sql, el arreglo siguiente contine los parametros que van en el sql  preparado
    //la funcion anonima recive la variable de err que controla el error  y la result
    //que es la que controla el resultado de la consulta el cual es un JSON
    client.query(sql,[usuario,password], function(err, result) {
      //console.log(sql);
      done();
      if(err) {
        return console.error('error running query', err);
      }
      //se conprueba si existe resultado
      //si es mayor a 0 se crea la variable de session con el resultado
      //y se devuelve el numero de resultados que en este caso siempre debe ser 1 si esta correcto
      //y es falso se devuelve el cero que sera para jusgar que realizar del lado Frond
      if(result.rowCount>0){
        req.session.codigo = result.rows[0].codigo;
        req.session.name = result.rows[0].name;
        req.session.rol = result.rows[0].rol;
        res.json(result.rowCount);
      }else{
        res.json(result.rowCount);
      }
    });
  });
  //se ejecuta si el usuario o password no son correctas y no se puede conectar al SGBD
  pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
  });
});

module.exports = router;
