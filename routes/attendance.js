var express = require("express");
var router = express.Router();

const mysql = require("./repository/payrolldb");
const helper = require("./repository/customhelper");
const dictionary = require("./repository/dictionary");

/* GET home page. */
router.get("/", isAuthUser, function (req, res, next) {
  res.render("attendance", {
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
    let sql = `select * from time_record`;

    mysql.Select(sql, "TimeRecord", (err, result) => {
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

router.post("/timelog", (req, res) => {
  try {
    let employeeid = req.body.employeeid;
    let time = helper.GetCurrentTime();
    let date = helper.GetCurrentDate();
    let type = req.body.type;
    let latitude = req.body.latitude;
    let longitude = req.body.longitude;
    let time_logs = [];

    console.log(`${employeeid} ${time} ${type} ${latitude} ${longitude}`);

    time_logs.push([employeeid, type, date, time, latitude, longitude]);

    mysql.InsertTable("time_logs", time_logs, (err, result) => {
      if (err) console.error("Error: ", err);

      console.log(result);

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

router.post("/getlogstatus", (req, res) => {
  try {
    let employeeid = req.body.employeeid;
    let currentdate = helper.GetCurrentDate();
    let sql = `select tl_type as type from time_logs where tl_employeeid='${employeeid}' and tl_date='${currentdate}'`;
    console.log(sql);

    mysql.SelectResult(sql, (err, result) => {
      if (err) console.error(err);

      console.log(result);

      if (result.length != 0) {
        res.json({
          msg: "success",
          data: result,
        });
      } else {
        res.json({
          msg: "nologs",
        });
      }
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});
