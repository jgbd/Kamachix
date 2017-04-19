var express = require('express');
var router = express.Router();
var configdb = require("../config/dbConfig.js");
//variable que controla el pool de conexiones
var pool = configdb.configdb();

router.get('/',function(req, res, next){

  var arre = [req.query.c];

  var sql='SELECT ma.proceso, ma.lider, ma."objProceso",ma."nombreIndicador",'+
  'ma."atriMedir",ma."objCalidad", ma."tipoIndicador",ma.frecuencia,'+
  ' ma."periodoCalculo", ma.tendencia,ma.meta, ma."objIndicador", ma."sim_Rango_MA",'+
  ' ma.formula,ma."maneraGrafica", ma."puntoRegistro",ma.resposable,'+
  ' ma.instructivo,ma."num_Rango_MA",ma."sim_Rango_A",'+
  ' ma."num_Rango_A",ma."sim_Rango_I",ma."num_Rango_I" '+
  'FROM public.manuales_indicadores ma WHERE ma.codigo = $1';

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
        result.rows[0].formular,
        result.rows[0].maneraGrafica,
        result.rows[0].puntoRegistro,
        result.rows[0].resposable,
        result.rows[0].instructivo,
        result.rows[0].sim_Rango_MA,       
        result.rows[0].num_Rango_MA,
        result.rows[0].sim_Rango_A,
        result.rows[0].num_Rango_A,
        result.rows[0].sim_Rango_I,
        result.rows[0].num_Rango_I
      ];

      res.json(arres);

    });
  });

  pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
  });
});


router.post('/',function(req, res, next){

  var ar = [
    req.body.atr1,
    req.body.atr2,
    req.body.atr3,
    req.body.atr4,
    req.body.atr5,
    req.body.atr6,
    req.body.atr7,
    req.body.atr8,
    req.body.atr9,
    req.body.atr10,
    req.body.atr11,
    req.body.atr12,
    req.body.atr13,
    req.body.atr14,
    req.body.atr15,
    req.body.atr16,
    req.body.atr17,
    req.body.atr18,
    req.body.atr19,
    req.body.atr20,
    req.body.atr21,
    req.body.atr22,
    req.body.atr23,
    req.body.indser
  ];

  var sql="UPDATE public.manuales_indicadores "+
          "SET proceso =$1, lider =$2, "
          +'"objProceso" =$3, "nombreIndicador" =$4, '+
          '"atriMedir" =$5, "objCalidad" =$6, '+
          '"tipoIndicador" =$7, '+'frecuencia =$8,'+
          '"periodoCalculo" =$9, '+'"tendencia" =$10,'+
          'meta =$11,'+'"objIndicador" =$12, '+
          'formula =$13, '+'"maneraGrafica" =$14, '+
          '"puntoRegistro" =$15, '+'resposable =$16, instructivo =$17,"sim_Rango_MA" =$18,"num_Rango_MA"=$19,"sim_Rango_A" =$20,"num_Rango_A"=$21,"sim_Rango_I" =$22,"num_Rango_I"=$23 '+
          'WHERE codigo =$24';

  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    //Aqui es donde serealiza el query de la DB
    //resive el sql, el arreglo siguiente contine los parametros que van en el sql  preparado
    //la funcion anonima recive la variable de err que controla el error  y la result
    //que es la que controla el resultado de la consulta el cual es un JSON
    client.query(sql,ar,function(err, result) {
      //console.log(sql);
      done();
      if(err) {
        return console.error('error running query', err);
      }
      //se conprueba si existe resultado
      //si es mayor a 0 se crea la variable de session con el resultado
      //y se devuelve el numero de resultados que en este caso siempre debe ser 1 si esta correcto
      //y es falso se devuelve el cero que sera para jusgar que realizar del lado Frond
      res.json(result.rowCount);

    });
  });

  pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
  });
});


module.exports = router;
