var express = require('express');
var router = express.Router();

const mysql = require('./repository/payrolldb');
const helper = require('./repository/customhelper');
const dictionary = require('./repository/dictionary');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('payroll', {
    fullname: req.session.fullname
  });
});

module.exports = router;

router.get('/load', (req, res) => {
  try {
      let sql = `select * from payroll_detail`;

      mysql.Select(sql, 'PayrollDetail', (err, result) => {
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
        let payrolldate = req.body.payrolldate;
        let datecovered = req.body.datecovered;
        let absences = req.body.absences;
        let late = req.body.late; 
        let undertime = req.body.undertime;
        let allowance = req.body.allowance;
        let cashadvance = req.body.cashadvance;
        let sss = req.body.sss;
        let sssloan = req.body.sssloan; 
        let philhealth = req.body.philhealth;
        let hmdf = req.body.hmdf;
        let tax = req.body.tax;
        let status = dictionary.GetValue(dictionary.ACT());
        let createdby = "Sample Data";
        let createdate = helper.GetCurrentDatetime();
        let data = [];

        data.push([
            employeeid,
            payrolldate,
            datecovered,
            absences,
            late,
            undertime,
            allowance,
            cashadvance,
            sss,
            sssloan,
            philhealth,
            hmdf,
            tax,
            status,
            createdby,
            createdate
        ]) 

        mysql.InsertTable('payroll_detail', data, (err, result) => {
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
