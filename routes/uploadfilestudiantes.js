var express = require('express');
var router = express.Router();
var fileupload = require("../config/fileupload.js");
var configdb = require("../config/dbConfig.js");
var fs = require('fs');

//variable del pool de conexiones a postgresql
var pool = configdb.configdb();

router.get('/', function(req, res, next) {
});

router.post('/',function(req, res, next){
  var upload=fileupload.fileupload(req.files);  
  if(upload==='-1'){
    var filename = req.files.file.name.replace(/\s/g, "");
    console.log(filename);

    fs.readFile('files/'+filename, function(error,datos){
      if (error) {
          console.log(error);
      }
      else {
        var regex = new RegExp(",", "g");
        var regex2 = new RegExp(";", "g");
        var arrdata = datos.toString().replace(regex,".").replace(regex2,",").replace(/\r/g,"").split('\n');
        arrdata.splice(0,1);
        arrdata.splice(arrdata.length-1,2);
        console.log(arrdata);
        var sql = 'INSERT INTO estudiantes_departamento (departamento, matriculados, anho, periodo) VALUES ';
        for (var i = 0; i < arrdata.length; i++) {
          var cam = arrdata[i].split(',');
          console.log(arrdata[i].length);
          if(i===arrdata.length-1){
            sql=sql+"('"+cam[0]+"','"+cam[2]+"','"+cam[1]+"','"+cam[3]+"')";
          }
          else{
            sql=sql+"('"+cam[0]+"','"+cam[2]+"','"+cam[1]+"','"+cam[3]+"'),";
          }
        }
        console.log(sql);
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
            var count;
            if(err) {
              count=0;
              //return console.error('error running query', err);
            }else {
              count = result.rowCount;
            }
            var re = {
              "upload" : upload,
              "count" : count
            };
            res.json(re);
          });
        });
        //se ejecuta si el usuario o password no son correctas y no se puede conectar al SGBD
        pool.on('error', function (err, client) {
          console.error('idle client error', err.message, err.stack)
        });
      }
    });
  }
});
module.exports = router;
