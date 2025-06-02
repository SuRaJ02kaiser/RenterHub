const express = require("express");
const connectDb = require("./config/db");
const landlordRouter = require("./routes/landlord.route");
const tenantRouter = require("./routes/tenant.route");
const requestRouter = require("./routes/request.route");
const propertyRouter = require("./routes/property.route");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: ["https://renterhub.netlify.app"],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());

app.use(express.static('public'));

connectDb();

app.get("/test", (req,res) => {
    console.log("Healthy");
    res.status(200).send("Healthy");
})

app.use("/landlord",landlordRouter);
app.use("/tenant",tenantRouter);
app.use("/request",requestRouter);
app.use("/property",propertyRouter);

const PORT = process.env.PORT || 8008;

app.listen(PORT, () => console.log("Server is running on Port:",PORT));

