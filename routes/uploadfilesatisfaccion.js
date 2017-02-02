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
        var regex = new RegExp("\"", "g");
        var arrdata = datos.toString().replace(/\t/g, ",").replace(regex,"'").split('\n');
        arrdata.splice(0,1);
        console.log(arrdata);
        var sql = 'INSERT INTO "Datawarehouse"."KPI_Satisfaction_level" VALUES ';
        for (var i = 0; i < arrdata.length; i++) {
          sql=sql+"("+arrdata[i]+"),";
          console.log(arrdata[i].length);
          if(i===arrdata.length-1 || arrdata[i].length===0){
            sql=sql+"("+arrdata[i]+")";
          }
        }
        console.log(sql);
        // pool.connect(function(err, client, done) {
        //   if(err) {
        //     return console.error('error fetching client from pool', err);
        //   }
        //   //Aqui es donde se realiza el query de la DB
        //   //resive el sql, el arreglo siguiente contiene los parametros que van en el sql  preparado
        //   //la funcion anonima recive la variable de err que controla el error  y la result
        //   //que es la que controla el resultado de la consulta el cual es un JSON
        //   client.query(sql, function(err, result) {
        //     done();
        //     if(err) {
        //       return console.error('error running query', err);
        //     }
        //     console.log(result);
        //     //res.json(result);
        //   });
        // });
        // //se ejecuta si el usuario o password no son correctas y no se puede conectar al SGBD
        // pool.on('error', function (err, client) {
        //   console.error('idle client error', err.message, err.stack)
        // });
      }
    });

    // pool.connect(function(err, client, done) {
    //   if(err) {
    //     return console.error('error fetching client from pool', err);
    //   }
    //   var stream = client.query(copyFrom('COPY "Datawarehouse"."KPI_Satisfaction_level" FROM STDIN'));
    //   console.log(stream);
    //   var fileStream = fs.createReadStream('../files/'+filename);
    //   fileStream.on('error', done);
    //   stream.on('error', done);
    //   stream.on('end', done);
    //   fileStream.pipe(stream);
    //
    //
    // });
  //   var sql= 'COPY "Datawarehouse"."KPI_Satisfaction_level" ("Programa", "Nivel", "Anho") FROM'+
  //   console.log('Listo para copy a db');

  }
  res.send(upload);
});
module.exports = router;
