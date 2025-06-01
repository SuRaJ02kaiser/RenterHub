const mongoose = require("mongoose");

const landlordSchema = new mongoose.Schema({
  name: String,
  email:{type:String,unique:true},
  phone:{type:Number,unique:true},
  password: String,
  properties: [{type:mongoose.Schema.Types.ObjectId, ref:"property"}],
  role: { type: String, default: "landlord" }
}, { timestamps: true });

const landlordModel = mongoose.model("landlord", landlordSchema);

module.exports = landlordModel
