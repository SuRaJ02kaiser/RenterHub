const landlordModel = require("../models/landlord.model");
const tenantModel = require("../models/tenant.model");
const requestModel = require("../models/request.model");
const propertyModel = require("../models/property.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();


const signuplandlord = async(req,res) => {
    try{
    const {name,phone,email,password} = req.body;

    if(!name || !phone || !email || !password){
       return res.status(401).json({message:"Please provide all the details"})
    }

    const user = await landlordModel.findOne({email});

    if(user){
        return res.status(409).json("user already avaialble, please login");
    }

    const salt = parseInt(process.env.SALT)||10;
    const hashedPassword = await bcrypt.hash(password,salt);

    const newlandlord = await landlordModel.create({name,email,phone,password:hashedPassword,role:"landlord"});
    res.status(201).json({message:"New Landlord created",newlandlord});
} catch(err){
    res.status(500).json({message:"something went wrong", error:err.message});
}
}


const loginlandlord = async(req,res) => {
    try{

        const {email,password} = req.body;

        const landlord = await landlordModel.findOne({email});

        if(!landlord || (!await bcrypt.compare(password,landlord.password))){
            return res.status(404).json({message:"Invalid Credentials"});
        }

        const token = jwt.sign({userId: landlord._id , role: landlord.role},process.env.JWT_SECRET,{expiresIn:"1d"})

        res.status(200).json({token:token,role:landlord.role});

    } catch(err){
        res.status(500).json({message:"something went wrong", error:err.message});
    }
}


const deletelandlord = async(req,res) => {
    try{
        const deleteLandlord = await landlordModel.findByIdAndDelete(req.user.userId);
        if(!deleteLandlord) return res.status(404).json("No landlord with this id")
        return res.status(200).json({message:"Landlord deleted",deleteLandlord});
    } catch(err){
        res.status(500).json({message:"something went wrong", error:err.message});
    }
}


const updatelandlord = async(req,res) => {
    try{
        const updatedlandlord = await landlordModel.findByIdAndUpdate(req.user.userId, req.body, { new: true });
        res.status(201).json({message:"Landlord updated",updatedlandlord});
    } catch(err){
        return res.status(500).json({message:"something went wrong", error:err.message});
    }
}


const getTenants = async(req,res) => {
    try{
    const tenants = await tenantModel.find({landlord:req.user.userId}).populate("property","name");
    if(tenants.length == 0){
        return res.status(404).json({message:"No Tenants Available"})
    }
    res.status(200).json(tenants);
    } catch(err){
        return res.status(500).json({message:"something went wrong", error:err.message});
    }
}


const removeTenant = async(req, res) => {
    try {
        const {tid} = req.params;
        let updatedTenant = await tenantModel.findByIdAndUpdate(tid, { landlord: null }, { new: true });
        res.status(200).json({ message: "Tenant removed from landlord", updatedTenant });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong", error: err.message });
    }
}

const getRequestslandlord = async (req, res) => {
  try {
    const requests = await requestModel
      .find({ landlord: req.user.userId })
      .populate("tenant", "name phone");

    if (requests.length === 0) {
      return res.status(200).json({ message: "Request folder empty" });
    }

    return res.status(200).json(requests);
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};


const getProperty = async (req, res) => {
    try {
        const properties = await propertyModel.find({landlord: req.user.userId});
        if (!properties.length) {
            return res.status(404).json({ message: "No properties available" });
        }
        return res.status(200).json(properties);
    } catch (err) {
        console.error("Error fetching properties:", err);
        res.status(500).json({ message: "Something went wrong", error: err.message });
    }
};


const getlandlord = async(req,res) => {
    try{
        const landlord = await landlordModel.findById(req.user.userId);
        if(!landlord) return res.status(404).json("No landlord with this id");
        return res.status(200).json(landlord);
    } catch(err){
        return res.status(500).json({message:"Something went wrong",err});
    }
}


const addTenant = async(req,res) => {
    try {
        const {tid} = req.params;
        let updatedTenant = await tenantModel.findByIdAndUpdate(tid, {landlord: req.user.userId},{ new: true });
        res.status(200).json({ message: "Tenant added landlord", updatedTenant });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong", error: err.message });
    }
}

module.exports = {signuplandlord,loginlandlord,deletelandlord,updatelandlord,getTenants,getRequestslandlord,addTenant,removeTenant,getProperty,getlandlord};