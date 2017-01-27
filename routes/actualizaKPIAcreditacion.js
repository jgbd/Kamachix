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
    var beforedata=[req.query.anho.substr(6, 9)];
    console.log(beforedata);
    if(req.query.c == 1)
        var sql ='INSERT INTO "Datawarehouse"."KPI_Accreditation" VALUES '+
            '($1,(select count(*) from acreditacion_alta_calidad WHERE activo=true),(select count(*) from programas),ROUND((select count(*) from acreditacion_alta_calidad where activo=true)*100/(select count(*) from programas),0))';
    else if (req.query.c == 2)
        var sql ='UPDATE "Datawarehouse"."KPI_Accreditation" SET '+
            'acreditados=(select count(*) from "public"."acreditacion_alta_calidad" WHERE activo=true),programas=(select count(*) from "public"."programas"),razon=(ROUND((select count(*) from acreditacion_alta_calidad where activo=true)*100/(select count(*) from programas),0))'+
            'WHERE "Anho"=$1';
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
