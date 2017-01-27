var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //valida si esta creada la variable de sesion caso contrario envia mensaje de error
  if(req.session.name!=null) res.render('relacion_docentes');
  else res.send('No inicio sesion Apropiadamente');
});


module.exports = router;
