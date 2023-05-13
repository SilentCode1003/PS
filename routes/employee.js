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
        let createdby = "Sample Data";
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
