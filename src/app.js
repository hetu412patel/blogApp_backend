const express = require("express")
const cors = require("cors")
require("./db/conn")
const cookieparser = require("cookie-parser")
const blogRouter = require("./routers/blogRoutes")
const userRouter = require("./routers/userRoutes")
const dotenv = require("dotenv");

dotenv.config();

const port = process.env.PORT 
const app = express()

app.use(cors({origin: true}))
app.use(express.urlencoded({extended: false}));
app.use(express.json())
app.use("/images",express.static('images'))
app.use("/blogs",blogRouter)
app.use("/users",userRouter)
app.use(cookieparser())


// to get cookie value => req.cookies.jwt

app.listen(port, ()=>{
    console.log(`connection is setup at port ${port}`);
})

// const server = app.listen(5000)
// const io = require('socket.io')(server)
// io.on('connection', socket => {
//     console.log("client connected");    
// })
