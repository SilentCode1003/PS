var express = require('express');
var router = express.Router();

const mysql = require('./repository/payrolldb');
const helper = require('./repository/customhelper');
const dictionary = require('./repository/dictionary');

/* GET home page. */
router.get('/', isAuthAdmin, function (req, res, next) {
  res.render('department', {
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
      let sql = `select * from master_department`;

      mysql.Select(sql, 'MasterDepartment', (err, result) => {
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
        let departmentname = req.body.departmentname;
        let status = dictionary.GetValue(dictionary.ACT());
        let createdby = req.session.fullname;
        let createdate = helper.GetCurrentDatetime();
        let data = [];
        let sql_check = `select * from master_department where md_departmentname='${departmentname}'`;

        mysql.Select(sql_check, 'MasterDepartment', (err, result) => {
            if (err) console.error('Error: ', err);

            if (result.length != 0) {
                return res.json({
                msg: 'exist'
                })
            }else {
                data.push([
                    departmentname,
                    status,
                    createdby,
                    createdate
                ])

                mysql.InsertTable('master_department', data, (err, result) => {
                    if (err) console.error(err);

                    res.json({
                        msg: 'success'
                    })
                });
            }
        })
        } catch (error) {
            res.json({
                msg: error
            })
        }
    })

router.post('/edit', (req, res) => {
    try {
        let departmentnamemodal = req.body.departmentnamemodal;
        let departmentcode = req.body.departmentcode;
        
        let data = [departmentnamemodal, departmentcode];
         
        let sql_Update = `UPDATE master_department 
                       SET md_departmentname = ?
                       WHERE md_departmentcode = ?`;
        
        let sql_check = `SELECT * FROM master_department WHERE md_departmentcode='${departmentcode}'`;

        console.log(data);

        mysql.Select(sql_check, 'MasterDepartment', (err, result) => {
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
        let departmentcode = req.body.departmentcode;
        let status = req.body.status == dictionary.GetValue(dictionary.ACT()) ? dictionary.GetValue(dictionary.INACT()): dictionary.GetValue(dictionary.ACT());
        let data = [status, departmentcode];

        let sql_Update = `UPDATE master_department 
                       SET md_status = ?
                       WHERE md_departmentcode = ?`;

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