const express = require("express")
const {authorizeAdmin} = require("../middleware/auth")
const {upload} = require('../middleware/uploadImage')
const router = new express.Router()

const  {addBlog, myBlogs, allBlogs, blogDetail, deleteBlog, updateBlog}  = require("../controller/blogController") 

router.post("/addblog",authorizeAdmin,upload.single('blogImage'), addBlog)
router.get("/myblogs",authorizeAdmin,myBlogs)
router.get("/allblogs", allBlogs)
router.get("/blog/:blogid", blogDetail)
router.delete("/delete/:blogid",authorizeAdmin,deleteBlog)
router.patch("/update/:blogid",authorizeAdmin , upload.single('blogImage'), updateBlog)

module.exports = router