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
    var sql ='SELECT al."Anho", al."acreditados", al."programas", al."razon","sim_Rango_MA","num_Rango_MA","sim_Rango_A","num_Rango_A","sim_Rango_I","num_Rango_I" FROM "Datawarehouse"."KPI_Acreditacion" al join manuales_indicadores on "manual_Acredita"=codigo ORDER BY al."Anho"';
  else if (req.query.c == 2){
    var beforedata=[req.query.flag];
    var sql = 'SELECT DISTINCT p.abreviatura,aac.inicioacreditacion,aac.periodo,(aac.inicioacreditacion+aac.periodo*365) as finacreditacion, aac.programa,p.departamento,aac.gravedad,aac.mail FROM programas p JOIN acreditacion_alta_calidad aac ON codigo=programa WHERE aac.activo=true AND p.nivel=$1 AND p.estado=true ORDER BY finacreditacion DESC';
  }
  else if (req.query.c == 3){
    var beforedata=[req.query.flag];
    var sql = 'SELECT DISTINCT p.codigo,p.abreviatura FROM programas p WHERE p.nivel=$1 AND p.estado=true EXCEPT SELECT DISTINCT aac.programa,p.abreviatura FROM programas p JOIN acreditacion_alta_calidad aac ON codigo=programa WHERE activo=true ORDER BY abreviatura DESC';
  }
  else if (req.query.c == 4){
    var beforedata=[req.query.anho.substr(6, 9)];
    var sql='SELECT * FROM "Datawarehouse"."KPI_Acreditacion" WHERE "Anho"=$1';
  }
  else return console.log("error");
  //aqui se crea la conexion a DB
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    //Aqui es donde se realiza el query de la DB
    //recibe el sql, el arreglo siguiente contiene los parametros que van en el sql  preparado
    //la funcion anonima recive la variable de err que controla el error  y la result
    //que es la que controla el resultado de la consulta el cual es un JSON
    client.query(sql, beforedata,function(err, result) {
      done();
      if(err) {
        return console.error('error running query', err);
      }
      //console.log(result);
      res.json(result);
    });
  });
  //se ejecuta si el usuario o password no son correctas y no se puede conectar al SGBD
  pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
  });

});

module.exports = router;
