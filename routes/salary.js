var express = require('express');
var router = express.Router();

const mysql = require('./repository/payrolldb');
const helper = require('./repository/customhelper');
const dictionary = require('./repository/dictionary');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('salary', {
    fullname: req.session.fullname
  });
});

module.exports = router;

router.get('/load', (req, res) => {
  try {
      let sql = `select * from employee_salary`;

      mysql.Select(sql, 'EmployeeSalary', (err, result) => {
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
        let department = req.body.departmentlist;
        let position = req.body.positionlist;
        let dailyrate = req.body.dailyrate;
        let monthlysalary = req.body.monthlysalary;
        let updateby = "Sample Data";
        let updateddate = "Sample Data";
        let status = dictionary.GetValue(dictionary.ACT());
        let createdby = "Sample Data";
        let createdate = helper.GetCurrentDatetime();

        let data = [];

        data.push([
            employeeid,
            firstname,
            middlename,
            lastname,
            department,
            position,
            dailyrate,
            monthlysalary,
            updateby,
            updateddate,
            status,
            createdby,
            createdate
        ])

        mysql.InsertTable('employee_salary', data, (err, result) => {
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