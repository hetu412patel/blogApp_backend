const jwt = require("jsonwebtoken")
const User = require("../modals/user")

const authorizeAdmin = async (req,res,next) => {
    
    const token = req.header("Authorization")?.replace("Bearer ",'')
    // console.log("fv",token);
    if(!token){
        return res.status(400).json({message:"user not authorized"})
    }
    try{
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY)
        const user = await User.findOne({_id: verifyUser._id})
        // console.log("fgf",user);
        req.user = user._id
        if(user.role !== "admin"){
            return res.status(400).json({message:"Authorize first as admin"})
        }
        next()
    }catch(e){
        res.status(401).json({msg:"server error", data: e})
    }
}

const authorizeUser = async(req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ",'')
    // console.log("fv",token);

    if(!token){
        return res.status(400).json({message:"user not authorized"})
    }
    
    try{
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY)
        // console.log(verifyUser);
        const user = await User.findOne({_id: verifyUser._id})
        // console.log(user);
        if(user.role !== "user"){
            return res.status(400).json({message:"Authorize first as user"})
        }
        next()
    }catch(e){
        console.log(e.message);
        res.status(401).json({msg: "server error"})
    }
}

module.exports = {authorizeAdmin, authorizeUser}