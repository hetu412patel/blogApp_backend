const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/blog-app").then(()=>{
    console.log("database connection successfully");
}).catch((err)=>{
    console.log("No connection",err);
})