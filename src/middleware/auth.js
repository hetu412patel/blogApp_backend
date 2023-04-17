const jwt = require("jsonwebtoken")
const User = require("../modals/user")

const authorizeAdmin = async (req,res,next) => {
    
    const token = req.header("Authorization")?.replace("Bearer " , '')
    if(!token){
        return res.status(400).json({message:"user not authorized"})
    }
    try{
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY)
        const user = await User.findOne({_id: verifyUser?._id.toString()})
        req.user = user?._id?.toString()
        if(user?.role !== "admin"){
            return res.status(400).json({message:"Authorize first as admin"})
        }
        next()
    }catch(e){
        console.log(e);
        res.status(419).json({message:"server error", data: e})
    }
}

const authorizeUser = async(req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ",'')
    
    if(!token){
        return res.status(400).json({message:"user not authorized"})
    }
    
    try{
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY)
        const user = await User.findOne({_id: verifyUser._id})
        
        if(user.role !== "user"){
            return res.status(400).json({message:"Authorize first as user"})
        }
        next()
    }catch(e){
        console.log(e.message);
        res.status(419).json({message: "server error"})
    }
}

const checkExpiry = async(req,res,next) => {
    const refreshToken = req.body?.refreshtoken
    try{
        const user = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY)
        if(user){
            next()
        }
    }catch(error){  
        return res.status(405).json({error: error, message:"Token expiry error login again"})
    }
}

module.exports = {authorizeAdmin, authorizeUser, checkExpiry}