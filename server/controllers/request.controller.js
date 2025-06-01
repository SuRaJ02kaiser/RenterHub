const requestModel = require("../models/request.model");
const tenantModel = require("../models/tenant.model");


const addRequest = async (req, res) => {
    try {
        const { title, category, description, priority } = req.body;

        if (!title || !category || !description || !priority) {
            return res.status(400).json({ message: "Please provide all the information" });
        }

        const tenant = await tenantModel.findById(req.user.userId);

        if(!tenant){
            return res.status(404).json({ message: "Tenant not found" });
        }

        const newReq = await requestModel.create({
            title,
            category,
            description,
            priority,
            status:"Pending",
            property: tenant.property,
            tenant: tenant._id,
            landlord: tenant.landlord
        });

        res.status(201).json({ message: "New request created", title: newReq.title });
    } catch (err) {
        console.error("Error in addRequest:", err);
        res.status(500).json({ message: "Something went wrong", error: err.message });
    }
};



const deleteRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRequest = await requestModel.findByIdAndDelete(id);

        if (!deletedRequest) {
            return res.status(404).json({ message: "Request not found" });
        }

        return res.status(200).json({ message: "Request deleted successfully" });

    } catch (err) {
        console.error("Error in deleteRequest:", err);
        res.status(500).json({ message: "Something went wrong", error: err.message });
    }
};




const updateRequest = async (req, res) => {
    try {
        const { rid } = req.params;

        const updatedRequest = await requestModel.findByIdAndUpdate(rid, req.body, { new: true });

        if (!updatedRequest) {
            return res.status(404).json({ message: "Request not found" });
        }

        res.status(200).json({ message: "Request updated", updatedRequest });

    } catch (err) {
        console.error("Error in updateRequest:", err);
        res.status(500).json({ message: "Something went wrong", error: err.message });
    }
};


module.exports = {addRequest,deleteRequest,updateRequest};