var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //valida si esta creada la variable de sesion caso contrario envia mensaje de error
  if(req.session.name!=null){
    if(req.session.rol!=1){
      res.render('relacion_docentes',{title:'Relacion Docentes', rols:'display:none', arch: 'display:none'});
    }else{
      res.render('relacion_docentes',{title:'Relacion Docentes', rols:'display:block', arch: 'display:block'});
    }
  }
  else {
    res.render('relacion_docentes',{title:'relacion_docentes', rols:'display:none', arch: 'display:none'});
  }
});


module.exports = router;
