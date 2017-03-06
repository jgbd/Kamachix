var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  //valida si esta creada la variable de sesion caso contrario envia mensaje de error

  if(req.session.name!=null) {
    if(req.session.rol!=1){
      res.render('formacion_departamento',{title:'formacion_departamento', rols:'display:none', arch: 'display:none'});
    }else{
      res.render('formacion_departamento',{title:'formacion_departamento', rols:'display:block', arch: 'display:block'});
    }
  }
  else {
    res.render('formacion_departamento',{title:'formacion_departamento', rols:'display:none', arch: 'display:none'});
  }
});


module.exports = router;
