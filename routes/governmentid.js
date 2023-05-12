var express = require('express');
var router = express.Router();

const mysql = require('./repository/payrolldb');
const helper = require('./repository/customhelper');
const dictionary = require('./repository/dictionary');

/* GET home page. */
router.get('/', isAuthAdmin, function (req, res, next) {
  res.render('governmentid', {
    fullname: req.session.fullname
    
  });
});

function isAuthAdmin(req, res, next) {

    if (req.session.roletype == "Admin") {
        next();
    }
    else {
        res.redirect('/login');
    }
};

module.exports = router;

router.get('/load', (req, res) => {
  try {
      let sql = `select * from employee_government_id_details`;

      mysql.Select(sql, 'EmployeeGovernmentIdDetails', (err, result) => {
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
        let sss = req.body.sss;
        let ssscontribution = req.body.ssscontribution;
        let hdmf = req.body.hdmf;
        let hdmfcontribution = req.body.hdmfcontribution;
        let philhealth = req.body.philhealth;
        let philhealthcontribution = req.body.philhealthcontribution;
        let status = dictionary.GetValue(dictionary.ACT());
        let createdby = "Sample Data";
        let createdate = helper.GetCurrentDatetime();
        let data = [];

        data.push([
            employeeid,
            sss,
            ssscontribution,
            hdmf,
            hdmfcontribution,
            philhealth,
            philhealthcontribution,
            status,
            createdby,
            createdate
        ])

        mysql.InsertTable('employee_government_id_details', data, (err, result) => {
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
