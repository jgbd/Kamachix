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
router.get('/', function(req, res, next) {

  if(req.query.c == 1){
    var sql='select nom_formacion,t_completo,anio from "Datawarehouse"."KPI_Formacion" join formacion on formacion=cod_formacion order by anio desc limit 8';
  }
  else if (req.query.c ==2){
    var sql='select DISTINCT anio from "Datawarehouse"."KPI_Formacion" order by anio DESC';
  }
  else if (req.query.c ==3){
    var sql="select name,t_completo,t_ocasional,hora_catedra,anio,periodo,nom_formacion from formacion_departamento join formacion on formacion=cod_formacion join users on departamento=codigo  where departamento='25' order by anio DESC limit 4";
  }
  else if (req.query.c ==4){
    var sql='select DISTINCT name from formacion_departamento join users on departamento=codigo order by name';
  }
  else if (req.query.c ==5){
    var sql='select DISTINCT anio from formacion_departamento order by anio DESC';
  }

  else if (req.query.c ==6){
    var sql='select DISTINCT periodo from formacion_departamento';
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
    client.query(sql, function(err, result) {
      //console.log(sql);
      done();
      if(err) {
        return console.error('error running query', err);
      }
      //se conprueba si existe resultado
      //si es mayor a 0 se crea la variable de session con el resultado
      //y se devuelve el numero de resultados que en este caso siempre debe ser 1 si esta correcto
      //y es falso se devuelve el cero que sera para jusgar que realizar del lado Frond

      res.json(result);
    });
  });

        //se ejecuta si el usuario o password no son correctas y no se puede conectar al SGBD
  pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
  });

});

// filtros
/* POST home page. */
router.post('/', function(req, res, next) {
  //valida si esta creada la variable de sesion caso contrario envia mensaje de error
  //variable para tomar el año que fue seleccionado
  var ani = [];

  
  if(req.body.c == 1){
    //esta variable es la que contien la consulta a realizarse en la DB
    var sql='select nom_formacion,t_completo,anio from "Datawarehouse"."KPI_Formacion" join formacion on formacion=cod_formacion where anio=$1 order by anio,formacion,t_completo';
    ani = [req.body.anio];
  }
  else if (req.body.c ==7){    
    var sql='select departamento,name,t_completo,t_ocasional,hora_catedra,anio,periodo,nom_formacion from formacion_departamento join formacion on formacion=cod_formacion join users on departamento=codigo where name=$1 and anio=$2 and periodo=$3 order by anio,formacion,t_completo';
    ani = [req.body.name,req.body.anio,req.body.periodo];    
  }

  
  
    //aquui se crea la conexion a DB
    pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      //Aqui es donde serealiza el query de la DB
      //resive el sql, el arreglo siguiente contine los parametros que van en el sql  preparado
      //la funcion anonima recive la variable de err que controla el error  y la result
      //que es la que controla el resultado de la consulta el cual es un JSON
      client.query(sql,ani, function(err, result) {
        //console.log(sql);
        done();
        if(err) {
          return console.error('error running query', err);
        }

        // se envia el json con el resultado de la consulta
        res.json(result);
        //console.log(result);

      });
    });

          //se ejecuta si el usuario o password no son correctas y no se puede conectar al SGBD
    pool.on('error', function (err, client) {
      console.error('idle client error', err.message, err.stack)
    });  
 


});
module.exports = router;
