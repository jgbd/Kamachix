var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //valida si esta creada la variable de sesion caso contrario envia mensaje de error
  if(req.session.name!=null) {
    if(req.session.rol!=1){
      res.render('cohorte',{title:'Cohorte', rols:'display:none', refe: 'logout', textmsg: 'Salir', user:req.session.name});
    }else{
      res.render('cohorte',{title:'Cohorte', rols:'visibility: visible', arch: 'display:block', refe: 'logout', textmsg: 'Salir', user:req.session.name});
    }
  }
  else {
    res.render('cohorte',{title:'cohorte', rols:'display:none', arch: 'display:none', refe: 'javascript:openmodallogin();', textmsg: 'Ingresar'});
  }
});

module.exports = router;
