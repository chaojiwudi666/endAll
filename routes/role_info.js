var express = require('express');
var utility=require('utility');
var router = express.Router();
var data=require('../data');
var moment = require('moment');
var request={data:[],state:1,message:"成功",page_no:0,page_size:0,total:0};


//保存角色信息
router.post('/saveroleinfo',function(req,res,next){
    var newrequest = JSON.parse(JSON.stringify(request));
    var arg=req.body;
    var current_time =moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    var role_info_model={
        id:1,
        title:arg.title,
        state:1,
        create_time:current_time,
        update_time:current_time,
        remark:arg.remark,
        create_user:arg.create_user,
    };
    data.connect(function(db){
        db.collection('role_info').find({}).sort({_id:-1}).limit(1).toArray(function(err,docs){
            if(err){
                newrequest.state=-1;
                newrequest.message=err;
                res.json(newrequest);
            }else{
                if(docs.length>0){
                    role_info_model.id=docs[0].id+1;
                }
                data.connect(function(db){
                    db.collection('role_info').insertOne(role_info_model,function(err,result){
                        if(err){
                            newrequest.state=-1;
                            newrequest.message=err;
                            res.json(newrequest);
                        }else{
                            newrequest.data=1;
                            res.json(newrequest);
                        }
                    })
                });
            }
        })
    });
    });
    //分页查询
    router.post('/getroleinfo',function(req,res,next){
        var newrequest = JSON.parse(JSON.stringify(request));
        var arg=req.body;
        var title="/"+arg.title+"/";
        var page_no=arg.page_no;
        var page_size=arg.page_size;
        var seach_data={title:title,state:1};
        if(arg.title==undefined){
            seach_data={state:1};
        }
        data.connect(function(db){
                db.collection('role_info').find().toArray(function(err,docs){
                    if(err){
                        newrequest.state=-1;
                        newrequest.message=err;
                      res.json(newrequest);
                    }else{
                        newrequest.total=docs.length;
                        data.connect(function(db){
                                db.collection('role_info').find(seach_data).sort({_id:-1}).limit(page_size).skip((page_no-1)*page_size).toArray(function(err,docs2){
                                    if(err){
                                        newrequest.state=-1;
                                        newrequest.message=err;
                                         res.json(newrequest);
                                    }else{
                                        newrequest.data=docs2;
                                        newrequest.pageSize=page_size;
                                        newrequest.pageNo=page_no;
                                        res.json(newrequest);
                                    }
                                })
                        })
                    }
                })
            })
    });
    //获取详情
    router.post('/getroleinfobyid',function(req,res,next){
        var newrequest = JSON.parse(JSON.stringify(request));
            var arg=req.body;
            var id=arg.id;
            var seach={id:id};
            data.connect(function(db){
                db.collection('role_info').find(seach).toArray(function(err,docs){
                    if(err){
                        newrequest.state=-1;
                        newrequest.message=err;
                         res.json(newrequest);
                       
                    }else{
                        newrequest.data=docs;
                        res.json(newrequest);
                    }
                })
            })
            
    });
    //修改角色信息
    router.post('/updateroleinfobyid',function(req,res,next){
        var newrequest = JSON.parse(JSON.stringify(request));
            var arg=req.body;
            var current_time =moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            var update_id={id:arg.id};
            var update_data={$set:{
                title:arg.title,
                remark:arg.remark,
                state:arg.state,
                update_time:current_time
            }
               }
            data.connect(function(db){
                db.collection('role_info').updateOne(update_id,update_data,function(err,result){
                    if(err){
                        newrequest.state=-1;
                        newrequest.message=err;
                      res.json(newrequest);
                    }else{
                        res.json(newrequest);
                    }
                })
            })
    });
    //批量删除
    router.post('/deleteroleinfobyids',function(req,res,next){
        var newrequest = JSON.parse(JSON.stringify(request));
            var arg=req.body;
            var ids=arg.ids;
            data.connect(function(db){
                db.collection('role_info').deleteMany({id:{$in:ids}},function(err,result){
                    if(err){
                        newrequest.state=-1;
                        newrequest.message=err;
                      res.json(newrequest);
                    }else{
                        res.json(newrequest);
                    }
                })
            });
    })
    module.exports = router;