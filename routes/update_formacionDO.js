var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  //valida si esta creada la variable de sesion caso contrario envia mensaje de error
  if(req.session.name!=null) res.render('update_formacionDO');
  else res.send('No inicio sesion Apropiadamente');
});


module.exports = router;
