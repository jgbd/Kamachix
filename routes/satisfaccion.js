var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //valida si esta creada la variable de sesion caso contrario envia mensaje de error
  if(req.session.name!=null){
    if(req.session.rol!=1){
      res.render('satisfaccion',{title:'Satisfacción', rols:'display:none'});
    }else{
      res.render('satisfaccion',{title:'Satisfacción', rols:'display:block', arch: 'display:block'});
    }
  }
  else {
    res.render('satisfaccion',{title:'satisfaccion', rols:'display:none', arch: 'display:none'});
  }
});

module.exports = router;
