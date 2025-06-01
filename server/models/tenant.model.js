const mongoose = require("mongoose");


const tenantSchema = new mongoose.Schema({
    name:String,
    email:{type:String,unique:true},
    phone:{type:Number,unique:true},
    password:String,
    role:{type:String, default:"tenant"},
    landlord:{type:mongoose.Schema.Types.ObjectId , ref:"landlord"},
    property:{type:mongoose.Schema.Types.ObjectId, ref:"property"}
}, {timestamps:true});

const tenantModel = mongoose.model("tenant",tenantSchema);

module.exports = tenantModel;