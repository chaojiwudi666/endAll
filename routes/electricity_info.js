var express = require('express');
var utility=require('utility');
var router = express.Router();
var data=require('../data');
var moment = require('moment');
var request={data:[],state:1,message:"成功",pageNo:0,pageSize:0,total:0};
//保存管理员信息
router.post('/saveelectricityinfo',function(req,res,next){
var newrequest=request;
var arg=req.body;
var current_time =moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
var electricityinfo={
    id:1,
    dormitory_id:arg.dormitory_id,
    degrees_history:arg.degrees_history,
    current:arg.current,
    state:1,
    price:arg.price,
    create_time:current_time,
    update_time:current_time,
    balance:arg.balance,
    create_user:arg.create_user,
};
data.connect(function(db){
    db.collection('electricity_info').find({}).sort({_id:-1}).limit(1).toArray(function(err,docs){
        if(err){
            newrequest.state=-1;
            newrequest.message=err;
            res.json(newrequest);
        }else{
            if(docs.length>0){
                electricityinfo.id=docs[0].id+1;
            }
            data.connect(function(db){
                db.collection('electricity_info').insertOne(electricityinfo,function(err,result){
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
router.post('/getelectricityinfo',function(req,res,next){
    var newrequest=request;
    var arg=req.body;
    var dormitory_id="/"+arg.dormitory_id+"/";
    var pageNo=arg.pagen_no;
    var pageSize=arg.page_size;
    var seachdata={dormitory_id:dormitory_id,state:1};
    if(arg.dormitory_id==undefined){
        seachdata={state:1};
    }
    data.connect(function(db){
            db.collection('electricity_info').find().toArray(function(err,docs){
                if(err){
                    newrequest.state=-1;
                    newrequest.message=err;
                    res.json(newrequest);
                }else{
                    newrequest.total=docs.length;
                    data.connect(function(db){
                            db.collection('electricity_info').find(seachdata).sort({_id:-1}).limit(pageSize).skip((pageNo-1)*pageSize).toArray(function(err,docs2){
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
router.post('/getelectricityinfobyid',function(req,res,next){
    var newrequest=request;
        var arg=req.body;
        var id=arg.id;
        var seach={id:id};
        data.connect(function(db){
            db.collection('electricity_info').find(seach).toArray(function(err,docs){
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
router.post('/updateelectricityinfobyid',function(req,res,next){
       var newrequest=request;
        var arg=req.body;
        var current_time =moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        var update_id={id:arg.id};
        var update_data={
           $set:{
            dormitory_id:arg.dormitory_id,
            degrees_history:arg.degrees_history,
            current:arg.current,
            state:arg.state,
            price:arg.price,
            update_time:current_time,
            balance:arg.balance,
           }}
        data.connect(function(db){
            db.collection('electricity_info').updateOne(update_id,update_data,function(err,result){
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
router.post('/deleteelectricityinfobyids',function(req,res,next){
        var newrequest=request;    
        var arg=req.body;
        var ids=arg.ids;
        data.connect(function(db){
            db.collection('electricity_info').deleteMany({id:{$in:ids}},function(err,result){
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