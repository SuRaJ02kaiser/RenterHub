const express = require("express");
const requestRouter = express.Router();
const {addRequest,deleteRequest,updateRequest} = require("../controllers/request.controller")
const authMiddleware = require("../middlewares/auth.middleware")

requestRouter.post("/addRequest",authMiddleware(["landlord","tenant"]),addRequest);
requestRouter.patch("/updateRequest/:rid",authMiddleware(["landlord","tenant"]),updateRequest);
requestRouter.delete("/deleteRequest/:rid",authMiddleware(["landlord","tenant"]),deleteRequest);

module.exports = requestRouter;