const express = require("express")
const blog = require("../modals/blog")
const {authorizeAdmin} = require("../middleware/auth")
const router = new express.Router()

router.post("/addblog" ,authorizeAdmin, async (req,res)=>{
    const formData = req.body
    try{
        const data = {...formData, userId: req.user}
        const addBlog = new blog(data)
        const blog1 = await addBlog.save()
        res.status(201).json({message:"Blog added successfully", data: blog1})
    }catch(e){
        console.log("detgf",e);
        res.status(400).json({message:"Internal error", data: e})
    }
})

router.get("/myblogs",authorizeAdmin, async(req, res)=>{
    try{
        const blogs = await blog.find({userId: req.user})
        res.status(201).json({message:"Blog get successfully", data: blogs})
    }catch(e){
        res.status(400).json({message:"Error"})
    }
} )

router.get("/allblogs", async(req,res)=>{
    try{
        const allBlog = await blog.find()
        if(!allBlog){
            res.status(400).json({message:"No Blog Found"})
        }
        res.status(200).send(allBlog)
    }catch(e){
        res.status(400).send(e)
    }
})

router.get("/blog/:blogid", async(req,res)=>{
    try{
        const _id = req.params.blogid
        const singleBlog = await blog.findById(_id)

        if(!singleBlog){
            res.status(400).json({message:"blog Not Found"})
        }
        res.status(200).json({msg:"view your blog", data: singleBlog})
    }catch(e){
        console.log(e.message);
        res.status(400).json({msg:"server error"})
    }
})

router.delete("/delete/:blogid",authorizeAdmin, async(req,res)=>{
    try{
        const _id = req.params.blogid
        const deleteBlog = await blog.findByIdAndDelete(_id)
        if(!deleteBlog){
            return res.status(400).send("Blog is not found for delete")
        }
        res.status(200).json({message:"blog deleted successfully", data: deleteBlog})
    }catch(e){
        res.status(400).send(e)
    }
})

router.patch("/update/:blogid",authorizeAdmin ,async(req,res)=>{
    try{
        const _id = req.params.blogid
        const editBlog = await blog.findByIdAndUpdate(_id, req.body, {
            new: true
        })
        if(!editBlog){
            return res.status(400).json({message:"No blog found"})
        }
        res.status(200).send(editBlog)
    }catch(e){
        res.status(400).send(e)
    }
})

module.exports = router