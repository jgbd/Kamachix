var express = require('express');
var router = express.Router();
var fileupload = require("../config/fileupload.js");
var configdb = require("../config/dbConfig.js");

var pool = configdb.configdb();

router.get('/', function(req, res, next) {
});

router.post('/',function(req, res, next){
  //console.log(req.files.file.name);
  var upload=fileupload.fileupload(req.files);
  // if(upload==='-1'){
  //   var sql= 'COPY public.encuestas_nivel_satisfaccion("N", "Id", "Completado", "Pagina", "Lenguaje", "Contrasenia", "Municipio", "Facultad", "Programa", "Semestre", "Genero", "Uno", "Dos", "Tres", "Cuatro", "Cinco", "Seis", "Siete", "Ocho", "Nueve", "Diez", "Once", "Doce", "Trece", "Catorce", "Quince", "Dieciseis", "Diecisiete", "Dieciocho") FROM'+
  //   "'/home/juan/Trabajo\ de\ Grado\ /Prototipo1/files/"+req.files.file.name+"'"+' DELIMITER '+"'|'"+' CSV HEADER;'
  //   console.log('Listo para copy a db');
  //   pool.connect(function(err, client, done) {
  //     if(err) {
  //       return console.error('error fetching client from pool', err);
  //     }
  //     //Aqui es donde se realiza el query de la DB
  //     //resive el sql, el arreglo siguiente contiene los parametros que van en el sql  preparado
  //     //la funcion anonima recive la variable de err que controla el error  y la result
  //     //que es la que controla el resultado de la consulta el cual es un JSON
  //     client.query(sql, function(err, result) {
  //       done();
  //       if(err) {
  //         return console.error('error running query', err);
  //       }
  //       console.log(result);
  //       //res.json(result);
  //     });
  //   });
  //   //se ejecuta si el usuario o password no son correctas y no se puede conectar al SGBD
  //   pool.on('error', function (err, client) {
  //     console.error('idle client error', err.message, err.stack)
  //   });
  // }
  res.send(upload);
});
module.exports = router;
