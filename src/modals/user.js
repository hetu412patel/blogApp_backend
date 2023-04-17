const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require('dotenv').config()

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required:true,
        unique:[true, "Email already present"],
        validator(value){
            if(!validator.isEmail(value)){
                throw new error("Invalid Email")
            }
        }
    },
    password:{
        type: String,
        required: true
    },
    confirmpassword:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    role:{
        type: String,
        lowercase:true,
        default: ["user"],
        enum: ["admin", "user"]
    },
    // googleId:{
    //     type: String
    // },
    // secret:{
    //     type: String
    // }
    // tokens:[{
    //     refreshToken:{
    //         type: String,
    //         required: true
    //     }
    // }]
})

userSchema.methods.generateAuthToken = async function(time){
    try{
        const token = jwt.sign({_id: this._id.toString()}, process.env.SECRET_KEY, {expiresIn: time})
        // this.tokens = this.tokens.concat({token})
        // await this.save()
        return token
    }catch(e){
        res.json({message:'Token is not generated due to some reason'})
    }
}

userSchema.methods.generateRefreshToken = async function(time){
    try{
        const refreshToken = jwt.sign({_id: this._id.toString()}, process.env.REFRESH_TOKEN_SECRET_KEY, {expiresIn: time})
        // this.tokens = this.tokens.concat({refreshToken})
        // await this.save()
        return refreshToken
    }catch(e){
        res.json({message:'Token is not generated due to some reason'})
    }
}

userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10)
        this.confirmpassword = await bcrypt.hash(this.confirmpassword, 10)
    }
    next()
})

const User = new mongoose.model("User", userSchema)
module.exports = User