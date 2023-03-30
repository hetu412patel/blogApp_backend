const express = require("express")
const User = require("../modals/user")
const router = new express.Router()
const bcrypt = require("bcryptjs")
const { authorizeAdmin } = require("../middleware/auth")

router.post("/register", async (req,res)=>{
        const {name, email, password, confirmpassword,country, addresss, gender} = req.body
    try{
        const password = req.body.password
        const confirmpassword = req.body.confirmpassword

        if(password === confirmpassword){
            const addUser = new User(req.body)
            // here we perform middleware concept and convert text password into hash(bcrypt) and to generate jwt token
            // const token = await addUser.generateAuthToken()

            // res.cookie("jwt", token, {
            //     httpOnly: true
            // })
            
            const user = await addUser.save()
            res.status(201).send(user)
        }else{
            res.json({message:"Make sure password and confirmpassword are matching"})
        }
    }catch(e){
        console.log(e);
        res.status(400).send(e)
    }
})

router.get("/alluser", authorizeAdmin, async (req,res) => {
    try{
        const allUser = await User.find({})
        console.log("frtrgtg",allUser);
        res.status(200).json({data: allUser})
    }catch(e){
        console.log(e.message);
        res.status(400).json({msg: "server error"})
    }
})

router.patch("/changerole/:id", authorizeAdmin ,async(req,res)=>{
    const {role} = req.body
    try{
        const _id = req.params.id
        const user = await User.findById(_id)
        if(!user){
            return res.status(400).json({message:"User not found"})
        }

        const editUser = await User.findByIdAndUpdate(user._id, {role} , {
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
        const {email, password} = req.body

    try{
        const useremail = await User.findOne({email:email})
        const isMatch = await bcrypt.compare(password, useremail.password)
        const token = await useremail.generateAuthToken()
        
        // console.log("dfdg",token);
        
        // res.cookie("jwt", token, {
        //     httpOnly: true
        //     //secure: true
        // })

        if(isMatch){
            res.status(200).json({message: "Login successfully", token: token})
            localStorage.setItem("token", token)
        }else{
            res.status(400).json({message:"Invalid Login Details"})
        }
    }catch(e){
        res.status(400).json({message: "Invalid Login Details"})
    }
})

module.exports = router