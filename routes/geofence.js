var express = require("express");
var router = express.Router();

const mysql = require("./repository/payrolldb");
const helper = require("./repository/customhelper");
const dictionary = require("./repository/dictionary");

/* GET home page. */
router.get("/", isAuthAdmin, function (req, res, next) {
  res.render("geofence", {
    fullname: req.session.fullname,
    roletype: req.session.roletype,
    accesstype: req.session.accesstype,
  });
});

function isAuthAdmin(req, res, next) {
  if (req.session.roletype == "Admin") {
    next();
  } else {
    res.redirect("/");
  }
}

module.exports = router;

router.get("/load", (req, res) => {
  try {
    let sql = `select * from geofence`;

    mysql.Select(sql, "Geofence", (err, result) => {
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
    let locationname = req.body.locationname;
    let departmentcode = req.body.departmentcode;
    let longitude = req.body.longitude;
    let latitude = req.body.latitude;
    let radius = req.body.radius;
    let status = dictionary.GetValue(dictionary.ACT());
    let createdby = req.session.fullname;
    let createdate = helper.GetCurrentDatetime();
    let data = [];
    let sql_check = `select * from geofence where g_locationname='${locationname}'`;

    mysql.Select(sql_check, "Geofence", (err, result) => {
      if (err) console.error("Error: ", err);

      if (result.length != 0) {
        return res.json({
          msg: "exist",
        });
      } else {
        data.push([
          departmentcode,
          locationname,
          longitude,
          latitude,
          radius,
          status,
          createdby,
          createdate,
        ]);

        mysql.InsertTable("geofence", data, (err, result) => {
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

// router.post("/edit", (req, res) => {
//   try {
//     let locationnamemodal = req.body.locationnamemodal;
//     let geofencecode = req.body.geofencecode;

//     let data = [locationnamemodal, geofencecode];

//     let sql_Update = `UPDATE geofence
//                        SET g_locationname = ?
//                        WHERE mat_geofencecode = ?`;

//     let sql_check = `SELECT * FROM geofence WHERE mat_geofencecode='${geofencecode}'`;

//     console.log(data);

//     mysql.Select(sql_check, "MasterRoleType", (err, result) => {
//       if (err) console.error("Error: ", err);

//       if (result.length != 1) {
//         return res.json({
//           msg: "notexist",
//         });
//       } else {
//         mysql.UpdateMultiple(sql_Update, data, (err, result) => {
//           if (err) console.error("Error: ", err);

//           console.log(result);

//           res.json({
//             msg: "success",
//           });
//         });
//       }
//     });
//   } catch (error) {
//     res.json({
//       msg: error,
//     });
//   }
// });

// router.post("/status", (req, res) => {
//   try {
//     let geofencecode = req.body.geofencecode;
//     let status =
//       req.body.status == dictionary.GetValue(dictionary.ACT())
//         ? dictionary.GetValue(dictionary.INACT())
//         : dictionary.GetValue(dictionary.ACT());
//     let data = [status, geofencecode];

//     let sql_Update = `UPDATE geofence
//                        SET mat_status = ?
//                        WHERE mat_geofencecode = ?`;

//     console.log(data);

//     mysql.UpdateMultiple(sql_Update, data, (err, result) => {
//       if (err) console.error("Error: ", err);

//       res.json({
//         msg: "success",
//       });
//     });
//   } catch (error) {
//     res.json({
//       msg: error,
//     });
//   }
// });

router.post("/getgeofence", (req, res) => {
  try {
    let department = req.body.department;
    let sql = `select md_departmentcode as departmentcode from master_department where md_departmentname='${department}'`;

    mysql.SelectResult(sql, (err, result) => {
      if (err) console.error("Error: ", err);

      console.log(result);
      let departmentcode = result[0].departmentcode;
      let sql_geofence = `select * from geofence where g_departmentcode='${departmentcode}'`;

      mysql.Select(sql_geofence, "Geofence", (err, result) => {
        if (err) console.error("Error: ", err);

        res.json({
          msg: "success",
          data: result,
        });
      });
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});
