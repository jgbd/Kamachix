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
    //arreglo que contine filtros
    var filters = [];
    //consulta basica sin condiciones
    var sql ='SELECT al."Anho", al."acreditados", al."programas", al."razon", "sim_Rango_MA","num_Rango_MA","sim_Rango_A","num_Rango_A","sim_Rango_I","num_Rango_I" FROM "Datawarehouse"."KPI_Acreditacion" al join manuales_indicadores on "manual_Acredita"=codigo WHERE ';
    //concatena al sql los valores d elos filtros
    if(req.body.yearfrom!=0){
      filters.push(req.body.yearfrom);
      sql=sql+'al."Anho" BETWEEN $1';
      if(req.body.yearto!=0){
        filters.push(req.body.yearto);
        sql=sql+' AND $2';
      }
      else {
        sql=sql+' AND $1';
      }
    }
    else{
      filters.push(req.body.yearto);
      sql=sql+'al."Anho" BETWEEN $1';
      if(req.body.yearfrom!=0){
        filters.push(req.body.yearfrom);
        sql=sql+' AND $2';
      }
      else {
        sql=sql+' AND $1';
      }
    }

    //al final se concatena al sql un ORDER BY por programa y año
    sql = sql+' ORDER BY al."Anho"';

    pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(sql,filters,function(err, result) {
        done();
        if(err) {
          return console.error('error running query', err);
        }

        //objeto que va acontener la estructura del json a retornar
        var re={
          "datos":[],
          "fieldstwo":[result.fields[0].name,result.fields[1].name,result.fields[2].name],
          "count":result.rowCount
        };

        //estos seran los datos de cada objeto o programa devuelto
        var datarray=[];
        for (var i = 0; i < result.rowCount; i++) {
            var d ={
              "razon": result.rows[i].razon,
              "Anho": result.rows[i].Anho,
              "acreditados": result.rows[i].acreditados,
              "programas": result.rows[i].programas
            };
            datarray.push(d);
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

module.exports = router;
