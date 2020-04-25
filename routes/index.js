var express = require('express');
var router = express.Router();
var data=require('../data')

/* GET home page. */
router.get('/', function(req, res, next) {
//data.connect(function(db){
  //db.collection('users').find().toArray(function(err,docs){
  //  console.log('用户列表',docs)
   res.render('index', { title: 'Express' });
//  })
//})

 
});

module.exports = router;
