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
    category:{
        type:String,
        required: true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        required: true
    }
})

const BlogCollection = new mongoose.model("blog",blogSchema)
module.exports = BlogCollection