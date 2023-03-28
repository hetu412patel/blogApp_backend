const express = require("express")
const blog = require("../modals/blog")
const router = new express.Router()

router.post("/blog", async (req,res)=>{
    try{
        const addBlog = new blog(req.body)
        const blog1 = await addBlog.save()
        res.status(201).send(blog1)
    }catch(e){
        console.log("detgf",e);
        res.status(400).send(e)
    }
})

router.get("/blog", async(req,res)=>{
    try{
        const allBlog = await blog.find()
        res.status(200).send(allBlog)
    }catch(e){
        res.status(400).send(e)
    }
})

router.get("/blog/:id", async(req,res)=>{
    try{
        const _id = req.params.id
        const singleBlog = await blog.findById(_id)
        res.status(200).send(singleBlog)
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete("/blog/:id", async(req,res)=>{
    try{
        const _id = req.params.id
        const deleteBlog = await blog.findByIdAndDelete(_id)
        if(!deleteBlog){
            return res.status(400).send()
        }
        res.status(200).send(deleteBlog)
    }catch(e){
        res.status(400).send(e)
    }
})

router.patch("/blog/:id", async(req,res)=>{
    try{
        const _id = req.params.id
        const editBlog = await blog.findByIdAndUpdate(_id, req.body, {
            new: true
        })
        if(!editBlog){
            return res.status(400).send()
        }
        res.status(200).send(editBlog)
    }catch(e){
        res.status(400).send(e)
    }
})

module.exports = router