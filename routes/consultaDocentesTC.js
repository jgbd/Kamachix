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
    //var sql ='SELECT spctt."Anho", spctt.razonanual,"sim_Rango_MA","num_Rango_MA","sim_Rango_A","num_Rango_A","sim_Rango_I","num_Rango_I" FROM "Datawarehouse"."KPI_Estudiantes_por_Docentes_TC" spctt join manuales_indicadores on "manual_Estu_Docente"=codigo ORDER BY spctt."Anho"';
    var sql ='SELECT spctt."Anho", ROUND(SUM(spctt.estudiantes)/SUM(spctt.docentes),0) AS razonanual,"sim_Rango_MA","num_Rango_MA","sim_Rango_A","num_Rango_A","sim_Rango_I","num_Rango_I" FROM "Datawarehouse"."KPI_Estudiantes_por_Docentes_TC" spctt join manuales_indicadores on "manual_Estu_Docente"=codigo GROUP BY spctt."Anho","sim_Rango_MA","num_Rango_MA","sim_Rango_A","num_Rango_A","sim_Rango_I","num_Rango_I" ORDER BY spctt."Anho"';
  else if (req.query.c == 2)
    //var sql = 'SELECT spctt."Anho", spctt."razona", spctt."razonb", spctt.razonanual,"sim_Rango_MA","num_Rango_MA","sim_Rango_A","num_Rango_A","sim_Rango_I","num_Rango_I" FROM "Datawarehouse"."KPI_Estudiantes_por_Docentes_TC" spctt join manuales_indicadores on "manual_Estu_Docente"=codigo ORDER BY spctt."Anho"';
    var sql = 'SELECT spctt."Anho", t1.ea/t2.da as razona, t3.eb/t4.db as razonb, "sim_Rango_MA","num_Rango_MA","sim_Rango_A","num_Rango_A","sim_Rango_I","num_Rango_I" FROM "Datawarehouse"."KPI_Estudiantes_por_Docentes_TC" spctt join manuales_indicadores on "manual_Estu_Docente"=codigo JOIN (SELECT estudiantes_departamento.anho, sum(estudiantes_departamento.matriculados) AS ea FROM estudiantes_departamento WHERE estudiantes_departamento.periodo='+"'1'"+' GROUP BY estudiantes_departamento.anho) t1 ON t1.anho=spctt."Anho" JOIN ( SELECT formacion_departamento.anio, sum(formacion_departamento.t_completo) AS da FROM formacion_departamento WHERE formacion_departamento.periodo ='+"'1'"+' GROUP BY formacion_departamento.anio) t2 ON t1.anho=t2.anio FULL JOIN (SELECT estudiantes_departamento.anho, sum(estudiantes_departamento.matriculados) AS eb FROM estudiantes_departamento WHERE estudiantes_departamento.periodo = '+"'2'"+' GROUP BY estudiantes_departamento.anho) t3 ON t1.anho=t3.anho FULL JOIN ( SELECT formacion_departamento.anio, sum(formacion_departamento.t_completo) AS db FROM formacion_departamento WHERE formacion_departamento.periodo = '+"'2'"+'  GROUP BY formacion_departamento.anio) t4 ON t1.anho=t4.anio GROUP BY spctt."Anho",t1.ea,t2.da,t3.eb,t4.db,"sim_Rango_MA","num_Rango_MA","sim_Rango_A","num_Rango_A","sim_Rango_I","num_Rango_I" ORDER BY spctt."Anho"';
/*  else if (req.query.c == 3){
    var beforedata=[req.query.anho];
    var sql = 'SELECT * FROM "Datawarehouse"."KPI_Estudiantes_por_Docentes_TC" spctt WHERE "Anho"=$1';
  }
  else if (req.query.c == 4){
    var beforedata=[req.query.anho];
    console.log(beforedata);
    var sql = 'SELECT * FROM "Datawarehouse"."KPI_Estudiantes_por_Docentes_TC" spctt WHERE "Anho"=$1 and razonb=0';
  }
  else if (req.query.c == 5){
    //var beforedata=[req.query.anho,1,2];
    var beforedata=[req.query.anho];
    //var sql = 'SELECT poblacion_estudiantes."semestreA" AS estudiantesa,poblacion_estudiantes."semestreB" AS estudiantesb,poblacion_estudiantes.promedio AS estudiantesprom,poblacion_docentes."semestreA" AS docentesa, poblacion_docentes."semestreB" AS docentesb,poblacion_docentes.promedio AS docentesprom, tipo FROM poblacion_docentes JOIN poblacion_estudiantes ON poblacion_docentes.anho=poblacion_estudiantes.anho WHERE poblacion_estudiantes.anho=$1 AND tipo=$2';
    //var sql = 'SELECT poblacion_estudiantes."semestreA" AS estudiantesa,poblacion_estudiantes."semestreB" AS estudiantesb,poblacion_estudiantes.promedio AS estudiantesprom,poblacion_docentes."semestreA" AS docentesa, (SELECT sum(t_completo) FROM formacion_departamento WHERE anio=$1 AND periodo=$3) AS docentesb,poblacion_docentes.promedio AS docentesprom, tipo FROM poblacion_docentes JOIN poblacion_estudiantes ON poblacion_docentes.anho=poblacion_estudiantes.anho WHERE poblacion_estudiantes.anho=$1 AND tipo=$2';
    var sql = 'SELECT poblacion_estudiantes."semestreA" AS estudiantesa,poblacion_estudiantes."semestreB" AS estudiantesb,poblacion_estudiantes.promedio AS estudiantesprom,vista_poblacion_docentes."semestreA" AS docentesa, vista_poblacion_docentes."semestreB" AS docentesb,vista_poblacion_docentes.promedio AS docentesprom FROM vista_poblacion_docentes JOIN poblacion_estudiantes ON vista_poblacion_docentes.anho=poblacion_estudiantes.anho WHERE poblacion_estudiantes.anho=$1';
  }
  else if (req.query.c == 6){
    var beforedata=[req.query.anho];
    var sql = 'SELECT "semestreA" as docentesa FROM vista_poblacion_docentes where anho=$1';
  }*/
  else if (req.query.c == 7){
    var dep=[req.query.department];
    var sql ='SELECT "Anho" FROM "Datawarehouse"."KPI_Estudiantes_por_Docentes_TC" WHERE departamento LIKE $1 ORDER BY "Anho"';
  }
  else if (req.query.c == 8){
    var sql ='SELECT spctt.departamento,u.name FROM "Datawarehouse"."KPI_Estudiantes_por_Docentes_TC" spctt JOIN users u ON spctt.departamento=u.codigo GROUP BY spctt.departamento,u.name ORDER BY u.name';
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
    client.query(sql, dep, function(err, result) {
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
