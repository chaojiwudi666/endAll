var express = require('express');
var router = express.Router();
var data=require('../data');
var moment = require('moment');
var utility = require('utility');
var request={data:[],state:1,message:"成功",page_no:0,page_size:0,total:0};

//student_info
//保存学生信息
router.post('/savestudentinfo',function(req,res,next){
    var newRequest = JSON.parse(JSON.stringify(request));
    var arg=req.body;
    var current_time =moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    var student_id_prefix=moment(Date.now()).format('YYYY');
    var role_info_model={
        id:1,
        name:arg.name,
        state:1,
        create_time:current_time,
        update_time:current_time,
        sex:parseInt(arg.sex),
        age:arg.age,
        class_id:parseInt(arg.class_id),
        role_id:4,
        photo:arg.photo,
        phone:arg.phone,
        dormitory_number:arg.dormitory_number,
        remark:arg.remark,
        create_user:arg.create_user,
        password:utility.md5("123456")
    };
    var seach={class_id:parseInt(arg.class_id)}
    data.connect(function(db){
        db.collection('dormitory_info').find({dormitory_number:arg.dormitory_number}).toArray(function(err,result2){
            if(err){
                newRequest.state=-1;
                newRequest.message=err;
                res.json(newRequest);
            }else{
                if(result2.length>0){
                    data.connect(function(db){
                        db.collection('student_info').find({dormitory_number:arg.dormitory_number}).toArray(function(err,result){
                            if(err){
                                newRequest.state=-1;
                                newRequest.message=err;
                                res.json(newRequest);
                            }else{
                                if(result.length<4){
                                    data.connect(function(db){
                                        db.collection('student_info').find({}).sort({_id:-1}).limit(1).toArray(function(err,docs){
                                            if(err){
                                                newRequest.state=-1;
                                                newRequest.message=err;
                                                res.json(newRequest);
                                            }else{
                                               if(docs.length>0){
                                                role_info_model.id=docs[0].id+1;
                                               }
                                               data.connect(function(db){
                                               db.collection('student_info').find(seach).sort({_id:-1}).limit(1).toArray(function(err,docs2){
                                                   if(err){
                                                    newRequest.state=-1;
                                                    newRequest.message=err;
                                                    res.json(newRequest);
                                                   }else{
                                                    
                                                       if(docs2.length>0){
                                                           var student_id=docs2[0].student_id;
                                                           var code=(parseInt(student_id.substring(student_id.length-2))+1).toString();
                                                           if(code.length==1){
                                                               code="0"+code;
                                                           }
                                                        role_info_model.student_id=student_id_prefix+arg.class_id+code;
                                                       }else{
                                                        role_info_model.student_id=student_id_prefix+arg.class_id+"01";
                                                       }
                                                       data.connect(function(db){
                                                        db.collection('student_info').insertOne(role_info_model,function(err,result){
                                                            if(err){
                                                                newRequest.state=-1;
                                                                newRequest.message=err;
                                                                res.json(newRequest);
                                                            }else{
                                                                newRequest.state=1;
                                                                res.json(newRequest);
                                                            }
                                                        })
                                                    });
                                                   }
                                               })
                                            });
                                            }
                                        })
                                    });
                
                                }else{
                                    newRequest.state=-1;
                                    newRequest.message={name:"寝室已满"};
                                    res.json(newRequest);
                                }
                            }
                        })
                    })
                }else{
                    newRequest.state=-1;
                    newRequest.message={name:"不存在该寝室"};
                    res.json(newRequest);
                }
            }
        })
    });
    });
    //分页查询
    router.post('/getstudentinfo',function(req,res,next){
        var newRequest = JSON.parse(JSON.stringify(request));
        var arg=req.body;
        var student_id=arg.student_id;
        var page_no=arg.page_no;
        var page_size=arg.page_size;
        var seach_data={student_id:student_id,state:1};
        if(!arg.student_id){
            seach_data={state:1};
        }
        data.connect(function(db){
                db.collection('student_info').find().toArray(function(err,docs){
                    if(err){
                        newRequest.state=-1;
                        newRequest.message=err;
                      res.json(newRequest);
                    }else{
                        if(arg.student_id){
                            newRequest.total=1;
                        }else{
                            newRequest.total=docs.length;
                        }
                        data.connect(function(db){
                                db.collection('student_info').find(seach_data).sort({_id:-1}).limit(page_size).skip((page_no-1)*page_size).toArray(function(err,docs2){
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
    router.post('/getstudentinfobyid',function(req,res,next){
        var newRequest = JSON.parse(JSON.stringify(request));
            var arg=req.body;
            var id=arg.id;
            var seach={id:id};
            data.connect(function(db){
                db.collection('student_info').find(seach).toArray(function(err,docs){
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
    //修改角色信息
    router.post('/updatestudentinfobyid',function(req,res,next){
        var newRequest = JSON.parse(JSON.stringify(request));
            var arg=req.body;
            var current_time =moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            var update_id={id:arg.id};
            var update_data={$set:{
                name:arg.name,
                sex:parseInt(arg.sex),
                age:arg.age,
                phone:arg.phone,
                photo:arg.photo,
                remark:arg.remark,
                dormitory_number:arg.dormitory_number,
                remark:arg.remark,
                state:arg.state,
                update_time:current_time
            }
                }
            data.connect(function(db){
                console.log(update_data);
                db.collection('student_info').updateOne(update_id,update_data,function(err,result){
                    if(err){
                        newRequest.state=-1;
                        newRequest.message=err;
                      res.json(newRequest);
                    }else{
                        newRequest.data=1;
                        res.json(newRequest);
                    }
                })
            })
    });
    //修改学生密码
    router.post('/updatestudentpassword',function(req,res,next){
        var newRequest = JSON.parse(JSON.stringify(request));
            var arg=req.body;
            
            var update_id={id:arg.id};
            var update_data={$set:{
                password:utility.md5(arg.password)  
            }
            }
            data.connect(function(db){
                console.log(update_data);
                db.collection('student_info').updateOne(update_id,update_data,function(err,result){
                    if(err){
                        newRequest.state=-1;
                        newRequest.message=err;
                      res.json(newRequest);
                    }else{
                        newRequest.data=1;
                        res.json(newRequest);
                    }
                })
            })
    });
    //批量删除
    router.post('/deletestudentinfobyids',function(req,res,next){
        var newRequest = JSON.parse(JSON.stringify(request));
            var arg=req.body;
            var ids=arg.ids;
            data.connect(function(db){
                db.collection('student_info').deleteMany({id:{$in:ids}},function(err,result){
                    if(err){
                        newRequest.state=-1;
                        newRequest.message=err;
                        res.json(newRequest);
                    }else{
                        res.json(newRequest);
                    }
                })
            });
    })

    module.exports = router;