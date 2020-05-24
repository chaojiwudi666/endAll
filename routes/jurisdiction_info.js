var express = require('express');
var utility=require('utility');
var router = express.Router();
var data=require('../data');
var moment = require('moment');
var request={data:[],state:1,message:"成功",pageNo:0,pageSize:0,total:0};
//获取权限信息
router.post('/getjurisdictioninfobyadminid',function(req,res,next){
   var newrequest = JSON.parse(JSON.stringify(request));
    var arg=req.body;
    data.collection(function(db){
        db.collection('jurisdiction_info').find({admin_id:arg.admin_id}).toArray(function(err,docs){
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
})
//保存管理员权限
router.post('/savejurisdictioninfo',function(req,res,next){
    var newrequest = JSON.parse(JSON.stringify(request));
var arg=req.body;
var current_time =moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
var jurisdiction_info={
    id:1,
    menu_id:arg.menu_id,
    admin_id:arg.admin_id,
    admin_name:arg.admin_name,
    state:1,
    create_time:current_time,
    update_time:current_time,
    create_user:arg.create_user,
};
data.connect(function(db){
    db.collection('jurisdiction_info').find({}).sort({_id:-1}).limit(1).toArray(function(err,docs){
        if(err){
            newrequest.state=-1;
            newrequest.message=err;
            res.json(newrequest);
        }else{
           if(docs.length>0){
            jurisdiction_info.id=docs[0].id+1;
           }
            data.connect(function(db){
                db.collection('jurisdiction_info').insertOne(jurisdiction_info,function(err,result){
                    if(err){
                        newrequest.state=-1;
                        newrequest.message=err;
                        res.json(newrequest);
                    }else{
                        res.json(newrequest);
                    }
                })
            });
        }
    })
});
});
//分页查询
router.post('/getjurisdictioninfo',function(req,res,next){
    var newrequest = JSON.parse(JSON.stringify(request));
    var arg=req.body;
    var admin_name="/"+arg.admin_name+"/";
    var pageNo=arg.page_no;
    var pageSize=arg.page_size;
    var seachdata={admin_name:admin_name,state:1};
    if(arg.admin_name==undefined){
        var seachdata={state:1};
    }
    data.connect(function(db){
            db.collection('jurisdiction_info').find().toArray(function(err,docs){
                if(err){
                    newrequest.state=-1;
                    newrequest.message=err;
                    res.json(newrequest);
                }else{
                    newrequest.total=docs.length;
                    data.connect(function(db){
                            db.collection('jurisdiction_info').find(seachdata).sort({_id:-1}).limit(pageSize).skip((pageNo-1)*pageSize).toArray(function(err,docs2){
                                if(err){
                                    newrequest.state=-1;
                                    newrequest.message=err;
                                     res.json(newrequest);
                                }else{
                                    newrequest.data=docs2;
                                    newrequest.pageSize=pageSize;
                                    newrequest.pageNo=pageNo;
                                    res.json(newrequest);
                                }
                            })
                    })
                }
            })
        })
});
//获取详情
router.post('/getjurisdictioninfobyid',function(req,res,next){
    var newrequest = JSON.parse(JSON.stringify(request));
        var arg=req.body;
        var id=arg.id;
        var seach={id:id};
        data.connect(function(db){
            db.collection('jurisdiction_info').find(seach).toArray(function(err,docs){
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
//修改管理员信息
router.post('/updatejurisdictioninfobyid',function(req,res,next){
    var newrequest = JSON.parse(JSON.stringify(request));
    var arg=req.body;
        var current_time =moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        var update_id={id:arg.id};
        var update_data={$set:{
            admin_name:arg.admin_name,
            menu_id:arg.menu_id,
            state:arg.state,
            update_time:current_time
            }
        }
        data.connect(function(db){
            db.collection('jurisdiction_info').updateOne(update_id,update_data,function(err,result){
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
router.post('/deletejurisdictioninfobyids',function(req,res,next){
    var newrequest = JSON.parse(JSON.stringify(request));   
    var arg=req.body;
        var ids=arg.ids;
        data.connect(function(db){
            db.collection('jurisdiction_info').deleteMany({id:{$in:ids}},function(err,result){
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