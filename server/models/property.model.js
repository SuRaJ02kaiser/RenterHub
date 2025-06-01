const mongoose = require("mongoose");


const propertySchema = new mongoose.Schema({
    name:String,
    address:String,
    landlordName:String,
    rent:Number,
    landlord: {type:mongoose.Schema.Types.ObjectId, ref:"landlord"}
})


const propertyModel = mongoose.model("property",propertySchema);

module.exports = propertyModel;