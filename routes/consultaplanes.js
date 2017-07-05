var express = require('express');
var router = express.Router();
var configdb = require("../config/dbConfig.js");

//variable que controla el pool de conexiones
var pool = configdb.configdb();


router.get('/', function(req, res, next){
  if(req.session.name != null){
    var sql = 'SELECT ac.programa, pr.nombre, ac.periodo FROM public.acreditacion_alta_calidad ac'+
              ' JOIN public.programas pr ON pr.snies=ac.programa WHERE ac.activo=TRUE';
    if(req.session.rol != 1){
      sql = sql+' AND pr.departamento = '+"'"+req.session.codigo+"'";
    }
    sql = sql+' ORDER BY pr.nombre'
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
        if (result.rowCount > 0) {
          console.log("si"+result.rowCount);
          res.json(result.rows);
        }
        else {
          console.log("no"+result.rowCount);
          res.json(result.rowCount);
        }
      });
    });
    //se ejecuta si el usuario o password no son correctas y no se puede conectar al SGBD
    pool.on('error', function (err, client) {
      console.error('idle client error', err.message, err.stack)
    });
  }
});

router.post('/',function(req, res, next){
  if(req.body.periodo == 4){
    var sql = "SELECT ac.inicioacreditacion inicio, ac.inicioacreditacion +(ac.periodo|| '  years')::interval fin,"+
              "ac.inicioacreditacion +interval '2 years'  fpm1,ac.inicioacreditacion +interval '3 years'  feva1,"+
              " 'no aplica' fpm2, 'no aplica' feva2, ac.chkpm1, ac.chkaev1, ac.chkpm2, ac.chkaev2, ac.chkmen"+
              " ,ac.mailpm1, ac.mailaev1, ac.mailpm2, ac.mailaev2, ac.mailmen"+
              " FROM public.acreditacion_alta_calidad ac where ac.programa = $1 AND ac.activo=TRUE";
  }else{
    var sql = "SELECT ac.inicioacreditacion inicio, ac.inicioacreditacion +(ac.periodo|| '  years')::interval fin,"+
              " ac.inicioacreditacion +interval '1.5 years'  fpm1, ac.inicioacreditacion +interval '2 years'  feva1,"+
              " ac.inicioacreditacion +interval '4 years'  fpm2,ac.inicioacreditacion +interval '5 years'  feva2,"+
              " ac.chkpm1, ac.chkaev1, ac.chkpm2, ac.chkaev2, ac.chkmen"+
              " ,ac.mailpm1, ac.mailaev1, ac.mailpm2, ac.mailaev2, ac.mailmen"+
              " FROM public.acreditacion_alta_calidad ac where ac.programa = $1 AND ac.activo=TRUE"
  }

  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    //Aqui es donde se realiza el query de la DB
    //resive el sql, el arreglo siguiente contiene los parametros que van en el sql  preparado
    //la funcion anonima recive la variable de err que controla el error  y la result
    //que es la que controla el resultado de la consulta el cual es un JSON
    client.query(sql, [req.body.snies],function(err, result) {
      done();
      if(err) {
        return console.error('error running query', err);
      }
      console.log(result.rows);
      res.json(result.rows);
    });
  });
  //se ejecuta si el usuario o password no son correctas y no se puede conectar al SGBD
  pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
  });
});
module.exports = router;
