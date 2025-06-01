const tenantModel = require("../models/tenant.model");
const requestModel = require("../models/request.model");
const propertyModel = require("../models/property.model")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();


const signuptenant = async(req,res) => {
    try{
    const {name,phone,email,password,landlord} = req.body;

    if(!name || !phone || !email || !password){
       return res.status(401).json({message:"Please provide all the details"})
    }
    if (landlord == "") landlord = "";
    const user = await tenantModel.findOne({email});

    if(user){
        return res.status(409).json("user already avaialble, please login");
    }

    const salt = parseInt(process.env.SALT)||10;
    const hashedPassword = await bcrypt.hash(password,salt);

    const newtenant = await tenantModel.create({name,email,phone,landlord:landlord,password:hashedPassword,role:"tenant"});
    res.status(201).json({message:"New tenant created",newtenant});
} catch(err){
    res.status(500).json({message:"something went wrong", error:err.message});
}
}


const logintenant = async(req,res) => {
    try{

        const {email,password} = req.body;

        const tenant = await tenantModel.findOne({email});

        if(!tenant || (!await bcrypt.compare(password,tenant.password))){
            return res.status(404).json({message:"Invalid Credentials"});
        }

        const token = jwt.sign({userId: tenant._id , role: tenant.role},process.env.JWT_SECRET,{expiresIn:"1d"})

        res.status(200).json({token:token,role:tenant.role});

    } catch(err){
        res.status(500).json({message:"something went wrong", error:err.message});
    }
}


const getTenant = async (req, res) => {
    try {
        const tenant = await tenantModel
            .findById(req.user.userId)
            .populate("landlord", "name");

        if (!tenant) return res.status(404).json("No Tenant with this id");

        return res.status(200).json(tenant);
    } catch (err) {
        res.status(500).json({ message: "Something went wrong", error: err.message });
    }
};


const deletetenant = async(req,res) => {
    try{
        const deletedtenant = await tenantModel.findByIdAndDelete(req.user.userId);
        return res.status(200).json({message:"tenant deleted",deletedtenant});
    } catch(err){
        res.status(500).json({message:"something went wrong", error:err.message});
    }
}


const updatetenant = async(req,res) => {
    try{
        const updatedtenant = await tenantModel.findByIdAndUpdate(req.user.userId,req.body);
        res.status(201).json({message:"tenant updated",updatedtenant});
    } catch(err){
        return res.status(500).json({message:"something went wrong", error:err.message});
    }
}


const getRequeststenant = async(req,res) => {
    try{
        const requests = await requestModel.find({tenant:req.user.userId});
        if(requests.length == 0){
            return res.status(200).json({message:"Request folder empty"});
        }
        return res.status(200).json(requests);
    } catch(err){
        return res.status(500).json({message:"something went wrong", error:err.message});
    }
}


const getProperty = async(req,res) => {
    try{
        const tenant = await tenantModel.findById(req.user.userId);
        const propertyId = tenant.property;
        const property = await propertyModel.findById(propertyId);
        if(!property){
            return res.status(200).json({message:"Not a residence of any property"});
        }
        return res.status(200).json(property);
    } catch(err){
        return res.status(500).json({message:"something went wrong", error:err.message});
    }
}


module.exports = {signuptenant,logintenant,deletetenant,updatetenant,getRequeststenant,getTenant,getProperty}