var express = require('express');
var utility=require('utility');
var router = express.Router();
var data=require('../data');
var moment = require('moment');
var request={data:[],state:1,message:"成功",pageNo:0,pageSize:0,total:0};
//dormitory_info
//保存宿舍信息
router.post('/savedormitoryinfo',function(req,res,next){
var arg=req.body;
var current_time =moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
var dormitory_infosavemodel={
    id:1,
    dormitory_number:arg.dormitory_number,
    hostel_id:arg.hostel_id,
    floor_id:arg.floor_id,
    layer_id:arg.layer_id,
    resident_population:arg.resident_population,
    sure_population:arg.sure_population,
    state:1,
    whether:arg.whether,
    create_time:current_time,
    update_time:current_time,
    remark:arg.remark,
    create_user:arg.create_user,
};
data.connect(function(db){
    db.collection('dormitory_info').find({}).sort({_id:-1}).limit(1).toArray(function(err,docs){
        if(err){
            request.state=-1;
            request.message=err;
            res.json(request);
        }else{
           if(docs.length>0){
            dormitory_infosavemodel.id=docs[0].id+1;
           }
            data.connect(function(db){
                db.collection('dormitory_info').insertOne(dormitory_infosavemodel,function(err,result){
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
router.post('/getdormitoryinfo',function(req,res,next){
    var arg=req.body;
    var dormitory_number="/"+arg.dormitory_number+"/";
    var pageNo=arg.pagen_no;
    var pageSize=arg.page_size;
    var seachdata={dormitory_number:dormitory_number,state:1};
    if(arg.dormitory_number==undefined){
        seachdata={state:1};
    }
    data.connect(function(db){
            db.collection('dormitory_info').find().toArray(function(err,docs){
                if(err){
                    request.state=-1;
                    request.message=err;
                  res.json(request);
                }else{
                    request.total=docs.length;
                    data.connect(function(db){
                            db.collection('dormitory_info').find(seachdata).sort({_id:-1}).limit(pageSize).skip((pageNo-1)*pageSize).toArray(function(err,docs2){
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
router.post('/getdormitoryinfobyid',function(req,res,next){
        var arg=req.body;
        var id=arg.id;
        var seach={id:id};
        data.connect(function(db){
            db.collection('dormitory_info').find(seach).toArray(function(err,docs){
                if(err){
                    request.data=docs;
                    res.json(request);
                }
            })
        })
        
});
//修改管理员信息
router.post('/updatedormitoryinfobyid',function(req,res,next){
        var arg=req.body;
        var current_time =moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        var update_id={id:arg.id};
        var update_data={
            dormitory_number:arg.dormitory_number,
            hostel_id:arg.hostel_id,
            floor_id:arg.floor_id,
            layer_id:arg.layer_id,
            resident_population:arg.resident_population,
            sure_population:arg.sure_population,
            state:arg.state,
            whether:arg.whether,
            updatetime:current_time,
            remark:arg.remark
        }
        data.connect(function(db){
            db.collection('dormitory_info').updateOne(update_id,update_data,function(err,result){
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
router.post('/deletedormitoryinfobyids',function(req,res,next){
        var arg=req.body;
        var ids=arg.ids;
        data.connect(function(db){
            db.collection('dormitory_info').deleteMany({id:{$in:ids}},function(err,result){
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