var express = require('express');
var router = express.Router();
var configdb = require("../config/dbConfig.js");

//variable que controla el pool de conexiones
var pool = configdb.configdb();

//metodo que se llama despues de invocar por get a la pagina
//la funcion anonima que resive tiene tres parametros
//req que es la peticion
//res que esla respuesta
//next que es la siguiente function

router.get('/', function(req, res, next) {

  if(req.query.c == 1){
    var sql = 'SELECT p.nombre,  pd.programa FROM "Datawarehouse"."KPI_Desercion_Periodo" pd JOIN public.programas p ON p.snies=pd.programa';
    // if(typeof(req.session.rol) != "undefined"){
    //   if(req.session.rol!=1)
    //     sql=sql+' WHERE p.departamento='+"'"+req.session.codigo+"'"+' OR pd.programa = '+"'000000'"+' GROUP BY pd.programa, p.nombre  ORDER BY p.nombre';
    // }
    sql=sql+' GROUP BY pd.programa, p.nombre  ORDER BY p.nombre';
  }else if (req.query.c ==2){
    var prog=[req.query.program];
    var sql = 'SELECT chd.periodo FROM	"Datawarehouse"."KPI_Desercion_Periodo" chd WHERE chd."programa" LIKE $1 GROUP BY chd.periodo ORDER BY chd.periodo';
  }else return console.log("error");
  //aqui se crea la conexion a DB
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    //Aqui es donde se realiza el query de la DB
    //resive el sql, el arreglo siguiente contiene los parametros que van en el sql  preparado
    //la funcion anonima recive la variable de err que controla el error  y la result
    //que es la que controla el resultado de la consulta el cual es un JSON
    client.query(sql,prog, function(err, result) {
      done();
      if(err) {
        return console.error('error running query', err);
      }
      res.json(result);
    });
  });
  //se ejecuta si el usuario o password no son correctas y no se puede conectar al SGBD
  pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
  });

});

module.exports = router;
