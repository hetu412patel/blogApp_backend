const mongoose = require("mongoose")
 
// mongoose.connect("mongodb://localhost:27017").then(()=>{
//     console.log("database connection successfully");
// }).catch((err)=>{
//     console.log("No connection",err);
// })

mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log("database connection successfully");
}).catch((err)=>{
    console.log("No connection",err);
})

