var express = require('express');
var router = express.Router();

const mysql = require('./repository/payrolldb');
const helper = require('./repository/customhelper');
const dictionary = require('./repository/dictionary');
const crypto = require('./repository/cryptography');

/* GET home page. */
router.get('/', isAuthAdmin, function (req, res, next) {
  res.render('users', {
    fullname: req.session.fullname,
    roletype: req.session.roletype,
    accesstype: req.session.accesstype,
  });
});
 
function isAuthAdmin(req, res, next) {

    if (req.session.roletype == "Admin" && req.session.accesstype == "Administrator") {
        next();
    }
    else {
        res.redirect('/');
    }
};

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
        let sql_check = `select * from master_user where mu_fullname='${fullname}'`;

        mysql.Select(sql_check, 'MasterUser', (err, result) => {
            if (err) console.error('Error: ', err);

            if (result.length != 0) {
                return res.json({
                msg: 'exist'
                })
            }else {
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
        })
    }
    catch (error) {
        res.json({
            msg: error
        })
    }
})

router.post('/edit', (req, res) => {
    try {
        let usercode = req.body.usercode;
        let fullname = req.body.fullname; 
        let username = req.body.username;
        let password = req.body.password;
        let roletype = req.body.roletype;
        let accesstype = req.body.accesstype;
        let encryptedPassword;

        crypto.Encrypter(password, (err, result) => {
        if (err) {
            console.error('error: ', err);
        } else {
            encryptedPassword = result;
            console.log('Encrypted password:', encryptedPassword);
        }
        });

        let data = [fullname, username, encryptedPassword, roletype, accesstype, usercode];
         
        let sql_Update = `UPDATE master_user 
                       SET mu_fullname = ?, 
                           mu_username = ?, 
                           mu_password = ?, 
                           mu_roletype = ?, 
                           mu_accesstype = ?
                       WHERE mu_usercode = ?`;
        
        let sql_check = `SELECT * FROM master_user WHERE mu_usercode='${usercode}'`;

        console.log(data);

        mysql.Select(sql_check, 'MasterUser', (err, result) => {
            if (err) console.error('Error: ', err);

            if (result.length != 1) {
                return res.json({
                    msg: 'notexist'
                });
            } else {
                mysql.UpdateMultiple(sql_Update, data, (err, result) => {
                    if (err) console.error('Error: ', err);

                    console.log(result);

                    res.json({
                        msg: 'success',
                    });
                });
            }
        });
    } catch (error) {
        res.json({
            msg: error
        });
    }
});

router.post('/status', (req, res) => {
    try {
        let usercode = req.body.usercode;
        let status = req.body.status == dictionary.GetValue(dictionary.ACT()) ? dictionary.GetValue(dictionary.INACT()): dictionary.GetValue(dictionary.ACT());
        let data = [status, usercode];

        let sql_Update = `UPDATE master_user 
                       SET mu_status = ?
                       WHERE mu_usercode = ?`;

        console.log(data);

        mysql.UpdateMultiple(sql_Update, data, (err, result) => {
            if (err) console.error('Error: ', err);

            res.json({
                msg: 'success',
            });
        });
        
    } catch (error) {
        res.json({
            msg: error
        });
    }
});
