var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //valida si está creada la variable de sesion caso contrario envía mensaje de error
  if(req.session.name!=null) {
    if(req.session.rol!=1){
      res.render('estudiantesDocente',{title:'Estudiantes Docente', rols:'display:none'});
    }else{
      res.render('estudiantesDocente',{title:'Estudiantes Docente', rols:'display:block'});
    }
  }
  else {
    res.send('Inicie Sesion Adecuadamente');
    res.end();
  }
});

module.exports = router;
