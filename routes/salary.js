var express = require("express");
var router = express.Router();

const mysql = require("./repository/payrolldb");
const helper = require("./repository/customhelper");
const dictionary = require("./repository/dictionary");

/* GET home page. */
router.get("/", isAuthUser, function (req, res, next) {
  res.render("salary", {
    fullname: req.session.fullname,
    roletype: req.session.roletype,
    accesstype: req.session.accesstype,
  });
});

function isAuthUser(req, res, next) {
  if (req.session.roletype == "User" || req.session.roletype == "Admin") {
    next();
  } else {
    res.redirect("/");
  }
}

module.exports = router;

router.get("/load", (req, res) => {
  try {
    let sql = `select * from employee_salary`;

    mysql.Select(sql, "EmployeeSalary", (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        });
      }

      console.log(helper.GetCurrentDatetime());

      res.json({
        msg: "success",
        data: result,
      });
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});

router.post("/save", (req, res) => {
  try {
    let employeeid = req.body.employeeid;
    let department = req.body.departmentlist;
    let position = req.body.positionlist;
    let dailyrate = req.body.dailyrate;
    let monthlysalary = req.body.monthlysalary;
    let updateby = req.session.fullname;
    let updateddate = helper.GetCurrentDatetime();
    let status = dictionary.GetValue(dictionary.ACT());
    let createdby = req.session.fullname;
    let createdate = helper.GetCurrentDatetime();
    let sql_employee = `select * from master_employee where me_employeeid='${employeeid}'`;
    let data = [];
    let sql_check = `select * from employee_salary where es_employeeid='${employeeid}'`;

    mysql.Select(sql_employee, "MasterEmployee", (err, result) => {
      if (err) console.error("Error: ", err);
      console.log(result);

      let firstname = result[0].firstname;
      let middlename = result[0].middlename;
      let lastname = result[0].lastname;

      mysql.Select(sql_check, "EmployeeSalary", (err, result) => {
        if (err) console.error("Error: ", err);

        if (result.length != 0) {
          return res.json({
            msg: "exist",
          });
        } else {
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
            createdate,
          ]);

          mysql.InsertTable("employee_salary", data, (err, result) => {
            if (err) console.error("Error: ", err);

            console.log(result);

            res.json({
              msg: "success",
            });
          });
        }
      });
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});

router.post("/edit", (req, res) => {
  try {
    let employeeid = req.body.employeeid;
    let firstname = req.body.firstname;
    let middlename = req.body.middlename;
    let lastname = req.body.lastname;
    let position = req.body.position;
    let department = req.body.department;
    let dailyrate = req.body.dailyrate;
    let monthlysalary = req.body.monthlysalary;
    let updateby = req.session.fullname;
    let updateddate = helper.GetCurrentDatetime();

    let data = [
      firstname,
      middlename,
      lastname,
      position,
      department,
      dailyrate,
      monthlysalary,
      updateby,
      updateddate,
      employeeid,
    ];

    let sql_Update = `UPDATE employee_salary 
                        SET es_firstname = ?,
                            es_middlename = ?,
                            es_lastname = ?,
                            es_position = ?,
                            es_department = ?,
                            es_dailyrate = ?,
                            es_monthlysalary = ?,
                            es_updateby = ?,
                            es_updateddate = ?
                        WHERE es_employeeid = ?`;

    let sql_check = `select * from employee_salary where es_employeeid='${employeeid}'`;

    mysql.Select(sql_check, "EmployeeSalary", (err, result) => {
      if (err) console.error("Error: ", err);

      if (result.length != 1) {
        return res.json({
          msg: "notexist",
        });
      } else {
        mysql.UpdateMultiple(sql_Update, data, (err, result) => {
          if (err) console.error("Error: ", err);

          console.log(result);

          res.json({
            msg: "success",
          });
        });
      }
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});

router.post("/status", (req, res) => {
  try {
    let employeeid = req.body.employeeid;
    let status =
      req.body.status == dictionary.GetValue(dictionary.ACT())
        ? dictionary.GetValue(dictionary.INACT())
        : dictionary.GetValue(dictionary.ACT());
    let data = [status, employeeid];

    let sql_Update = `UPDATE employee_salary 
                       SET es_status = ?
                       WHERE es_employeeid = ?`;

    console.log(data);

    mysql.UpdateMultiple(sql_Update, data, (err, result) => {
      if (err) console.error("Error: ", err);

      res.json({
        msg: "success",
      });
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});
