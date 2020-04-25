var MongoClient=require('mongodb').MongoClient

var url='mongodb://111.231.57.75:3307'
var dbName='dormitory'

//数据库的连接方法
function connect(callback){
    MongoClient.connect(url,function(err,client){
        if(err){
            console.log('数据库连接错误',err)
        }else{
            var db=client.db(dbName)
            callback && callback(db)
            client.close()
        }
    })
}

module.exports={
    connect
}