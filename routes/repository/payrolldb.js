const mysql = require('mysql');
const model = require('../model/payrollmodel');
require('dotenv').config();
const crypt = require('./cryptography');

let password = '';
crypt.Decrypter(process.env._PASSWORD, (err, result) => {
    if (err) throw err;

    password = result;
    console.log(`${result}`);
});


const connection = mysql.createConnection({
    host: process.env._HOST,
    user: process.env._USER,
    password: password,
    database: process.env._DATABASE
});

crypt.Encrypter('#Ebedaf19dd0d', (err, result) => {
    if (err) console.error('Error: ', err);

    console.log(result);
})

// crypt.Decrypter('f6a3287039d0d75cb83cb29d35b3dfcb', (err, result) => {
//     if (err) console.error('Error: ', err);

//     console.log(${result});
// });

exports.CheckConnection = () => {
    connection.connect((err) => {
        if (err) {
            console.error('Error connection to MYSQL databases: ', err);
            return;
        }
        console.log('MySQL database connection established successfully!');
    });
}

exports.InsertMultiple = async (stmt, todos) => {
    try {
        connection.connect((err) => { return err; })
        // console.log(statement: ${stmt} data: ${todos});

        connection.query(stmt, [todos], (err, results, fields) => {
            if (err) {
                return console.error(err.message);
            }
            console.log(`Row inserted: ${results.affectedRows}`);

            return 1;
        });

    } catch (error) {
        console.log(error);
    }
}

exports.Select = (sql, table, callback) => {
    try {
        connection.connect((err) => { return err; })
        connection.query(sql, (error, results, fields) => {

            // console.log(results);

            if (error) {
                callback(error, null)
            }

            if (table == 'MasterUser') {
                callback(null, model.MasterUser(results));
            }

            if (table == 'MasterRoleType') {
                callback(null, model.MasterRoleType(results));
            }

            if (table == 'MasterAccessType') {
                callback(null, model.MasterAccessType(results));
            }

            if (table == 'MasterDepartment') {
                callback(null, model.MasterDepartment(results));
            }

            if (table == 'MasterPosition') {
                callback(null, model.MasterPosition(results));
            }

            if (table == 'MasterEmployee') {
                callback(null, model.MasterEmployee(results));
            }

            if (table == 'TimeRecord') {
                callback(null, model.TimeRecord(results));
            }

        });

    } catch (error) {
        console.log(error);
    }
}

exports.StoredProcedure = (sql, data, callback) => {
    try {

        connection.query(sql, data, (error, results, fields) => {
            if (error) {
                callback(error.message, null);
            }
            callback(null, results[0])
        });
    } catch (error) {
        callback(error, null);
    }
}

exports.StoredProcedureResult = (sql, callback) => {
    try {

        connection.query(sql, (error, results, fields) => {
            if (error) {
                callback(error.message, null);
            }
            callback(null, results[0])
        });
    } catch (error) {
        callback(error, null);
    }
}

exports.Update = async (sql, callback) => {
    try {
        connection.query(sql, (error, results, fields) => {
            if (error) {
                callback(error, null)
            }
            // console.log('Rows affected:', results.affectedRows);

            callback(null, `Rows affected: ${results.affectedRows}`);
        });
    } catch (error) {
        callback(error, null)
    }
}

exports.UpdateMultiple = async (sql, data, callback) => {
    try {
        connection.query(sql, data, (error, results, fields) => {
            if (error) {
                callback(error, null)
            }
            // console.log('Rows affected:', results.affectedRows);

            callback(null, `Rows affected: ${results.affectedRows}`);
        });
    } catch (error) {
        console.log(error);
    }
}

exports.CloseConnect = () => {
    connection.end();
}

exports.Insert = (stmt, todos, callback) => {
    try {
        connection.connect((err) => { return err; })
        // console.log(statement: ${stmt} data: ${todos});

        connection.query(stmt, [todos], (err, results, fields) => {
            if (err) {
                callback(err, null);
            }
            // callback(null, Row inserted: ${results});
            callback(null, `Row inserted: ${results.affectedRows}`);
            // console.log(Row inserted: ${results.affectedRows});
        });

    } catch (error) {
        callback(error, null);
    }
}

exports.SelectResult = (sql, callback) => {
    try {
        connection.connect((err) => { return err; })
        connection.query(sql, (error, results, fields) => {

            // console.log(results);

            if (error) {
                callback(error, null)
            }

            callback(null, results);

        });

    } catch (error) {
        console.log(error);
    }
}

exports.InsertTable = (tablename, data, callback) => {
    if (tablename == 'master_user') {
        let sql = `INSERT INTO master_user(
            mu_fullname,
            mu_username,
            mu_password,
            mu_roletype,
            mu_accesstype,
            mu_status,
            mu_createdby,
            mu_createddate) VALUES ?`;

        this.Insert(sql, data, (err, result) => {
            if (err) {
                callback(err, null);
            }
            callback(null, result)
        })
    }
 
    if (tablename == 'master_role_type') {
        let sql = `INSERT INTO master_role_type(
            mrt_rolename,
            mrt_status,
            mrt_createdby,
            mrt_createddate) VALUES ?`;

        this.Insert(sql, data, (err, result) => {
            if (err) {
                callback(err, null);
            }
            callback(null, result)
        })
    }

    if (tablename == 'master_access_type') {
        let sql = `INSERT INTO master_access_type(
            mat_accessname,
            mat_status,
            mat_createdby,
            mat_createddate) VALUES ?`;
        this.Insert(sql, data, (err, result) => {
            if (err) {
                callback(err, null);
            }
            callback(null, result)
        })
    }

    if (tablename == 'master_department') {
        let sql = `INSERT INTO master_department(
            md_departmentname,
            md_status,
            md_createdby,
            md_createddate) VALUES ?`;
        this.Insert(sql, data, (err, result) => {
            if (err) {
                callback(err, null);
            }
            callback(null, result)
        })
    }

    if (tablename == 'master_position') {
        let sql = `INSERT INTO master_position(
            mp_positionname,
            mp_status,
            mp_createdby,
            mp_createddate) VALUES ?`;

        this.Insert(sql, data, (err, result) => {
            if (err) {
                callback(err, null);
            }
            callback(null, result)
        })
    }

    if (tablename == 'master_employee') {
        let sql = `INSERT INTO master_employee(
            me_employeeid,
            me_firstname,
            me_middlename,
            me_lastname,
            me_position,
            me_department,
            me_contactnumber,
            me_email,
            me_status,
            me_createdby,
            me_createddate) VALUES ?`;
        this.Insert(sql, data, (err, result) => {
            if (err) {
                callback(err, null);
            }
            callback(null, result)
        })
    }
}