require("dotenv").config()
const express = require('express')
const cors = require("cors")
const EmployeeModel = require("./model/employee.model")
const mockdata = require("./data")




const app = express()

app.use(cors({origin:["https://employee-dashboard-client-kopal-litauriyas-projects.vercel.app", "http://localhost:3000"]}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.send("All Good!!")
})


app.post("/form", async (req, res) => {
    const info = req.body;
    try {
        const checkEmployee = await EmployeeModel.findOne({ email: info.email }).lean().exec();
        if (checkEmployee) {
            res.send({ success: false, error: true, message: "Employee already exists!" })
            return;
        }
        
        const newEmployee = new EmployeeModel({
            employeeName: info.name,
            employeeId: info.id,
            email: info.email,
            phoneNumber: info.phone,
            age: info.age,
            department: info.department,
            position: info.position,
            salary: info.salary
        });
        await newEmployee.save()
        res.send({ success: true, error: false, message: "Employee details saved!" })
    } catch (error) {
        res.send({ success: false, error: true, message: error.message })
    }

   
})

app.get("/user", async(req,res)=>{
    try{
        let dep = req.query.department?.split(",") || []
        let pos = req.query.position?.split(",")  || []

        if (dep.length == 1 && dep[0] == '') dep = [];
        if (pos.length == 1 && pos[0] == '') pos = [];

        let response= await EmployeeModel.find({})
        console.log(">>1", response)
        if(dep.length) {
        response= response.filter((itm)=>dep.includes(itm.department))
        } 
        if(pos.length) {
        response= response.filter((itm)=>pos.includes(itm.position))
        } 

        console.log('>>>>>>>>>>>>>>2', response);
        // pagination
        const pageNumber = parseInt(req.query.page)
        const limit = 10
        const offset = (pageNumber - 1) * limit
        console.log(offset)
        let pagData = response.slice(offset, offset + limit);
        console.log('>>>>3', pagData);
        
        res.send({success:true, error: false, data: {
        page: pageNumber,
        per_page: limit,
        total: pagData.length,
        data: pagData,
        total_pages: Math.ceil(response.length / limit)
    }})
    } catch(error){
        res.send({success:false, error: true, message: error.message})

    }
})

app.get("/totalemployee",async(req,res)=>{
    let response=await EmployeeModel.find({position:"Employee"})
    res.send(response)
})
app.get("/totalintern",async(req,res)=>{
    let response=await EmployeeModel.find({position:"Intern"})
    res.send(response)
})
app.get("/department",async(req,res)=>{
    let response=await EmployeeModel.distinct("department")
    res.send(response)
})

app.delete("/user/:id",async(req,res)=>{
    try{
        let response = await EmployeeModel.deleteOne({_id:req.params.id})
    res.send({success:true, error: false, data: response})
    }catch(err){
        res.send({success:false, error: true, message: err.message})
    }
})



app.listen(8000, (req, res) => {
    console.log(`Server is Listening ...`)
})

module.exports=app

