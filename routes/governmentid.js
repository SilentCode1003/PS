var express = require('express');
var router = express.Router();

const mysql = require('./repository/payrolldb');
const helper = require('./repository/customhelper');
const dictionary = require('./repository/dictionary');

/* GET home page. */
router.get('/', isAuthUser, function (req, res, next) {
  res.render('governmentid', {
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
        let createdby = req.session.fullname;
        let createdate = helper.GetCurrentDatetime();
        let data = [];

        let sql_check = `select * from employee_government_id_details where egid_employeeid='${employeeid}'`;

        mysql.Select(sql_check, 'EmployeeGovernmentIdDetails', (err, result) => {
            if (err) console.error('Error: ', err);

            if (result.length != 0) {
                return res.json({
                msg: 'exist'
                })
            }else {
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
        let sss = req.body.sss;
        let ssscontribution = req.body.ssscontribution;
        let hdmf = req.body.hdmf;
        let hdmfcontribution = req.body.hdmfcontribution;
        let philhealth = req.body.philhealth;
        let philhealthcontribution = req.body.philhealthcontribution;

        let data = [sss, ssscontribution, hdmf, hdmfcontribution, philhealth, philhealthcontribution, employeeid];
         
        let sql_Update = `UPDATE employee_government_id_details 
                        SET egid_sss = ?,
                            egid_ssscontribution = ?,
                            egid_hdmf = ?,
                            egid_hdmfcontribution = ?,
                            egid_philhealth = ?,
                            egid_philhealthcontribution = ?
                        WHERE egid_employeeid = ?`;
        
        let sql_check = `SELECT * FROM employee_government_id_details WHERE egid_employeeid='${employeeid}'`;

        console.log(data);

        mysql.Select(sql_check, 'EmployeeGovernmentIdDetails', (err, result) => {
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
        let employeeid = req.body.employeeid;
        let status = req.body.status == dictionary.GetValue(dictionary.ACT()) ? dictionary.GetValue(dictionary.INACT()): dictionary.GetValue(dictionary.ACT());
        let data = [status, employeeid];

        let sql_Update = `UPDATE employee_government_id_details 
                       SET egid_status = ?
                       WHERE egid_employeeid = ?`;

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

