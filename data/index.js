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
function insert(collection, obj, callback){
    MongoClient.connect(url, function (error, db) {
        if (error == null) {
            var database = db.db(dbName);
            database.collection(collection).insertOne(obj, callback);
            db.close();
        } else {
            console.log(error);
        }
    });
}

function insertMany(collection, objs, callback) {
    MongoClient.connect(url, function (error, db) {
        if (error == null) {
            var database = db.db(dbName);
            database.collection(collection).insertMany(objs, callback);
            db.close();
        } else {
            console.log(error);
        }
    });
}

function find(collection, where, callback) {
    MongoClient.connect(url, function (error, db) {
        if (error == null) {
            var database = db.db(dbName);
            database.collection(collection).find(where).toArray(callback);
            db.close();
        } else {
            console.log(error);
        }
    });
}
function findByPage(collection, where,pageNo,pageSize, callback) {
    MongoClient.connect(url, function (error, db) {
        if (error == null) {
            var database = db.db(dbName);
            database.collection(collection).find(where).sort({_id:-1}).limit(pageSize).skip((pageNo-1)*pageSize).toArray(callback);
            db.close();
        } else {
            console.log(error);
        }
    });
}

function update(collection, where, update, callback) {
    MongoClient.connect(url, function (error, db) {
        if (error == null) {
            var database = db.db(dbName);
            database.collection(collection).updateOne(where, update, callback);
            db.close();
        } else {
            console.log(error);
        }
    });
}

function deleteData(collection, where, callback) {
    MongoClient.connect(url, function (error, db) {
        if (error == null) {
            var database = db.db(dbName);
            database.collection(collection).deleteOne(where, callback);
            db.close();
        } else {
            console.log(error);
        }
    });
}


module.exports={
    connect,
    insert,
    update,
    find,
    deleteData,
    findByPage
}