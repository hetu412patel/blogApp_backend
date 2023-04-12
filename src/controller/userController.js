const User = require("../modals/user")
const bcrypt = require("bcryptjs")

const register = async (req,res)=>{
    try{
        const password = req.body.password
        const confirmpassword = req.body.confirmpassword

        if(password === confirmpassword){
            const addUser = new User({
                name: req.body.name,
                email: req.body.email,
                password : password,
                confirmpassword : confirmpassword,
                country : req.body.country,
                address : req.body.address,
                gender : req.body.gender,
                role : 'user'
            })
            
            const user = await addUser.save()
            res.status(201).send(user)
        }else{
            res.json({message:"Make sure password and confirmpassword are matching"})
        }
    }catch(e){
        console.log(e);
        res.status(400).send(e)
    }
}

const getAllUser = async (req,res) => {
    try{
        const allUser = await User.find({})
        return res.status(200).json({data: allUser})               
    }catch(e){
        console.log(e.message);
        return res.status(400).json({msg: "server error"})
    }
}

const changeRole = async(req,res)=>{
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
        console.log(e.message); 
        res.status(400).send(e)
    }
}

const login = async(req,res)=>{
    
    const email = req.body.email
    const password = req.body.password

try{
    const findUser = await User.findOne({email: email})
    
    if(!findUser){
        return res.status(400).json({message:"Invalid Login Details"})
    }

    const isMatch = await bcrypt.compare(password, findUser?.password)
    const token = await findUser.generateAuthToken("24h")

    if(isMatch){
        return res.status(200).json({message: "Login successfully", token: token, data: findUser})
    }else{
        return res.status(400).json({message:"Invalid Login Details"})
    }
}catch(e){
    console.log(e.message); 
    res.status(400).json({message: "Invalid Login Details"})
    }
}

module.exports = {register, getAllUser, changeRole, login}