var mongoose=require('../../data/mongoose.js');
var Schema = mongoose.Schema; 
var studentsSchema = new Schema({ id : { type: Number }, //id 
name: {type: String}, //学生姓名
state: {type: Number}, //学生姓名
create_time: {type: String}, //学生姓名
update_time: {type: String}, //学生姓名
sex: {type: Number}, //学生姓名
class_id: {type: String}, //学生姓名
student_id: {type: String}, //学生姓名
photo: {type: String}, //学生姓名
phone: {type: Number}, //年龄 
dormitory_id : { type: Number}, //最近登录时间 
remark: {type: String}, //学生姓名
create_user: {type: String}, //学生姓名
});
var Students = mongoose.model('Students',studentsSchema,'student_info');

module.exports = Students;