const mongoose = require("mongoose")
const TripSchema = mongoose.Schema({
    from:{
        type:String,
        required:[true , "Please select your departure city"]
    },
    to:{
        type:String,
        required:[true , "Please select your destination city"]
    },
    date:{
        type:Date,
        required:[true,"Please provide your travel date"]
    },
    space:{
        type:Number,
        required:[true,"Please specify available space(in KG)"]
    },
    description:{
        type:String,
        default:""
    },
    agree:{
        type:Boolean,
        required:true
    }
},{timestamps:true})

const TripModel = mongoose.model("trip" ,TripSchema)
module.exports = TripModel