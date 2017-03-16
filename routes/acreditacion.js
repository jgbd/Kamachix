var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //valida si está creada la variable de sesion caso contrario envía mensaje de error
  if(req.session.name!=null) {
    if(req.session.rol!=1){
      res.render('acreditacion',{title:'acreditacion', rols:'display:none', arch: 'display:none', refe: 'logout', textmsg: 'Salir'});
    }else{
      res.render('acreditacion',{title:'acreditacion', rols:'visibility: visible' , arch: 'display:block', refe: 'logout', textmsg: 'Salir'});
    }
  }
  else {
    res.render('acreditacion',{title:'acreditacion', rols:'display:none', arch: 'display:none', refe: 'javascript:openmodallogin();', textmsg: 'Ingresar'});
  }
});

module.exports = router;
