var express = require('express');
var router = express.Router();

const mysql = require('./repository/payrolldb');
const helper = require('./repository/customhelper');
const dictionary = require('./repository/dictionary');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('department', {
    // title: req.session.title,
    // username: req.session.username,
    // fullname: req.session.fullname,
    // role: req.session.role,
    // position: req.session.position
  });
});
 
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