const express = require("express")
const blog = require("../modals/blog")
const {authorizeAdmin} = require("../middleware/auth")
const {upload} = require('../middleware/uploadImage')
const router = new express.Router()
const fs = require('fs')

// const multer = require('multer')
// const upload = multer({dest: 'images/'})

router.post("/addblog",authorizeAdmin,upload.single('blogImage'), async (req,res)=>{
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
        // console.log("detgf",e);
        res.status(400).json({message:"Internal error", data: e})
    }
})

router.get("/myblogs",authorizeAdmin, async(req, res)=>{
    try{
        const myBlogs = await blog.find({userId: req.user})

        myBlogs.forEach((blog) => {
            blog.blogImage = `${req.protocol}://${req.get('host')}/images/${blog.blogImage}`
        })

        res.status(201).json({message:"Blog get successfully", data: blogs})
    }catch(e){if(file.mimetype.split('/')[0] === 'image')
        res.status(400).json({message:"Error"})
    }
})

router.get("/allblogs", async(req,res)=>{
    try{
        const allBlog = await blog.find()
        
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
})

router.get("/blog/:blogid", async(req,res)=>{
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
})

router.delete("/delete/:blogid",authorizeAdmin, async(req,res)=>{
    const _id = req.params.blogid
    const findblog = await blog.findById(_id)
    
    try{

        if(findblog.userId !== req.user){
            return res.status(400).json({message: "You can't delete another admin blog"})
        }else{
            fs.unlink(`images/${findblog.blogImage}`, (err) => {
                if(err){
                    console.log(err);
                }
            })
            const deleteBlog = await blog.findByIdAndDelete(_id)
            console.log("delete", deleteBlog);
            if(!deleteBlog){
                return res.status(400).send("Blog is not found for delete")
            }
        }
        return res.status(200).json({message:"blog deleted successfully", data: deleteBlog})
    }catch(e){
        console.log(e);
        res.status(400).send(e)
    }
})

router.patch("/update/:blogid",authorizeAdmin , upload.single('blogImage'), async(req,res)=>{
    try{
        const _id = req.params.blogid
        const formData = req.body
        const data = {...formData, blogImage : req.file.filename}

        const findblog = await blog.findById(_id)

        if(findblog.userId !== req.user){
            return res.status(400).json({message: "You can't update another admin blog"})
        }

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
        // console.log("edit",editBlog );
        if(!editBlog){
            return res.status(400).json({message:"No blog found"})
        }
        res.status(200).send(editBlog)
    }catch(e){
        res.status(400).send(e)
    }
})

module.exports = router