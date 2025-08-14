require("dotenv").config()
const mongoose = require("mongoose")
const connectDB = ()=>{
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log(`Database Connected Successfully with ${mongoose.connection.host}`)
    }).catch((err)=>{
        console.log("Error in database connection")
    })
}
module.exports=connectDB