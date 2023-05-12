var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', isAuthAdmin, function (req, res, next) {
  res.render('index', {
    fullname: req.session.fullname,
    roletype: req.session.roletype,
  });
});

function isAuthAdmin(req, res, next) {

  if (req.session.roletype == "Admin" || req.session.roletype == "User") {
      next();
  }
  else {
      res.redirect('/login');
  }
};

module.exports = router;