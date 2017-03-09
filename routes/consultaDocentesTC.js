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
  if(req.query.c == 1)
    //var sql ='SELECT spctt."Anho", spctt."estudiantes", spctt."docentes", ROUND(spctt."estudiantes"/spctt."docentes",0) AS razon FROM "Datawarehouse"."KPI_Students_per_Complete_Time_Teacher" spctt ORDER BY spctt."Anho"';
    var sql ='SELECT spctt."Anho", spctt.razonanual FROM "Datawarehouse"."KPI_Estudiantes_por_Docentes_TC" spctt ORDER BY spctt."Anho"';
  else if (req.query.c == 2)
    //var sql = 'SELECT pe."anho", pd."tipo", ROUND(pe."semestreA"/pd."semestreA",0) as razonA, ROUND(pe."semestreB"/pd."semestreB",0) as razonB FROM "poblacion_estudiantes" pe JOIN "poblacion_docentes" pd ON pe.anho=pd.anho WHERE pd."tipo"='+"'1'"+'ORDER BY pe."anho"';
    var sql = 'SELECT spctt."Anho", spctt."razona", spctt."razonb", spctt.razonanual FROM "Datawarehouse"."KPI_Estudiantes_por_Docentes_TC" spctt ORDER BY spctt."Anho"';
  else if (req.query.c == 3){
    var beforedata=[req.query.anho];
    var sql = 'SELECT * FROM "Datawarehouse"."KPI_Estudiantes_por_Docentes_TC" spctt WHERE "Anho"=$1';
  }
  else if (req.query.c == 4){
    var beforedata=[req.query.anho];
    console.log(beforedata);
    var sql = 'SELECT * FROM "Datawarehouse"."KPI_Estudiantes_por_Docentes_TC" spctt WHERE "Anho"=$1 and razonb=0';
  }
  else if (req.query.c == 5){
    var beforedata=[req.query.anho,1];
    var sql = 'SELECT poblacion_estudiantes."semestreA" AS estudiantesa,poblacion_estudiantes."semestreB" AS estudiantesb,poblacion_estudiantes.promedio AS estudiantesprom,poblacion_docentes."semestreA" AS docentesa, poblacion_docentes."semestreB" AS docentesb,poblacion_docentes.promedio AS docentesprom, tipo FROM poblacion_docentes JOIN poblacion_estudiantes ON poblacion_docentes.anho=poblacion_estudiantes.anho WHERE poblacion_estudiantes.anho=$1 AND tipo=$2';
  }
  else return console.log("error");
  //aqui se crea la conexion a DB
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    //Aqui es donde se realiza el query de la DB
    //resive el sql, el arreglo siguiente contiene los parametros que van en el sql  preparado
    //la funcion anonima recive la variable de err que controla el error  y la result
    //que es la que controla el resultado de la consulta el cual es un JSON
    client.query(sql, beforedata, function(err, result) {
      done();
      if(err) {
        return console.error('error running query', err);
      }
      console.log(result);
      res.json(result);
    });
  });
  //se ejecuta si el usuario o password no son correctas y no se puede conectar al SGBD
  pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
  });

});

module.exports = router;
