const express = require("express")
const user = require("../modals/user")
const router = new express.Router()
const bcrypt = require("bcryptjs")

router.post("/user", async (req,res)=>{
    try{
        const password = req.body.password
        const confirmpassword = req.body.confirmpassword

        if(password === confirmpassword){
            const addUser = new user(req.body)
            // here we perform middleware concept and convert text password into hash(bcrypt) and to generate jwt token
            const token = await addUser.generateAuthToken()

            res.cookie("jwt", token, {
                httpOnly: true
            })
            
            const user1 = await addUser.save()
            res.status(201).send(user1)
        }else{
            res.json({message:"Make sure password and confirmpassword are matching"})
        }
    }catch(e){
        res.status(400).send(e)
    }
})

router.get("/user", async(req,res)=>{
    try{
        const allUser = await user.find()
        res.status(200).send(allUser)
    }catch(e){
        res.status(400).send(e)
    }
})

router.patch("/user/:id", async(req,res)=>{
    try{
        const _id = req.params.id
        const editUser = await user.findByIdAndUpdate(_id, req.body, {
            new: true
        })
        if(!editUser){
            return res.status(400).json({message:"No user found"})
        }
        res.status(200).send(editUser)
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/login', async(req,res)=>{
    try{
        const useremail = await user.findOne({email:req.body.email})
        
        const isMatch = await bcrypt.compare(req.body.password, useremail.password)

        const token = await useremail.generateAuthToken()

        res.cookie("jwt", token, {
            httpOnly: true
            //secure: true
        })

        if(isMatch){
            res.status(201).json({message: "Login successfully"})
        }else{
            res.status(400).json({message:"Invalid Login Details"})
        }
    }catch(e){
        res.status(400).json({message: "Invalid Login Details"})
    }
})

module.exports = router