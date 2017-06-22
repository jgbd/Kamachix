var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //valida si existe variable de session
  if(req.session.name!=null) {
    if(req.session.rol!=1){
      res.render('tutorial',{title:'Guias de uso', rols:'display:none', arch: 'display:none', refe: 'logout', textmsg: 'Salir', user:req.session.name });
    }else{
      res.render('tutorial',{title:'Guias de uso', rols:'visibility: visible', rep:'display:none', arch: 'display:block', refe: 'logout', textmsg: 'Salir', user:req.session.name});
    }

  }
  else {
    res.render('tutorial',{title:'Guias de uso', rols:'display:none', arch: 'display:none', refe: 'javascript:openmodallogin();', textmsg: 'Ingresar', plan:'display:none'});
  }
});

module.exports = router;
