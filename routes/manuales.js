var express = require('express');
var router = express.Router();
var configdb = require("../config/dbConfig.js");
//variable que controla el pool de conexiones
var pool = configdb.configdb();

router.get('/',function(req, res, next){

  var arre = [req.query.c];

  var sql='SELECT ma.proceso, ma.lider, ma."objProceso", '+
          'ma."nombreIndicador", ma."atriMedir",'+
          ' ma."objCalidad", ma."tipoIndicador",'+
          ' ma.frecuencia, ma."periodoCalculo", ma.tendencia,'+
          ' ma.meta, ma."objIndicador", ma.rango, ma.formular,'+
          ' ma."maneraGrafica", ma."puntoRegistro",'+
          ' ma.resposable, ma.instructivo'+
          ' FROM public.manuales_indicadores ma'+
          ' WHERE ma.codigo = $1';

  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    //Aqui es donde serealiza el query de la DB
    //resive el sql, el arreglo siguiente contine los parametros que van en el sql  preparado
    //la funcion anonima recive la variable de err que controla el error  y la result
    //que es la que controla el resultado de la consulta el cual es un JSON
    client.query(sql,arre,function(err, result) {
      //console.log(sql);
      done();
      if(err) {
        return console.error('error running query', err);
      }
      //se conprueba si existe resultado
      //si es mayor a 0 se crea la variable de session con el resultado
      //y se devuelve el numero de resultados que en este caso siempre debe ser 1 si esta correcto
      //y es falso se devuelve el cero que sera para jusgar que realizar del lado Frond
      console.log(result.rows);

      var arres = [
        result.rows[0].proceso,
        result.rows[0].lider,
        result.rows[0].objProceso,
        result.rows[0].nombreIndicador,
        result.rows[0].atriMedir,
        result.rows[0].objCalidad,
        result.rows[0].tipoIndicador,
        result.rows[0].frecuencia,
        result.rows[0].periodoCalculo,
        result.rows[0].tendencia,
        result.rows[0].meta,
        result.rows[0].objIndicador,
        result.rows[0].rango,
        result.rows[0].formular,
        result.rows[0].maneraGrafica,
        result.rows[0].puntoRegistro,
        result.rows[0].resposable,
        result.rows[0].instructivo
      ];

      res.json(arres);

    });
  });

  pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
  });
});

module.exports = router;
