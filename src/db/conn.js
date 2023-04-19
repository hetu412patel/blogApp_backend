const mongoose = require("mongoose")

const url = process.env.MONGODB_URL

// mongoose.connect("mongodb://localhost:27017/blog-app").then(()=>{
//     console.log("database connection successfully");
// }).catch((err)=>{
//     console.log("No connection",err);
// })

mongoose.connect(url).then(()=>{
    console.log("database connection successfully");
}).catch((err)=>{
    console.log("No connection",err);
})

