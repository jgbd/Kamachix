var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  //valida si esta creada la variable de sesion caso contrario envia mensaje de error

  if(req.session.name!=null) {
    if(req.session.rol!=1){
      res.render('formacion',{title:'formacion', rols:'display:none', arch: 'display:none', refe: 'logout', textmsg: 'Salir', user:req.session.name});
    }else{
      res.render('formacion',{title:'formacion', rols:'visibility: visible', arch: 'visibility: visible', refe: 'logout', textmsg: 'Salir', user:req.session.name});
    }
  }
  else {
    res.render('formacion',{title:'formacion', rols:'display:none', arch: 'display:none', refe: 'javascript:openmodallogin();', textmsg: 'Ingresar', plan:'display:none'});
  }
});


module.exports = router;
