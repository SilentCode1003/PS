var express = require('express');
var router = express.Router();

const mysql = require('./repository/payrolldb');
const helper = require('./repository/customhelper');
const dictionary = require('./repository/dictionary');
const crypto = require('./repository/cryptography');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('users', {
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
      let sql = `select * from master_user`;

      mysql.Select(sql, 'MasterUser', (err, result) => {
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


router.post('/save', (req, res) => {
    try {
        let fullname = req.body.fullname; 
        let username = req.body.username;
        let password = req.body.password;
        let roletype = req.body.roletype;
        let accesstype = req.body.accesstype;
        let status = dictionary.GetValue(dictionary.ACT());
        let createdby = "Sample Data";
        let createdate = helper.GetCurrentDatetime();
        let data = [];

        crypto.Encrypter(password, (err, result)=>{
            if(err)console.error('error: ', err);
            data.push([
                fullname,
                username,
                result,
                roletype,
                accesstype,
                status,
                createdby,
                createdate
            ]) 
        })

        mysql.InsertTable('master_user', data, (err, result) => {
            if (err) console.error('Error: ', err);

            console.log(result);

            res.json({
                msg: 'success',
            })
        })
    }
    catch (error) {
        res.json({
            msg: error
        })
    }
})
