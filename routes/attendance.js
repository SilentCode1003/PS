var express = require('express');
var router = express.Router();

const mysql = require('./repository/payrolldb');
const helper = require('./repository/customhelper');
const dictionary = require('./repository/dictionary');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('attendance', {
    // title: req.session.title,
    // username: req.session.username,
    // fullname: req.session.fullname,
    // role: req.session.role,
    // position: req.session.position
  });
});

module.exports = router;

router.get('/load', (req, res) => {
  try {
      let sql = `select * from time_record`;

      mysql.Select(sql, 'TimeRecord', (err, result) => {
          if (err) {
              return res.json({
                  msg: err
              })
          }

          console.log(helper.GetCurrentDatetime());

          res.json({
              msg: 'success',
              data: result
          })
      });
  } catch (error) {
      res.json({
          msg: error
      })
  }
})