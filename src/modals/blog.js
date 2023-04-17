const mongoose = require("mongoose")

const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    description:{
        type:String,
        required: true
    },
    author:{
        type:String,
        required: true
    },
    blogImage:{
        type: String
    },
    category:{
        type:String,
        required: true,
        enum:["CS-IT", "TRAVEL", "FOOD"]
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        // ref:"User",
        required: true
    }
})

const blog = new mongoose.model("Blog",blogSchema)
module.exports = blog