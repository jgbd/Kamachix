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

  var sql ='SELECT pd."programa", pd."periodo", pd."graduados", pd."desertores", pd."desercion", pd."retencion" FROM "Datawarehouse"."KPI_Period_Dropout" pd WHERE pd."programa" LIKE '+"'udenar'"+'ORDER BY pd."periodo" DESC LIMIT 5';
  //aqui se crea la conexion a DB
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    //Aqui es donde se realiza el query de la DB
    //resive el sql, el arreglo siguiente contiene los parametros que van en el sql  preparado
    //la funcion anonima recive la variable de err que controla el error  y la result
    //que es la que controla el resultado de la consulta el cual es un JSON
    client.query(sql, function(err, result) {
      done();
      if(err) {
        return console.error('error running query', err);
      }
      var re={
        "programa": result.rows[0].programa,
        "datos":[],
        "fields":[result.fields[1].name,result.fields[4].name,result.fields[5].name],
        "count":result.rowCount
      };

      //estos seran los datos de cada objeto o programa devuelto
      var datarray=[];
      for (var i = 0; i < result.rowCount; i++) {
        if(re.programa==result.rows[i].programa){
          var d ={
            "periodo":result.rows[i].periodo,
            "graduados": result.rows[i].graduados,
            "desertores": result.rows[i].desertores,
            "desercion": result.rows[i].desercion,
            "retencion": result.rows[i].retencion
          };
          datarray.push(d);
        }
      }
      re.datos = datarray;
      res.json(re);
    });
  });
  //se ejecuta si el usuario o password no son correctas y no se puede conectar al SGBD
  pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
  });

});

router.post('/',function(req, res, next){
  var filters = [req.body.program];
  var periodfrom = req.body.periodfrom;
  var periodto = req.body.periodto;

  var sql ='SELECT pd."programa", pd."periodo", pd."graduados", pd."desertores", pd."desercion", pd."retencion" FROM "Datawarehouse"."KPI_Period_Dropout" pd WHERE ';

  sql = sql+'pd.programa LIKE $1'
  if(periodfrom!=0){
    filters.push(periodfrom);
    sql = sql +'AND pd."periodo" BETWEEN $2'; //se utiliza la funcion BETWEEN ya que se necesita                                    //crear rangos en la consulta
    if(periodto!=0){
      filters.push(periodto);
      sql = sql +' AND $3';
    }else{
      sql = sql +' AND $2';
    }
  }

  sql=sql+'ORDER BY pd."periodo" DESC';

  //aqui se crea la conexion a DB
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    //Aqui es donde se realiza el query de la DB
    //resive el sql, el arreglo siguiente contiene los parametros que van en el sql  preparado
    //la funcion anonima recive la variable de err que controla el error  y la result
    //que es la que controla el resultado de la consulta el cual es un JSON
    client.query(sql,filters, function(err, result) {
      done();
      if(err) {
        return console.error('error running query', err);
      }
      if(result.rowCount>0){
        var re={
          "programa": result.rows[0].programa,
          "datos":[],
          "fields":[result.fields[1].name,result.fields[4].name,result.fields[5].name],
          "count":result.rowCount
        };

        //estos seran los datos de cada objeto o programa devuelto
        var datarray=[];
        for (var i = 0; i < result.rowCount; i++) {
          if(re.programa==result.rows[i].programa){
            var d ={
              "periodo":result.rows[i].periodo,
              "graduados": result.rows[i].graduados,
              "desertores": result.rows[i].desertores,
              "desercion": result.rows[i].desercion,
              "retencion": result.rows[i].retencion
            };
            datarray.push(d);
          }
        }
        re.datos = datarray;
        console.log(re);
        res.json(re);
      }else{
        var re = {"Error":true}
        res.json(re);
      }
    });
  });
  //se ejecuta si el usuario o password no son correctas y no se puede conectar al SGBD
  pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
  });
});

module.exports = router;
