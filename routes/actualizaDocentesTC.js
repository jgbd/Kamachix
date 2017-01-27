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
    var beforedata=[req.body.anho,req.body.estudiantes]
    var beforedata2=[req.body.anho,req.body.docentes,1]
    if(req.body.semestre=="B"){
        var sql ='UPDATE poblacion_estudiantes SET "semestreB"=$2, promedio=ROUND(("semestreA"+$2)/2,0) WHERE anho=$1';
        var sql2 ='UPDATE poblacion_docentes SET "semestreB"=$2, promedio=ROUND(("semestreA"+$2)/2,0) WHERE anho=$1 AND tipo=$3';
    }
    else{
        console.log(beforedata);
        console.log(beforedata2);
        var sql ='INSERT INTO poblacion_estudiantes (anho,"semestreA",promedio) VALUES ($1,'+req.body.estudiantes+',$2)';
        var sql2 ='INSERT INTO poblacion_docentes (anho,tipo,"semestreA",promedio) VALUES ($1,$3,'+req.body.docentes+',$2)';
    }
  //consulta basica sin condiciones
  
    pool.connect(function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        client.query(sql,beforedata,function(err, result) {
            done();
            if(err) {
                return console.error('error running query', err);
            }
        });
        client.query(sql2,beforedata2,function(err, result) {
            done();
            if(err) {
                return console.error('error running query', err);
            }
        });
    });
    //se ejecuta si el usuario o password no son correctas y no se puede conectar al SGBD
    pool.on('error', function (err, client) {
        console.error('idle client error', err.message, err.stack)
    });
});

module.exports = router;
