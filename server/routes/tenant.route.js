const express = require("express");
const tenantRouter = express.Router();
const {signuptenant,logintenant,deletetenant,updatetenant,getRequeststenant,getTenant,getProperty,getlandlordByTenant} = require("../controllers/tenant.controller");
const authMiddleware = require("../middlewares/auth.middleware");

tenantRouter.post("/signup",signuptenant);
tenantRouter.post("/login",logintenant);
tenantRouter.get("/getlandlordByTenant",authMiddleware(["tenant"]),getlandlordByTenant);
tenantRouter.get("/getTenant",authMiddleware(["tenant"]),getTenant);
tenantRouter.delete("/delete",authMiddleware(["tenant"]),deletetenant);
tenantRouter.patch("/update",authMiddleware(["tenant"]),updatetenant);
tenantRouter.get("/getProperty",authMiddleware(["landlord","tenant"]),getProperty);
tenantRouter.get("/requests",authMiddleware(["tenant"]),getRequeststenant);

module.exports = tenantRouter;