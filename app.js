var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//管理员信息
var admin_info_router = require('./routes/admin_info');
//角色信息
var role_info_router = require('./routes/role_info');
//学生信息
var student_info=require('./routes/student_info');
//管理员权限
var jurisdiction_info = require('./routes/jurisdiction_info');
//菜单表
var menu_info = require('./routes/menu_info');
//宿舍信息
var dormitory_info=require('./routes/dormitory_info');
//来访人员信息
var visitor_info = require('./routes/visitor_info');
//卫生信息管理
var hygiene_info = require('./routes/hygiene_info');
//维修管理
var maintenance_info=require('./routes/maintenance_info');
//宿舍电费
var electricity_info = require('./routes/electricity_info');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);

app.use('/api/admininfo',admin_info_router);
// app.use('/api/roleinfo',role_info_router);
app.use('/api/studentinfo',student_info);

app.use('/api/jurisdictioninfo',jurisdiction_info);
app.use('/api/menuinfo',menu_info);
app.use('/api/dormitoryinfo',dormitory_info);

app.use('/api/visitorinfo',visitor_info);
app.use('/api/hygieneinfo',hygiene_info);
app.use('/api/maintenanceinfo',maintenance_info);
app.use('/api/electricityinfo',electricity_info);

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
