var express = require('express');
var router = express.Router();

const mysql = require('./repository/payrolldb');
const helper = require('./repository/customhelper');
const dictionary = require('./repository/dictionary');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('deduction', {
    fullname: req.session.fullname
  });
});

module.exports = router;

router.get('/load', (req, res) => {
  try {
      let sql = `select * from employee_deduction_details`;

      mysql.Select(sql, 'EmployeeDeductionDetails', (err, result) => {
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
        let late = req.body.late;
        let absent = req.body.absent;
        let sss = req.body.sss;
        let hdmf = req.body.hdmf;
        let philhealth = req.body.philhealth;
        let cashadvance = req.body.cashadvance;
        let loan = req.body.loan;
        let tax = req.body.tax;
        let payrolldate = "08/05/2023";
        let cutoffdate = "2023-05-08 to 2023-05-23";
        let data = [];

        data.push([
            employeeid,
            late, 
            absent,
            sss,
            hdmf,
            philhealth,
            cashadvance,
            loan,
            tax,
            payrolldate,
            cutoffdate
        ])

        mysql.InsertTable('employee_deduction_details', data, (err, result) => {
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