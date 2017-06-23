var express = require('express');
var router = express.Router();
var configdb = require("../config/dbConfig.js");
var configmail = require("../config/emailconfig.js");

//variable que controla el pool de conexiones
var pool = configdb.configdb();

router.get('/', function(req, res, next) {
  var sql = 'SELECT pr.nombre,'+
            'ac.resolucion,'+
            'ac.inicioacreditacion "Inicio",'+
            "ac.inicioacreditacion + (ac.periodo || ' years')::interval"+' "Fin",'+
            'ac.activo'+' FROM public.acreditacion_alta_calidad ac'+
            ' JOIN public.programas pr ON pr.snies = ac.programa ORDER BY pr.nombre'

  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
  //Aqui es donde se realiza el query de la DB
  //recibe el sql, el arreglo siguiente contiene los parametros que van en el sql  preparado
  //la funcion anonima recive la variable de err que controla el error  y la result
  //que es la que controla el resultado de la consulta el cual es un JSON
    client.query(sql,function(err, result) {
      done();
      if(err) {
        return console.error('error running query', err);
      }
      var data = [];
      for (var i = 0; i < result.rowCount; i++) {
        var diai = result.rows[i].Inicio.getDate();
        var diaf = result.rows[i].Fin.getDate();
        var mesi = result.rows[i].Inicio.getMonth()+1;
        var mesf = result.rows[i].Fin.getMonth()+1;
        if (diai<10) diai='0'+mesi;
        if (diaf<10) diaf='0'+mesf;
        if (mesi<10) mesi='0'+mesi;
        if (mesf<10) mesf='0'+mesf;
        var prog = {
          'resolucion':result.rows[i].resolucion,
          'nombre': result.rows[i].nombre,
          'inicio': diai+'/'+mesi+'/'
                    +result.rows[i].Inicio.getFullYear(),
          'finalizacion': diaf+'/'+mesf+'/'
                    +result.rows[i].Fin.getFullYear(),
          'activo': result.rows[i].activo
        }
        data.push(prog);
      }
      var hist = {
        "data":data
      }
      res.json(hist);
      console.log(data);
    });
  });
  //se ejecuta si el usuario o password no son correctas y no se puede conectar al SGBD
  pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
  });
});

module.exports = router
