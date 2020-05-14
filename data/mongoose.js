var mongoose = require('mongoose'), 

DB_URL = 'mongodb://111.231.57.75:3307/dormitory'; /** * 连接 */ 

mongoose.connect(DB_URL,{
    useNewUrlParser: true ,
    useUnifiedTopology: true
}); /** * 连接成功 */ 

mongoose.connection.on('connected', function () { 

console.log('Mongoose connection open to ' + DB_URL); }); /** * 连接异常 */ 

mongoose.connection.on('error',function (err) { 

console.log('Mongoose connection error: ' + err); }); /** * 连接断开 */ 

mongoose.connection.on('disconnected', function () { 

console.log('Mongoose connection disconnected'); }); 

module.exports = mongoose;