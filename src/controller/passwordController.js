const nodemailer = require('nodemailer')
const User = require("../modals/user")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth : {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

const resetpassword = async(req,res) => {
    const {email} = req.body

    if(!email){
        return res.status(400).json({message: "Enter your Email"})
    }

    try{
        const useremail = await User.findOne({email: email})
        // const token = await useremail.generateAuthToken(120000)
        const token = jwt.sign({_id:useremail._id}, process.env.SECRET_KEY , {expiresIn:"120s"})
        
        if(token){
            const mailOptions = {
                from: "process.env.EMAIL",
                to: email,
                subject: "Sending Email for Passwor Reset",
                text: `This Link valid for 2 MINUTES ${process.env.FRONT_URL}/forgetpassword/${useremail._id}/${token}`
            }

            transporter.sendMail(mailOptions, (error, info) => {
                if(error){
                    console.log("error", error);
                    return res.status(400).json({message: "Email not send"})
                }else{
                    console.log("info", info.response);
                    return res.status(200).json({message: "Email sent successfully"})
                }
            })
        }  
    }catch(e){
        console.log(e);
        res.status(400).json({message:"Internal error", data: e})
    }
}

const verifyUser = async(req,res) => {
    const {id, token} = req.params
    try{
        const validUser = await User.findOne({_id : id})
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY)
    
        if(validUser && verifyToken._id){
            return res.status(200).json({data : validUser})
        }
        else{
            return res.status(400).json({message:"User not exist"})
        }
    }catch(e){
        console.log(e);
        res.status(400).json({message: "Not verify"})
    }
}

const changePassword = async(req, res) => {
    const {id, token} = req.params
    const {password} = req.body.password
    const {confirmpassword} = req.body.confirmpassword

    try{
        const validUser = await User.findOne({_id : id})
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY)

        if(validUser && verifyToken._id){
            const newPassword = await bcrypt.hash(password, 10)
            const newConfirmPassword = await bcrypt.hash(confirmpassword, 10)

            const newUserPass = await User.findByIdAndUpdate({_id: id} , {password: newPassword, confirmpassword: newConfirmPassword})

            newUserPass.save()
            res.status(200).json({message:"Your password update successfully", data : newUserPass})

        }else{
            res.status(400).json({message:"User not exist"})
        }

    }catch(e){
        console.log(e);
        res.status(400).json({message: "User Not verify"})
    }
}

module.exports = {resetpassword, verifyUser, changePassword}