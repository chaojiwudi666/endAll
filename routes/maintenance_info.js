var express = require('express');
var utility=require('utility');
var router = express.Router();
var data=require('../data');
var moment = require('moment');
var request={data:[],state:1,message:"成功",page_no:0,page_size:0,total:0};
//保存管理员信息
router.post('/savemaintenanceinfo',function(req,res,next){
    var newrequest = JSON.parse(JSON.stringify(request));
var arg=req.body;

var current_time =moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
var maintenanceinfomodel={
    id:1,
    dormitory_number:arg.dormitory_number,
    phone:arg.phone,
    maintenance_type:arg.maintenance_type,
    state:1,
    create_time:current_time,
    update_time:current_time,
    remark:arg.remark,
    create_user:arg.create_user,
};
data.connect(function(db){
    db.collection('dormitory_info').find({dormitory_number:arg.dormitory_number}).toArray(function(err,result){
        if(err){
            newrequest.state=-1;
            newrequest.message=err;
            res.json(newrequest);
        }else{
            if(result.length>0){
                data.connect(function(db){
                    db.collection('maintenance_info').find({}).sort({_id:-1}).limit(1).toArray(function(err,docs){
                        if(err){
                            newrequest.state=-1;
                            newrequest.message=err;
                            res.json(newrequest);
                        }else{
                            if(docs.length>0){
                                maintenanceinfomodel.id=docs[0].id+1;
                            }
                            data.connect(function(db){
                                db.collection('maintenance_info').insertOne(maintenanceinfomodel,function(err,result){
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
            }else{
                newrequest.state=-1;
                newrequest.message={
                    name:"寝室不存在"
                };
                res.json(newrequest);
            }
            
        }
    })
})

});
//分页查询
router.post('/getmaintenanceinfo',function(req,res,next){
    
    var newrequest = JSON.parse(JSON.stringify(request));
    var arg=req.body;
 
    var dormitory_number="/"+arg.dormitory_number+"/";
    var page_no=arg.page_no;
  
    var page_size=arg.page_size;
    console.log(page_no);
    var seachdata={dormitory_number:dormitory_number,state:1};
    if(arg.dormitory_number==undefined){
        seachdata={state:1};
    }
    data.connect(function(db){
            db.collection('maintenance_info').find().toArray(function(err,docs){
                if(err){
                    newrequest.state=-1;
                    newrequest.message=err;
                  res.json(newrequest);
                }else{
                    newrequest.total=docs.length;
                    data.connect(function(db){
                            db.collection('maintenance_info').find(seachdata).sort({_id:-1}).limit(page_size).skip((page_no-1)*page_size).toArray(function(err,docs2){
                                if(err){
                                    newrequest.state=-1;
                                    newrequest.message=err;
                                     res.json(newrequest);
                                }else{
                                    newrequest.data=docs2;
                                    newrequest.page_size=page_size;
                                    newrequest.page_no=page_no;                                                                                       
                                    res.json(newrequest);
                                }
                            })
                    })
                }
            })
        })
});
//获取详情
router.post('/getmaintenanceinfobyid',function(req,res,next){
    var newrequest = JSON.parse(JSON.stringify(request));
        var arg=req.body;
        var id=arg.id;
        var seach={id:id};
        data.connect(function(db){
            db.collection('maintenance_info').find(seach).toArray(function(err,docs){
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
router.post('/updatemaintenanceinfobyid',function(req,res,next){
    var newrequest = JSON.parse(JSON.stringify(request));
        var arg=req.body;
        var current_time =moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        var update_id={id:arg.id};
        var update_data={
           $set:{
            dormitory_number:arg.dormitory_number,
            maintenance_type:arg.maintenance_type,
            state:arg.state,
            update_time:current_time,
            remark:arg.remark,
           }}
        data.connect(function(db){
            db.collection('maintenance_info').updateOne(update_id,update_data,function(err,result){
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
router.post('/deletemaintenanceinfobyids',function(req,res,next){
    var newrequest = JSON.parse(JSON.stringify(request));
        var arg=req.body;
        var ids=arg.ids;
        data.connect(function(db){
            db.collection('maintenance_info').deleteMany({id:{$in:ids}},function(err,result){
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