const mongoose = require("mongoose")

// mongoose.connect("mongodb://localhost:27017/blog-app").then(()=>{
//     console.log("database connection successfully");
// }).catch((err)=>{
//     console.log("No connection",err);
// })

mongoose.connect("mongodb+srv://hetakshipatel412:hetakshi@cluster0.etn5u7z.mongodb.net/?retryWrites=true&w=majority").then(()=>{
    console.log("database connection successfully");
}).catch((err)=>{
    console.log("No connection",err);
})

