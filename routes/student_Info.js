var express = require('express');
var router = express.Router();
var data=require('../data');
var moment = require('moment');
var request={data:[],state:1,message:"成功",page_no:0,page_size:0,total:0};

//student_info
//保存管理员信息
router.post('/savestudentinfo',function(req,res,next){
    var arg=req.body;
    var current_time =moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    var student_id_prefix=current_time =moment(Date.now()).format('YYYY');
    var role_info_model={
        id:1,
        name:arg.name,
        state:1,
        create_time:current_time,
        update_time:current_time,
        sex:arg.sex,
        age:arg.age,
        class_id:arg.class,
        student_id:student_id_prefix+arg.class,
        photo:arg.photo,
        phone:arg.phone,
        dormitory_id:arg.dormitory_id,
        remark:arg.remark,
        create_user:arg.create_user,
    };
    var seach={class_id:arg.class_id}
    data.connect(function(db){
        db.collection('student_info').find(seach).sort({_id:-1}).limit(1).toArray(function(err,docs){
            if(err){
                request.state=-1;
                request.message=err;
                res.json(request);
            }else{
                role_info_model.id=docs[0].id+1;
                role_info_model.student_id=role_info_model.student_id+role_info_model.id;
                data.connect(function(db){
                    db.collection('student_info').insertOne(role_info_model,function(err,result){
                        if(err){
                            request.state=-1;
                            request.message=err;
                            res.json(request);
                        }else{
                            res.json(request);
                        }
                    })
                });
            }
        })
    });
    });
    //分页查询
    router.post('/getstudentinfo',function(req,res,next){
        var arg=req.body;
        var phone="/"+arg.phone+"/";
        var page_no=arg.page_no;
        var page_size=arg.page_size;
        var seach_data={phone:phone,state:1};
        data.connect(function(db){
                db.collection('student_info').find().toArray(function(err,docs){
                    if(err){
                        request.state=-1;
                        request.message=err;
                      res.json(request);
                    }else{
                        request.total=docs.length;
                        data.connect(function(db){
                                db.collection('student_info').find(seach_data).sort({_id:-1}).limit(page_size).skip((page_no-1)*page_size).toArray(function(err,docs2){
                                    if(err){
                                        request.state=-1;
                                        request.message=err;
                                         res.json(request);
                                    }else{
                                        request.data=docs2;
                                        request.pageSize=page_size;
                                        request.pageNo=page_size;
                                        res.json(request);
                                    }
                                })
                        })
                    }
                })
            })
    });
    //获取详情
    router.post('/getstudentinfobyid',function(req,res,next){
            var arg=req.body;
            var id=arg.id;
            var seach={id:id};
            data.connect(function(db){
                db.collection('student_info').find(seach).toArray(function(err,docs){
                    if(err){
                        request.data=docs;
                        res.json(request);
                    }
                })
            })
            
    });
    //修改角色信息
    router.post('/updatestudentinfobyid',function(req,res,next){
            var arg=req.body;
            var current_time =moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            var update_id={id:arg.id};
            var update_data={
                name:arg.name,
                sex:arg.sex,
                age:arg.age,
                phone:arg.phone,
                photo:arg.photo,
                remark:arg,remark,
                dormitory_id:arg.dormitory_id,
                remark:arg.remark,
                state:arg.state,
                update_time:current_time}
            data.connect(function(db){
                db.collection('student_info').updateOne(update_id,update_data,function(err,result){
                    if(err){
                        request.state=-1;
                        request.message=err;
                      res.json(request);
                    }else{
                        res.json(request);
                    }
                })
            })
    });
    //批量删除
    router.post('/deletestudentinfobyids',function(req,res,next){
            var arg=req.body;
            var ids=arg.ids;
            data.connect(function(db){
                db.collection('student_info').deleteMany({id:{$in:ids}},function(err,result){
                    if(err){
                        request.state=-1;
                        request.message=err;
                      res.json(request);
                    }else{
                        res.json(request);
                    }
                })
            });
    })

