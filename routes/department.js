var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('department', {
    // title: req.session.title,
    // username: req.session.username,
    // fullname: req.session.fullname,
    // role: req.session.role,
    // position: req.session.position
  });
});

module.exports = router;