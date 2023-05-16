var express = require('express');
var router = express.Router();
 
const mysql = require('./repository/payrolldb');
const helper = require('./repository/customhelper');
const dictionary = require('./repository/dictionary');

/* GET home page. */
router.get('/', isAuthAdmin, function (req, res, next) {
  res.render('access', {
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
        let sql = `select * from master_access_type`;

        mysql.Select(sql, 'MasterAccessType', (err, result) => {
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
        let accessname = req.body.accessname;
        let status = dictionary.GetValue(dictionary.ACT());
        let createdby = "Sample Data";
        let createdate = helper.GetCurrentDatetime();
        let data = [];
        let sql_check = `select * from master_access_type where mat_accessname='${accessname}'`;
        
        mysql.Select(sql_check, 'MasterAccessType', (err, result) => {
            if (err) console.error('Error: ', err);

            if (result.length != 0) {
                return res.json({
                msg: 'exist'
                })
            }else {
                data.push([
                    accessname,
                    status,
                    createdby,
                    createdate
                ])
        
                mysql.InsertTable('master_access_type', data, (err, result) => {
                    if (err) console.error('Error: ', err);
        
                    console.log(result);
        
                    res.json({
                        msg: 'success',
                    })
                });
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
        let accessnamemodal = req.body.accessnamemodal;
        let accesscode = req.body.accesscode;
        
        let data = [accessnamemodal, accesscode];
         
        let sql_Update = `UPDATE master_access_type 
                       SET mat_accessname = ?
                       WHERE mat_accesscode = ?`;
        
        let sql_check = `SELECT * FROM master_access_type WHERE mat_accesscode='${accesscode}'`;

        console.log(data);

        mysql.Select(sql_check, 'MasterRoleType', (err, result) => {
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
        let accesscode = req.body.accesscode;
        let status = req.body.status == dictionary.GetValue(dictionary.ACT()) ? dictionary.GetValue(dictionary.INACT()): dictionary.GetValue(dictionary.ACT());
        let data = [status, accesscode];

        let sql_Update = `UPDATE master_access_type 
                       SET mat_status = ?
                       WHERE mat_accesscode = ?`;

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