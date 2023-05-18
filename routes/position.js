var express = require('express');
var router = express.Router();

const mysql = require('./repository/payrolldb');
const helper = require('./repository/customhelper');
const dictionary = require('./repository/dictionary');

/* GET home page. */
router.get('/', isAuthAdmin, function (req, res, next) {
  res.render('position', {
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
      let sql = `select * from master_position`;

      mysql.Select(sql, 'MasterPosition', (err, result) => {
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
        let positionname = req.body.positionname;
        let status = dictionary.GetValue(dictionary.ACT());
        let createdby = "Sample Data";
        let createdate = helper.GetCurrentDatetime();
        let data = [];
        let sql_check = `select * from master_position where mp_positionname='${positionname}'`;

        mysql.Select(sql_check, 'MasterDepartment', (err, result) => {
            if (err) console.error('Error: ', err);

            if (result.length != 0) {
                return res.json({
                msg: 'exist'
                })
            }else {
                data.push([
                    positionname,
                    status,
                    createdby,
                    createdate
                ])
                mysql.InsertTable('master_position', data, (err, result) => {
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
        let positionnamemodal = req.body.positionnamemodal;
        let positioncode = req.body.positioncode;
        
        let data = [positionnamemodal, positioncode];
         
        let sql_Update = `UPDATE master_position 
                       SET mp_positionname = ?
                       WHERE mp_positioncode = ?`;
        
        let sql_check = `SELECT * FROM master_position WHERE mp_positioncode='${positioncode}'`;

        console.log(data);

        mysql.Select(sql_check, 'MasterPosition', (err, result) => {
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
        let positioncode = req.body.positioncode;
        let status = req.body.status == dictionary.GetValue(dictionary.ACT()) ? dictionary.GetValue(dictionary.INACT()): dictionary.GetValue(dictionary.ACT());
        let data = [status, positioncode];

        let sql_Update = `UPDATE master_position 
                       SET mp_status = ?
                       WHERE mp_positioncode = ?`;

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