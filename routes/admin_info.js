var express = require('express');
var utility = require('utility');
var router = express.Router();
var data = require('../data');
var moment = require('moment');
var request = { data: [], state: 1, message: "成功", pageNo: 0, pageSize: 0, total: 0 };

//登录
router.post('/login', function (req, res, next) {
    var newRequest = JSON.parse(JSON.stringify(request));
    var arg = req.body;
    var _data = { phone: arg.phone, password: utility.md5(arg.password) };
    data.connect(function (db) {
        db.collection('admin_info').find(_data).toArray(function (err, docs) {
            if (err) {
                newRequest.state = -1;
                newRequest.message = err;
                res.json(newRequest);
            } else {
                if (docs.length > 0) {
                    newRequest.state = 1;
                    newRequest.data = docs[0];
                    res.json(newRequest);

                } else {

                    newRequest.state = -1;
                    newRequest.message = {
                        name:"账号或密码错误"
                    };
                    res.json(newRequest);
                }
            }
        })
    })
}),
    //保存管理员信息
    router.post('/saveadmininfo', function (req, res, next) {
        var newRequest = JSON.parse(JSON.stringify(request));
        var arg = req.body;
        data.connect(function (db) {
            db.collection('admin_info').find({ phone: arg.phone }).toArray(function (err, docs) {
                if (err) {
                    newRequest.state = -1;
                    newRequest.message = err;
                    res.json(newRequest);
                } else {
                    if (docs.length > 0) {
                        newRequest.state = -1;
                        newRequest.data = docs;

                        newRequest.message = {
                            name:"重复账号"
                        };
                        res.json(newRequest);
                    } else {
                        var current_time = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
                        var admininfosavemodel = {
                            id: 1,
                            name: arg.name,
                            phone: arg.phone,
                            state: 1,
                            role_id: parseInt(arg.role_id),
                            create_time: current_time,
                            update_time: current_time,
                            remark: arg.remark,

                            password: utility.md5(arg.password)
                        };
                        data.connect(function (db) {
                            db.collection('admin_info').find({}).sort({ _id: -1 }).limit(1).toArray(function (err, docs) {
                                if (err) {
                                    newRequest.state = -1;
                                    newRequest.message = err;
                                    res.json(newRequest);
                                } else {
                                    if (docs.length > 0) {
                                        admininfosavemodel.id = docs[0].id + 1;
                                    }
                                    data.connect(function (db) {
                                        db.collection('admin_info').insertOne(admininfosavemodel, function (err, result) {
                                            if (err) {
                                                newRequest.state = -1;
                                                newRequest.message = err;
                                                res.json(newRequest);
                                            } else {
                                                newRequest.state = 1;
                                                res.json(newRequest);
                                            }
                                        })
                                    });
                                }
                            })
                        });

                    }
                }
            })

        });


    });
  
//分页查询
router.post('/getadmininfo', function (req, res, next) {
   
    
    var newRequest = JSON.parse(JSON.stringify(request));
    var arg = req.body;
    var phone = arg.phone;
    var pageNo = arg.page_no;
    var pageSize = arg.page_size;
    var seachdata = { phone: phone, state: 1 };
    if (arg.phone == undefined) {
        seachdata = { state: 1 };
    }
    data.connect(function (db) {
        db.collection('admin_info').find().toArray(function (err, docs) {
            if (err) {
                newRequest.state = -1;
                newRequest.message = err;
                res.json(newRequest);
            } else {
           
                newRequest.total = docs.length;
          
                data.findByPage("admin_info", seachdata, pageNo, pageSize, function (err, docs2) {
                    if (err) {
                        newRequest.state = -1;
                        newRequest.message = err;
                        res.json(newRequest);
                    } else {
                      
                        newRequest.state = 1;
                     
                        newRequest.data = docs2;
                        newRequest.pageSize = pageSize;
                        newRequest.pageNo = pageNo;
                        res.json(newRequest);
                    }
                })
                // data.connect(function(db){
                //         db.collection('admin_info').find(seachdata).sort({_id:-1}).limit(pageSize).skip((pageNo-1)*pageSize).toArray(
                // })
            }
        })
    })
});
//获取详情
router.post('/getadmininfobyid', function (req, res, next) {
   
    var newRequest = JSON.parse(JSON.stringify(request));
    var arg = req.body;

    var id = arg.id;
    var seach = { id: id };
    data.connect(function (db) {
        db.collection('admin_info').find(seach).toArray(function (err, docs) {
            if (err) {
                newRequest.state = -1;
                newRequest.message = err;
                res.json(newRequest);
                
            }else{
                newRequest.state = 1;
                newRequest.data = docs;
                res.json(newRequest);
            }
        })
    })

});
//修改管理员信息
router.post('/updateadmininfobyid', function (req, res, next) {
   
    var newRequest = JSON.parse(JSON.stringify(request));
    var arg = req.body;
    var current_time = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    var update_id = { id: arg.id };
    var update_data = {$set:{
        name: arg.name,
        photo: arg.photo,
        remark: arg.remark,
        password: arg.password,
        role_id:parseInt(arg.role_id),
        updatetime: current_time
    }}
    
    data.update('admin_info',update_id, update_data, function (err, result) {
        if (err) {
            newRequest.state = -1;
            newRequest.message = err;
            res.json(newRequest);
        } else {
            newRequest.state = 1;
            newRequest.data = result;
            console.log(result);
            res.json(newRequest);
        }
    });
    // data.connect(function (db) {
    //     db.collection('admin_info').updateOne(update_id, update_data, function (err, result) {
    //         if (err) {
    //             request.state = -1;
    //             request.message = err;
    //             res.json(request);
    //         } else {
    //             request.state = 1;
          
    //             res.json(request);
    //         }
    //     })
    // })
});
//批量删除
router.post('/deleteadmininfobyids', function (req, res, next) {
    var newRequest = JSON.parse(JSON.stringify(request));
    var arg = req.body;
    var ids = arg.ids;
    data.connect(function (db) {
        db.collection('admin_info').deleteMany({ id: { $in: ids } }, function (err, result) {
            if (err) {
                newRequest.state = -1;
                newRequest.message = err;
                res.json(newRequest);
            } else {
                newRequest.state = 1;
                res.json(newRequest);
            }
        })
    });
})
module.exports = router;