var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  //valida si esta creada la variable de sesion caso contrario envia mensaje de error

  if(req.session.name!=null) {
    if(req.session.rol!=1){
      res.render('formacion_departamento',{title:'formacion_departamento', rols:'display:none', arch: 'display:none', refe: 'logout', textmsg: 'Salir', user:req.session.name});
    }else{
      res.render('formacion_departamento',{title:'formacion_departamento', rols:'visibility: visible', rep:'display:none', arch: 'display:block', refe: 'logout', textmsg: 'Salir', user:req.session.name});
    }
  }
  else {
    res.render('formacion_departamento',{title:'formacion_departamento', rols:'display:none', arch: 'display:none', refe: 'javascript:openmodallogin();', textmsg: 'Ingresar', plan:'display:none'});
  }
});


module.exports = router;
