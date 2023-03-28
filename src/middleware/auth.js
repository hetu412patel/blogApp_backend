const jwt = require("jsonwebtoken")
const blog = require("../modals/blog")
const User = require("../modals/user")

const auth = async (req,res,next) => {
    try{
        const token = req.cookies.jwt
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY)
        console.log(verifyUser);
        res.json({message:"User verified successfully"})

        const user = await User.findOne({_id: verifyUser._id})
        console.log(user);
        next()
    }catch(e){
        res.status(401).send("User is not verified",e)
    }
}

module.exports = auth