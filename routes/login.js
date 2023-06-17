var express = require("express");
var router = express.Router();

const mysql = require("./repository/payrolldb");
const helper = require("./repository/customhelper");
const dictionary = require("./repository/dictionary");
const crypt = require("./repository/cryptography");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("login", {
    fullname: req.session.fullname,
    roletype: req.session.roletype,
    accesstype: req.session.accesstype,
  });
});

router.post("/authentication", (req, res) => {
  try {
    var username = req.body.username;
    var password = req.body.password;
    var message = "";

    crypt.Encrypter(password, (err, result) => {
      if (err) {
        console.error("Encryption Error: ", err);
      }
      console.log(result);

      // console.log(USERNAME: ${username})
      let sql = `select * from master_user where mu_username='${username}' and mu_password='${result}'`;
      mysql.Select(sql, "MasterUser", (err, result) => {
        if (err) {
          return res.json({
            msg: err,
          });
        }
        console.log(result);
        if (result.length != 0) {
          req.session.isAuth = true;
          req.session.username = result[0].username;
          req.session.fullname = result[0].fullname;
          req.session.roletype = result[0].roletype;
          req.session.accesstype = result[0].accesstype;

          res.json({
            msg: "success",
          }).next;
        } else {
          return res.json({
            msg: "incorrect",
          });
        }
      });
    });
  } catch (error) {
    res,
      json({
        msg: error,
      });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.json({
        msg: err,
      });
    }

    res.json({
      msg: "success",
    });
  });
});

router.post("/employeelogin", (req, res) => {
  try {
    let username = req.body.username;
    let password = req.body.password;

    crypt.Encrypter(password, (err, encryted) => {
      if (err) console.error("Error: ", err);
      let sql_check = `select * from master_employee where me_username='${username}' and me_password='${encryted}'`;

      mysql.Select(sql_check, "MasterEmployee", (err, result) => {
        if (err) console.error("Error: ", err);

        console.log(result);

        if (result.length != 0) {
          return res.json({
            msg: "success",
            data: result,
          });
        } else {
          res.json({
            msg: "notexist",
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

module.exports = router;
