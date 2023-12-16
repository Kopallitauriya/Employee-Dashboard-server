const mongoose = require('../config/mongodb.config')

const EmployeeSchema = new mongoose.Schema({
    employeeName : String,
    employeeId:Number,
    email:String,
    phoneNumber:Number,
    age:Number,
    department:String,
    position:String,
    salary:Number
},
{timestamps: {'createdAt': "created"}},
{timestamps: {'updatedAt': "updated"}},
)

const EmployeeModel = new mongoose.model("employee",EmployeeSchema)
module.exports=EmployeeModel