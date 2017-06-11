var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //Destruye las variables de session creadas y render index
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
