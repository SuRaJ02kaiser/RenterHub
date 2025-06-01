const express = require("express");
const landlordRouter = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const {signuplandlord,loginlandlord,deletelandlord,updatelandlord,getTenants,getRequestslandlord,removeTenant,getProperty,getlandlord,addTenant} = require("../controllers/landlord.controller");


landlordRouter.post("/signup",signuplandlord);
landlordRouter.post("/login",loginlandlord);
landlordRouter.get("/getlandlord",authMiddleware(["landlord"]),getlandlord);
landlordRouter.delete("/delete",authMiddleware(["landlord"]),deletelandlord);
landlordRouter.patch("/update",authMiddleware(["landlord"]),updatelandlord);
landlordRouter.get("/getTenants",authMiddleware(["landlord"]),getTenants);
landlordRouter.patch("/addTenant/:tid",authMiddleware(["landlord"]),addTenant);
landlordRouter.patch("/removeTenant/:tid",authMiddleware(["landlord"]),removeTenant);
landlordRouter.get("/getRequests",authMiddleware(["landlord"]),getRequestslandlord);
landlordRouter.get("/getProperties", authMiddleware(["landlord"]), getProperty);


module.exports = landlordRouter;

