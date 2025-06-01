
require("dotenv").config();

const mongoose = require("mongoose");

const connectDb = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB....");
    } catch(err){
                console.log("Error occured while connecting DB",err);
        process.exit(1);
    }
}


module.exports = connectDb;