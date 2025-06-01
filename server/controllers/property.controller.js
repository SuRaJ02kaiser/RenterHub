const propertyModel = require("../models/property.model");
const tenantModel = require("../models/tenant.model");
const landlordModel = require("../models/landlord.model");



const addProperty = async(req,res) => {
    try{
        const {name,address,rent} = req.body;
        if(!name || !address || !rent){
            return res.status(400).json("Please provide all the information");
        }

        const landlord = await landlordModel.findById(req.user.userId);

            let newReq = await propertyModel.create({name,address,rent,landlordName:landlord.name,landlord:landlord._id});
            res.status(201).json({message:"New Property created",tile:newReq.name});

    } catch(err){
        res.status(500).json({message:"something went wrong",err})
    }
}


const deleteProperty = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "ID is required" });
        }

        const deletedProperty = await propertyModel.findByIdAndDelete(id);

        if (!deletedProperty) {
            return res.status(404).json({ message: "Property not found" });
        }

        return res.status(200).json({ message: "Property deleted successfully" });

    } catch (err) {
        return res.status(500).json({ message: "Something went wrong", error: err.message });
    }
};


const updateProperty = async(req,res) => {
    try{
        const {id} = req.params;
        
        if(!id) return res.status(400).json({ message: "ID is required" });

        const updatedProperty = await propertyModel.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ message: "Property updated", updatedProperty });
    } catch(err){
        res.status(500).json({message:"Something went wrong", error: err.message});
    }
}


const addTenantToProperty = async (req, res) => {
    try {
        const { tid } = req.params;
        const { addressId } = req.body; 

        if (!addressId || !tid) {
            return res.status(400).json({ message: "AddressId and TenantId are required" });
        }

        const tenant = await tenantModel.findByIdAndUpdate(
            tid,
            { property: addressId },
            { new: true }
        );

        if (!tenant) {
            return res.status(404).json({ message: "No tenant found" });
        }

        return res.status(200).json({
            message: "Tenant address updated successfully",
            tenant
        });
    } catch (err) {
        console.error("Error updating tenant:", err);
        res.status(500).json({ message: "Something went wrong", error: err.message });
    }
};


const removeTenantFromProperty = async (req, res) => {
    try {
        const { tid } = req.params;

        if (!tid) {
            return res.status(400).json({ message: "Tenant ID is required" });
        }

        const tenant = await tenantModel.findByIdAndUpdate(
            tid,
            { property: null},
            { new: true }
        );

        if(!tenant){
            return res.status(404).json({ message: "No tenant found" });
        }

        return res.status(200).json({
            message: "Tenant has been removed from the property",
            tenant
        });
    } catch (err) {
        console.error("Error removing tenant:", err);
        res.status(500).json({ message: "Something went wrong", error: err.message });
    }
};


const getPropertByName = async(req,res) => {
    try {
        const name = req.params;
        const properties = await propertyModel.find({name:name});
        if (!properties.length) {
            return res.status(404).json({ message: "No properties available" });
        }
        return res.status(200).json(properties);
    } catch (err) {
        console.error("Error fetching properties:", err);
        res.status(500).json({ message: "Something went wrong", error: err.message });
    }
};

module.exports = {addProperty,deleteProperty,updateProperty,addTenantToProperty,removeTenantFromProperty,getPropertByName};