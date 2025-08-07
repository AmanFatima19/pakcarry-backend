const mongoose = require("mongoose")

const feedbackSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter your name"]
    },
    email:{
        type:String,
        required:[true,"Email is required to give feedback"]
    },
    feedback:{
        type:String,
        required:[true,"Please write a feedback"]
    },
    rating:{
        type:Number,
        required:[true,"Please enter rating to appreciate pakcarry"]
    }
})

const feedbackModel = mongoose.model('feedback',feedbackSchema)
module.exports = feedbackModel