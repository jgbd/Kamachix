var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //valida si está creada la variable de sesion caso contrario envía mensaje de error
  if(req.session.name!=null) {
    if(req.session.rol!=1){
      res.render('planesmejoramiento',{title:'planesmejoramiento', rols:'display:none', arch: 'display:none', refe: 'logout', textmsg: 'Salir', user:req.session.name, check:'display:none'});
    }else{
      res.render('planesmejoramiento',{title:'planesmejoramiento', rols:'visibility: visible' , arch: 'display:none', refe: 'logout', textmsg: 'Salir', user:req.session.name});
    }
  }
  else {
    res.redirect('/');
  }
});

module.exports = router;
