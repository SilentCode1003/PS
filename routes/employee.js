var express = require('express');
var router = express.Router();

const mysql = require('./repository/payrolldb');
const helper = require('./repository/customhelper');
const dictionary = require('./repository/dictionary');

/* GET home page. */
router.get('/', isAuthAdmin, function (req, res, next) {
  res.render('employee', {
    fullname: req.session.fullname,
    roletype: req.session.roletype,
    accesstype: req.session.accesstype,
  });
});

function isAuthAdmin(req, res, next) {

    if (req.session.roletype == "Admin") {
        next();
    }
    else {
        res.redirect('/');
    }
};

module.exports = router;

router.get('/load', (req, res) => {
  try {
      let sql = `select * from master_employee`;

      mysql.Select(sql, 'MasterEmployee', (err, result) => {
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
        let firstname = req.body.firstname;
        let middlename = req.body.middlename;
        let lastname = req.body.lastname;
        let contactnumber = req.body.contactnumber;
        let email = req.body.email;
        let position = req.body.positionlist;
        let department = req.body.departmentlist;
        let status = dictionary.GetValue(dictionary.ACT());
        let createdby = req.session.fullname;
        let createdate = helper.GetCurrentDatetime();
        let data = [];

        let sql_check = `select * from master_employee where me_employeeid='${employeeid}'`;
        mysql.Select(sql_check, 'MasterDepartment', (err, result) => {
            if (err) console.error('Error: ', err);

            if (result.length != 0) {
                return res.json({
                msg: 'exist'
                })
            }else {
                data.push([
                    employeeid,
                    firstname,
                    middlename,
                    lastname,
                    position,
                    department,
                    contactnumber,
                    email,
                    status,
                    createdby,
                    createdate
                ])
                mysql.InsertTable('master_employee', data, (err, result) => {
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
        let systemid = req.body.systemid;
        let employeeid = req.body.employeeid;
        let firstname = req.body.firstname;
        let middlename = req.body.middlename;
        let lastname = req.body.lastname;
        let contactnumber = req.body.contactnumber;
        let email = req.body.email;
        let position = req.body.positionlist;
        let department = req.body.departmentlist;

        let data = [employeeid, firstname, middlename, lastname, position, department, contactnumber, email, systemid];
         
        let sql_Update = `UPDATE master_employee 
                        SET me_employeeid = ?,
                            me_firstname = ?,
                            me_middlename = ?,
                            me_lastname = ?,
                            me_position = ?,
                            me_department = ?,
                            me_contactnumber = ?,
                            me_email = ?
                        WHERE me_systemid = ?`;
        
        let sql_check = `SELECT * FROM master_employee WHERE me_systemid='${systemid}'`;

        console.log(data);

        mysql.Select(sql_check, 'MasterEmployee', (err, result) => {
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
        let systemid = req.body.systemid;
        let status = req.body.status == dictionary.GetValue(dictionary.ACT()) ? dictionary.GetValue(dictionary.INACT()): dictionary.GetValue(dictionary.ACT());
        let data = [status, systemid];

        let sql_Update = `UPDATE master_employee 
                       SET me_status = ?
                       WHERE me_systemid = ?`;

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
