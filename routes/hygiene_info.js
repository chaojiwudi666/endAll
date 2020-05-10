var express = require('express');
var router = express.Router();
var data=require('../data');
var moment = require('moment');
var request={data:[],state:1,message:"成功",pageNo:0,pageSize:0,total:0};

//hygiene_info  //未修改
//保存管理员信息
router.post('/savehygieneinfo',function(req,res,next){
var arg=req.body;
var current_time =moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
var hygiene_infosavemodel={
    id:1,
    dormitory_id:arg.dormitory_id,
    hygienic_condition:arg.gygienic_condition,
    state:1,
    create_time:current_time,
    update_time:current_time,
    remark:arg.remark,
    create_user:arg.create_user,
};

data.connect(function(db){
    db.collection('hygiene_info').find({}).sort({_id:-1}).limit(1).toArray(function(err,docs){
        if(err){
            request.state=-1;
            request.message=err;
            res.json(request);
        }else{
            hygiene_infosavemodel.id=docs[0].id+1;
            data.connect(function(db){
                db.collection('hygiene_info').insertOne(hygiene_infosavemodel,function(err,result){
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
router.post('/gethygieneinfo',function(req,res,next){
    var arg=req.body;
    var dormitory_id="/"+arg.dormitory_id+"/";
    var pageNo=arg.pagen_no;
    var pageSize=arg.page_size;
    var seachdata={dormitory_id:dormitory_id,state:1};
    data.connect(function(db){
            db.collection('hygiene_info').find().toArray(function(err,docs){
                if(err){
                    request.state=-1;
                    request.message=err;
                  res.json(request);
                }else{
                    request.total=docs.length;
                    data.connect(function(db){
                            db.collection('hygiene_info').find(seachdata).sort({_id:-1}).limit(pageSize).skip((pageNo-1)*pageSize).toArray(function(err,docs2){
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
router.post('/gethygieneinfobyid',function(req,res,next){
        var arg=req.body;
        var id=arg.id;
        var seach={id:id};
        data.connect(function(db){
            db.collection('hygiene_info').find(seach).toArray(function(err,docs){
                if(err){
                    request.data=docs;
                    res.json(request);
                }
            })
        })
        
});
//修改管理员信息
router.post('/updatehygieneinfobyid',function(req,res,next){
        var arg=req.body;
        var current_time =moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        var update_id={id:arg.id};
        var update_data={
            dormitory_id:arg.dormitory_id,
            hygienic_condition:arg.gygienic_condition,
            remark:arg.remark,
            state:arg.state,
            updatetime:current_time}
        data.connect(function(db){
            db.collection('hygiene_info').updateOne(update_id,update_data,function(err,result){
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
router.post('/deletehygieneinfobyids',function(req,res,next){
        var arg=req.body;
        var ids=arg.ids;
        data.connect(function(db){
            db.collection('hygiene_info').deleteMany({id:{$in:ids}},function(err,result){
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