const mongoose = require("mongoose");


const requestSchema = new mongoose.Schema({
    title:String,
    category: String,
    description:String,
    priority: {type:String,enum:["Low","Medium","High","Urgent"]},
    status: {type:String, enum:["Pending","In progress", "Completed"]},
    response:String,
    property:{type:mongoose.Schema.Types.ObjectId, ref:"property"},
    landlord: {type:mongoose.Schema.Types.ObjectId , ref:"landlord"},
    tenant: {type:mongoose.Schema.Types.ObjectId, ref:"tenant"},
}, {timestamps:true});

const requestModel = mongoose.model("request",requestSchema);

module.exports = requestModel;