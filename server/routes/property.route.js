const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware")
const propertyRouter = express.Router();

const {addProperty,deleteProperty,updateProperty,addTenantToProperty,removeTenantFromProperty,getPropertByName} = require("../controllers/property.controller")

propertyRouter.post("/addProperty",authMiddleware(["landlord"]),addProperty);
propertyRouter.post("/getPropertyByName/:name",authMiddleware(["landlord"]),getPropertByName);
propertyRouter.delete("/deleteProperty/:id",authMiddleware(["landlord"]),deleteProperty);
propertyRouter.patch("/updateProperty/:id",authMiddleware(["landlord"]),updateProperty);
propertyRouter.put("/addTenantToProperty/:tid",authMiddleware(["landlord"]),addTenantToProperty);
propertyRouter.patch("/removeTenantFromProperty/:tid",authMiddleware(["landlord"]),removeTenantFromProperty);


module.exports = propertyRouter;