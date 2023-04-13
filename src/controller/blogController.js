const blog = require("../modals/blog")
const fs = require('fs')

const addBlog = async (req,res)=>{
    try{
        const addBlog = new blog({
            title: req.body.title,
            description: req.body.description,
            author: req.body.author, 
            blogImage: req.file.filename,
            category: req.body.category,
            userId: req.user
        })
        const blog1 = await addBlog.save()
        res.status(201).json({message:"Blog added successfully", data: blog1})
    }catch(e){
        res.status(400).json({message:"Internal error", data: e})
    }
}

const myBlogs = async(req, res)=>{
    try{
        const myBlogs = await blog.find({userId: req.user})

        myBlogs.forEach((blog) => {
            blog.blogImage = `${req.protocol}://${req.get('host')}/images/${blog.blogImage}`
        })

        res.status(201).json({message:"Blog get successfully", data: myBlogs})
    }catch(e){if(file.mimetype.split('/')[0] === 'image')
        res.status(400).json({message:"Error"})
    }
}

const allBlogs = async(req,res)=>{
    try{
        const allBlog = await blog.find().populate("userId","name")
        
        allBlog.forEach((blog) => {
            blog.blogImage = `${req.protocol}://${req.get('host')}/images/${blog.blogImage}`
        })

        if(!allBlog){
            res.status(400).json({message:"No Blog Found"})
        }
        res.status(200).send(allBlog)
    }catch(e){
        res.status(400).send(e)
    }
}

const blogDetail = async(req,res)=>{
    try{
        const _id = req.params.blogid
        const singleBlog = await blog.findById(_id)
        
        if(!singleBlog){
            res.status(400).json({message:"blog Not Found"})
        }

        singleBlog.blogImage = `${req.protocol}://${req.get('host')}/images/${singleBlog.blogImage}`
        res.status(200).json({msg:"view your blog", data: singleBlog})
    }catch(e){
        res.status(400).json({msg:"server error"})
    }
}

const deleteBlog = async(req,res)=>{
    const _id = req.params.blogid
    const findblog = await blog.findById(_id)
    
    try{
        if(findblog?.userId?.toString() !== req.user?.toString()){
            return res.status(400).json({message: "You can't delete another admin blog"})
        }else{
            fs.unlink(`images/${findblog.blogImage}`, (err) => {
                if(err){
                    console.log(err);
                }
            })
            const deleteBlog = await blog.findByIdAndDelete(_id)
            if(!deleteBlog){
                return res.status(400).send("Blog is not found for delete")
            }
            return res.status(200).json({message:"blog deleted successfully", data: deleteBlog})
        }
    }catch(e){
        console.log(e);
        res.status(400).send(e)
    }
}

const updateBlog = async(req,res)=>{
    
    try{
        const _id = req.params.blogid
        const formData = req.body
        const data = {...formData, blogImage : req.file.filename}

        const findblog = await blog.findById(_id)
        console.log(findblog);
        if(findblog.userId.toString() !== req.user.toString()){
            return res.status(400).json({message: "You can't update another admin blog"})
        }else{
            if(req.file.filename){
                fs.unlink(`images/${findblog.blogImage}`, (err) => {
                    if(err){
                        console.log(err);
                    }
                })
            }
            const editBlog = await blog.findByIdAndUpdate(_id, data , {
                new: true
            })
            if(!editBlog){
                return res.status(400).json({message:"No blog found"})
            }
            res.status(200).send(editBlog)
        }
    }catch(e){
        res.status(400).send(e)
    }
}

module.exports = {addBlog, myBlogs, allBlogs, blogDetail, deleteBlog, updateBlog}