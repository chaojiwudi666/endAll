var express = require('express');
var utility=require('utility');
var router = express.Router();
var data=require('../data');
var moment = require('moment');
var request={data:[],state:1,message:"成功",pageNo:0,pageSize:0,total:0};


//保存菜单信息
router.post('/savemenuinfo',function(req,res,next){
    var newrequest=request;
var arg=req.body;
var current_time =moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
var menu_infosavemodel={
    id:1,
    menu_name:arg.menu_name,
    address:arg.address,
    state:1,
    create_time:current_time,
    update_time:current_time,
    remark:arg.remark,
    create_user:arg.create_user
};
data.connect(function(db){
    db.collection('menu_info').find({}).sort({_id:-1}).limit(1).toArray(function(err,docs){
        if(err){
            newrequest.state=-1;
            newrequest.message=err;
            res.json(newrequest);
        }else{
            if(docs.length>0){
                menu_infosavemodel.id=docs[0].id+1;
            }
            data.connect(function(db){
                db.collection('menu_info').insertOne(menu_infosavemodel,function(err,result){
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
router.post('/getmenuinfo',function(req,res,next){
    var newrequest=request;
    var arg=req.body;
    var menu_name="/"+arg.menu_name+"/";
    var pageNo=arg.page_no;
    var pageSize=arg.page_size;
    var seachdata={menu_name:menu_name,state:1};
    if(arg.menu_name==undefined){
        seachdata={state:1};
    }
    console.log(seachdata);
    data.connect(function(db){
            db.collection('menu_info').find().toArray(function(err,docs){
                if(err){
                    newrequest.state=-1;
                    newrequest.message=err;
                  res.json(newrequest);
                }else{
                    newrequest.total=docs.length;
                    data.connect(function(db){
                            db.collection('menu_info').find(seachdata).sort({_id:-1}).limit(pageSize).skip((pageNo-1)*pageSize).toArray(function(err,docs2){
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
router.post('/getmenuinfobyid',function(req,res,next){
    var newrequest=request;
        var arg=req.body;
        var id=arg.id;
        console.log(arg)
        var seach={id:id};
        data.connect(function(db){
            db.collection('menu_info').find(seach).toArray(function(err,docs){
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
router.post('/updatemenuinfobyid',function(req,res,next){
    var newrequest=request;
        var arg=req.body;
        var current_time =moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        var update_id={id:arg.id};
        var update_data={$set:{menu_name:arg.menu_name,
            address:arg.address,
            remark:arg.remark,
            state:arg.state,
            updatetime:current_time}
        }
        data.connect(function(db){
            db.collection('menu_info').updateOne(update_id,update_data,function(err,result){
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
router.post('/deletemenuinfobyids',function(req,res,next){
    var newrequest=request;
        var arg=req.body;
        var ids=arg.ids;
        data.connect(function(db){
            db.collection('menu_info').deleteMany({id:{$in:ids}},function(err,result){
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