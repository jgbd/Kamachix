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
  var sql ='SELECT p.abreviatura, sl."Nivel", sl. "Anho","sim_Rango_MA","num_Rango_MA","sim_Rango_A","num_Rango_A","sim_Rango_I","num_Rango_I" FROM "Datawarehouse"."KPI_Nivel_Satisfaccion" sl JOIN public.programas p ON p.snies=sl."Programa" join manuales_indicadores on manual=manuales_indicadores.codigo WHERE sl."Programa" = '+"'1296'"+' ORDER BY p."abreviatura", sl."Anho"';
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
      var re ={
        "Programa":result.rows[0].abreviatura,
        "datos":[],
        "fields":[result.fields[2].name,result.fields[1].name],
        "count":result.rowCount
      }
      var datalst=[];

      for (var i = 0; i < result.rowCount; i++) {
        if(re.Programa==result.rows[i].abreviatura){
          var d = {
            "Nivel":result.rows[i].Nivel,
            "Anho":result.rows[i].Anho,
            "num_Rango_I":result.rows[i].num_Rango_I,
            "num_Rango_A":result.rows[i].num_Rango_A,
            "num_Rango_MA":result.rows[i].num_Rango_MA,
            "sim_Rango_I":result.rows[i].sim_Rango_I,
            "sim_Rango_A":result.rows[i].sim_Rango_A,
            "sim_Rango_MA":result.rows[i].sim_Rango_MA,
            "color":"#9704f2"
          };
          datalst.push(d);
        }
      }

      re.datos=datalst;
      res.json(re);
    });
  });
  //se ejecuta si el usuario o password no son correctas y no se puede conectar al SGBD
  pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
  });
});

router.post('/', function(req, res, next) {
    //arreglo que contine filtros
    var filters=[req.body.program];
    //consulta basica sin condiciones
    var sql ='SELECT p.abreviatura, sl."Nivel", sl."Anho","sim_Rango_MA","num_Rango_MA","sim_Rango_A","num_Rango_A","sim_Rango_I","num_Rango_I" FROM "Datawarehouse"."KPI_Nivel_Satisfaccion" sl JOIN public.programas p ON p.snies=sl."Programa" join manuales_indicadores on manual=manuales_indicadores.codigo WHERE ';

    //concatena al sql los valores d elos filtros
    sql=sql+'sl."Programa" = $1';
    if(req.body.yearfrom!=0){
      filters.push(req.body.yearfrom);
      sql=sql+' AND sl."Anho" BETWEEN $2';
      if(req.body.yearto!=0){
        filters.push(req.body.yearto);
        sql=sql+' AND $3';
      }
      else {
        sql=sql+' AND $2';
      }
    }

    //al final se concatena al sql un ORDER BY por programa y año
    sql = sql+' ORDER BY p.abreviatura, sl."Anho"';

    pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(sql,filters, function(err, result) {
        done

        if(err) {
          return console.error('error running query', err);
        }
        console.log(result.rows);
        //objeto que va acontener la estructura del json a retornar
        if(result.rowCount>0){
          var re={
            "Programa": result.rows[0].abreviatura,
            "datos":[],
            "fields":[result.fields[2].name,result.fields[1].name],
            "count":result.rowCount
          };

          //estos seran los datos de cada objeto o programa devuelto
          var datarray=[];
          for (var i = 0; i < result.rowCount; i++) {
            if(re.Programa==result.rows[i].abreviatura){
              var d ={
                "Nivel":result.rows[i].Nivel,
                "num_Rango_I":result.rows[i].num_Rango_I,
                "num_Rango_A":result.rows[i].num_Rango_A,
                "num_Rango_MA":result.rows[i].num_Rango_MA,
                "sim_Rango_I":result.rows[i].sim_Rango_I,
                "sim_Rango_A":result.rows[i].sim_Rango_A,
                "sim_Rango_MA":result.rows[i].sim_Rango_MA,
                "Anho": result.rows[i].Anho
              };
              datarray.push(d);
            }
          }
          re.datos = datarray;
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
