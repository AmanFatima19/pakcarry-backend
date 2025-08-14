import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  earliestDate:
   {
     type: String,
      required: [true, "Please select the earliest delivery date"] 
    },
  lastDate: {
     type: String,
      required: [true, "Please select the last delivery date"] 
    },
  from: 
  {
     type: String, required: [true, "Please enter the origin city"] 
    },
  to: {
     type: String, 
     required: [true, "Please enter the destination city"] 
    },
  weight: { 
    type: Number,
     required: [true, "Please enter the package weight"] 
    },
  description: { 
    type: String 
  }, 
  images: [String] 
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
