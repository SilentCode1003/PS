var express = require('express');
var router = express.Router();

const mysql = require('./repository/payrolldb');
const helper = require('./repository/customhelper');
const dictionary = require('./repository/dictionary');

/* GET home page. */
router.get('/', isAuthUser, function (req, res, next) {
  res.render('allowance', {
    fullname: req.session.fullname,
    roletype: req.session.roletype,
    accesstype: req.session.accesstype,
  });
});

function isAuthUser(req, res, next) {

    if (req.session.roletype == "User" || req.session.roletype == "Admin") {
        next();
    }
    else {
        res.redirect('/');
    }
};

module.exports = router;

router.get('/load', (req, res) => {
  try {
      let sql = `select * from employee_allowance`;

      mysql.Select(sql, 'EmployeeAllowance', (err, result) => {
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
        let employeeid = req.body.employeeid;
        let allowance = req.body.allowance;
        let status = dictionary.GetValue(dictionary.ACT());
        let createdby = req.session.fullname;
        let createdate = helper.GetCurrentDatetime();
        let data = [];

        let sql_check = `select * from employee_allowance where ea_employeeid='${employeeid}'`;

        mysql.Select(sql_check, 'EmployeeAllowance', (err, result) => {
            if (err) console.error('Error: ', err);

            if (result.length != 0) {
                return res.json({
                msg: 'exist'
                })
            }else {
                data.push([
                    employeeid,
                    allowance,
                    status,
                    createdby,
                    createdate
                ])
        
                mysql.InsertTable('employee_allowance', data, (err, result) => {
                    if (err) console.error('Error: ', err);
        
                    console.log(result);
        
                    res.json({
                        msg: 'success',
                    })
                })
            }
        })
    }catch (error) {
        res.json({
            msg: error
        })
    }
})

router.post('/edit', (req, res) => {
    try {
        let employeeid = req.body.employeeid;
        let allowance = req.body.allowance;

        let data = [allowance, employeeid];

        let sql_Update = `UPDATE employee_allowance 
                       SET ea_allowance = ?
                       WHERE ea_employeeid = ?`;

        let sql_check = `select * from employee_allowance where ea_employeeid='${employeeid}'`;

        mysql.Select(sql_check, 'EmployeeAllowance', (err, result) => {
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
        })
    }catch (error) {
        res.json({
            msg: error
        })
    }
})

router.post('/status', (req, res) => {
    try {
        let employeeid = req.body.employeeid;
        let status = req.body.status == dictionary.GetValue(dictionary.ACT()) ? dictionary.GetValue(dictionary.INACT()): dictionary.GetValue(dictionary.ACT());
        let data = [status, employeeid];

        let sql_Update = `UPDATE employee_allowance 
                        SET ea_status = ?
                        WHERE ea_employeeid = ?`;

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