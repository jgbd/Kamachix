var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //valida si existe variable de session
  if(req.session.name!=null) {
    if(req.session.rol!=1){
      res.render('indicadores',{title:'Indicadores', rols:'display:none'});
    }else{
      res.render('indicadores',{title:'Indicadores', rols:'display:block'});
    }

  }
  else {
    res.send("No inicio Sesión Apropiadamente");
    res.end();
  }
});

module.exports = router;
