var express = require('express');
var utility = require('utility');
var router = express.Router();
var data = require('../data');
var moment = require('moment');
var request = { data: [], state: 1, message: "成功", pageNo: 0, pageSize: 0, total: 0 };

/* var http=require('http');
var url=require('url');
var qs=require('querystring');//解析参数的库 */
/* console.log(req.url);
    var arg=url.parse(req.url).query;
    var nameValue=qs.parse(arg)['phone'];
    console.log(nameValue); */
/*     console.log(arg1);
console.log(arg1.phone); */
/* router.get('/login', function(req, res, next) {
    
    var arg=url.parse(req.url,true).query;

     var _data = { phone: arg.phone, password: utility.md5(arg.password) };
  data.connect(function(db){
      db.collection('admininfo').find(_data).toArray(function(err,docs){
          if(err){
             res.json(_data);
          }else{
              res.json(docs);
          }
      })
  })
}) */
//登录
router.post('/login', function (req, res, next) {
    var arg = req.body;
    var _data = { phone: arg.phone, password: utility.md5(arg.password) };
    data.connect(function (db) {
        db.collection('admin_info').find(_data).toArray(function (err, docs) {
            if (err) {
                request.state = -1;
                request.message = err;
                res.json(request);
            } else {
                if (docs.length > 0) {
                    request.data = docs[0];
                    res.json(request);

                } else {

                    request.state = -1;
                    request.message = {
                        name:"账号或密码错误"
                    };;
                    res.json(request);

                }

            }
        })
    })
}),
    //保存管理员信息
    router.post('/saveadmininfo', function (req, res, next) {
        var arg = req.body;
        data.connect(function (db) {
            db.collection('admin_info').find({ phone: arg.phone }).toArray(function (err, docs) {
                if (err) {
                    request.state = -1;
                    request.message = err;
                    res.json(request);
                } else {
                    if (docs.length > 0) {
                        request.state = -1;
                        request.data = docs;

                        request.message = {
                            name:"重复账号"
                        };
                        res.json(request);
                    } else {
                        var current_time = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
                        var admininfosavemodel = {
                            id: 1,
                            name: arg.name,
                            // photo:arg.photo,
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
                                    request.state = -1;
                                    request.message = err;
                                    res.json(request);
                                } else {
                                    if (docs.length > 0) {
                                        admininfosavemodel.id = docs[0].id + 1;
                                    }
                                    data.connect(function (db) {
                                        db.collection('admin_info').insertOne(admininfosavemodel, function (err, result) {
                                            if (err) {
                                                request.state = -1;
                                                request.message = err;
                                                res.json(request);
                                            } else {
                                                res.json(request);
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
                request.state = -1;
                request.message = err;
                res.json(request);
            } else {
                request.total = docs.length;
                data.findByPage("admin_info", seachdata, pageNo, pageSize, function (err, docs2) {
                    if (err) {
                        request.state = -1;
                        request.message = err;
                        res.json(request);
                    } else {
                        console.log(docs2);
                        request.data = docs2;
                        request.pageSize = pageSize;
                        request.pageNo = pageNo;
                        res.json(request);
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
    var arg = req.body;

    var id = arg.id;
    var seach = { id: id };
    data.connect(function (db) {
        db.collection('admin_info').find(seach).toArray(function (err, docs) {
            if (err) {
                request.state = -1;
                request.message = err;
                res.json(request);
                
            }else{
                request.state = 1;
                request.data = docs;
                res.json(request);
            }
        })
    })

});
//修改管理员信息
router.post('/updateadmininfobyid', function (req, res, next) {
    var arg = req.body;
    var current_time = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    var update_id = { id: arg.id };
    var update_data = {
        name: arg.name,
        photo: arg.photo,
        remark: arg.remark,
        password: arg.password,
        state: arg.state,
        updatetime: current_time
    }
    data.connect(function (db) {
        db.collection('admin_info').updateOne(update_id, update_data, function (err, result) {
            if (err) {
                request.state = -1;
                request.message = err;
                res.json(request);
            } else {
                res.json(request);
            }
        })
    })
});
//批量删除
router.post('/deleteadmininfobyids', function (req, res, next) {
    var arg = req.body;
    var ids = arg.ids;
    data.connect(function (db) {
        db.collection('admin_info').deleteMany({ id: { $in: ids } }, function (err, result) {
            if (err) {
                request.state = -1;
                request.message = err;
                res.json(request);
            } else {
                request.state = 1;
                res.json(request);
            }
        })
    });
})
module.exports = router;