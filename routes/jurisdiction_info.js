var express = require('express');
var utility=require('utility');
var router = express.Router();
var data=require('../data');
var moment = require('moment');
var request={data:[],state:1,message:"成功",pageNo:0,pageSize:0,total:0};
//jurisdiction_info
//保存管理员信息
router.post('/savejurisdictioninfo',function(req,res,next){
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
            request.state=-1;
            request.message=err;
            res.json(request);
        }else{
            jurisdiction_info.id=docs[0].id+1;
            data.connect(function(db){
                db.collection('jurisdiction_info').insertOne(jurisdiction_info,function(err,result){
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
router.post('/getjurisdictioninfo',function(req,res,next){
    var arg=req.body;
    var admin_name="/"+arg.admin_name+"/";
    var pageNo=arg.pagen_no;
    var pageSize=arg.page_size;
    var seachdata={admin_name:admin_name,state:1};
    data.connect(function(db){
            db.collection('jurisdiction_info').find().toArray(function(err,docs){
                if(err){
                    request.state=-1;
                    request.message=err;
                    res.json(request);
                }else{
                    request.total=docs.length;
                    data.connect(function(db){
                            db.collection('jurisdiction_info').find(seachdata).sort({_id:-1}).limit(pageSize).skip((pageNo-1)*pageSize).toArray(function(err,docs2){
                                if(err){
                                    request.state=-1;
                                    request.message=err;
                                     res.json(request);
                                }else{
                                    request.data=docs2;
                                    request.pageSize=pageSize;
                                    request.pageNo=pageNo;
                                    res.json(request);
                                }
                            })
                    })
                }
            })
        })
});
//获取详情
router.post('/getjurisdictioninfobyid',function(req,res,next){
        var arg=req.body;
        var id=arg.id;
        var seach={id:id};
        data.connect(function(db){
            db.collection('jurisdiction_info').find(seach).toArray(function(err,docs){
                if(err){
                    request.data=docs;
                    res.json(request);
                }
            })
        })
        
});
//修改管理员信息
router.post('/updatejurisdictioninfobyid',function(req,res,next){
        var arg=req.body;
        var current_time =moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        var update_id={id:arg.id};
        var update_data={
            admin_name:arg.admin_name,
            menu_id:arg.menu_id,
            state:arg.state,
            updatetime:current_time
        }
        data.connect(function(db){
            db.collection('jurisdiction_info').updateOne(update_id,update_data,function(err,result){
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
router.post('/deletejurisdictioninfobyids',function(req,res,next){
        var arg=req.body;
        var ids=arg.ids;
        data.connect(function(db){
            db.collection('jurisdiction_info').deleteMany({id:{$in:ids}},function(err,result){
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
module.exports = router;