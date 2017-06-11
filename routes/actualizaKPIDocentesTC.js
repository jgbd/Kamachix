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
    //consulta basica sin condiciones
    if(req.query.c == 1){
        var beforedata=[req.query.anho,req.query.estudiantesa,req.query.docentesa,Math.round(req.query.estudiantesa/req.query.docentesa)];
        var sql ='INSERT INTO "Datawarehouse"."KPI_Estudiantes_por_Docentes_TC" ("Anho",estudiantes,docentes,razonanual,razona) VALUES '+
            '($1,$2,$3,$4,$4)';
    }
    else if (req.query.c == 2){
        var beforedata=[req.query.anho,req.query.estudiantesprom,req.query.docentesprom,Math.round(req.query.estudiantesb/req.query.docentesb)];
        console.log(beforedata);
        var sql ='UPDATE "Datawarehouse"."KPI_Estudiantes_por_Docentes_TC" SET '+
            'estudiantes=$2,docentes=$3,razonb=ROUND($4,0),razonanual=ROUND((razona+$4)/2,0) '+
            'WHERE "Anho"=$1';
    }
    else return console.log("error");
    pool.connect(function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        client.query(sql,beforedata,function(err, result) {
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
