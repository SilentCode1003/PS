var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var departmentRouter = require('./routes/department');
var rolesRouter = require('./routes/roles');
var positionRouter = require('./routes/position');
var accessRouter = require('./routes/access');
var employeeRouter = require('./routes/employee');
var attendanceRouter = require('./routes/attendance');
var governmentidRouter = require('./routes/governmentid');
var deductionRouter = require('./routes/deduction');
var allowanceRouter = require('./routes/allowance');
var payrollRouter = require('./routes/payroll');
var salaryRouter = require('./routes/salary');
var loginRouter = require('./routes/login');
var geofenceRouter = require('./routes/geofence');

var app = express();

const session = require('express-session');
const mongoose = require('mongoose');
const MongoDBSession = require('connect-mongodb-session')(session);

const mysql = require('./routes/repository/payrolldb');

//mongodb
mongoose.connect('mongodb://localhost:27017/PayRoll')
  .then((res) => {
    console.log("MongoDB Connected!");
  });

const store = new MongoDBSession({
  uri: 'mongodb://localhost:27017/Ticketing',
  collection: 'PayRollSessions',
});

//Session
app.use(
  session({
    secret: "5L Secret Key",
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

//Check SQL Connection
mysql.CheckConnection();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/department', departmentRouter);
app.use('/roles', rolesRouter);
app.use('/position', positionRouter);
app.use('/access', accessRouter);
app.use('/employee', employeeRouter);
app.use('/attendance', attendanceRouter);
app.use('/governmentid', governmentidRouter);
app.use('/deduction', deductionRouter);
app.use('/allowance', allowanceRouter);
app.use('/payroll', payrollRouter);
app.use('/salary', salaryRouter);
app.use('/login', loginRouter);
app.use('/geofence', geofenceRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


