var express = require('express');
var router = express.Router();
var configdb = require("../config/dbConfig.js");
var AES = require("crypto-js/aes");
var SHA256 = require("crypto-js/sha256");

//variable que controla el pool de conexiones
var pool = configdb.configdb();

router.get('/', function(req, res, next) {
  res._no_cache = true;
  //para verificar la fecha del vinculo y dejar que solo sea usable el dia que lo genero
  var date = new Date();
  var day = ""+date.getDate()+date.getMonth()+date.getFullYear();
  var fec = SHA256(day).toString();
  var ban = true;
  var ar = [req.query.clave];

  if(fec==req.query.fe){
    var sql = 'SELECT u.codigo FROM public.users u WHERE u.encriptado LIKE $1';
  }else {
    var enc = ""+date.getDate()+date.getMonth()+date.getFullYear()+
              date.getHours()+date.getMinutes()+date.getSeconds()+Math.random();
    ar.push(enc);
    var sql = 'UPDATE public.users SET encriptado = md5($2) WHERE encriptado = $1';
    ban = false;
  }

  //aqui se crea la conexion a DB
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    //Aqui es donde serealiza el query de la DB
    //resive el sql, el arreglo siguiente contine los parametros que van en el sql  preparado
    //la funcion anonima recive la variable de err que controla el error  y la result
    //que es la que controla el resultado de la consulta el cual es un JSON
    client.query(sql,ar, function(err, result) {
      //console.log(sql);
      done();
      if(err) {
        return console.error('error running query', err);
      }
      //se conprueba si existe resultado
      //si es mayor a 0 se crea la variable de session con el resultado
      //y se devuelve el numero de resultados que en este caso siempre debe ser 1 si esta correcto
      //y es falso se devuelve el cero que sera para jusgar que realizar del lado Frond
      if(result.rowCount>0 && ban){
        req.session.codigo = result.rows[0].codigo;
        res.render('recover',{title:'Recuperar Contraseña', rols:'display:none', arch: 'display:none', refe: 'javascript:openmodallogin();', textmsg: 'Ingresar'});
      }else{
        res.send('<center style= "color:red"><h1>Este Enlace ya no es valido.</h1><br>'+
                  '<h2>Vuelva a intentar recuperar la Contraseña</h2></center>');
      }
    });
  });
  //se ejecuta si el usuario o password no son correctas y no se puede conectar al SGBD
  pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
  });
});

router.post('/', function(req, res, next) {
  console.log(req.body.pass);
  var date = new Date();
  var enc = ""+date.getDate()+date.getMonth()+date.getFullYear()+
            date.getHours()+date.getMinutes()+date.getSeconds()+req.session.codigo;
  var ar = [
    req.body.pass,
    enc,
    req.session.codigo
  ];

  var sql = 'UPDATE public.users SET pass = md5($1), encriptado = md5($2) WHERE codigo = $3';
  //aquui se crea la conexion a DB
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    //Aqui es donde serealiza el query de la DB
    //resive el sql, el arreglo siguiente contine los parametros que van en el sql  preparado
    //la funcion anonima recive la variable de err que controla el error  y la result
    //que es la que controla el resultado de la consulta el cual es un JSON
    client.query(sql,ar, function(err, result) {
      //console.log(sql);
      done();
      if(err) {
        return console.error('error running query', err);
      }
      //se conprueba si existe resultado
      //si es mayor a 0 se crea la variable de session con el resultado
      //y se devuelve el numero de resultados que en este caso siempre debe ser 1 si esta correcto
      //y es falso se devuelve el cero que sera para jusgar que realizar del lado Frond
      if(result.rowCount>0){
        res.json('1')
        req.session.destroy();
      }else{
        res.json('0');
      }
    });
  });
  //se ejecuta si el usuario o password no son correctas y no se puede conectar al SGBD
  pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
  });
});

module.exports = router;
