var express = require('express');
var router = express.Router();
var data = require('../data');
var moment = require('moment');
var request = { data: [], state: 1, message: "成功", page_no: 0, page_size: 0, total: 0 };

//visitor_info
//保存管理员信息
router.post('/savevisitorinfo', function (req, res, next) {

   
    var newRequest = JSON.parse(JSON.stringify(request));
    
    var arg = req.body;
    var current_time = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    var visitor_infosavemodel = {
        id: 1,
        name: arg.name,
        phone: arg.phone,
        student_name: arg.student_name,
        student_id: arg.student_id,
        state: 1,
        create_time: current_time,
        update_time: current_time,
        remark: arg.remark,
        create_user: arg.create_user,
    };
    data.connect(function(db){
        db.collection('visitor_info').find({}).sort({_id:-1}).limit(1).toArray(function(err,docs){
            if(err){
                newRequest.state=-1;
                newRequest.message=err;
                res.json(newRequest);
            }else{
                if(docs.length>0){
                    visitor_infosavemodel.id=docs[0].id+1;
                }
                data.connect(function(db){
                    db.collection('visitor_info').insertOne(visitor_infosavemodel,function(err,result){
                        if(err){
                            newRequest.state=-1;
                            newRequest.message=err;
                            res.json(newRequest);
                        }else{
                            res.json(newRequest);
                        }
                    })
                });
            }
        })
    });
});
//分页查询
router.post('/getvisitorinfo', function (req, res, next) {
    var newRequest = JSON.parse(JSON.stringify(request));
    var arg = req.body; 
    var phone = arg.phone;
    var page_no = arg.page_no;
    var page_size = arg.page_size;
    var seachdata = { phone: phone };
    if (!arg.phone) {
        seachdata = { state: 1 };
    }
    console.log(seachdata);
    data.connect(function(db){
        db.collection('visitor_info').find().toArray(function(err,docs){
            if(err){
                newRequest.state=-1;
                newRequest.message=err;
              res.json(newRequest);
            }else{
                newRequest.total=docs.length;
                data.connect(function(db){
                        db.collection('visitor_info').find().sort({_id:-1}).limit(page_size).skip((page_no-1)*page_size).toArray(function(err,docs2){
                            if(err){
                                newRequest.state=-1;
                                newRequest.message=err;
                                 res.json(newRequest);
                            }else{
                                newRequest.data=docs2;
                                newRequest.page_size=page_size;
                                newRequest.page_no=page_no;
                                res.json(newRequest);
                            }
                        })
                })
            }
        })
    })
  
});
//获取详情
router.post('/getvisitorinfobyid', function (req, res, next) {
    var newRequest = JSON.parse(JSON.stringify(request));
    var arg = req.body;
    var id = arg.id;
    var seach = { id: id };
    data.connect(function (db) {
        db.collection('visitor_info').find(seach).toArray(function (err, docs) {
            if(err){
                newRequest.state=-1;
                newRequest.message=err;
                 res.json(newRequest);
            }else{
                newRequest.state=1;
                newRequest.data=docs;
                res.json(newRequest);
            }
        })
    })
});
//修改管理员信息
router.post('/updatevisitorinfobyid', function (req, res, next) {
    var newRequest = JSON.parse(JSON.stringify(request));
    var arg = req.body;
    var current_time = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    var update_id = { id: arg.id };
    var update_data = {$set:{
        name: arg.name,
        phone: arg.phone,
        student_name: arg.student_name,
        student_id: arg.student_id,
        remark: arg.remark,
        state: arg.state,
        updatetime: current_time
    }
        
    }
    data.connect(function (db) {
        db.collection('visitor_info').updateOne(update_id, update_data, function (err, result) {
            if (err) {
                newRequest.state = -1;
                newRequest.message = err;
                res.json(newRequest);
            } else {
                newRequest.state = 1;
                res.json(newRequest);
            }
        })
    })
});
//批量删除
router.post('/deletevisitorinfobyids', function (req, res, next) {
    var newRequest = JSON.parse(JSON.stringify(request));
    var arg = req.body;
    var ids = arg.ids;
    console.log(ids);
    data.connect(function (db) {
        db.collection('visitor_info').deleteMany({ id: { $in: ids } }, function (err, result) {
            if (err) {
                newRequest.state = -1;
                newRequest.message = err;
                res.json(newRequest);
            } else {
                res.json(newRequest);
            }
        })
    });
})
module.exports = router;